-- Volt & Victor — sale/offer tags, homepage banner, festival theme and
-- social links.
-- Safe to run any number of times, and safe to run on top of any earlier
-- version of this file or of schema.sql: it only adds what is missing and
-- never deletes your shop items.
-- Paste this whole file into Supabase: SQL Editor > New query > Run.

-- Helper that stamps updated_at on every edit (also created by schema.sql).
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- A short tag on a product card, e.g. "Sale", "Offer", "-20%".
alter table public.products
  add column if not exists sale_tag text;

-- The original price, shown struck through next to the current price.
alter table public.products
  add column if not exists original_price numeric
  check (original_price is null or original_price >= 0);

-- Site-wide settings, one row only: the banner strip, the festival theme
-- and the social links. Starts off, so nothing shows until you turn it on.
create table if not exists public.site_banner (
  id smallint primary key default 1 check (id = 1),
  message text not null default '',
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.site_banner
  add column if not exists festival text not null default 'none'
  check (festival in (
    'none', 'durga_puja', 'kali_puja', 'saraswati_puja', 'poila_boishakh',
    'diwali', 'holi', 'eid', 'christmas', 'new_year',
    'independence_day', 'republic_day'
  ));

alter table public.site_banner
  add column if not exists instagram_url text
  check (instagram_url is null or instagram_url = '' or instagram_url like 'https://%');

alter table public.site_banner
  add column if not exists facebook_url text
  check (facebook_url is null or facebook_url = '' or facebook_url like 'https://%');

-- The one settings row the admin page edits.
insert into public.site_banner (id, message, enabled)
  values (1, '', false)
  on conflict (id) do nothing;

alter table public.site_banner enable row level security;

-- Everyone can read the settings (the website needs them).
drop policy if exists "Banner is publicly readable" on public.site_banner;
create policy "Banner is publicly readable"
  on public.site_banner for select
  using (true);

-- Only a signed-in admin can change them. The insert policy matters even
-- though the row already exists: saving from the admin page can attempt an
-- insert first, and without this policy that save is refused.
drop policy if exists "Signed-in users can insert the banner" on public.site_banner;
create policy "Signed-in users can insert the banner"
  on public.site_banner for insert
  to authenticated
  with check (true);

drop policy if exists "Signed-in users can update the banner" on public.site_banner;
create policy "Signed-in users can update the banner"
  on public.site_banner for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Signed-in users can delete the banner" on public.site_banner;
create policy "Signed-in users can delete the banner"
  on public.site_banner for delete
  to authenticated
  using (true);

drop trigger if exists site_banner_touch_updated_at on public.site_banner;
create trigger site_banner_touch_updated_at
  before update on public.site_banner
  for each row execute function public.touch_updated_at();

-- Make sure the roles are allowed to touch the table at all.
grant select on public.site_banner to anon, authenticated;
grant insert, update, delete on public.site_banner to authenticated;

-- Check: this should list 4 policies and one row with id 1.
select policyname, cmd, roles from pg_policies where tablename = 'site_banner' order by cmd;
select id, enabled, festival from public.site_banner;
