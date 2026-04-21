-- Profil-Erweiterung um Rechnungsanschrift + Anfrage-Erweiterung
-- um Anzahl pro Gerätekategorie.

alter table public.profiles
  add column if not exists billing_company text,
  add column if not exists billing_street text,
  add column if not exists billing_postal_code text,
  add column if not exists billing_city text;

-- device_category_counts: { "ortsveraenderlich": 120, "ortsfeste_anlagen": 15, ... }
alter table public.inspection_requests
  add column if not exists device_category_counts jsonb not null default '{}'::jsonb;
