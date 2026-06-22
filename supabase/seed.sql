insert into public.branches (name, slug, address, active)
values
  ('Olavarria', 'olavarria', 'Olavarria, Mar del Plata', true),
  ('Santa Fe', 'santafe', 'Santa Fe, Mar del Plata', true),
  ('Moreno', 'moreno', 'Moreno, Mar del Plata', true),
  ('Rioja', 'rioja', 'La Rioja, Mar del Plata', true),
  ('Edison', 'edison', 'Edison, Mar del Plata', true)
on conflict (slug) do update
set name = excluded.name,
    address = excluded.address,
    active = excluded.active;

insert into public.customers (name, phone, branch_id, status, opt_in, source)
select 'Ana Perez', '+542235551111', id, 'active', true, 'QR sucursal'
from public.branches where slug = 'olavarria'
on conflict (phone) do nothing;

insert into public.customers (name, phone, branch_id, status, opt_in, source)
select 'Martin Gomez', '+542235552222', id, 'active', true, 'QR sucursal'
from public.branches where slug = 'santafe'
on conflict (phone) do nothing;

insert into public.customers (name, phone, branch_id, status, opt_in, source)
select 'Lucia Torres', '+542235553333', id, 'unsubscribed', true, 'QR sucursal'
from public.branches where slug = 'moreno'
on conflict (phone) do nothing;

insert into public.campaigns (name, message, branch_id, status)
values (
  'Ofertas del finde',
  'Hola {nombre}. Soy Mercalito. Te dejamos las ofertas del finde en tu sucursal {sucursal}. Mostrá este mensaje en caja y aprovechá el beneficio. Para dejar de recibir mensajes, respondé BAJA.',
  null,
  'draft'
);
