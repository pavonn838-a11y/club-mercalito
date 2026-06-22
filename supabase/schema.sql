create extension if not exists "pgcrypto";

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  address text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('administrador', 'oficina')),
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  branch_id uuid not null references public.branches(id),
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  opt_in boolean not null default false,
  source text not null default 'QR sucursal',
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  branch_id uuid references public.branches(id),
  status text not null default 'draft' check (status in ('draft', 'sent')),
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create table if not exists public.campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  customer_id uuid not null references public.customers(id),
  personalized_message text not null,
  created_at timestamptz not null default now()
);

create index if not exists customers_branch_id_idx on public.customers(branch_id);
create index if not exists customers_created_at_idx on public.customers(created_at desc);
create index if not exists customers_status_idx on public.customers(status);
create index if not exists campaigns_branch_id_idx on public.campaigns(branch_id);
create index if not exists campaign_recipients_campaign_id_idx on public.campaign_recipients(campaign_id);

create or replace view public.customers_by_branch as
select
  b.id as branch_id,
  b.name as branch_name,
  count(c.id)::int as total
from public.branches b
left join public.customers c on c.branch_id = b.id
group by b.id, b.name
order by total desc, b.name asc;

alter table public.branches enable row level security;
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_recipients enable row level security;

create policy "Public can read active branches"
on public.branches for select
to anon, authenticated
using (active = true);

create policy "Authenticated can read branches"
on public.branches for select
to authenticated
using (true);

create policy "Authenticated can read profiles"
on public.profiles for select
to authenticated
using (auth.uid() = id);

-- Las escrituras administrativas se hacen desde el servidor con SUPABASE_SERVICE_ROLE_KEY.
-- No crear policies públicas para customers/campaigns evita exponer datos sensibles.
