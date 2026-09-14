-- GEN-ZZ CLUB Phase 2F-A: product image storage.
-- Run this once in the Supabase SQL Editor.
-- The bucket is publicly readable, but only authenticated owners can write.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists product_images_public_read on storage.objects;
create policy product_images_public_read
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists product_images_owner_insert on storage.objects;
create policy product_images_owner_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
);

drop policy if exists product_images_owner_update on storage.objects;
create policy product_images_owner_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
)
with check (
  bucket_id = 'product-images'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
);

drop policy if exists product_images_owner_delete on storage.objects;
create policy product_images_owner_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
);
