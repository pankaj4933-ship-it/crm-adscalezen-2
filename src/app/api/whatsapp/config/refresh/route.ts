import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import {
  verifyPhoneNumber,
  listWabaPhoneNumbers,
  getSubscribedApps,
  type MetaPhoneInfo,
  type WabaPhoneNumber,
} from '@/lib/whatsapp/meta-api'
import { decrypt } from '@/lib/whatsapp/encryption'

let _adminClient: any = null
function supabaseAdmin() {
  if (!_adminClient) {
    _adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return _adminClient
}

async function resolveAccountId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('account_id')
    .eq('user_id', userId)
    .maybeSingle()
  if (error || !data?.account_id) return null
  return data.account_id as string
}

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accountId = await resolveAccountId(supabase, user.id)
    if (!accountId) {
      return NextResponse.json(
        { error: 'Your profile is not linked to an account.' },
        { status: 403 }
      )
    }

    const { data: config, error: configError } = await supabase
      .from('whatsapp_config')
      .select('*')
      .eq('account_id', accountId)
      .maybeSingle()

    if (configError || !config) {
      return NextResponse.json(
        { error: 'No WhatsApp configuration found to refresh.' },
        { status: 404 }
      )
    }

    let accessToken: string
    try {
      accessToken = decrypt(config.access_token)
    } catch (err) {
      return NextResponse.json(
        { error: 'Access token decryption failed. Re-connect with Facebook.' },
        { status: 400 }
      )
    }

    // Refresh phone number info from Meta
    let phoneInfo: MetaPhoneInfo | null = null
    try {
      phoneInfo = await verifyPhoneNumber({
        phoneNumberId: config.phone_number_id,
        accessToken,
      })
    } catch (err: any) {
      console.warn('[Refresh] verifyPhoneNumber error:', err)
    }

    // Refresh WABA phone numbers if waba_id is set
    let wabaPhoneNumbers: WabaPhoneNumber[] = []
    if (config.waba_id) {
      try {
        wabaPhoneNumbers = await listWabaPhoneNumbers({
          wabaId: config.waba_id,
          accessToken,
        })
      } catch (err) {
        console.warn('[Refresh] listWabaPhoneNumbers error:', err)
      }
    }

    // Update database cache
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      status: 'connected',
    }

    if (phoneInfo) {
      updatePayload.display_phone_number = phoneInfo.display_phone_number || null
      updatePayload.verified_name = phoneInfo.verified_name || null
      updatePayload.quality_rating = phoneInfo.quality_rating || null
      updatePayload.code_verification_status = phoneInfo.code_verification_status || null
      updatePayload.name_status = phoneInfo.name_status || null
    }

    if (wabaPhoneNumbers.length > 0) {
      updatePayload.phone_numbers = wabaPhoneNumbers
    }

    await supabase
      .from('whatsapp_config')
      .update(updatePayload)
      .eq('account_id', accountId)

    // Update whatsapp_phone_numbers table
    if (wabaPhoneNumbers.length > 0) {
      try {
        for (const num of wabaPhoneNumbers) {
          await supabaseAdmin()
            .from('whatsapp_phone_numbers')
            .upsert(
              {
                account_id: accountId,
                waba_id: config.waba_id || null,
                phone_number_id: num.id,
                display_phone_number: num.display_phone_number || null,
                verified_name: num.verified_name || null,
                quality_rating: num.quality_rating || null,
                is_default: num.id === config.phone_number_id,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'account_id,phone_number_id' }
            )
        }
      } catch (err) {
        console.warn('[Refresh] whatsapp_phone_numbers sync notice:', err)
      }
    }

    return NextResponse.json({
      success: true,
      phone_info: phoneInfo || {
        id: config.phone_number_id,
        display_phone_number: config.display_phone_number,
        verified_name: config.verified_name,
        quality_rating: config.quality_rating,
      },
      phone_numbers: wabaPhoneNumbers.length > 0 ? wabaPhoneNumbers : (config.phone_numbers || []),
      waba_id: config.waba_id,
    })
  } catch (error: any) {
    console.error('Error refreshing WhatsApp info:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to refresh WhatsApp business information.' },
      { status: 500 }
    )
  }
}
