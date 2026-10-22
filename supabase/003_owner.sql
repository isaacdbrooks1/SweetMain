-- Sweet Main: "Meet the owner" on each listing. Paste into Supabase:
-- SQL Editor -> New query -> paste -> Run. Safe to run more than once.

alter table public.businesses add column if not exists owner_name  text;
alter table public.businesses add column if not exists owner_story text not null default '';
alter table public.businesses add column if not exists owner_photo text;
