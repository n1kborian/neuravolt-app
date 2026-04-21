-- „Flexibel bis spätestens …" — harter Deadline-Wert, der optional
-- zusätzlich zum Freitext-Zeitraum gesetzt werden kann.
-- Wird beim Auto-Order als orders.desired_date übernommen.

alter table public.inspection_requests
  add column if not exists desired_deadline date;

create or replace function public.create_order_from_inspection_request()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  total_devices int;
  price_per_device int;
  travel_fee int := 4900;
  total_net int;
  profile_row record;
  user_email text;
  display_company text;
  display_contact text;
begin
  total_devices := coalesce(new.device_count_new, 0) + coalesce(new.device_count_existing, 0);
  if total_devices <= 0 then
    return new;
  end if;

  if total_devices >= 100 then
    price_per_device := 390;
  elsif total_devices >= 50 then
    price_per_device := 450;
  else
    price_per_device := 490;
  end if;
  total_net := total_devices * price_per_device + travel_fee;

  select full_name, company_name, phone
    into profile_row
    from public.profiles
    where id = new.user_id;

  select email into user_email from auth.users where id = new.user_id;

  display_company := coalesce(
    nullif(profile_row.company_name, ''),
    nullif(profile_row.full_name, ''),
    split_part(coalesce(user_email, 'Unbekannt'), '@', 1)
  );
  display_contact := coalesce(profile_row.full_name, display_company);

  insert into public.orders (
    inspection_request_id,
    customer_company,
    customer_contact,
    customer_email,
    customer_phone,
    city,
    postal_code,
    address,
    device_count,
    is_first_inspection,
    desired_date,
    desired_timeframe,
    notes,
    price_per_device_cents,
    travel_fee_cents,
    setup_fee_cents,
    total_net_cents,
    status
  ) values (
    new.id,
    display_company,
    display_contact,
    user_email,
    profile_row.phone,
    coalesce(new.address_city, 'Unbekannt'),
    new.address_postal_code,
    new.address_street,
    total_devices,
    new.is_first_inspection,
    new.desired_deadline,
    new.desired_timeframe,
    new.notes,
    price_per_device,
    travel_fee,
    0,
    total_net,
    'open'
  );

  return new;
end;
$$;
