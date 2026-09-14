-- GEN-ZZ CLUB future catalog foundation.
-- This file is a reference only; it is not applied automatically.
-- RLS is enabled with no public policies so browser clients cannot read or write
-- catalog data until explicit authenticated owner policies are added.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  category text not null,
  availability boolean not null default true,
  default_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  colour text not null,
  image text,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, colour)
);

create table if not exists public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  available boolean not null default true,
  unique (product_id, size)
);

alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_sizes enable row level security;

-- Add narrowly scoped authenticated owner policies in the future dashboard phase.
-- Do not add public write policies for these tables.
