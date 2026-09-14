-- GEN-ZZ CLUB Phase 2E: preserve existing public product IDs and featured state.
-- Run this once in the Supabase SQL Editor before using the admin seed action.

alter table public.products
  add column if not exists slug text;

alter table public.products
  add column if not exists featured boolean not null default false;

create unique index if not exists products_slug_key
  on public.products (slug)
  where slug is not null;

-- Existing UUID ids remain unchanged. The slug stores the static catalogue id
-- used by the existing /shop/:productId URLs.