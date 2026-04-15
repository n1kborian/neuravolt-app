-- Add desired_timeframe column to contact_requests so the contact form can
-- pass the same information as the quote wizard.

alter table public.contact_requests
  add column if not exists desired_timeframe text;
