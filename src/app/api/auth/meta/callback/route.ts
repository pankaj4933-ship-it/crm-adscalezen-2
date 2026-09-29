import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import {
  verifyPhoneNumber,
  listWabaPhoneNumbers,
  subscribeWabaToApp,
  type MetaPhoneInfo,
  type WabaPhoneNumber,
} from '@/lib/whatsapp/meta-api'
import { encrypt } from '@/lib/whatsapp/encryption'

/**
 * Server-side Meta OAuth callback route for Facebook Login for Business & WhatsApp Embedded Signup.
 *
 * Route: /api/auth/meta/callback
 *
 * OAuth Redirect URI: Configured via process.env.META_OAUTH_REDIRECT_URI
 * Example: https://adscalezen.online/api/auth/meta/callback
 *
 * Handles:
 * 1. GET requests from Meta OAuth browser redirects with code & state query params.
 * 2. POST requests from client-side Embedded Signup with code, waba_id, and phone_number_id.
 *
 * Automatically:
 * - Validates authentication
 * - Exchanges authorization code server-side for access token
 * - Discovers / confirms WABA ID and Phone Number ID
 * - Fetches verified phone info & quality rating from Meta Graph API
 * - Subscribes WABA to app for webhook delivery
 * - Encrypts and saves credentials & phone information against the workspace in database
 * - Sets connection status to CONNECTED
 */

const META_GRAPH_API = 'https://graph.facebook.com/v23.0'

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

const DEFAULT_META_APP_ID = '1591981308443623'
const DEFAULT_META_APP_SECRET = '603ac6147c05e5d16f181b02d7785b4b'
const DEFAULT_META_OAUTH_REDIRECT_URI = 'https://adscalezen.online/api/auth/meta/callback'

function cleanEnvValue(val: string | undefined, prefix?: string): string {
  if (!val) return ''
  let cleaned = val.trim()
  if (prefix && cleaned.startsWith(`${prefix}=`)) {
    cleaned = cleaned.substring(prefix.length + 1).trim()
  }
  return cleaned.replace(/^["']|["']$/g, '').trim()
}

/**
 * Exchange auth code with Meta Graph API for access token.
 */
async function exchangeCodeForToken(code: string, origin: string): Promise<string> {
  const appId =
    cleanEnvValue(process.env.META_APP_ID || process.env.NEXT_PUBLIC_META_APP_ID, 'META_APP_ID') ||
    DEFAULT_META_APP_ID
  const appSecret =
    cleanEnvValue(process.env.META_APP_SECRET, 'META_APP_SECRET') ||
    DEFAULT_META_APP_SECRET
  const redirectUri =
    cleanEnvValue(process.env.META_OAUTH_REDIRECT_URI, 'META_OAUTH_REDIRECT_URI') ||
    (origin ? `${origin}/api/auth/meta/callback` : DEFAULT_META_OAUTH_REDIRECT_URI)

  if (!appId || !appSecret) {
    throw new Error('META_APP_ID or META_APP_SECRET is not configured on server.')
  }

  const params = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    redirect_uri: redirectUri,
    code,
  })

  const tokenRes = await fetch(`${META_GRAPH_API}/oauth/access_token?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })

  const tokenData = await tokenRes.json()

  if (tokenData.error || !tokenData.access_token) {
    console.error('[Meta OAuth Error] Code exchange failed:', {
      errorType: tokenData.error?.type,
      errorCode: tokenData.error?.code,
      errorMessage: tokenData.error?.message,
    })
    throw new Error(tokenData.error?.message || 'Meta did not return an access token.')
  }

  return tokenData.access_token as string
}

/**
 * Inspect debug token to discover WABA ID if not passed from client.
 */
async function inspectDebugToken(accessToken: string): Promise<{ wabaId?: string }> {
  const appId =
    cleanEnvValue(process.env.META_APP_ID || process.env.NEXT_PUBLIC_META_APP_ID, 'META_APP_ID') ||
    DEFAULT_META_APP_ID
  const appSecret =
    cleanEnvValue(process.env.META_APP_SECRET, 'META_APP_SECRET') ||
    DEFAULT_META_APP_SECRET
  if (!appId || !appSecret) return {}

  try {
    const url = `https://graph.facebook.com/v21.0/debug_token?input_token=${accessToken}&access_token=${appId}|${appSecret}`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return {}
    const data = await res.json()
    const scopes = data?.data?.granular_scopes as Array<{ scope: string; target_ids?: string[] }> | undefined
    if (scopes && Array.isArray(scopes)) {
      const waScope = scopes.find((s) => s.scope === 'whatsapp_business_management' || s.scope === 'whatsapp_business_messaging')
      if (waScope?.target_ids && waScope.target_ids.length > 0) {
        return { wabaId: waScope.target_ids[0] }
      }
    }
  } catch (err) {
    console.warn('[Meta OAuth] debug_token lookup failed:', err)
  }
  return {}
}

/**
 * Process token, fetch phone information, subscribe WABA, and save to database.
 */
async function processAndSaveConnection(params: {
  supabase: Awaited<ReturnType<typeof createClient>>
  userId: string
  accountId: string
  accessToken: string
  wabaId?: string | null
  phoneNumberId?: string | null
}) {
  const { supabase, userId, accountId, accessToken } = params
  let wabaId = params.wabaId
  let phoneNumberId = params.phoneNumberId

  // Discover WABA ID if missing
  if (!wabaId) {
    const debugInfo = await inspectDebugToken(accessToken)
    if (debugInfo.wabaId) {
      wabaId = debugInfo.wabaId
    }
  }

  // Fetch list of phone numbers under WABA if WABA ID is available
  let wabaPhoneNumbers: WabaPhoneNumber[] = []
  if (wabaId) {
    try {
      wabaPhoneNumbers = await listWabaPhoneNumbers({
        wabaId,
        accessToken,
      })
      console.log(`[Meta OAuth Callback] Discovered ${wabaPhoneNumbers.length} phone number(s) under WABA ${wabaId}`)
    } catch (err) {
      console.warn('[Meta OAuth Error] Failed to list WABA phone numbers:', err)
    }

    // Subscribe WABA to our App so incoming webhooks are routed
    try {
      await subscribeWabaToApp({
        wabaId,
        accessToken,
      })
      console.log(`[Meta OAuth Callback] Successfully subscribed WABA ${wabaId} to app`)
    } catch (err) {
      console.warn('[Meta OAuth Error] Failed to subscribe WABA to app:', err)
    }
  }

  // If phoneNumberId is still missing, select the first phone number under WABA
  if (!phoneNumberId && wabaPhoneNumbers.length > 0) {
    phoneNumberId = wabaPhoneNumbers[0].id
  }

  if (!phoneNumberId) {
    throw new Error('Meta connection completed, but WhatsApp Business phone number information could not be retrieved.')
  }

  // Fetch verified phone number details
  let phoneInfo: MetaPhoneInfo
  try {
    phoneInfo = await verifyPhoneNumber({
      phoneNumberId,
      accessToken,
    })
    console.log('[Meta OAuth Callback] Verified phone info from Meta:', {
      id: phoneInfo.id,
      display_phone_number: phoneInfo.display_phone_number,
      verified_name: phoneInfo.verified_name,
      quality_rating: phoneInfo.quality_rating,
    })
  } catch (err: any) {
    console.error('[Meta OAuth Error] Failed to verify phone number with Meta:', err)
    throw new Error(err?.message || 'Failed to retrieve WhatsApp phone details from Meta.')
  }

  // Check if another account has already claimed this phone number
  const { data: claimed } = await supabaseAdmin()
    .from('whatsapp_config')
    .select('account_id')
    .eq('phone_number_id', phoneNumberId)
    .neq('account_id', accountId)
    .maybeSingle()

  if (claimed) {
    throw new Error('This WhatsApp phone number is already linked to another workspace.')
  }

  // Encrypt access token
  const encryptedAccessToken = encrypt(accessToken)

  // Check for existing config
  const { data: existing } = await supabase
    .from('whatsapp_config')
    .select('id')
    .eq('account_id', accountId)
    .maybeSingle()

  const configPayload: Record<string, unknown> = {
    account_id: accountId,
    user_id: userId,
    phone_number_id: phoneNumberId,
    waba_id: wabaId || null,
    access_token: encryptedAccessToken,
    status: 'connected',
    connected_at: new Date().toISOString(),
    registered_at: new Date().toISOString(),
    subscribed_apps_at: new Date().toISOString(),
    display_phone_number: phoneInfo.display_phone_number || null,
    verified_name: phoneInfo.verified_name || null,
    quality_rating: phoneInfo.quality_rating || null,
    code_verification_status: phoneInfo.code_verification_status || null,
    name_status: phoneInfo.name_status || null,
    phone_numbers: wabaPhoneNumbers.length > 0 ? wabaPhoneNumbers : [
      {
        id: phoneInfo.id,
        display_phone_number: phoneInfo.display_phone_number,
        verified_name: phoneInfo.verified_name,
        quality_rating: phoneInfo.quality_rating,
      },
    ],
    last_registration_error: null,
    updated_at: new Date().toISOString(),
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from('whatsapp_config')
      .update(configPayload)
      .eq('account_id', accountId)

    if (updateError) {
      console.error('[Meta OAuth Error] Database update failed:', updateError)
      throw new Error('Failed to save WhatsApp configuration to database.')
    }
  } else {
    const { error: insertError } = await supabase
      .from('whatsapp_config')
      .insert(configPayload)

    if (insertError) {
      console.error('[Meta OAuth Error] Database insert failed:', insertError)
      throw new Error('Failed to save WhatsApp configuration to database.')
    }
  }

  // Attempt to save multi-number rows in whatsapp_phone_numbers table
  try {
    const numbersToInsert = (wabaPhoneNumbers.length > 0 ? wabaPhoneNumbers : [phoneInfo]).map((num) => ({
      account_id: accountId,
      waba_id: wabaId || null,
      phone_number_id: num.id,
      display_phone_number: num.display_phone_number || null,
      verified_name: num.verified_name || null,
      quality_rating: num.quality_rating || null,
      is_default: num.id === phoneNumberId,
      updated_at: new Date().toISOString(),
    }))

    for (const numRow of numbersToInsert) {
      await supabaseAdmin()
        .from('whatsapp_phone_numbers')
        .upsert(numRow, { onConflict: 'account_id,phone_number_id' })
    }
  } catch (err) {
    // Non-blocking if table is being created
    console.warn('[Meta OAuth] Optional whatsapp_phone_numbers upsert notice:', err)
  }

  return {
    success: true,
    phone_info: phoneInfo,
    waba_id: wabaId,
    phone_numbers: wabaPhoneNumbers.length > 0 ? wabaPhoneNumbers : [phoneInfo],
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error')
  const errorReason = searchParams.get('error_reason')
  const errorDescription = searchParams.get('error_description')

  console.log('[Meta OAuth Start] Received Meta OAuth browser GET callback')

  const redirectTarget = `${origin}/settings?tab=whatsapp`

  if (errorParam || errorReason || errorDescription) {
    console.error('[Meta OAuth Error] OAuth error returned from Meta:', {
      error: errorParam,
      reason: errorReason,
      description: errorDescription,
    })
    const errMessage = encodeURIComponent(errorDescription || errorReason || errorParam || 'OAuth failed')
    return NextResponse.redirect(`${redirectTarget}&error=${errMessage}`)
  }

  if (!code) {
    console.error('[Meta OAuth Error] No authorization code found in GET request searchParams')
    return NextResponse.redirect(`${redirectTarget}&error=${encodeURIComponent('No authorization code provided')}`)
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[Meta OAuth Error] User session missing or unauthenticated')
      return NextResponse.redirect(`${redirectTarget}&error=${encodeURIComponent('User unauthenticated')}`)
    }

    const accountId = await resolveAccountId(supabase, user.id)
    if (!accountId) {
      return NextResponse.redirect(`${redirectTarget}&error=${encodeURIComponent('Profile not linked to workspace')}`)
    }

    console.log('[Meta OAuth Callback] Exchanging code and retrieving WhatsApp Business information')
    const accessToken = await exchangeCodeForToken(code, origin)

    await processAndSaveConnection({
      supabase,
      userId: user.id,
      accountId,
      accessToken,
    })

    console.log('[Meta OAuth Callback] Connection successfully processed and saved. Redirecting.')
    return NextResponse.redirect(`${redirectTarget}&meta_connected=true`)
  } catch (err: any) {
    console.error('[Meta OAuth Error] Connection processing failed:', err)
    const msg = encodeURIComponent(err?.message || 'Meta connection completed, but WhatsApp Business information could not be retrieved.')
    return NextResponse.redirect(`${redirectTarget}&error=${msg}`)
  }
}

export async function POST(request: Request) {
  console.log('[Meta OAuth Start] Received Meta OAuth POST callback / exchange request')

  const { origin } = new URL(request.url)
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('[Meta OAuth Error] Unauthorized POST request — no user session')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accountId = await resolveAccountId(supabase, user.id)
  if (!accountId) {
    return NextResponse.json({ error: 'Your profile is not linked to an account.' }, { status: 403 })
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    console.error('[Meta OAuth Error] Failed to parse request JSON body')
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { code, waba_id, phone_number_id } = body || {}

  if (!code || typeof code !== 'string') {
    console.error('[Meta OAuth Error] Missing or invalid authorization code in POST body')
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 })
  }

  try {
    console.log('[Meta OAuth Callback] Exchanging code server-side for access token')
    const accessToken = await exchangeCodeForToken(code, origin)

    console.log('[Meta OAuth Callback] Processing WhatsApp connection & retrieving business details')
    const result = await processAndSaveConnection({
      supabase,
      userId: user.id,
      accountId,
      accessToken,
      wabaId: waba_id,
      phoneNumberId: phone_number_id,
    })

    console.log('[Meta OAuth Callback] WhatsApp connection saved and marked CONNECTED')
    return NextResponse.json(result, { status: 200 })
  } catch (err: any) {
    console.error('[Meta OAuth Error] Error processing Meta Embedded Signup connection:', err)
    return NextResponse.json(
      {
        error:
          err?.message ||
          'Meta connection completed, but WhatsApp Business information could not be retrieved.',
      },
      { status: 400 }
    )
  }
}
