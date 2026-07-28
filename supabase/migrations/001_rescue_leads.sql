-- rescue_leads: cart-style capture (gstregister funnel pattern).
-- One row per assessment cart: created at business + email, updated on every
-- answered question, finalised on completion. Abandoned carts keep their
-- progress and stay queryable for follow-up.
--
-- Run in the Supabase SQL editor (or supabase db push) before pointing
-- SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY at the project.

create table if not exists public.rescue_leads (
  id uuid primary key,                    -- client cart id (crypto.randomUUID)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  stage text not null default 'started' check (stage in ('started', 'progress', 'completed')),
  email text,
  business text,
  abn text,
  entity_type text,
  entity_location text,
  name text,
  phone text,
  answers jsonb,                          -- [{topic, answer}] human-readable
  raw_answers jsonb,                      -- [optionIndex...] partial while in progress
  score integer,
  outcome text check (outcome in ('green', 'amber', 'red', 'dpn-urgent')),
  priority text check (priority in ('standard', 'high', 'urgent')),
  flags jsonb default '[]'::jsonb,
  utm jsonb default '{}'::jsonb,
  referrer text,
  landing_path text
);

create index if not exists rescue_leads_created_at_idx on public.rescue_leads (created_at desc);
create index if not exists rescue_leads_stage_idx on public.rescue_leads (stage);
create index if not exists rescue_leads_outcome_idx on public.rescue_leads (outcome);

-- Abandoned-cart follow-up view: started or mid-assessment, untouched for an hour.
create or replace view public.rescue_abandoned_carts as
  select id, created_at, updated_at, email, business, abn, raw_answers, utm, referrer
  from public.rescue_leads
  where stage in ('started', 'progress')
    and updated_at < now() - interval '1 hour';

-- Service-role key bypasses RLS; enabling RLS with no policies keeps the
-- table closed to anon/authenticated clients.
alter table public.rescue_leads enable row level security;
