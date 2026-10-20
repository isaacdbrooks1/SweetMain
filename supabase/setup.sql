-- Sweet Main database setup. Paste this whole file into Supabase:
-- SQL Editor -> New query -> paste -> Run. Safe to run more than once.

create table if not exists public.businesses (
  id               text primary key,
  created_at       timestamptz not null default now(),
  name             text not null,
  category         text not null,
  tagline          text not null,
  description      text not null default '',
  city             text not null default '',
  state            text not null default '',
  zip              text not null default '',
  address          text,
  online_only      boolean not null default false,
  lat              double precision,
  lng              double precision,
  logo             text,
  photos           text[] not null default '{}',
  links            jsonb not null default '{}'::jsonb,
  support_links    jsonb not null default '[]'::jsonb,
  investor_contact boolean not null default false,
  -- Private: only the website's server ever reads this.
  owner_email      text not null,
  -- 'hidden' listings are removed from the site (used by the admin tools later).
  status           text not null default 'live' check (status in ('live', 'hidden'))
);

create index if not exists businesses_created_at_idx on public.businesses (created_at desc);
create index if not exists businesses_category_idx on public.businesses (category);

-- Lock the table down. With row level security on and no policies, the public
-- keys can't read or write anything; only the website's server (secret key) can.
alter table public.businesses enable row level security;
