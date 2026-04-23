-- Fristencheck: Rechner-Details speichern, wenn Kunde Erinnerung aktiviert.
alter table public.fristencheck_signups
  add column if not exists device_types text[] not null default '{}'::text[],
  add column if not exists environment text,
  add column if not exists last_inspection_date date,
  add column if not exists next_due_date date,
  add column if not exists reminder_before_days int not null default 42,
  add column if not exists reminder_active boolean not null default false,
  add column if not exists reminder_sent_at timestamptz;
