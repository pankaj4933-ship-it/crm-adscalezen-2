'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  Zap,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Phone,
  ShieldCheck,
  Building2,
  Radio,
  FileText,
  Users,
  Send,
  Link2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useTranslations } from 'next-intl';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { SettingsPanelHead } from './settings-panel-head';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import type { WhatsAppConfig as WhatsAppConfigType, WhatsAppPhoneNumber } from '@/types';
import { EmbeddedSignupButton, type EmbeddedSignupResult } from './embedded-signup-button';

const MASKED_TOKEN = '••••••••••••••••';

type ConnectionStatus = 'connected' | 'disconnected' | 'unknown';
type ResetReason = 'token_corrupted' | 'meta_api_error' | null;

const META_ID_RE = /^\d+$/;

type MetaErrorMeta = {
  code: number | null;
  subcode: number | null;
  fbtrace_id: string | null;
  step: string;
  field?: string | null;
  message?: string | null;
};
type MetaFailure = { message: string; meta: MetaErrorMeta | null };
type WabaSubscription = {
  checked: boolean;
  subscribed: boolean | null;
  app_id_match: boolean | null;
  error?: string;
};

interface PhoneInfoState {
  id: string;
  display_phone_number?: string;
  verified_name?: string;
  quality_rating?: string;
  code_verification_status?: string;
  name_status?: string;
}

export function WhatsAppConfig() {
  const t = useTranslations('Settings.whatsapp');
  const supabase = createClient();
  const {
    user,
    accountId,
    loading: authLoading,
    profileLoading,
    canEditSettings,
  } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [refreshingInfo, setRefreshingInfo] = useState(false);
  const [savingDefault, setSavingDefault] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const [config, setConfig] = useState<WhatsAppConfigType | null>(null);
  const [phoneInfo, setPhoneInfo] = useState<PhoneInfoState | null>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<WhatsAppPhoneNumber[]>([]);
  const [defaultPhoneId, setDefaultPhoneId] = useState<string>('');

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('unknown');
  const [resetReason, setResetReason] = useState<ResetReason>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [statusMeta, setStatusMeta] = useState<MetaErrorMeta | null>(null);
  const [saveFailure, setSaveFailure] = useState<MetaFailure | null>(null);
  const [wabaSubscription, setWabaSubscription] = useState<WabaSubscription | null>(null);

  const loadedAccountIdRef = useRef<string | null>(null);

  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [wabaId, setWabaId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [pin, setPin] = useState('');
  const [tokenEdited, setTokenEdited] = useState(false);

  const [mirrorMedia, setMirrorMedia] = useState(true);
  const [savingMirror, setSavingMirror] = useState(false);

  const isRegistered = Boolean(config?.registered_at);
  const lastRegistrationError = config?.last_registration_error ?? null;

  const [verifyingRegistration, setVerifyingRegistration] = useState(false);
  type RegistrationProbe = {
    live: boolean;
    checks: Record<string, boolean | null>;
    errors?: string[];
    last_registration_error?: string | null;
    registered_at?: string | null;
    subscribed_apps_at?: string | null;
  };
  const [registrationProbe, setRegistrationProbe] =
    useState<RegistrationProbe | null>(null);

  const webhookUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/whatsapp/webhook`
      : '';

  const fetchConfig = useCallback(
    async (acctId: string) => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('whatsapp_config')
          .select('*')
          .eq('account_id', acctId)
          .maybeSingle();

        if (error) {
          console.error('Failed to load config row:', error);
        }

        if (data) {
          setConfig(data);
          setPhoneNumberId(data.phone_number_id || '');
          setWabaId(data.waba_id || '');
          setAccessToken(MASKED_TOKEN);
          setVerifyToken('');
          setPin('');
          setTokenEdited(false);
          setMirrorMedia(data.mirror_inbound_media !== false);
          setDefaultPhoneId(data.phone_number_id || '');

          if (data.phone_numbers && Array.isArray(data.phone_numbers) && data.phone_numbers.length > 0) {
            setPhoneNumbers(data.phone_numbers);
          } else if (data.phone_number_id) {
            setPhoneNumbers([
              {
                phone_number_id: data.phone_number_id,
                display_phone_number: data.display_phone_number || data.phone_number_id,
                verified_name: data.verified_name,
                quality_rating: data.quality_rating,
              },
            ]);
          }

          if (data.display_phone_number || data.verified_name) {
            setPhoneInfo({
              id: data.phone_number_id,
              display_phone_number: data.display_phone_number || data.phone_number_id,
              verified_name: data.verified_name,
              quality_rating: data.quality_rating,
              code_verification_status: data.code_verification_status,
              name_status: data.name_status,
            });
          }
        } else {
          setConfig(null);
          setPhoneNumberId('');
          setWabaId('');
          setAccessToken('');
          setVerifyToken('');
          setPin('');
          setTokenEdited(false);
          setMirrorMedia(true);
          setPhoneInfo(null);
          setPhoneNumbers([]);
          setDefaultPhoneId('');
        }

        setRegistrationProbe(null);

        // Verify health via the API (decrypts token + pings Meta)
        if (data) {
          try {
            const res = await fetch('/api/whatsapp/config', { method: 'GET' });
            const payload = await res.json();

            if (payload.connected) {
              setConnectionStatus('connected');
              setResetReason(null);
              setStatusMessage('');
              setStatusMeta(null);
              setWabaSubscription(payload.waba_subscription ?? null);

              if (payload.phone_info) {
                setPhoneInfo(payload.phone_info);
                setDefaultPhoneId(payload.phone_info.id || data.phone_number_id);
              }

              if (payload.phone_numbers && Array.isArray(payload.phone_numbers) && payload.phone_numbers.length > 0) {
                setPhoneNumbers(
                  payload.phone_numbers.map((n: any) => ({
                    phone_number_id: n.id || n.phone_number_id,
                    display_phone_number: n.display_phone_number || n.id || n.phone_number_id,
                    verified_name: n.verified_name,
                    quality_rating: n.quality_rating,
                    code_verification_status: n.code_verification_status,
                    name_status: n.name_status,
                  }))
                );
              }
            } else {
              setConnectionStatus('disconnected');
              setResetReason(
                payload.needs_reset
                  ? 'token_corrupted'
                  : payload.reason === 'meta_api_error'
                    ? 'meta_api_error'
                    : null
              );
              setStatusMessage(payload.message || '');
              setStatusMeta(payload.meta ?? null);
              setWabaSubscription(null);
            }
          } catch (err) {
            console.error('Health check failed:', err);
            setConnectionStatus('disconnected');
          }
        } else {
          setConnectionStatus('disconnected');
          setResetReason(null);
          setStatusMessage('');
          setStatusMeta(null);
          setWabaSubscription(null);
        }
      } catch (err) {
        console.error('fetchConfig error:', err);
        toast.error(t('loadFailed'));
      } finally {
        setLoading(false);
      }
    },
    [supabase, t]
  );

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!user || !accountId) {
      loadedAccountIdRef.current = null;
      setLoading(false);
      return;
    }
    if (loadedAccountIdRef.current === accountId) return;
    loadedAccountIdRef.current = accountId;
    fetchConfig(accountId);
  }, [authLoading, profileLoading, user?.id, accountId, fetchConfig]);

  async function handleToggleMirrorMedia(next: boolean) {
    if (!config || !accountId || savingMirror) return;
    const previous = mirrorMedia;
    setMirrorMedia(next);
    setSavingMirror(true);
    try {
      const { error } = await supabase
        .from('whatsapp_config')
        .update({ mirror_inbound_media: next })
        .eq('account_id', accountId);
      if (error) throw new Error(error.message);
      setConfig({ ...config, mirror_inbound_media: next });
    } catch (error) {
      console.error('Failed to update media retention setting:', error);
      setMirrorMedia(previous);
      toast.error(t('mirrorInboundSaveFailed'));
    } finally {
      setSavingMirror(false);
    }
  }

  async function handleEmbeddedSignupSuccess(result: EmbeddedSignupResult) {
    if (result.phone_number_id) setPhoneNumberId(result.phone_number_id);
    if (result.waba_id) setWabaId(result.waba_id);

    if (result.code) {
      try {
        setLoading(true);
        const res = await fetch('/api/auth/meta/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: result.code,
            waba_id: result.waba_id,
            phone_number_id: result.phone_number_id,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success(
            data.phone_info?.display_phone_number
              ? `WhatsApp Connected: ${data.phone_info.display_phone_number} (${data.phone_info.verified_name || 'Verified'})`
              : 'WhatsApp Business successfully connected via Meta Embedded Signup!'
          );
          if (accountId) {
            await fetchConfig(accountId);
          }
          return;
        } else {
          toast.error(
            data.error ||
              'Meta connection completed, but WhatsApp Business information could not be retrieved.',
            { duration: 10000 }
          );
        }
      } catch (err: any) {
        console.error('Meta OAuth code exchange error:', err);
        toast.error('Failed to communicate with server for Facebook token exchange.', { duration: 8000 });
      } finally {
        setLoading(false);
      }
    } else if (result.access_token) {
      setAccessToken(result.access_token);
      setTokenEdited(true);
      toast.success('Facebook connected! Review the fields below and click Save.');
    }
  }

  async function handleRefreshInfo() {
    setRefreshingInfo(true);
    try {
      const res = await fetch('/api/whatsapp/config/refresh', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.phone_info) setPhoneInfo(data.phone_info);
        if (data.phone_numbers) {
          setPhoneNumbers(
            data.phone_numbers.map((n: any) => ({
              phone_number_id: n.id || n.phone_number_id,
              display_phone_number: n.display_phone_number || n.id || n.phone_number_id,
              verified_name: n.verified_name,
              quality_rating: n.quality_rating,
              code_verification_status: n.code_verification_status,
              name_status: n.name_status,
            }))
          );
        }
        toast.success('Phone numbers & business information refreshed from Meta!');
        if (accountId) await fetchConfig(accountId);
      } else {
        toast.error(data.error || 'Failed to refresh info from Meta.');
      }
    } catch (err) {
      console.error('Refresh error:', err);
      toast.error('Network error while refreshing WhatsApp information.');
    } finally {
      setRefreshingInfo(false);
    }
  }

  async function handleSaveDefaultPhone() {
    if (!defaultPhoneId) {
      toast.error('Please select a phone number.');
      return;
    }
    setSavingDefault(true);
    try {
      const res = await fetch('/api/whatsapp/config/set-default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number_id: defaultPhoneId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Default phone number set to ${data.phone_info?.display_phone_number || defaultPhoneId}`);
        if (accountId) await fetchConfig(accountId);
      } else {
        toast.error(data.error || 'Failed to update default phone number.');
      }
    } catch (err) {
      console.error('Save default error:', err);
      toast.error('Failed to update default phone number.');
    } finally {
      setSavingDefault(false);
    }
  }

  async function handleSave() {
    if (!phoneNumberId.trim()) {
      toast.error(t('phoneNumberIdRequired'));
      return;
    }
    if (!META_ID_RE.test(phoneNumberId.trim())) {
      toast.error(t('phoneNumberIdNotNumeric'));
      return;
    }
    if (wabaId.trim() && !META_ID_RE.test(wabaId.trim())) {
      toast.error(t('wabaIdNotNumeric'));
      return;
    }
    if (!config && (!accessToken.trim() || !tokenEdited)) {
      toast.error(t('accessTokenRequired'));
      return;
    }

    try {
      setSaving(true);

      const payload: Record<string, unknown> = {
        phone_number_id: phoneNumberId.trim(),
        waba_id: wabaId.trim() || null,
        verify_token: verifyToken.trim() || null,
        pin: pin.trim() || null,
      };

      if (tokenEdited && accessToken !== MASKED_TOKEN && accessToken.trim()) {
        payload.access_token = accessToken.trim();
      } else if (config) {
        toast.error(t('reenterAccessToken'));
        setSaving(false);
        return;
      }

      const res = await fetch('/api/whatsapp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSaveFailure({
          message: data.error || t('saveFailed'),
          meta: data.meta ?? null,
        });
        toast.error(data.error || t('saveFailed'), { duration: 10000 });
        setSaving(false);
        return;
      }
      setSaveFailure(null);

      if (data.registered === false && data.registration_error) {
        setSaveFailure({
          message: `Saved, but Meta couldn't register the number: ${data.registration_error}`,
          meta: data.meta ?? null,
        });
        toast.error(
          t('savedButRegistrationFailed', { error: data.registration_error }),
          { duration: 12000 }
        );
      } else if (data.registration_skipped) {
        toast.success(t('savedRegistrationSkipped'), { duration: 10000 });
        setPin('');
      } else {
        toast.success(
          data.phone_info?.verified_name
            ? t('liveWithName', { name: data.phone_info.verified_name })
            : t('connectedGeneric')
        );
        setPin('');
      }

      if (accountId) await fetchConfig(accountId);
    } catch (err) {
      console.error('Save error:', err);
      toast.error(t('saveFailed'));
    } finally {
      setSaving(false);
    }
  }

  async function handleTestConnection() {
    try {
      setTesting(true);
      const res = await fetch('/api/whatsapp/config', { method: 'GET' });
      const payload = await res.json();

      if (payload.connected) {
        setConnectionStatus('connected');
        setResetReason(null);
        setStatusMessage('');
        setStatusMeta(null);
        setWabaSubscription(payload.waba_subscription ?? null);
        if (payload.phone_info) setPhoneInfo(payload.phone_info);
        toast.success(
          payload.phone_info?.verified_name
            ? t('connectedTo', { name: payload.phone_info.verified_name })
            : t('apiConnectionOk')
        );
      } else {
        setConnectionStatus('disconnected');
        setResetReason(
          payload.needs_reset
            ? 'token_corrupted'
            : payload.reason === 'meta_api_error'
              ? 'meta_api_error'
              : null
        );
        setStatusMessage(payload.message || '');
        setStatusMeta(payload.meta ?? null);
        setWabaSubscription(null);
        toast.error(payload.message || t('apiConnectionFailed'), { duration: 10000 });
      }
    } catch (err) {
      console.error('Test connection error:', err);
      setConnectionStatus('disconnected');
      toast.error(t('connectionTestFailed'));
    } finally {
      setTesting(false);
    }
  }

  async function handleVerifyRegistration() {
    setVerifyingRegistration(true);
    setRegistrationProbe(null);
    try {
      const res = await fetch('/api/whatsapp/config/verify-registration', {
        method: 'GET',
      });
      const data = (await res.json()) as RegistrationProbe;
      setRegistrationProbe(data);
      if (data.live) {
        toast.success(t('fullyWired'));
      } else {
        toast.error(t('notFullyRegistered'), { duration: 8000 });
      }
      if (accountId) await fetchConfig(accountId);
    } catch (err) {
      console.error('verify-registration failed:', err);
      toast.error(t('verifyEndpointUnreachable'));
    } finally {
      setVerifyingRegistration(false);
    }
  }

  async function handleReset() {
    if (!confirm('Are you sure you want to disconnect this WhatsApp Business Account? Your campaigns and contacts will remain safe.')) {
      return;
    }

    try {
      setResetting(true);
      const res = await fetch('/api/whatsapp/config', { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || t('resetFailed'));
        return;
      }

      toast.success('WhatsApp account disconnected.');
      setConfig(null);
      setPhoneInfo(null);
      setPhoneNumbers([]);
      setDefaultPhoneId('');
      setPhoneNumberId('');
      setWabaId('');
      setAccessToken('');
      setVerifyToken('');
      setPin('');
      setTokenEdited(false);
      setConnectionStatus('disconnected');
      setResetReason(null);
      setStatusMessage('');
      setStatusMeta(null);
      setSaveFailure(null);
      setWabaSubscription(null);
    } catch (err) {
      console.error('Reset error:', err);
      toast.error(t('resetFailed'));
    } finally {
      setResetting(false);
    }
  }

  function handleCopyWebhookUrl() {
    navigator.clipboard.writeText(webhookUrl);
    toast.success(t('webhookCopied'));
  }

  if (loading) {
    return (
      <section className="animate-in fade-in-50 duration-200">
        <SettingsPanelHead title={t('title')} description={t('description')} />
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  const showResetBanner = resetReason === 'token_corrupted';
  const isConnected = connectionStatus === 'connected' && Boolean(config);

  const formattedConnectedDate = config?.connected_at
    ? new Date(config.connected_at).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
    : null;

  const renderMetaDetails = (meta: MetaErrorMeta) => (
    <div className="mt-2 space-y-0.5 text-[11px] leading-relaxed text-muted-foreground break-all">
      <p>
        {t('metaErrorStep')}: <code>{meta.step}</code>
        {meta.code !== null && meta.code !== undefined && (
          <>
            {' · '}
            {t('metaErrorCode')}:{' '}
            <code>
              {meta.code}
              {meta.subcode !== null && meta.subcode !== undefined ? `/${meta.subcode}` : ''}
            </code>
          </>
        )}
        {meta.fbtrace_id && (
          <>
            {' · '}
            {t('metaErrorTrace')}: <code>{meta.fbtrace_id}</code>
          </>
        )}
      </p>
      {meta.message && (
        <p>
          {t('metaErrorMessage')}: {meta.message}
        </p>
      )}
      <p>{t('metaErrorDetailsHint')}</p>
    </div>
  );

  return (
    <section className="animate-in fade-in-50 duration-200 space-y-6">
      <SettingsPanelHead title={t('title')} description={t('description')} />

      {/* Connected Top Banner */}
      {isConnected && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 flex items-center gap-3">
          <span className="flex size-3 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-sm font-medium text-emerald-400">
            WhatsApp Business App - Cloud API connected using Embedded Signup{' '}
            {formattedConnectedDate ? `on ${formattedConnectedDate}` : ''}
          </p>
        </div>
      )}

      {/* Error Banners */}
      {showResetBanner && (
        <Alert className="bg-amber-950/40 border-amber-600/40">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <AlertTitle className="text-amber-200 mb-1">{t('tokenCorrupted')}</AlertTitle>
              <AlertDescription className="text-amber-100/80 text-sm">
                {statusMessage}
              </AlertDescription>
              <Button
                onClick={handleReset}
                disabled={resetting}
                size="sm"
                className="mt-3 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {resetting ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4 mr-1.5" />}
                {t('resetConfig')}
              </Button>
            </div>
          </div>
        </Alert>
      )}

      {saveFailure && (
        <Alert className="bg-red-950/30 border-red-700/50">
          <div className="flex items-start gap-3">
            <XCircle className="size-5 text-red-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <AlertTitle className="text-red-200 mb-1">{t('lastSaveFailed')}</AlertTitle>
              <AlertDescription className="text-red-100/80 text-sm">
                {saveFailure.message}
              </AlertDescription>
              {saveFailure.meta && renderMetaDetails(saveFailure.meta)}
            </div>
          </div>
        </Alert>
      )}

      {/* Main Grid: Left Column (Controls & Settings) vs Right Column (Operations & Status) */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left Column */}
        <div className="space-y-6">
          {isConnected ? (
            <>
              {/* Default Phone Number Card */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="inline-block px-2.5 py-1 text-xs font-semibold rounded bg-muted text-foreground mb-1 w-fit">
                    Default Phone Number
                  </div>
                  <CardDescription className="text-muted-foreground text-xs">
                    Select which WhatsApp Business number to use for sending messages, broadcasts, and automations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Select Default Phone Number</Label>
                    <select
                      value={defaultPhoneId}
                      onChange={(e) => setDefaultPhoneId(e.target.value)}
                      disabled={savingDefault || !canEditSettings}
                      className="w-full h-11 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      {phoneNumbers.length > 0 ? (
                        phoneNumbers.map((num) => (
                          <option key={num.phone_number_id} value={num.phone_number_id}>
                            {num.display_phone_number || num.phone_number_id}
                            {num.verified_name ? ` (${num.verified_name})` : ''}
                            {num.phone_number_id === (config?.phone_number_id || '') ? ' — [Active]' : ''}
                          </option>
                        ))
                      ) : (
                        <option value={config?.phone_number_id || ''}>
                          {phoneInfo?.display_phone_number || config?.phone_number_id || ''}
                          {phoneInfo?.verified_name ? ` (${phoneInfo.verified_name})` : ''}
                        </option>
                      )}
                    </select>
                  </div>

                  <Button
                    onClick={handleSaveDefaultPhone}
                    disabled={savingDefault || !canEditSettings}
                    className="h-10 bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 shadow-sm"
                  >
                    {savingDefault ? <Loader2 className="size-4 animate-spin mr-1.5" /> : null}
                    Save
                  </Button>
                </CardContent>
              </Card>

              {/* Action Buttons Bar */}
              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      href="/broadcasts"
                      className={buttonVariants({ variant: 'outline', size: 'sm', className: 'border-border text-foreground hover:bg-muted' })}
                    >
                      <FileText className="size-4 mr-1.5 text-muted-foreground" />
                      Manage Templates
                    </Link>
                    <Link
                      href="/contacts"
                      className={buttonVariants({ variant: 'outline', size: 'sm', className: 'border-border text-foreground hover:bg-muted' })}
                    >
                      <Users className="size-4 mr-1.5 text-muted-foreground" />
                      Manage Contacts
                    </Link>
                    <Link
                      href="/broadcasts"
                      className={buttonVariants({ size: 'sm', className: 'bg-[#1e293b] hover:bg-[#0f172a] text-white' })}
                    >
                      <Send className="size-4 mr-1.5" />
                      Create New Campaign
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleReset}
                      disabled={resetting || !canEditSettings}
                      className="bg-red-600 hover:bg-red-700 text-white ml-auto"
                    >
                      {resetting ? <Loader2 className="size-4 animate-spin mr-1.5" /> : null}
                      Disconnect Account
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Webhook & Inbound Retention */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground text-base flex items-center gap-2">
                    <Radio className="size-4 text-primary" />
                    {t('webhookTitle')}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-xs">
                    {t('webhookDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">{t('webhookUrl')}</Label>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={webhookUrl}
                        className="bg-muted border-border text-foreground font-mono text-xs"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyWebhookUrl}
                        className="shrink-0 border-border text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3 bg-card/40">
                    <div>
                      <p className="text-sm font-medium text-foreground">{t('mirrorInbound')}</p>
                      <p className="text-xs text-muted-foreground">{t('mirrorInboundDesc')}</p>
                    </div>
                    <Switch
                      checked={mirrorMedia}
                      onCheckedChange={handleToggleMirrorMedia}
                      disabled={savingMirror || !canEditSettings}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Advanced / Manual Fallback Accordion */}
              <Accordion className="w-full">
                <AccordionItem value="manual-creds" className="border-border">
                  <AccordionTrigger className="text-muted-foreground hover:text-foreground text-xs py-3">
                    Advanced Configuration &amp; Diagnostic Tools
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs">{t('phoneNumberId')}</Label>
                      <Input
                        value={phoneNumberId}
                        onChange={(e) => setPhoneNumberId(e.target.value)}
                        className="bg-muted border-border text-foreground text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs">{t('wabaId')}</Label>
                      <Input
                        value={wabaId}
                        onChange={(e) => setWabaId(e.target.value)}
                        className="bg-muted border-border text-foreground text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs">{t('accessToken')}</Label>
                      <div className="relative">
                        <Input
                          type={showToken ? 'text' : 'password'}
                          value={accessToken}
                          onChange={(e) => {
                            setAccessToken(e.target.value);
                            setTokenEdited(true);
                          }}
                          className="bg-muted border-border text-foreground text-xs pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowToken(!showToken)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showToken ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSave} disabled={saving} size="sm" className="bg-primary text-primary-foreground text-xs">
                        {saving ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : null}
                        Save API Credentials
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleTestConnection} disabled={testing} className="border-border text-xs">
                        {testing ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : <Zap className="size-3.5 mr-1.5" />}
                        Test API Connection
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleVerifyRegistration} disabled={verifyingRegistration} className="border-border text-xs">
                        {verifyingRegistration ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : <ShieldCheck className="size-3.5 mr-1.5" />}
                        Verify Registration Probe
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          ) : (
            <>
              {/* Not Connected Card */}
              <Alert className="bg-card border-border">
                <div className="flex items-center gap-2">
                  <XCircle className="size-4 text-red-500" />
                  <AlertTitle className="text-foreground font-bold mb-0">NOT CONNECTED</AlertTitle>
                </div>
                <AlertDescription className="text-muted-foreground text-xs mt-1">
                  Connect your WhatsApp Business Account using official Meta Embedded Signup to start sending and receiving messages.
                </AlertDescription>
              </Alert>

              {/* Embedded Signup Card */}
              <Card className="border-[#1877F2]/30 bg-[#1877F2]/5">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#1877F2">
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.03 4.388 11.022 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.27h3.328l-.532 3.49h-2.796v8.437C19.612 23.095 24 18.103 24 12.073z" />
                    </svg>
                    Quick Connect via Facebook
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-xs">
                    Sign in with Facebook to automatically connect your WhatsApp Business Account, Phone Number ID, and generate secure credentials.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <EmbeddedSignupButton
                    onSuccess={handleEmbeddedSignupSuccess}
                    onError={(msg) => toast.error(msg, { duration: 8000 })}
                    disabled={!canEditSettings || saving}
                  />
                  <p className="text-xs text-muted-foreground">
                    Clicking &quot;Connect with Facebook&quot; opens an official Meta popup. Select your WhatsApp Business Account and phone number to finish setup in one click.
                  </p>
                </CardContent>
              </Card>

              {/* Manual Fallback */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground text-sm">{t('apiCredentialsTitle')}</CardTitle>
                  <CardDescription className="text-muted-foreground text-xs">
                    {t('apiCredentialsDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">{t('phoneNumberId')}</Label>
                    <Input
                      placeholder={t('phoneNumberIdPlaceholder')}
                      value={phoneNumberId}
                      onChange={(e) => setPhoneNumberId(e.target.value)}
                      className="bg-muted border-border text-foreground text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">{t('wabaId')}</Label>
                    <Input
                      placeholder={t('wabaIdPlaceholder')}
                      value={wabaId}
                      onChange={(e) => setWabaId(e.target.value)}
                      className="bg-muted border-border text-foreground text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">{t('accessToken')}</Label>
                    <Input
                      type="password"
                      placeholder={t('accessTokenPlaceholder')}
                      value={accessToken}
                      onChange={(e) => {
                        setAccessToken(e.target.value);
                        setTokenEdited(true);
                      }}
                      className="bg-muted border-border text-foreground text-xs"
                    />
                  </div>

                  <Button onClick={handleSave} disabled={saving} className="w-full bg-primary text-primary-foreground text-sm">
                    {saving ? <Loader2 className="size-4 animate-spin mr-1.5" /> : null}
                    {t('saveConfig')}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Right Column: Operations & Status */}
        <div className="space-y-6">
          {isConnected ? (
            <>
              {/* Operations Card */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <div className="inline-block px-2.5 py-1 text-xs font-semibold rounded bg-muted text-foreground mb-1 w-fit">
                    Operations
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleRefreshInfo}
                    disabled={refreshingInfo}
                    className="w-full bg-[#00d2b4] hover:bg-[#00be9e] text-slate-900 font-semibold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <RefreshCw className={`size-4 ${refreshingInfo ? 'animate-spin' : ''}`} />
                    Refresh Phone Numbers &amp; Business Information
                  </Button>

                  <div className="relative">
                    <a
                      href="https://business.facebook.com/wa/manage/phone-numbers/"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full h-9 px-3 rounded-md bg-muted/80 hover:bg-muted text-foreground text-xs font-medium flex items-center justify-between transition-colors border border-border"
                    >
                      <span className="flex items-center gap-2">
                        <Link2 className="size-3.5 text-muted-foreground" />
                        Useful Meta Links (WhatsApp Manager)
                      </span>
                      <ExternalLink className="size-3.5 text-muted-foreground" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Phone Numbers Card (Reference Panel Style) */}
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <div className="inline-block px-2.5 py-1 text-xs font-semibold rounded bg-muted text-foreground mb-1 w-fit">
                    Phone Numbers
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Phone Number ID</span>
                    <span className="font-mono text-foreground font-semibold text-sm">
                      {phoneInfo?.id || config?.phone_number_id || ''}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block">Verified Name</span>
                    <span className="text-foreground font-medium">
                      {phoneInfo?.verified_name || 'Dhiraj Sharma'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block">Status</span>
                    <span className="text-emerald-400 font-bold text-sm tracking-wide">
                      CONNECTED
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block">Display Phone Number</span>
                    <span className="font-semibold text-foreground text-base">
                      {phoneInfo?.display_phone_number || config?.phone_number_id || ''}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Quality Rating</span>
                      <a
                        href="https://developers.facebook.com/docs/whatsapp/messaging-limits#quality-rating"
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                    <span className="text-emerald-400 font-medium text-xs block mt-0.5">
                      {phoneInfo?.quality_rating === 'GREEN'
                        ? 'Green - High quality'
                        : phoneInfo?.quality_rating === 'YELLOW'
                          ? 'Yellow - Medium quality'
                          : phoneInfo?.quality_rating === 'RED'
                            ? 'Red - Low quality'
                            : 'Green - High quality'}
                    </span>
                  </div>

                  {/* Green Tip Box */}
                  <div className="rounded-lg bg-emerald-600/90 text-white p-3 text-xs leading-relaxed flex items-start gap-2 shadow-sm">
                    <span className="text-sm">💡</span>
                    <span>You can manage business information from your WhatsApp Business mobile App</span>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Setup Instructions Sidebar */
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base">{t('setupInstructions')}</CardTitle>
                <CardDescription className="text-muted-foreground text-xs">
                  {t('setupInstructionsDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion className="w-full">
                  <AccordionItem value="step1" className="border-border">
                    <AccordionTrigger className="text-muted-foreground hover:text-foreground text-xs">
                      1. Connect via Facebook
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-xs leading-relaxed">
                      Click the official &quot;Connect with Facebook&quot; button to launch Meta Embedded Signup. Select your Business portfolio and phone number.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="step2" className="border-border">
                    <AccordionTrigger className="text-muted-foreground hover:text-foreground text-xs">
                      2. Automatic Authentication
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-xs leading-relaxed">
                      Adscale Zen automatically exchanges the authorization code server-side, retrieves your WhatsApp Business ID, and subscribes to webhooks.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="step3" className="border-border">
                    <AccordionTrigger className="text-muted-foreground hover:text-foreground text-xs">
                      3. Ready to Send
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-xs leading-relaxed">
                      Once connected, your display number, verified name, and quality rating will automatically appear, ready for broadcasts and inbox chat.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
