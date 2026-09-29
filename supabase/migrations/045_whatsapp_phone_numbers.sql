-- ============================================================
-- 045_whatsapp_phone_numbers.sql
-- Support for professional WhatsApp Cloud API management:
-- - Multi-phone number storage per WABA / workspace
-- - Display phone numbers, verified names, and quality ratings
-- ============================================================

-- ── Enhance whatsapp_config table ────────────────────────────
ALTER TABLE whatsapp_config
  ADD COLUMN IF NOT EXISTS display_phone_number TEXT,
  ADD COLUMN IF NOT EXISTS verified_name TEXT,
  ADD COLUMN IF NOT EXISTS quality_rating TEXT,
  ADD COLUMN IF NOT EXISTS code_verification_status TEXT,
  ADD COLUMN IF NOT EXISTS name_status TEXT,
  ADD COLUMN IF NOT EXISTS phone_numbers JSONB DEFAULT '[]'::jsonb;

-- ── Create whatsapp_phone_numbers table ───────────────────────
CREATE TABLE IF NOT EXISTS whatsapp_phone_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  waba_id TEXT,
  phone_number_id TEXT NOT NULL,
  display_phone_number TEXT,
  verified_name TEXT,
  quality_rating TEXT,
  code_verification_status TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, phone_number_id)
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_phone_numbers_account ON whatsapp_phone_numbers(account_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_phone_numbers_phone_id ON whatsapp_phone_numbers(phone_number_id);

ALTER TABLE whatsapp_phone_numbers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "whatsapp_phone_numbers_select" ON whatsapp_phone_numbers;
CREATE POLICY "whatsapp_phone_numbers_select" ON whatsapp_phone_numbers FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS "whatsapp_phone_numbers_admin" ON whatsapp_phone_numbers;
CREATE POLICY "whatsapp_phone_numbers_admin" ON whatsapp_phone_numbers FOR ALL USING (is_account_member(account_id, 'admin'));
