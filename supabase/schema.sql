-- Enrique Fernandez Electricista - production schema
-- Run this in Supabase SQL Editor after connecting the project.

create extension if not exists pgcrypto;

create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  business_name text not null default 'Enrique Fernández Electricista',
  tax_id text,
  address text,
  phone text,
  email text,
  invoice_prefix text not null default 'F',
  next_invoice_number integer not null default 1,
  default_vat numeric(5,2) not null default 21,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  unit_price numeric(12,2) not null default 0,
  vat_rate numeric(5,2) not null default 21,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  scheduled_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled','in_progress','completed','cancelled')),
  notes text,
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_items (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  catalog_item_id uuid references public.catalog_items(id) on delete set null,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  vat_rate numeric(5,2) not null default 21
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  job_id uuid references public.jobs(id) on delete set null,
  invoice_number text not null,
  issue_date date not null default current_date,
  due_date date,
  status text not null default 'pending' check (status in ('draft','pending','paid','cancelled')),
  concept text,
  subtotal numeric(12,2) not null default 0,
  vat_amount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, invoice_number)
);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  vat_rate numeric(5,2) not null default 21,
  line_subtotal numeric(12,2) not null default 0,
  line_vat numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  supplier text not null,
  tax_id text,
  invoice_number text,
  category text not null default 'Otros',
  expense_date date not null default current_date,
  subtotal numeric(12,2) not null default 0,
  vat_rate numeric(5,2) not null default 21,
  vat_amount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  notes text,
  document_path text,
  ocr_status text not null default 'pending' check (ocr_status in ('pending','processing','completed','failed','manual')),
  ocr_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  address text,
  requested_service text,
  description text,
  preferred_date date,
  status text not null default 'new' check (status in ('new','contacted','scheduled','completed','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists idx_clients_owner on public.clients(owner_id);
create index if not exists idx_catalog_owner on public.catalog_items(owner_id);
create index if not exists idx_jobs_owner_date on public.jobs(owner_id, scheduled_at);
create index if not exists idx_invoices_owner_date on public.invoices(owner_id, issue_date);
create index if not exists idx_expenses_owner_date on public.expenses(owner_id, expense_date);
create index if not exists idx_requests_owner_status on public.service_requests(owner_id, status);

alter table public.business_profiles enable row level security;
alter table public.clients enable row level security;
alter table public.catalog_items enable row level security;
alter table public.jobs enable row level security;
alter table public.job_items enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.expenses enable row level security;
alter table public.service_requests enable row level security;
alter table public.app_settings enable row level security;

-- Owner-isolation policies.
create policy "owner business profile" on public.business_profiles for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner clients" on public.clients for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner catalog" on public.catalog_items for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner jobs" on public.jobs for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner invoices" on public.invoices for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner expenses" on public.expenses for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner settings" on public.app_settings for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Job/invoice item access follows the parent record owner.
create policy "owner job items" on public.job_items for all
using (exists (select 1 from public.jobs j where j.id = job_id and j.owner_id = auth.uid()))
with check (exists (select 1 from public.jobs j where j.id = job_id and j.owner_id = auth.uid()));

create policy "owner invoice items" on public.invoice_items for all
using (exists (select 1 from public.invoices i where i.id = invoice_id and i.owner_id = auth.uid()))
with check (exists (select 1 from public.invoices i where i.id = invoice_id and i.owner_id = auth.uid()));

-- Public website requests may be inserted without exposing existing requests.
create policy "public can create service requests" on public.service_requests
for insert with check (owner_id is null);
create policy "owner can manage service requests" on public.service_requests
for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Storage bucket for invoices/receipts. Keep it private and serve files with signed URLs.
insert into storage.buckets (id, name, public) values ('business-documents', 'business-documents', false)
on conflict (id) do nothing;

create policy "owner document access" on storage.objects
for all using (bucket_id = 'business-documents' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'business-documents' and (storage.foldername(name))[1] = auth.uid()::text);

-- Useful quarterly view for accounting exports.
create or replace view public.expense_quarter_summary as
select owner_id,
       extract(year from expense_date)::int as year,
       extract(quarter from expense_date)::int as quarter,
       count(*) as expense_count,
       round(sum(subtotal),2) as subtotal,
       round(sum(vat_amount),2) as vat_amount,
       round(sum(total),2) as total
from public.expenses
group by owner_id, extract(year from expense_date), extract(quarter from expense_date);
