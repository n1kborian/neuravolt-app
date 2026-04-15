-- Bootstrap: profiles + RLS + Auto-Profil bei User-Anlage.
-- Schema spiegelt packages/database/src/types/database.types.ts.

create type if not exists public.user_role as enum ('company', 'customer', 'admin', 'partner');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'customer',
  full_name text,
  company_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update"
  on public.profiles for update
  using (auth.uid() = id);

-- Seed: Admin-Accounts (IDs stammen aus auth.users, via Admin-API angelegt).
insert into public.profiles (id, role, full_name)
values
  ('57e766cb-1627-410a-9817-3b365536fafb', 'company',  'Admin Company'),
  ('305742f9-c7c8-48ba-b703-557ed5bfb455', 'customer', 'Admin Customer')
on conflict (id) do update
  set role = excluded.role,
      full_name = excluded.full_name,
      updated_at = now();
