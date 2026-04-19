-- Verknüpfung zwischen inspection_requests (Kundenanfragen aus dem Portal)
-- und orders (Aufträge im Partnernetzwerk).
-- Trigger propagiert orders.status → inspection_requests.status, sodass
-- die Kunde-seitige Statusanzeige automatisch aktualisiert wird, ohne
-- dass ein Admin den inspection_request-Status manuell pflegen muss.

alter table public.orders
  add column if not exists inspection_request_id uuid
    references public.inspection_requests(id) on delete set null;

create index if not exists orders_inspection_request_idx
  on public.orders (inspection_request_id);

-- Propagation-Funktion
create or replace function public.propagate_order_status_to_inspection_request()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  if new.inspection_request_id is null then
    return new;
  end if;

  -- Partner hat den Auftrag gebucht → Anfrage ist "beauftragt" (status=scheduled)
  if new.status = 'booked' and (old.status is distinct from 'booked') then
    update public.inspection_requests
      set status = 'scheduled'
      where id = new.inspection_request_id
        and status not in ('completed', 'cancelled');

  -- Auftrag abgeschlossen → Anfrage ebenfalls abschließen
  elsif new.status = 'completed' and (old.status is distinct from 'completed') then
    update public.inspection_requests
      set status = 'completed'
      where id = new.inspection_request_id;

  -- Auftrag storniert → Anfrage zurück auf "neu", damit Admin sie neu ausschreiben kann
  elsif new.status = 'cancelled' and (old.status is distinct from 'cancelled') then
    update public.inspection_requests
      set status = 'new'
      where id = new.inspection_request_id
        and status = 'scheduled';
  end if;

  return new;
end;
$$;

drop trigger if exists propagate_order_status on public.orders;
create trigger propagate_order_status
  after update of status on public.orders
  for each row execute function public.propagate_order_status_to_inspection_request();
