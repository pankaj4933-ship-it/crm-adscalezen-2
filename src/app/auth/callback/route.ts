import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Bootstrap account & profile if newly signed up via Google OAuth
      try {
        const user = sessionData?.user ?? (await supabase.auth.getUser()).data.user;
        if (user) {
          const admin = process.env.SUPABASE_SERVICE_ROLE_KEY
            ? (await import('@supabase/supabase-js')).createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
              )
            : supabase;

          // 1. Ensure accounts row exists
          let accountId: string | null = null;
          const { data: existingAccount } = await admin
            .from('accounts')
            .select('id')
            .eq('owner_user_id', user.id)
            .maybeSingle();

          if (existingAccount) {
            accountId = existingAccount.id;
          } else {
            const accountName =
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email ||
              'My account';

            const { data: newAccount } = await admin
              .from('accounts')
              .insert({
                name: accountName,
                owner_user_id: user.id,
              })
              .select('id')
              .maybeSingle();

            if (newAccount) {
              accountId = newAccount.id;
            }
          }

          // 2. Ensure profiles row exists and has accurate email and account_id
          if (accountId) {
            const fullName =
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.user_metadata?.user_name ||
              '';
            const avatarUrl =
              user.user_metadata?.avatar_url ||
              user.user_metadata?.picture ||
              null;

            await admin
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
              );

            // 3. Auto-provision Free 7-Day Trial if no subscription exists
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
        }
      } catch (bootstrapErr) {
        console.error('OAuth callback bootstrap error (non-fatal):', bootstrapErr);
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // If code exchange failed or wasn't provided, bounce back to login
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
