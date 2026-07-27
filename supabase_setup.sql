-- ==========================================
-- KALDIREV SUPABASE DATABASE SETUP SCRIPT (V2 - CLEAN BOLIVIANOS)
-- Run this in your Supabase SQL Editor
-- ==========================================

-- Clean up any existing tables to avoid mismatched columns
drop table if exists public.combo_stock cascade;
drop table if exists public.branches cascade;
drop table if exists public.orders cascade;
drop table if exists public.combos cascade;
drop table if exists public.testimonials cascade;
drop table if exists public.faqs cascade;
drop table if exists public.settings cascade;
drop table if exists public.profiles cascade;

-- 1. Create Public User Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone default now(),
  full_name text,
  email text,
  avatar_url text,
  phone text,
  address text,
  city text
);

-- 2. Create Combos Table (Directly in Bolivianos)
create table public.combos (
  id serial primary key,
  created_at timestamp with time zone default now() not null,
  name text not null,
  category text not null,
  price_bs numeric not null,          -- Direct Bolivianos Price
  original_price_bs numeric not null, -- Direct Original Bolivianos Price (Strikethrough)
  includes text not null,
  bullets text[] not null,
  dosage text not null,
  package_detail text not null,
  badge text,
  tagline text,
  image_url text,
  pinned boolean default false
);

-- 2b. Create Branches Table
create table public.branches (
  id serial primary key,
  name text not null unique,
  address text,
  shipping_cost_bs numeric not null default 15
);

-- 2c. Create Combo Stock per Branch Table
create table public.combo_stock (
  combo_id integer references public.combos(id) on delete cascade,
  branch_id integer references public.branches(id) on delete cascade,
  stock integer not null default 0,
  primary key (combo_id, branch_id)
);

-- 3. Create Testimonials Table
create table public.testimonials (
  id serial primary key,
  created_at timestamp with time zone default now() not null,
  text text not null,
  author text not null,
  stars integer default 5
);

-- 4. Create FAQs Table
create table public.faqs (
  id serial primary key,
  created_at timestamp with time zone default now() not null,
  question text not null,
  answer text not null,
  display_order integer default 0
);

-- 5. Create Orders Table with logistics and payment statuses
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  customer_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  payment_method text not null,
  total_bs numeric not null,
  status text not null default 'Pendiente', -- 'Pendiente', 'Completado', 'Cancelado'
  items jsonb not null,
  user_id uuid references auth.users on delete set null,
  branch_id integer references public.branches(id) on delete set null,
  shipping_cost numeric not null default 0,
  delivery_method text default 'Local (Yango)',
  tracking_id text,
  qr_payment_status text default 'Pendiente',
  gps_coordinates text
);

-- 6. Create Settings Table
create table public.settings (
  key text primary key,
  value jsonb not null
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

alter table public.profiles enable row level security;
alter table public.combos enable row level security;
alter table public.branches enable row level security;
alter table public.combo_stock enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.orders enable row level security;
alter table public.settings enable row level security;

-- Profiles Policies
create policy "Allow public reading of profiles" on public.profiles for select using (true);
create policy "Allow users to update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Allow users to insert their own profile" on public.profiles for insert with check (auth.uid() = id);

-- Combos Policies
create policy "Allow public read access to combos" on public.combos for select using (true);
create policy "Allow admin write access to combos" on public.combos for all using (true);

-- Branches Policies
create policy "Allow public read access to branches" on public.branches for select using (true);
create policy "Allow admin write access to branches" on public.branches for all using (true);

-- Combo Stock Policies
create policy "Allow public read access to combo_stock" on public.combo_stock for select using (true);
create policy "Allow admin write access to combo_stock" on public.combo_stock for all using (true);

-- Testimonials Policies
create policy "Allow public read access to testimonials" on public.testimonials for select using (true);
create policy "Allow admin write access to testimonials" on public.testimonials for all using (true);

-- FAQs Policies
create policy "Allow public read access to faqs" on public.faqs for select using (true);
create policy "Allow admin write access to faqs" on public.faqs for all using (true);

-- Orders Policies
create policy "Allow anyone to create an order" on public.orders for insert with check (true);
create policy "Allow users to view their own orders" on public.orders for select using (auth.uid() = user_id or user_id is null);
create policy "Allow admin update access to orders" on public.orders for all using (true);

-- Settings Policies
create policy "Allow public read access to settings" on public.settings for select using (true);
create policy "Allow admin update access to settings" on public.settings for all using (true);

-- ==========================================
-- GOOGLE AUTH TRIGGER FOR PUBLIC PROFILES
-- ==========================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==========================================
-- SEED DATA (OFFICIAL KALDIBEV BOLIVIAN CATALOG)
-- ==========================================

-- Seed Settings
insert into public.settings (key, value) values
  ('exchange_rate', '6.96'::jsonb),
  ('whatsapp_number', '"59163488086"'::jsonb)
on conflict (key) do update set value = excluded.value;

-- Seed Combos (Using price_bs and original_price_bs)
insert into public.combos (id, name, category, price_bs, original_price_bs, includes, bullets, dosage, package_detail, badge, tagline, image_url, pinned) values
  (1, 'Kit Energía Diaria', 'Energía', 55, 75, '2 Cordycafe + 3 Té Tianshi', 
   array['Aumenta la vitalidad y concentración mental', 'Combate el sueño y cansancio crónico', 'Ideal para deportistas y jornadas largas de trabajo'], 
   'Disolver 1 sobre de Cordycafe en una taza de agua caliente por la mañana y tomar 1 taza de Té Tianshi a media tarde.', 
   'Empacado en bolsa doypack kraft original sellada térmicamente con sello de seguridad Kaldirev.', 
   'Más Vendido', 'Energía y enfoque natural al instante', '/products/kit_energia_diaria.jpg', true),

  (2, 'Kit Bienestar & Huesos', 'Bienestar', 85, 110, '1 Calcio Nutritivo + 2 Cordycafe', 
   array['Fortalece huesos, dientes y articulaciones', 'Aporta energía natural activa sin efectos rebote', 'Ideal para dolores musculares, de espalda y rodillas'], 
   'Disolver 1 sobre de Calcio Nutritivo en media taza de agua tibia antes de dormir. Tomar 1 sobre de Cordycafe por la mañana.', 
   'Empacado en bolsa doypack kraft original sellada térmicamente con sello de seguridad Kaldirev.', 
   'Recomendado', 'Huesos fuertes y vitalidad física diaria', '/products/kit_bienestar_huesos.jpg', true),

  (3, 'Kit Antojo Saludable', 'Saludable', 50, 65, '10 Luteínas (tipo caramelos masticables)', 
   array['Protege la salud visual del cansancio de pantallas', 'Aporta antioxidantes de origen natural', 'Forma deliciosa de nutrir la vista, ideal para niños y adultos'], 
   'Masticar de 1 a 2 tabletas de Luteína al día como un antojo dulce y saludable.', 
   'Empacado en bolsa doypack kraft original sellada térmicamente con sello de seguridad Kaldirev.', 
   'Exclusivo', 'Protección visual con delicioso sabor natural', '/products/kit_antojo_saludable.jpg', false)
on conflict (id) do update set 
  name = excluded.name,
  category = excluded.category,
  price_bs = excluded.price_bs,
  original_price_bs = excluded.original_price_bs,
  includes = excluded.includes,
  bullets = excluded.bullets,
  dosage = excluded.dosage,
  package_detail = excluded.package_detail,
  badge = excluded.badge,
  tagline = excluded.tagline,
  image_url = excluded.image_url,
  pinned = excluded.pinned;

-- Adjust sequence value for combos serial column
select setval('combos_id_seq', (select max(id) from combos));

-- Seed Branches
insert into public.branches (id, name, address, shipping_cost_bs) values
  (1, 'Santa Cruz', 'Av. San Martín, Equipetrol, Santa Cruz', 12),
  (2, 'La Paz', 'Av. 16 de Julio, El Prado, La Paz', 15),
  (3, 'Cochabamba', 'Calle España, Zona Central, Cochabamba', 15)
on conflict (id) do update set
  name = excluded.name,
  address = excluded.address,
  shipping_cost_bs = excluded.shipping_cost_bs;

select setval('branches_id_seq', (select max(id) from branches));

-- Seed Combo Stock
insert into public.combo_stock (combo_id, branch_id, stock) values
  -- Kit Energía Diaria (Combo 1)
  (1, 1, 35), -- Santa Cruz
  (1, 2, 18), -- La Paz
  (1, 3, 10), -- Cochabamba
  -- Kit Bienestar & Huesos (Combo 2)
  (2, 1, 20), -- Santa Cruz
  (2, 2, 8),  -- La Paz
  (2, 3, 5),  -- Cochabamba
  -- Kit Antojo Saludable (Combo 3)
  (3, 1, 15), -- Santa Cruz
  (3, 2, 12), -- La Paz
  (3, 3, 12)  -- Cochabamba
on conflict (combo_id, branch_id) do update set
  stock = excluded.stock;

-- Seed Testimonials
insert into public.testimonials (id, text, author, stars) values
  (1, 'El Kit Energía Diaria me mantiene despierta todo el día en el trabajo en Santa Cruz. La presentación en la bolsa Doypack sellada es súper fina y da mucha seguridad.', 'María René S. (Santa Cruz)', 5),
  (2, 'Pedí el Kit Bienestar & Huesos para mi mamá. Le llegó a su casa por delivery y pagamos con QR en el momento. Muy buena atención por WhatsApp.', 'Carlos Mendoza (Equipetrol)', 5),
  (3, 'Los caramelos de Luteína son riquísimos. Mis hijos paran en la tablet todo el día y esto les protege los ojitos. Recomendado Kaldirev.', 'Ana Lucía V. (Cochabamba)', 5)
on conflict (id) do update set 
  text = excluded.text,
  author = excluded.author,
  stars = excluded.stars;

select setval('testimonials_id_seq', (select max(id) from testimonials));

-- Seed FAQs
insert into public.faqs (id, question, answer, display_order) values
  (1, '¿Cómo realizan las entregas en Santa Cruz?', 'Realizamos envíos en Santa Cruz de la Sierra mediante motorizados de confianza. El costo de delivery es de 10 a 15 Bs según tu zona y coordinamos el despacho por WhatsApp.', 0),
  (2, '¿Cuáles son los métodos de pago aceptados?', 'Aceptamos Pago por QR simple (puedes transferir desde cualquier banco antes del despacho o al recibir el paquete). También aceptamos efectivo en contraentrega.', 1),
  (3, '¿Por qué las bolsas vienen termoselladas?', 'Para tu total tranquilidad, empacamos todos los combos en bolsas doypack kraft de grado alimenticio y las termosellamos con máquina manual de calor. Esto garantiza que tus productos están 100% cerrados de fábrica, originales y sin ninguna alteración.', 2)
on conflict (id) do update set 
  question = excluded.question,
  answer = excluded.answer,
  display_order = excluded.display_order;

select setval('faqs_id_seq', (select max(id) from faqs));
