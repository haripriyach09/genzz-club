-- GEN-ZZ CLUB Phase 2C: owner-only product management policies.
-- Run this migration in the Supabase SQL Editor after the schema foundation.
-- Before running it, set the existing owner's Auth user app_metadata to:
-- { "role": "owner" }
-- Do not use user_metadata for authorization; users can change that themselves.

-- These policies are intentionally limited to the owner claim. They do not grant
-- public or generic authenticated users catalogue write access.

drop policy if exists products_owner_access on public.products;
create policy products_owner_access
on public.products
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

drop policy if exists product_variants_owner_access on public.product_variants;
create policy product_variants_owner_access
on public.product_variants
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

drop policy if exists product_sizes_owner_access on public.product_sizes;
create policy product_sizes_owner_access
on public.product_sizes
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');
