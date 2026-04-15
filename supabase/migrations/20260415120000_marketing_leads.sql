-- Marketing lead-capture tables: quote requests, Fristencheck signups, newsletter signups.
-- All writes happen via the service role from marketing API routes. RLS denies all public access.

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Wizard inputs
  branche text,
  device_count int not null check (device_count >= 0),
  is_first_inspection boolean not null,
  desired_timeframe text,
  postal_code text,
  city text,

  -- Contact
  company text,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  notes text,

  -- Calculated quote snapshot (cents to avoid float drift)
  price_per_device_cents int not null,
  devices_subtotal_cents int not null,
  travel_fee_cents int not null,
  setup_fee_cents int not null,
  minimum_adjustment_cents int not null,
  net_total_cents int not null,
  vat_cents int not null,
  gross_total_cents int not null,

  -- Consent
  consent_privacy boolean not null,
  consent_given_at timestamptz not null default now(),

  -- Internal status
  status text not null default 'new',
  user_agent text,
  ip_hash text
);

create index if not exists quote_requests_created_at_idx on public.quote_requests (created_at desc);
create index if not exists quote_requests_email_idx on public.quote_requests (email);

alter table public.quote_requests enable row level security;
drop policy if exists "quote_requests_no_public_access" on public.quote_requests;
create policy "quote_requests_no_public_access" on public.quote_requests for all using (false);

-- Fristencheck freebie signups (simple email + optional branche)
create table if not exists public.fristencheck_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  company text,
  branche text,
  consent_privacy boolean not null,
  user_agent text,
  ip_hash text,
  unique (email)
);

create index if not exists fristencheck_signups_created_at_idx on public.fristencheck_signups (created_at desc);

alter table public.fristencheck_signups enable row level security;
drop policy if exists "fristencheck_signups_no_public_access" on public.fristencheck_signups;
create policy "fristencheck_signups_no_public_access" on public.fristencheck_signups for all using (false);

-- Newsletter signups with double opt-in.
-- pending: token issued, confirmation email sent
-- confirmed: user clicked confirmation link
-- unsubscribed: user later unsubscribed (future-proof)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'newsletter_status' and typnamespace = 'public'::regnamespace) then
    create type public.newsletter_status as enum ('pending', 'confirmed', 'unsubscribed');
  end if;
end$$;

create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  status public.newsletter_status not null default 'pending',
  confirm_token text not null,
  confirm_token_expires_at timestamptz not null,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  consent_privacy boolean not null,
  source text,
  user_agent text,
  ip_hash text,
  unique (email)
);

create index if not exists newsletter_signups_token_idx on public.newsletter_signups (confirm_token);
create index if not exists newsletter_signups_status_idx on public.newsletter_signups (status);

alter table public.newsletter_signups enable row level security;
drop policy if exists "newsletter_signups_no_public_access" on public.newsletter_signups;
create policy "newsletter_signups_no_public_access" on public.newsletter_signups for all using (false);

-- Contact form submissions (wired from /contact page)
create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  company text,
  branche text,
  device_count_range text,
  message text,
  consent_privacy boolean not null,
  status text not null default 'new',
  user_agent text,
  ip_hash text
);

create index if not exists contact_requests_created_at_idx on public.contact_requests (created_at desc);

alter table public.contact_requests enable row level security;
drop policy if exists "contact_requests_no_public_access" on public.contact_requests;
create policy "contact_requests_no_public_access" on public.contact_requests for all using (false);
