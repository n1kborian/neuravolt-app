-- Automatically create a public.profiles row when a new auth user is created.
-- Reads role, full_name, and company_name from the user's raw_user_meta_data
-- (passed via signUp options.data in the client).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  user_role public.user_role;
begin
  -- Map the role string from metadata to the enum, defaulting to 'customer'.
  begin
    user_role := (meta ->> 'role')::public.user_role;
  exception when others then
    user_role := 'customer';
  end;

  insert into public.profiles (id, role, full_name, company_name)
  values (
    new.id,
    user_role,
    meta ->> 'full_name',
    meta ->> 'company_name'
  )
  on conflict (id) do update
    set role         = excluded.role,
        full_name    = coalesce(excluded.full_name, public.profiles.full_name),
        company_name = coalesce(excluded.company_name, public.profiles.company_name),
        updated_at   = now();

  return new;
end;
$$;

-- Wire the trigger (drop first to be idempotent).
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
