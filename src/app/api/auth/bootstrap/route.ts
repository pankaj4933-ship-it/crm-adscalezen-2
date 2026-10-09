import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ── POST /api/auth/bootstrap ───────────────────────────────────────
// Guarantees that the currently authenticated user has:
// 1. An accounts row (where owner_user_id = user.id)
// 2. A profiles row (with valid email, full_name, account_id, account_role)
// 3. A default 7-Day Free Trial subscription if none exists
export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? (await import('@supabase/supabase-js')).createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
    : supabase;

  try {
    // 1. Ensure accounts row exists
    let accountId: string | null = null;
    let accountName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email ||
      'My account';

    const { data: existingAccount } = await admin
      .from('accounts')
      .select('id, name')
      .eq('owner_user_id', user.id)
      .maybeSingle();

    if (existingAccount) {
      accountId = existingAccount.id;
      accountName = existingAccount.name;
    } else {
      const { data: newAccount, error: createAccErr } = await admin
        .from('accounts')
        .insert({
          name: accountName,
          owner_user_id: user.id,
        })
        .select('id, name')
        .maybeSingle();

      if (createAccErr) {
        console.error('Bootstrap accounts insert error:', createAccErr);
      }
      if (newAccount) {
        accountId = newAccount.id;
      }
    }

    // 2. Ensure profiles row exists
    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.user_name ||
      '';
    const avatarUrl =
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      null;

    const { data: profile, error: profErr } = await admin
      .from('profiles')
      .upsert(
        {
          user_id: user.id,
          email: user.email || '',
          full_name: fullName,
          avatar_url: avatarUrl,
          account_id: accountId,
          account_role: 'owner',
        },
        { onConflict: 'user_id' }
      )
      .select('id, full_name, email, avatar_url, role, beta_features, account_id, account_role, is_super_admin')
      .single();

    if (profErr) {
      console.error('Bootstrap profiles upsert error:', profErr);
    }

    // 3. Ensure a default 7-Day Free Trial subscription exists
    if (accountId) {
      const { data: existingSub } = await admin
        .from('subscriptions')
        .select('id')
        .eq('account_id', accountId)
        .maybeSingle();

      if (!existingSub) {
        const { data: freePlan } = await admin
          .from('plans')
          .select('id, trial_days')
          .or('name.eq.Free Plan,is_trial.eq.true')
          .limit(1)
          .maybeSingle();

        if (freePlan) {
          const now = new Date();
          const end = new Date(
            now.getTime() + (freePlan.trial_days || 7) * 24 * 60 * 60 * 1000
          );
          await admin.from('subscriptions').insert({
            account_id: accountId,
            plan_id: freePlan.id,
            status: 'active',
            is_trial: true,
            billing_cycle: 'monthly',
            start_date: now.toISOString(),
            end_date: end.toISOString(),
            notes: 'Auto-provisioned 7-day free trial on signup',
            created_by: user.id,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      profile,
      accountId,
    });
  } catch (err: any) {
    console.error('Bootstrap threw unexpected error:', err);
    return NextResponse.json({ error: err?.message || 'Bootstrap failed' }, { status: 500 });
  }
}
