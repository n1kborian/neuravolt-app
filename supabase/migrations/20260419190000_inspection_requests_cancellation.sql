-- Terminverwaltung: Kunde kann eigene Anfragen stornieren.
-- Gebühr richtet sich nach dem Zeitabstand zum fixierten Termin.

alter table public.inspection_requests
  add column if not exists cancelled_at timestamptz,
  add column if not exists cancellation_fee_cents int;

-- Customer darf eigene Anfragen aktualisieren (z. B. Storno).
drop policy if exists "inspection_requests_own_update" on public.inspection_requests;
create policy "inspection_requests_own_update"
  on public.inspection_requests for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Wenn der Kunde eine Anfrage storniert, wird der verknüpfte Auftrag
-- automatisch mitstorniert, damit Partner ihn nicht mehr buchen können.
create or replace function public.cascade_inspection_cancel_to_order()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  if new.status = 'cancelled' and (old.status is distinct from 'cancelled') then
    update public.orders
      set status = 'cancelled',
          cancelled_at = coalesce(cancelled_at, now()),
          cancellation_reason = coalesce(cancellation_reason, 'Kunde hat Termin storniert')
      where inspection_request_id = new.id
        and status not in ('completed', 'cancelled');
  end if;
  return new;
end;
$$;

drop trigger if exists cascade_inspection_cancel on public.inspection_requests;
create trigger cascade_inspection_cancel
  after update of status on public.inspection_requests
  for each row execute function public.cascade_inspection_cancel_to_order();
