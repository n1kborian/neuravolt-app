-- Pro Kategorie-Box speichert der Kunde "davon bereits durch uns geprüft".
-- Die Top-Level device_count_new/existing werden daraus abgeleitet.

alter table public.inspection_requests
  add column if not exists device_category_counts_previous jsonb not null default '{}'::jsonb;
