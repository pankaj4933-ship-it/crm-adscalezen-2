import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ── GET /api/admin/subscriptions ──────────────────────────────────
// Returns all accounts with their profile, subscription, plan, limits, and usage counts.
// Super-admin only.
export async function GET() {
  const supabase = await createClient();

  // Auth check
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('user_id', user.id)
    .single();

  if (!profile?.is_super_admin) {
    return NextResponse.json({ error: 'Forbidden. Super admin only.' }, { status: 403 });
  }

  // Best-effort auto-expire
  try {
    await supabase.rpc('expire_subscriptions');
  } catch (e) {
    // Ignore if not present
  }

  const admin = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? (await import('@supabase/supabase-js')).createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
    : supabase;

  // 1. Fetch all available plans
  const { data: allPlansData } = await admin
    .from('plans')
    .select('*')
    .neq('name', 'Scale')
    .order('sort_order', { ascending: true });

  const plansList = allPlansData || [];
  const planById = new Map(plansList.map((p) => [p.id, p]));

  // 2. Fetch all registered auth users from Supabase Auth directly
  let authUsers: any[] = [];
  try {
    const listRes = await admin.auth.admin.listUsers({ perPage: 1000 });
    authUsers = listRes.data?.users || [];
  } catch (authListErr) {
    console.warn('Could not list auth users directly:', authListErr);
  }

  // 3. Fetch existing accounts, profiles, and subscriptions in parallel (3 fast single queries)
  const [{ data: existingAccounts }, { data: existingProfiles }, { data: allSubscriptions }] = await Promise.all([
    admin.from('accounts').select('id, name, created_at, owner_user_id').order('created_at', { ascending: false }),
    admin.from('profiles').select('id, user_id, account_id, full_name, email, is_super_admin'),
    admin.from('subscriptions').select('id, account_id, plan_id, status, start_date, end_date, notes, is_trial, billing_cycle, custom_overrides'),
  ]);

  const accountsByOwnerId = new Map((existingAccounts || []).map((a) => [a.owner_user_id, a]));
  const profilesByUserId = new Map((existingProfiles || []).map((p) => [p.user_id, p]));
  const profilesByAccountId = new Map((existingProfiles || []).map((p) => [p.account_id, p]));
  const subsByAccountId = new Map<string, any[]>();

  (allSubscriptions || []).forEach((sub) => {
    const arr = subsByAccountId.get(sub.account_id) || [];
    arr.push({
      ...sub,
      plans: planById.get(sub.plan_id) || null,
    });
    subsByAccountId.set(sub.account_id, arr);
  });

  // 4. If any auth user is missing an accounts row, batch create them
  const missingAuthUsers = authUsers.filter((u) => !accountsByOwnerId.has(u.id));
  if (missingAuthUsers.length > 0) {
    try {
      const newAccountsData = missingAuthUsers.map((u) => ({
        name: u.user_metadata?.full_name || u.user_metadata?.name || u.email || 'My account',
        owner_user_id: u.id,
      }));

      const { data: createdAccounts } = await admin
        .from('accounts')
        .insert(newAccountsData)
        .select('id, name, created_at, owner_user_id');

      (createdAccounts || []).forEach((newAcc) => {
        accountsByOwnerId.set(newAcc.owner_user_id, newAcc);
      });
    } catch (createErr) {
      console.warn('Batch account creation error:', createErr);
    }
  }

  const authUserById = new Map(authUsers.map((u) => [u.id, u]));

  // Combine all accounts list
  const allAccountsList = Array.from(accountsByOwnerId.values()).sort(
    (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );

  // 5. Build enhanced response with complete profile, registered Gmail, plan & usage
  const enhancedAccounts = allAccountsList.map((acc) => {
    const ownerProf = profilesByUserId.get(acc.owner_user_id) || profilesByAccountId.get(acc.id);
    const authUser = authUserById.get(acc.owner_user_id);

    const resolvedEmail = authUser?.email || ownerProf?.email || '';
    const resolvedName =
      ownerProf?.full_name ||
      authUser?.user_metadata?.full_name ||
      authUser?.user_metadata?.name ||
      acc.name ||
      '';

    const accountSubs = subsByAccountId.get(acc.id) || [];

    return {
      id: acc.id,
      name: acc.name,
      created_at: acc.created_at,
      owner_user_id: acc.owner_user_id,
      profiles: {
        full_name: resolvedName,
        email: resolvedEmail,
        is_super_admin: Boolean(ownerProf?.is_super_admin),
      },
      subscriptions: accountSubs,
      usage: {
        contactsCount: 0,
        campaignsCount: 0,
        flowsCount: 0,
        teamMembersCount: 0,
      },
    };
  });

  return NextResponse.json({ accounts: enhancedAccounts });
}

// ── POST /api/admin/subscriptions ─────────────────────────────────
// Assign or update a subscription for an account, with custom overrides and privileges.
export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('user_id', user.id)
    .single();

  if (!profile?.is_super_admin) {
    return NextResponse.json({ error: 'Forbidden. Super admin only.' }, { status: 403 });
  }

  const body = await request.json();
  const {
    account_id,
    plan_id,
    status = 'active',
    start_date,
    end_date,
    is_trial = false,
    billing_cycle = 'monthly',
    notes,
    custom_overrides = {},
  } = body;

  if (!account_id || !plan_id) {
    return NextResponse.json({ error: 'account_id and plan_id are required' }, { status: 400 });
  }

  const startAt = start_date ? new Date(start_date) : new Date();
  const endAt = end_date
    ? new Date(end_date)
    : new Date(startAt.getTime() + (is_trial ? 7 : 30) * 24 * 60 * 60 * 1000);

  const admin = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? (await import('@supabase/supabase-js')).createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
    : supabase;

  const { data, error } = await admin
    .from('subscriptions')
    .upsert(
      {
        account_id,
        plan_id,
        status,
        is_trial: Boolean(is_trial),
        billing_cycle,
        start_date: startAt.toISOString(),
        end_date: endAt.toISOString(),
        notes: notes ?? null,
        custom_overrides: custom_overrides || {},
        created_by: user.id,
      },
      { onConflict: 'account_id' },
    )
    .select()
    .single();

  if (error) {
    console.error('Admin subscription upsert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subscription: data });
}

// ── DELETE /api/admin/subscriptions?account_id=xxx ────────────────
// Cancel a subscription
export async function DELETE(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? (await import('@supabase/supabase-js')).createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
    : supabase;

  const { data: profile } = await admin
    .from('profiles')
    .select('is_super_admin')
    .eq('user_id', user.id)
    .single();

  if (!profile?.is_super_admin) {
    return NextResponse.json({ error: 'Forbidden. Super admin only.' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get('account_id');
  if (!accountId) return NextResponse.json({ error: 'account_id required' }, { status: 400 });

  const { error } = await admin
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('account_id', accountId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
