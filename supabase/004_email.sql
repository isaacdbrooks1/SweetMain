-- Sweet Main: owner edit links and investor messages. Paste into Supabase:
-- SQL Editor -> New query -> paste -> Run. Safe to run more than once.

-- A private edit key per listing. Only a scrambled (hashed) copy is stored;
-- the real key exists only in the link emailed to the owner.
alter table public.businesses add column if not exists edit_token_hash text;
alter table public.businesses add column if not exists edit_link_sent_at timestamptz;

-- Messages from people interested in investing, kept as a record.
-- The owner gets an email copy; their address is never shown to the sender.
create table if not exists public.investor_messages (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  business_id  text not null references public.businesses (id) on delete cascade,
  sender_name  text not null,
  sender_email text not null,
  amount       text not null default '',
  message      text not null,
  emailed      boolean not null default false
);

create index if not exists investor_messages_business_idx on public.investor_messages (business_id, created_at desc);

-- Same lock-down as the other tables: only the website's server can read or write.
alter table public.investor_messages enable row level security;
