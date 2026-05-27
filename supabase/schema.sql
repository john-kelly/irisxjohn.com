-- Iris & John — RSVP schema
-- Run this top-to-bottom in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- It is safe to re-run: tables use "if not exists" and functions use "create or replace".
--
-- Security model (no password — anyone can pull up any invitation):
--   * The tables have Row Level Security ON with NO policies, so the public
--     anon key CANNOT read or write them directly (no dumping the guest list,
--     no rewriting names).
--   * The website only ever calls the three SECURITY DEFINER functions below.
--     They run as the table owner, so they can read/write — but they only do
--     exactly what we allow: search by name, read one invitation, and flip a
--     single guest's attendance.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- One row per household / invitation. "label" is an optional display name
-- shown above the guest list, e.g. "The Craige Household".
create table if not exists public.invitations (
  id         uuid primary key default gen_random_uuid(),
  label      text,
  created_at timestamptz not null default now()
);

-- People attached to an invitation. attending: null = no reply yet,
-- true = coming, false = can't make it.
create table if not exists public.guests (
  id            uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  full_name     text not null,
  attending     boolean,
  responded_at  timestamptz,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists guests_invitation_id_idx on public.guests(invitation_id);

-- Lock the tables down. RLS enabled + no policies = the anon web client
-- cannot touch these directly. The functions below (security definer) are the
-- only way in.
alter table public.invitations enable row level security;
alter table public.guests      enable row level security;

-- ---------------------------------------------------------------------------
-- Functions (the only API the website uses)
-- ---------------------------------------------------------------------------

-- Autocomplete: find guests whose name contains the typed text. Requires at
-- least 2 characters so an empty box can't list everyone. Capped at 10 rows.
create or replace function public.rsvp_search(term text)
returns table (guest_id uuid, full_name text, invitation_id uuid, household text)
language sql
security definer
set search_path = public
as $$
  select g.id, g.full_name, g.invitation_id, i.label
  from public.guests g
  join public.invitations i on i.id = g.invitation_id
  where char_length(btrim(term)) >= 2
    and g.full_name ilike '%' || btrim(term) || '%'
  order by g.full_name
  limit 10;
$$;

-- Pull up a full invitation: every guest on it, in display order.
create or replace function public.rsvp_get_invitation(inv_id uuid)
returns table (guest_id uuid, full_name text, attending boolean, household text)
language sql
security definer
set search_path = public
as $$
  select g.id, g.full_name, g.attending, i.label
  from public.guests g
  join public.invitations i on i.id = g.invitation_id
  where g.invitation_id = inv_id
  order by g.sort_order, g.full_name;
$$;

-- Save one guest's answer. This is the only write the website can make.
create or replace function public.rsvp_set_attending(guest_id uuid, is_attending boolean)
returns void
language sql
security definer
set search_path = public
as $$
  update public.guests
  set attending = is_attending,
      responded_at = now()
  where id = guest_id;
$$;

-- Expose only these functions to the anonymous web client.
revoke all on function public.rsvp_search(text)              from public;
revoke all on function public.rsvp_get_invitation(uuid)      from public;
revoke all on function public.rsvp_set_attending(uuid, boolean) from public;

grant execute on function public.rsvp_search(text)              to anon, authenticated;
grant execute on function public.rsvp_get_invitation(uuid)      to anon, authenticated;
grant execute on function public.rsvp_set_attending(uuid, boolean) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Example data — DELETE this block (or edit it) once you add your real list.
-- Shows the "shared household" idea: both names lead to the same invitation.
-- ---------------------------------------------------------------------------
-- with inv as (
--   insert into public.invitations (label) values ('The Craige Household')
--   returning id
-- )
-- insert into public.guests (invitation_id, full_name, sort_order)
-- select inv.id, name, ord
-- from inv, (values ('Gigi Craige', 1), ('Steven Craige', 2)) as g(name, ord);
