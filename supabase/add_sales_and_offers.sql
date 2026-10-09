-- Volt & Victor — adds sales/offer tags and the homepage banner.
-- Safe to run after schema.sql: it only adds columns and a new table, and
-- does not touch your existing products.
-- Paste this whole file into Supabase: SQL Editor > New query > Run.

-- A short tag on a product card, e.g. "Sale", "Offer", "-20%". Leave blank
-- for a normal item.
alter table public.products
  add column if not exists sale_tag text;

-- The original price, shown struck through next to the current price.
-- Leave blank unless you're discounting the item.
alter table public.products
  add column if not exists original_price numeric check (original_price is null or original_price >= 0);

-- The strip at the very top of the homepage, for a site-wide sale or
-- announcement. One row only. Starts off (enabled = false), so nothing
-- shows until you turn it on from the admin page.
create table if not exists public.site_banner (
  id smallint primary key default 1 check (id = 1),
  message text not null default '',
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.site_banner (id, message, enabled)
  values (1, '', false)
  on conflict (id) do nothing;

alter table public.site_banner enable row level security;

drop policy if exists "Banner is publicly readable" on public.site_banner;
create policy "Banner is publicly readable"
  on public.site_banner for select
  using (true);

drop policy if exists "Signed-in users can update the banner" on public.site_banner;
create policy "Signed-in users can update the banner"
  on public.site_banner for update
  to authenticated
  using (true)
  with check (true);

drop trigger if exists site_banner_touch_updated_at on public.site_banner;
create trigger site_banner_touch_updated_at
  before update on public.site_banner
  for each row execute function public.touch_updated_at();
