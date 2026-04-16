-- Add protocol upload columns to orders
alter table public.orders
  add column if not exists protocol_path text,
  add column if not exists protocol_uploaded_at timestamptz;

-- Storage bucket for inspection protocols (PDF, JPG, PNG, max 10MB)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('protocols', 'protocols', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

-- Company/partner/admin can upload
create policy "protocols_company_upload" on storage.objects
  for insert
  with check (
    bucket_id = 'protocols'
    and auth.uid() is not null
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('company', 'admin', 'partner')
    )
  );

-- Company/partner/admin can read
create policy "protocols_read" on storage.objects
  for select
  using (
    bucket_id = 'protocols'
    and auth.uid() is not null
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('company', 'admin', 'partner')
    )
  );
