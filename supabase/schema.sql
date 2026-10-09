-- Volt & Victor — Supabase setup for the shop admin
-- Paste this whole file into Supabase: SQL Editor > New query > Run.
-- Safe to re-run: it drops and recreates the table and its policies.

drop table if exists public.products;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('tools','boards','sensors','motors','audio','kits','power','parts')),
  icon text not null,
  price numeric not null check (price >= 0),
  unit text not null default '',
  in_stock boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Anyone (including signed-out visitors) can read the shop.
create policy "Products are publicly readable"
  on public.products for select
  using (true);

-- Only a signed-in admin can add, change or remove items.
create policy "Signed-in users can insert products"
  on public.products for insert
  to authenticated
  with check (true);

create policy "Signed-in users can update products"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

create policy "Signed-in users can delete products"
  on public.products for delete
  to authenticated
  using (true);

-- Keep updated_at current on every edit.
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- Seed the table with the 28 items already on the site.
insert into public.products (name, category, icon, price, unit, in_stock, sort_order) values
  ('Multimeter', 'tools', 'c-multimeter', 235, 'digital, DT830D', true, 0),
  ('Soldering iron', 'tools', 'c-solder', 329, '25 W', true, 1),
  ('Arduino Uno', 'boards', 'c-uno', 600, 'compatible board', true, 2),
  ('ESP32', 'boards', 'c-esp32', 385, 'DevKit V1', true, 3),
  ('Raspberry Pi', 'boards', 'c-pi', 4500, 'Pi 4 Model B, from', true, 4),
  ('Relay module', 'boards', 'c-relay', 82, '1 channel, 5 V', true, 5),
  ('LCD display', 'boards', 'c-lcd', 159, '16x2, blue', true, 6),
  ('Ultrasonic sensor', 'sensors', 'c-ultrasonic', 99, 'HC-SR04', true, 7),
  ('PIR motion sensor', 'sensors', 'c-pir', 54, 'HC-SR501', true, 8),
  ('Temperature & humidity sensor', 'sensors', 'c-dht', 49, 'DHT11 module', true, 9),
  ('Light sensor (LDR)', 'sensors', 'c-ldr', 12, '5 mm', true, 10),
  ('Servo motor', 'motors', 'c-servo', 119, 'SG90', true, 11),
  ('DC motor', 'motors', 'c-dcmotor', 169, '100 RPM, geared', true, 12),
  ('Drone motor', 'motors', 'c-dronemotor', 1540, '2212, 920 KV', true, 13),
  ('Speakers', 'audio', 'c-speaker', 449, '3 inch', true, 14),
  ('Buzzers', 'audio', 'c-buzzer', 59, 'active module', true, 15),
  ('Electronic kits', 'kits', 'c-kit', 999, 'Arduino Uno starter kit', true, 16),
  ('9V batteries', 'power', 'c-battery', 25, 'each', true, 17),
  ('Solar panel', 'power', 'c-solar', 199, '6 V, 1 W', true, 18),
  ('Breadboard', 'parts', 'c-breadboard', 100, '830 points', true, 19),
  ('Jumper wires', 'parts', 'c-wire', 69, '40 pcs, 20 cm', true, 20),
  ('LEDs', 'parts', 'c-led', 7, 'each, 5 mm', true, 21),
  ('Resistors', 'parts', 'c-resistor', 3, 'each, 1/4 W', true, 22),
  ('Capacitors', 'parts', 'c-capacitor', 6, 'each, 100 µF 25 V', true, 23),
  ('Transistors', 'parts', 'c-transistor', 4, 'each, BC548', true, 24),
  ('Potentiometer', 'parts', 'c-pot', 25, '10 kΩ preset', true, 25),
  ('Push buttons', 'parts', 'c-button', 10, 'each, tactile', true, 26),
  ('Copper wire', 'parts', 'c-copper', 900, 'per kg, enamelled', true, 27);
