-- rescue_leads: one row per completed assessment + lead capture.
-- Run in the Supabase SQL editor (or supabase db push) before pointing
-- SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY at the project.

create table if not exists public.rescue_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text not null,
  business text,
  answers jsonb not null,          -- [{topic, answer}] human-readable
  raw_answers jsonb not null,      -- [optionIndex x6] for re-scoring later
  score integer not null,
  outcome text not null check (outcome in ('green', 'amber', 'red', 'dpn-urgent')),
  priority text not null check (priority in ('standard', 'high', 'urgent')),
  flags jsonb not null default '[]'::jsonb,
  utm jsonb not null default '{}'::jsonb,
  referrer text,
  landing_path text
);

create index if not exists rescue_leads_created_at_idx on public.rescue_leads (created_at desc);
create index if not exists rescue_leads_outcome_idx on public.rescue_leads (outcome);

-- Service-role key bypasses RLS; enabling RLS with no policies keeps the
-- table closed to anon/authenticated clients.
alter table public.rescue_leads enable row level security;
