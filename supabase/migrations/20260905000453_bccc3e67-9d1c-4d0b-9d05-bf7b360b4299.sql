-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- First signed-in user can claim admin when no admin exists yet
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin');
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  benefit text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  price numeric(10,2) NOT NULL DEFAULT 0,
  size text NOT NULL DEFAULT '',
  available boolean NOT NULL DEFAULT true,
  visible boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  areas text[] NOT NULL DEFAULT '{}',
  needs text[] NOT NULL DEFAULT '{}',
  results text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view visible products" ON public.products
  FOR SELECT TO anon, authenticated USING (visible = true);
CREATE POLICY "Admins can view all products" ON public.products
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.products (slug, name, category, tagline, description, benefit, features, price, size, sort_order, areas, needs, results, images) VALUES
('shampoo-con-cera', 'Shampoo con cera', 'Shampoo automotriz', 'Limpieza + brillo en un solo producto.', 'Limpieza + brillo en un solo producto. Fórmula de pH neutro, ideal para suciedad media.', 'Limpia y deja acabado brillante en un solo paso.', ARRAY['pH neutro','Suciedad media','Acabado brillante','Uso en carrocería y rines','Rinde hasta 30 lavadas'], 12.50, '500 ml', 1, ARRAY['exterior'], ARRAY['brillo','limpieza','proteccion'], ARRAY['acabado-premium','proteccion'], ARRAY['/__l5e/assets-v1/83cf2f2c-8984-474b-8ba3-88582b59e41f/p1.webp','/__l5e/assets-v1/7480342a-18a1-4901-8b01-f261156e68bd/hero.webp']),
('shampoo-sin-cera', 'Shampoo sin cera', 'Shampoo automotriz', 'Limpieza profunda para remover suciedad más intensa.', 'Limpieza profunda para remover suciedad más intensa. Fórmula de pH neutro para uso frecuente.', 'Remueve suciedad intensa sin dañar la pintura.', ARRAY['pH neutro','Suciedad fuerte','Brillo medio','Uso en carrocería y rines','Rinde hasta 30 lavadas'], 10.50, '500 ml', 2, ARRAY['exterior'], ARRAY['limpieza','mantenimiento'], ARRAY['limpieza-profunda','mantenimiento-diario'], ARRAY['/__l5e/assets-v1/cb83f0d1-16d6-4609-aa02-7daa9eccc707/p2.webp','/__l5e/assets-v1/7480342a-18a1-4901-8b01-f261156e68bd/hero.webp']),
('el-limpiador', 'El Limpiador', 'Producto de limpieza', 'Producto especializado para el cuidado de tu vehículo.', 'Limpiador multiusos para interiores y exteriores. Remueve polvo, grasa y manchas del día a día sin dañar plásticos, vinil ni pintura.', 'Multiusos para limpiar interior y exterior a diario.', ARRAY['Fórmula multiusos','Seguro en plásticos y vinil','Remueve grasa y manchas','Uso interior y exterior','Rinde para uso frecuente'], 7.50, '500 ml', 3, ARRAY['ambos','interior','exterior'], ARRAY['limpieza','mantenimiento'], ARRAY['limpieza-profunda','mantenimiento-diario'], ARRAY['/__l5e/assets-v1/741aeae1-df82-470b-b9bc-be1f54a94129/p3.webp','/__l5e/assets-v1/7480342a-18a1-4901-8b01-f261156e68bd/hero.webp']),
('silicon-para-interiores', 'Silicón para interiores', 'Cuidado interior', 'Protege y revitaliza las superficies interiores de tu vehículo.', 'Silicón acondicionador para tableros, paneles y plásticos interiores. Revitaliza el color y deja un acabado protector sin sensación grasosa.', 'Protege y revitaliza plásticos y tableros.', ARRAY['Acabado satinado no grasoso','Revitaliza el color','Protección contra resequedad','Ideal para tablero y paneles','Aroma agradable'], 9.75, '500 ml', 4, ARRAY['interior'], ARRAY['proteccion','brillo','mantenimiento'], ARRAY['proteccion','acabado-premium','mantenimiento-diario'], ARRAY['/__l5e/assets-v1/bfab652a-8b9d-4301-ace3-0a386ea212b9/p4.webp','/__l5e/assets-v1/7480342a-18a1-4901-8b01-f261156e68bd/hero.webp']);

-- Orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  delivery_method text NOT NULL,
  department text NOT NULL DEFAULT '',
  municipality text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  reference text NOT NULL DEFAULT '',
  payment_method text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  shipping numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'nuevo',
  email_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view orders" ON public.orders
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete orders" ON public.orders
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Contact messages
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  subject text NOT NULL,
  channel text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'nuevo',
  email_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update messages" ON public.contact_messages
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete messages" ON public.contact_messages
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();