-- Inspection requests submitted by authenticated customers from the customer portal.
-- Separate from marketing `quote_requests` (those are anonymous leads).

create table if not exists public.inspection_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- Inspection type
  is_first_inspection boolean not null,

  -- Device breakdown
  -- For first inspection: device_count_new = total, device_count_existing is null.
  -- For re-inspection: device_count_existing = already known, device_count_new = added since.
  device_count_new int not null check (device_count_new >= 0),
  device_count_existing int check (device_count_existing is null or device_count_existing >= 0),
  last_inspection_date date,

  -- Device type categories (some have shorter intervals)
  device_types text[] not null default '{}',

  -- Scheduling
  desired_timeframe text,
  notes text,

  -- Internal
  status text not null default 'new',

  -- A follow-up inspection must know the existing count and the last date
  constraint inspection_requests_followup_complete
    check (
      is_first_inspection
      or (device_count_existing is not null and last_inspection_date is not null)
    ),
  -- First inspection must have no existing count / date
  constraint inspection_requests_firstcheck_empty
    check (
      not is_first_inspection
      or (device_count_existing is null and last_inspection_date is null)
    ),
  -- At least one device in total
  constraint inspection_requests_has_devices
    check (
      coalesce(device_count_new, 0) + coalesce(device_count_existing, 0) > 0
    )
);

create index if not exists inspection_requests_user_idx
  on public.inspection_requests (user_id, created_at desc);
create index if not exists inspection_requests_status_idx
  on public.inspection_requests (status);

alter table public.inspection_requests enable row level security;

-- Customers see only their own requests
drop policy if exists "inspection_requests_own_read" on public.inspection_requests;
create policy "inspection_requests_own_read"
  on public.inspection_requests for select
  using (auth.uid() = user_id);

-- Customers can insert their own requests
drop policy if exists "inspection_requests_own_insert" on public.inspection_requests;
create policy "inspection_requests_own_insert"
  on public.inspection_requests for insert
  with check (auth.uid() = user_id);

-- Admins can do everything
drop policy if exists "inspection_requests_admin_all" on public.inspection_requests;
create policy "inspection_requests_admin_all"
  on public.inspection_requests for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- updated_at auto-touch
create or replace function public.inspection_requests_touch_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_catalog
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists inspection_requests_updated_at on public.inspection_requests;
create trigger inspection_requests_updated_at
  before update on public.inspection_requests
  for each row execute function public.inspection_requests_touch_updated_at();
