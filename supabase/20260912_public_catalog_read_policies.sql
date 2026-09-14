-- GEN-ZZ CLUB Phase 2D: allow customers to read the catalogue only.
-- Run this migration in Supabase after the owner policies.
-- No INSERT, UPDATE, or DELETE policy is added for anonymous users.

drop policy if exists products_public_read on public.products;
create policy products_public_read
on public.products
for select
to anon, authenticated
using (true);

drop policy if exists product_variants_public_read on public.product_variants;
create policy product_variants_public_read
on public.product_variants
for select
to anon, authenticated
using (true);

drop policy if exists product_sizes_public_read on public.product_sizes;
create policy product_sizes_public_read
on public.product_sizes
for select
to anon, authenticated
using (true);