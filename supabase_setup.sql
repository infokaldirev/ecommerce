-- =========================================================================
-- KALDIREV SUPABASE DATABASE SETUP SCRIPT (V4 - PROFESSIONAL RETAIL SCHEMA)
-- Run this in your Supabase SQL Editor
-- =========================================================================

-- Clean up any existing tables to avoid conflicts
drop table if exists public.combo_products cascade;
drop table if exists public.product_stock cascade;
drop table if exists public.product_images cascade;
drop table if exists public.combo_stock cascade;
drop table if exists public.branches cascade;
drop table if exists public.orders cascade;
drop table if exists public.combos cascade;
drop table if exists public.products cascade;
drop table if exists public.categories cascade;
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

-- 2. Create Categories Table
create table public.categories (
  id serial primary key,
  name text not null unique,
  slug text not null unique,
  description text
);

-- 3. Create Products Table (Individual Items)
create table public.products (
  id serial primary key,
  created_at timestamp with time zone default now() not null,
  name text not null,
  sku text unique,
  slug text unique,
  price_bs numeric not null,
  original_price_bs numeric not null,
  category_id integer references public.categories(id) on delete set null,
  description text not null,
  bullets text[] not null,
  dosage text,
  package_detail text,
  badge text,
  tagline text,
  pinned boolean default false
);

-- 4. Create Product Images Table (Gallery Carousel supporting WebP & Videos)
create table public.product_images (
  id serial primary key,
  product_id integer references public.products(id) on delete cascade,
  url text not null,
  position integer default 0,
  is_video boolean default false
);

-- 5. Create Combos / Bundles Table
create table if not exists public.combos (
  id serial primary key,
  created_at timestamp with time zone default now() not null,
  name text not null,
  slug text unique,
  price_bs numeric not null,
  original_price_bs numeric not null,
  cost_price_bs numeric default 0,
  description text not null,
  badge text,
  tagline text,
  pinned boolean default false,
  image_url text,
  category text,
  includes text,
  bullets text[],
  dosage text,
  package_detail text,
  is_active boolean default true
);

-- 6. Create Combo Products Table (Many-to-Many Join Table)
create table public.combo_products (
  combo_id integer references public.combos(id) on delete cascade,
  product_id integer references public.products(id) on delete cascade,
  quantity integer not null default 1,
  primary key (combo_id, product_id)
);

-- 7. Create Branches Table
create table public.branches (
  id serial primary key,
  name text not null unique,
  address text,
  shipping_cost_bs numeric not null default 15
);

-- 8. Create Product Stock Table (Inventory tracked at the product level per branch)
create table public.product_stock (
  product_id integer references public.products(id) on delete cascade,
  branch_id integer references public.branches(id) on delete cascade,
  stock integer not null default 0,
  primary key (product_id, branch_id)
);

-- 9. Create Testimonials Table
create table public.testimonials (
  id serial primary key,
  created_at timestamp with time zone default now() not null,
  text text not null,
  author text not null,
  stars integer default 5
);

-- 10. Create FAQs Table
create table public.faqs (
  id serial primary key,
  created_at timestamp with time zone default now() not null,
  question text not null,
  answer text not null,
  display_order integer default 0
);

-- 11. Create Orders Table
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
  items jsonb not null, -- Stores array of: { type: 'product'|'combo', id: id, name: name, price: price, quantity: qty }
  user_id uuid references auth.users on delete set null,
  branch_id integer references public.branches(id) on delete set null,
  shipping_cost numeric not null default 0,
  delivery_method text default 'Local (Yango)',
  tracking_id text,
  qr_payment_status text default 'Pendiente',
  gps_coordinates text
);

-- 12. Create Settings Table
create table public.settings (
  key text primary key,
  value jsonb not null
);

-- =========================================================================
-- DISABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES TO AVOID 403 FORBIDDEN LOGS
-- =========================================================================
alter table public.profiles disable row level security;
alter table public.categories disable row level security;
alter table public.products disable row level security;
alter table public.product_images disable row level security;
alter table public.combos disable row level security;
alter table public.combo_products disable row level security;
alter table public.branches disable row level security;
alter table public.product_stock disable row level security;
alter table public.testimonials disable row level security;
alter table public.faqs disable row level security;
alter table public.orders disable row level security;
alter table public.settings disable row level security;

-- Automatic trigger for user profile insertion
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  ) on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    avatar_url = excluded.avatar_url,
    updated_at = now();
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================================
-- SEED DATA (OFFICIAL RETAIL CATALOG IN BOLIVIANOS)
-- =========================================================================

-- 1. General configuration settings
insert into public.settings (key, value) values
  ('exchange_rate', '6.96'::jsonb),
  ('whatsapp_number', '"59163488086"'::jsonb)
on conflict (key) do update set value = excluded.value;

-- 2. Seed Categories
insert into public.categories (id, name, slug, description) values
  (1, 'Energía', 'energia', 'Productos para combatir la fatiga y aumentar el enfoque mental'),
  (2, 'Bienestar', 'bienestar', 'Suplementos para fortalecer el cuerpo y el bienestar general'),
  (3, 'Saludable', 'saludable', 'Caramelos nutritivos y snacks sanos para la vista y defensas'),
  (4, 'Café', 'cafe', 'Cafés premium adicionados con hongos funcionales')
on conflict (id) do update set name = excluded.name, slug = excluded.slug, description = excluded.description;

select setval('categories_id_seq', (select max(id) from categories));

-- 3. Seed Products (Individual retail items)
insert into public.products (id, name, sku, slug, price_bs, original_price_bs, category_id, description, bullets, dosage, package_detail, badge, tagline, pinned) values
  (1, 'Cordycafe Tiens', 'TIENS-CC-01', 'cordycafe-tiens', 140, 180, 4,
   'Café instantáneo gourmet elaborado con granos seleccionados y adicionado con polvo de micelio de hongo Cordyceps Sinensis de alta calidad.',
   array['Contiene hongo Cordyceps que fortalece pulmones y riñones', 'Brinda energía natural de larga duración sin causar nerviosismo', 'Apoya al sistema inmune y mejora el rendimiento físico'],
   'Disolver 1 sobre en una taza de agua caliente por la mañana o antes del ejercicio físico.',
   'Caja original sellada de fábrica conteniendo 12 sobres individuales de 15g cada uno.',
   'Popular', 'Tu café con energía natural y salud', true),

  (2, 'Calcio Nutritivo Tiens', 'TIENS-CN-02', 'calcio-nutritivo', 70, 90, 2,
   'Suplemento dietario de calcio en polvo de alta absorción biológica, enriquecido con vitaminas, minerales y aminoácidos esenciales.',
   array['Fortalece la estructura ósea, articulaciones y dientes', 'Tasa de absorción superior al 95% patentada de Tiens', 'Ayuda a prevenir la osteoporosis y dolores musculares'],
   'Disolver 1 sobre en media taza de agua tibia (no hirviendo) antes de acostarse.',
   'Empacado en sobres individuales sellados herméticamente de 10g cada uno.',
   'Recomendado', 'Huesos fuertes y vitalidad física diaria', true),

  (3, 'Té Tianshi', 'TIENS-TE-03', 'te-tianshi', 15, 25, 1,
   'Té herbal tradicional formulado con hojas de té verde y extractos de hierbas que apoyan a la digestión y limpieza celular.',
   array['Potente antioxidante y quemador de grasa natural', 'Ayuda a regular los niveles de colesterol y triglicéridos', 'Promueve una digestión saludable y desintoxicación corporal'],
   'Hervir 1 sobre de Té en un litro de agua y tomar como agua de tiempo a lo largo del día.',
   'Sobre de filtrante original con doble empaque termosellado.',
   'Detox', 'Limpia, desintoxica y renueva tu cuerpo', false),

  (4, 'Luteína Masticable', 'TIENS-LU-04', 'luteina-masticable', 50, 65, 3,
   'Caramelos masticables formulados con luteína y extractos naturales de arándano para la protección de la retina frente a la luz de pantallas.',
   array['Protege los ojos del cansancio provocado por pantallas móviles y PCs', 'Delicioso sabor a arándanos natural, ideal para niños y adultos', 'Aporta antioxidantes específicos para la salud visual'],
   'Masticar de 1 a 2 tabletas de Luteína al día como un antojo dulce y saludable.',
   'Empacado en bolsa doypack termosellada con cierre hermético reutilizable.',
   'Vista Sana', 'Protección visual con delicioso sabor natural', false)
on conflict (id) do update set
  name = excluded.name,
  sku = excluded.sku,
  slug = excluded.slug,
  price_bs = excluded.price_bs,
  original_price_bs = excluded.original_price_bs,
  category_id = excluded.category_id,
  description = excluded.description,
  bullets = excluded.bullets,
  dosage = excluded.dosage,
  package_detail = excluded.package_detail,
  badge = excluded.badge,
  tagline = excluded.tagline,
  pinned = excluded.pinned;

select setval('products_id_seq', (select max(id) from products));

-- 4. Seed Product Gallery Images
insert into public.product_images (id, product_id, url, position, is_video) values
  (1, 1, 'https://res.cloudinary.com/dv6d41ect/image/upload/v1758840055/A75_vzmmrq.png', 0, false),
  (2, 1, 'https://res.cloudinary.com/dv6d41ect/video/upload/v1774966537/video-1005263159337962_zpdaac.mp4', 1, true),
  (3, 2, 'https://res.cloudinary.com/dv6d41ect/image/upload/v1758840051/A01_zf5hc8.png', 0, false),
  (4, 3, 'https://res.cloudinary.com/dv6d41ect/image/upload/v1758840047/A10_jffvj9.png', 0, false),
  (5, 4, 'https://res.cloudinary.com/dv6d41ect/image/upload/v1758840049/A03_i3z2v1.png', 0, false)
on conflict (id) do update set product_id = excluded.product_id, url = excluded.url, position = excluded.position, is_video = excluded.is_video;

select setval('product_images_id_seq', (select max(id) from product_images));

-- 5. Seed Combos (3 Main Trilogies + 4 Weekly Starter Kits)
insert into public.combos (id, name, slug, price_bs, original_price_bs, cost_price_bs, description, badge, tagline, pinned, image_url, category, bullets, dosage, package_detail, is_active) values
  (1, 'Kit Energía Diaria (Salud Ósea, Articular e Inmunológica)', 'kit-energia-diaria', 751.4, 865.0, 580.0,
   'Trilogía sinérgica para la regeneración del cartílago, remineralización ósea profunda y fortalecimiento inmune celular integral.',
   'Combo Especial', 'Huesos fuertes, articulaciones flexibles y defensas al máximo', true, 'products/kit_energia_diaria.jpg', 'Bienestar',
   array['Regenera cartílagos y tejido conectivo con Glucosamina', 'Alta absorción ósea con Calcio Nutritivo patentado', 'Equilibrio hormonal e inmunológico con Zinc orgánico', 'Tratamiento completo mensual'],
   'Tomar según indicación diaria de cada suplemento.', 'Pack completo de frascos y cajas originales selladas.', true),

  (2, 'Kit Bienestar & Huesos (Trilogía Familiar de Calcio Tiens)', 'kit-bienestar-huesos', 861.9, 990.1, 680.0,
   'Solución integral de calcio para cada etapa familiar: adultos, niños en crecimiento y personas que requieren control glucémico.',
   'Combo Especial', 'Nutrición ósea y metabólica integral para toda la familia', true, 'products/kit_bienestar_huesos.jpg', 'Saludable',
   array['Calcio Adultos de alta absorción (95%)', 'Calcio Infantil con taurina y lecitina para el desarrollo cerebral', 'Calcio Dietético especial con polvo de calabaza', 'Cuidado integral para toda la familia'],
   '1 sobre al día según edad antes de dormir o por la mañana.', 'Trilogía de cajas originales selladas de fábrica.', true),

  (3, 'Kit Antojo Saludable (Digestión, Control de Grasas y Flora Intestinal)', 'kit-antojo-saludable', 1406.6, 1620.0, 1100.0,
   'Tratamiento intensivo de depuración gástrica, absorción selectiva de lípidos y restauración prebiótica de la microbiota intestinal.',
   'Combo Especial', 'Digestión ligera, bloqueo de grasas y regeneración de la flora intestinal', true, 'products/kit_antojo_saludable.jpg', 'Energía',
   array['Chitosa para atrapar y eliminar grasas ingeridas', 'Jarabe FOS para alimentar y regenerar la flora intestinal', 'Té Tianshi desintoxicante y antioxidante', 'Efecto vientre plano y digestión óptima'],
   'Té en ayunas, Jarabe FOS a media tarde y Chitosa antes de comidas principales.', 'Pack completo de suplementos en presentación original.', true),

  (4, 'Reto Detox 7 Días', 'reto-detox-7-dias', 55.0, 75.0, 35.0,
   'Desinflama el abdomen, elimina toxinas acumuladas y combate el tránsito lento desde el primer día sin causar dolor ni cólicos.',
   'Más Vendido', 'Limpieza digestiva y colon • 7 Sobres de Té', false, 'products/kit_antojo_saludable.jpg', 'Bienestar',
   array['Alivia la pesadez y acidez después de comidas pesadas.', 'Regula la digestión de forma 100% natural.', 'Rinde para 7 litros de infusión herbal.', 'Incluye 7 sobres individuales sellados herméticamente.'],
   '1 sobre diario infusionado en 1 litro de agua tibia, tomado a lo largo de la mañana o en ayunas.', 'Empaque Kraft ecológico termosellado con 7 sobres individuales de Té Tiens.', true),

  (5, 'Pack Energía & Rendimiento 5 Días', 'pack-energia-5-dias', 95.0, 125.0, 60.4,
   'Energía natural sostenida para jornadas largas de trabajo o estudio, sin taquicardia ni irritación estomacal.',
   'Energía Total', 'CordyCafé sin gastritis • 5 Sobres', false, 'products/kit_energia_diaria.jpg', 'Energía',
   array['Contiene extracto de Cordyceps para aumentar rendimiento físico y mental.', 'Cero acidez (ideal para personas con gastritis).', 'Reemplaza el café común con un tónico revitalizante.', 'Incluye 5 sobres individuales de CordyCafé gourmet.'],
   '1 sobre disuelto en una taza de agua caliente a media mañana o al inicio de la jornada laboral.', 'Empaque Kraft ecológico termosellado con 5 sobres individuales de CordyCafé Tiens.', true),

  (6, 'Kit Calcio Nutritivo 5 Días', 'kit-calcio-5-dias', 145.0, 180.0, 100.0,
   'Fórmula de calcio de alta absorción (95%) para aliviar dolores de rodillas, espalda, calambres y desgaste articular.',
   'Alta Absorción', 'Huesos fuertes y cero dolor articular • 5 Sobres', false, 'products/kit_bienestar_huesos.jpg', 'Bienestar',
   array['Tasa de absorción del 95% patentada sin generar cálculos renales.', 'Fortalece masa ósea y alivia contracturas musculares.', 'Ideal para personas con alta exigencia física o adultos mayores.', 'Incluye 5 sobres individuales de Calcio Nutritivo Tiens.'],
   '1 sobre diario disuelto en agua tibia (nunca hirviendo) antes de dormir o con el desayuno.', 'Empaque Kraft ecológico termosellado con 5 sobres individuales de Calcio Nutritivo Tiens.', true),

  (7, 'Combo Doble Acción 5 Días', 'combo-doble-accion-5-dias', 135.0, 160.0, 85.4,
   'El tratamiento combinado para limpiar el organismo por la mañana y mantener el rendimiento al máximo durante todo el día.',
   'Mayor Ahorro', 'Digestión limpia + Energía total • 10 Sobres', false, 'products/kit_energia_diaria.jpg', 'Saludable',
   array['5 sobres de Té Digestivo + 5 sobres de CordyCafé.', 'Ahorras 15 Bs comprándolos juntos en lugar de individuales.', 'Doble beneficio: Digestión ligera por la mañana y energía prolongada por la tarde.', 'Total 10 sobres fraccionados termosellados.'],
   'Té herbal durante la mañana + CordyCafé después del almuerzo.', 'Empaque Kraft ecológico con 5 sobres de Té Tianshi y 5 sobres de CordyCafé.', true)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  price_bs = excluded.price_bs,
  original_price_bs = excluded.original_price_bs,
  cost_price_bs = excluded.cost_price_bs,
  description = excluded.description,
  badge = excluded.badge,
  tagline = excluded.tagline,
  pinned = excluded.pinned,
  image_url = excluded.image_url,
  category = excluded.category,
  bullets = excluded.bullets,
  dosage = excluded.dosage,
  package_detail = excluded.package_detail,
  is_active = excluded.is_active;

select setval('combos_id_seq', (select max(id) from combos));

-- 6. Link Products inside Combos
insert into public.combo_products (combo_id, product_id, quantity) values
  (1, 2, 1),
  (2, 2, 1),
  (2, 4, 1),
  (3, 3, 1),
  (4, 3, 7),  -- Reto Detox: 7 Sobres de Té
  (5, 1, 5),  -- Pack Energía: 5 Sobres CordyCafé
  (6, 2, 5),  -- Kit Calcio: 5 Sobres Calcio Nutritivo
  (7, 3, 5),  -- Combo Doble Acción: 5 Sobres Té
  (7, 1, 5)   -- Combo Doble Acción: 5 Sobres CordyCafé
on conflict (combo_id, product_id) do update set quantity = excluded.quantity;

-- 7. Seed Branches
insert into public.branches (id, name, address, shipping_cost_bs) values
  (1, 'Santa Cruz', 'Av. San Martín, Equipetrol, Santa Cruz', 12),
  (2, 'La Paz', 'Av. 16 de Julio, El Prado, La Paz', 15),
  (3, 'Cochabamba', 'Calle España, Zona Central, Cochabamba', 15)
on conflict (id) do update set name = excluded.name, address = excluded.address, shipping_cost_bs = excluded.shipping_cost_bs;

select setval('branches_id_seq', (select max(id) from branches));

-- 8. Seed Stocks at the Product Level
insert into public.product_stock (product_id, branch_id, stock) values
  -- Cordycafe (Product 1)
  (1, 1, 50), -- Santa Cruz
  (1, 2, 30), -- La Paz
  (1, 3, 20), -- Cochabamba
  -- Calcio (Product 2)
  (2, 1, 30), (2, 2, 15), (2, 3, 10),
  -- Té Tianshi (Product 3)
  (3, 1, 100), (3, 2, 60), (3, 3, 40),
  -- Luteína (Product 4)
  (4, 1, 40), (4, 2, 25), (4, 3, 20)
on conflict (product_id, branch_id) do update set stock = excluded.stock;

-- 9. Seed Testimonials
insert into public.testimonials (id, text, author, stars) values
  (1, 'El Kit Energía Diaria me mantiene despierta todo el día en el trabajo en Santa Cruz. La bolsa termosellada da mucha seguridad.', 'María René S. (Santa Cruz)', 5),
  (2, 'Pedí el Kit Bienestar & Huesos para mi mamá. Le llegó a su casa por delivery y pagamos con QR en el momento.', 'Carlos Mendoza (Equipetrol)', 5),
  (3, 'Los caramelos de Luteína son riquísimos. Mis hijos paran en la tablet todo el día y esto les protege los ojitos.', 'Ana Lucía V. (Cochabamba)', 5)
on conflict (id) do update set text = excluded.text, author = excluded.author, stars = excluded.stars;

select setval('testimonials_id_seq', (select max(id) from testimonials));

-- 10. Seed FAQs
insert into public.faqs (id, question, answer, display_order) values
  (1, '¿Cómo realizan las entregas en Santa Cruz?', 'Realizamos envíos en Santa Cruz de la Sierra mediante motorizados de confianza. El costo de delivery es de 10 a 15 Bs según tu zona y coordinamos el despacho por WhatsApp.', 0),
  (2, '¿Cuáles son los métodos de pago aceptados?', 'Aceptamos Pago por QR simple (puedes transferir desde cualquier banco antes del despacho o al recibir el paquete). También aceptamos efectivo en contraentrega.', 1),
  (3, '¿Por qué las bolsas vienen termoselladas?', 'Para tu total tranquilidad, empacamos todos los combos en bolsas doypack kraft de grado alimenticio y las termosellamos con máquina manual de calor. Esto garantiza que tus productos están 100% cerrados de fábrica, originales y sin ninguna alteración.', 2)
on conflict (id) do update set question = excluded.question, answer = excluded.answer, display_order = excluded.display_order;

select setval('faqs_id_seq', (select max(id) from faqs));
