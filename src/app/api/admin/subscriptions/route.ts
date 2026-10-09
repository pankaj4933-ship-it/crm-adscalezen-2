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
  const freePlan = plansList.find((p) => p.name === 'Free Plan' || p.is_trial) || plansList[0];

  // 2. Fetch all registered auth users from Supabase Auth directly (so NO user is ever missed)
  let authUsers: any[] = [];
  try {
    const listRes = await admin.auth.admin.listUsers({ perPage: 1000 });
    authUsers = listRes.data?.users || [];
  } catch (authListErr) {
    console.warn('Could not list auth users directly (falling back to profiles):', authListErr);
  }

  // 3. Fetch existing accounts and profiles
  const [{ data: existingAccounts }, { data: existingProfiles }] = await Promise.all([
    admin.from('accounts').select('id, name, created_at, owner_user_id'),
    admin.from('profiles').select('id, user_id, account_id, full_name, email, is_super_admin'),
  ]);

  const accountsByOwnerId = new Map((existingAccounts || []).map((a) => [a.owner_user_id, a]));
  const profilesByUserId = new Map((existingProfiles || []).map((p) => [p.user_id, p]));

  // 4. Auto-heal: Ensure every registered user has an accounts and profiles row
  for (const authUser of authUsers) {
    let acc = accountsByOwnerId.get(authUser.id);
    if (!acc) {
      const accName =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        authUser.email ||
        'My account';

      const { data: newAcc } = await admin
        .from('accounts')
        .insert({
          name: accName,
          owner_user_id: authUser.id,
        })
        .select('id, name, created_at, owner_user_id')
        .maybeSingle();

      if (newAcc) {
        acc = newAcc;
        accountsByOwnerId.set(authUser.id, newAcc);
      }
    }

    const prof = profilesByUserId.get(authUser.id);
    const targetAccountId = acc?.id || prof?.account_id;

    if (!prof || !prof.email || !prof.account_id) {
      const fullName =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        prof?.full_name ||
        '';

      const { data: updatedProf } = await admin
        .from('profiles')
        .upsert(
          {
            user_id: authUser.id,
            email: authUser.email || prof?.email || '',
            full_name: fullName,
            account_id: targetAccountId,
            account_role: 'owner',
          },
          { onConflict: 'user_id' }
        )
        .select('id, user_id, account_id, full_name, email, is_super_admin')
        .maybeSingle();

      if (updatedProf) {
        profilesByUserId.set(authUser.id, updatedProf);
      }
    }

    // Auto-provision 7-Day Free Trial if account has no subscription
    if (targetAccountId && freePlan) {
      const { data: existingSub } = await admin
        .from('subscriptions')
        .select('id')
        .eq('account_id', targetAccountId)
        .maybeSingle();

      if (!existingSub) {
        const now = new Date();
        const end = new Date(now.getTime() + (freePlan.trial_days || 7) * 24 * 60 * 60 * 1000);
        await admin.from('subscriptions').insert({
          account_id: targetAccountId,
          plan_id: freePlan.id,
          status: 'active',
          is_trial: true,
          billing_cycle: 'monthly',
          start_date: now.toISOString(),
          end_date: end.toISOString(),
          notes: 'Auto-provisioned 7-day free trial on signup',
          created_by: authUser.id,
        });
      }
    }
  }

  // 5. Fetch all accounts with subscriptions
  const { data: accounts, error } = await admin
    .from('accounts')
    .select(`
      id,
      name,
      created_at,
      owner_user_id,
      subscriptions (
        id,
        plan_id,
        status,
        start_date,
        end_date,
        notes,
        is_trial,
        billing_cycle,
        custom_overrides
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Admin subscriptions fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 6. Refetch profiles to ensure freshest data
  const { data: latestProfiles } = await admin
    .from('profiles')
    .select('user_id, account_id, full_name, email, is_super_admin');

  const profileByUserId = new Map((latestProfiles || []).map((p) => [p.user_id, p]));
  const profileByAccountId = new Map((latestProfiles || []).map((p) => [p.account_id, p]));
  const authUserById = new Map(authUsers.map((u) => [u.id, u]));

  // 7. Attach owner info, resolved plan, and usage stats
  const enhancedAccounts = await Promise.all(
    (accounts || []).map(async (acc) => {
      const [contactsRes, campaignsRes, flowsRes, membersRes] = await Promise.all([
        admin.from('contacts').select('id', { count: 'exact', head: true }).eq('account_id', acc.id),
        admin.from('broadcasts').select('id', { count: 'exact', head: true }).eq('account_id', acc.id),
        admin.from('flows').select('id', { count: 'exact', head: true }).eq('account_id', acc.id),
        admin.from('profiles').select('id', { count: 'exact', head: true }).eq('account_id', acc.id),
      ]);

      const ownerProf =
        profileByUserId.get(acc.owner_user_id) ||
        profileByAccountId.get(acc.id) ||
        null;
      const authUser = authUserById.get(acc.owner_user_id);

      const resolvedEmail = authUser?.email || ownerProf?.email || '';
      const resolvedName =
        ownerProf?.full_name ||
        authUser?.user_metadata?.full_name ||
        authUser?.user_metadata?.name ||
        acc.name ||
        '';

      // Attach resolved plan to each subscription
      const resolvedSubscriptions = (acc.subscriptions || []).map((sub: any) => ({
        ...sub,
        plans: planById.get(sub.plan_id) || null,
      }));

      return {
        ...acc,
        profiles: {
          full_name: resolvedName,
          email: resolvedEmail,
          is_super_admin: Boolean(ownerProf?.is_super_admin),
        },
        subscriptions: resolvedSubscriptions,
        usage: {
          contactsCount: contactsRes.count ?? 0,
          campaignsCount: campaignsRes.count ?? 0,
          flowsCount: flowsRes.count ?? 0,
          teamMembersCount: Math.max(0, (membersRes.count ?? 1) - 1),
        },
      };
    })
  );

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
