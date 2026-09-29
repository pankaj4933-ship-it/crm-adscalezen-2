import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { verifyPhoneNumber } from '@/lib/whatsapp/meta-api'
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

export async function POST(request: Request) {
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

    const { phone_number_id } = await request.json()

    if (!phone_number_id || typeof phone_number_id !== 'string') {
      return NextResponse.json(
        { error: 'phone_number_id is required' },
        { status: 400 }
      )
    }

    const { data: config, error: configError } = await supabase
      .from('whatsapp_config')
      .select('*')
      .eq('account_id', accountId)
      .maybeSingle()

    if (configError || !config) {
      return NextResponse.json(
        { error: 'No WhatsApp configuration found.' },
        { status: 404 }
      )
    }

    let accessToken: string
    try {
      accessToken = decrypt(config.access_token)
    } catch (err) {
      return NextResponse.json(
        { error: 'Token decryption failed. Please re-authenticate.' },
        { status: 400 }
      )
    }

    // Verify newly selected phone number
    let phoneInfo
    try {
      phoneInfo = await verifyPhoneNumber({
        phoneNumberId: phone_number_id,
        accessToken,
      })
    } catch (err: any) {
      return NextResponse.json(
        { error: err?.message || 'Failed to verify selected phone number with Meta.' },
        { status: 400 }
      )
    }

    // Update active phone_number_id in whatsapp_config
    const { error: updateError } = await supabase
      .from('whatsapp_config')
      .update({
        phone_number_id: phone_number_id,
        display_phone_number: phoneInfo.display_phone_number || null,
        verified_name: phoneInfo.verified_name || null,
        quality_rating: phoneInfo.quality_rating || null,
        code_verification_status: phoneInfo.code_verification_status || null,
        name_status: phoneInfo.name_status || null,
        updated_at: new Date().toISOString(),
      })
      .eq('account_id', accountId)

    if (updateError) {
      console.error('Failed to update default phone number in whatsapp_config:', updateError)
      return NextResponse.json(
        { error: 'Failed to update default phone number.' },
        { status: 500 }
      )
    }

    // Update default flags in whatsapp_phone_numbers table
    try {
      await supabaseAdmin()
        .from('whatsapp_phone_numbers')
        .update({ is_default: false })
        .eq('account_id', accountId)

      await supabaseAdmin()
        .from('whatsapp_phone_numbers')
        .update({ is_default: true, updated_at: new Date().toISOString() })
        .eq('account_id', accountId)
        .eq('phone_number_id', phone_number_id)
    } catch (err) {
      console.warn('Notice updating whatsapp_phone_numbers table:', err)
    }

    return NextResponse.json({
      success: true,
      phone_info: phoneInfo,
    })
  } catch (error: any) {
    console.error('Error in set-default route:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
