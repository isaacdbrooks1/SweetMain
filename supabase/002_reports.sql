-- Sweet Main: reports from visitors about listings. Paste into Supabase:
-- SQL Editor -> New query -> paste -> Run. Safe to run more than once.

create table if not exists public.reports (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  business_id text not null references public.businesses (id) on delete cascade,
  reason      text not null,
  details     text not null default '',
  -- 'open' until you deal with it on the admin page.
  status      text not null default 'open' check (status in ('open', 'dismissed', 'resolved'))
);

create index if not exists reports_status_idx on public.reports (status, created_at desc);

-- Same lock-down as the businesses table: only the website's server can read or write.
alter table public.reports enable row level security;
