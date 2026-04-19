-- Orders table: inspection jobs that partner companies can browse and book.
-- Created manually by admins or converted from quote_requests.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status' and typnamespace = 'public'::regnamespace) then
    create type public.order_status as enum ('open', 'booked', 'in_progress', 'completed', 'cancelled');
  end if;
end$$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Source (optional link back to the original quote request)
  quote_request_id uuid references public.quote_requests(id) on delete set null,

  -- Customer info
  customer_company text not null,
  customer_contact text,
  customer_email text,
  customer_phone text,

  -- Location
  city text not null,
  postal_code text,
  address text,

  -- Job details
  branche text,
  device_count int not null check (device_count > 0),
  is_first_inspection boolean not null default true,
  desired_date date,
  desired_timeframe text,
  notes text,

  -- Pricing (cents to avoid float drift)
  price_per_device_cents int not null,
  travel_fee_cents int not null default 4900,
  setup_fee_cents int not null default 0,
  total_net_cents int not null,

  -- Status & booking
  status public.order_status not null default 'open',
  booked_by uuid references public.profiles(id) on delete set null,
  booked_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_city_idx on public.orders (city);
create index if not exists orders_booked_by_idx on public.orders (booked_by);
create index if not exists orders_desired_date_idx on public.orders (desired_date);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

-- Open orders are visible to all authenticated company/admin/partner users.
drop policy if exists "orders_company_read" on public.orders;
create policy "orders_company_read"
  on public.orders for select
  using (
    auth.uid() is not null
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('company', 'admin', 'partner')
    )
  );

-- Only admins can insert/update/delete orders.
drop policy if exists "orders_admin_insert" on public.orders;
create policy "orders_admin_insert"
  on public.orders for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Companies can update orders they've booked (limited: only status transitions).
-- For now we handle booking via service role in server actions, so this policy
-- is a future-proofing measure.
drop policy if exists "orders_company_book" on public.orders;
create policy "orders_company_book"
  on public.orders for update
  using (
    status = 'open'
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('company', 'partner')
    )
  )
  with check (
    status = 'booked'
    and booked_by = auth.uid()
  );

-- Seed: a few test orders for development
insert into public.orders (customer_company, customer_contact, customer_email, city, postal_code, branche, device_count, is_first_inspection, desired_date, desired_timeframe, price_per_device_cents, total_net_cents, status)
values
  ('Müller & Söhne GmbH',  'Thomas Müller',    'mueller@example.com',  'Stuttgart',           '70173', 'Büro & Verwaltung', 45,  true,  '2026-05-15', 'Innerhalb des nächsten Monats',    490, 31450, 'open'),
  ('Gasthaus Lamm',         'Maria Bauer',      'bauer@example.com',    'Ludwigsburg',         '71634', 'Gastronomie',       28,  true,  '2026-05-22', 'Innerhalb der nächsten 3 Monate',  490, 22620, 'open'),
  ('Praxis Dr. Weber',      'Dr. Lisa Weber',   'weber@example.com',    'Esslingen',           '73728', 'Arztpraxis',        15,  false, '2026-06-01', 'Innerhalb der nächsten 3 Monate',  490, 12250, 'open'),
  ('Hotel Krone',            'Stefan Krone',     'krone@example.com',    'Stuttgart',           '70178', 'Hotel',            120,  true,  '2026-06-10', 'Innerhalb der nächsten 6 Monate',  390, 55700, 'open'),
  ('AutoFix Werkstatt',      'Klaus Fischer',   'fischer@example.com',  'Korntal-Münchingen',  '70825', 'Werkstatt',         62,  true,  '2026-05-20', 'Innerhalb des nächsten Monats',    450, 36800, 'open'),
  ('Mode Boutique Anna',     'Anna Schwarz',    'schwarz@example.com',  'Böblingen',           '71032', 'Einzelhandel',      33,  false, '2026-07-01', 'Flexibel',         490, 21070, 'open')
on conflict do nothing;
