-- Iris & John — RSVP TEST DATA
-- Run this in the Supabase SQL Editor AFTER running schema.sql.
-- Safe to re-run: it wipes all rows first, then re-inserts. Delete this whole
-- file (and re-run the truncate) before loading your real guest list.

begin;

-- Clear existing rows so this script is repeatable during testing.
truncate public.guests, public.invitations cascade;

-- 1) A couple sharing a surname — searching either name opens this same invite.
with inv as (
  insert into public.invitations (label) values ('The Craige Household') returning id
)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv,
  (values ('Gigi Craige', 1), ('Steven Craige', 2)) as g(name, ord);

-- 2) A couple with different surnames on one invite.
with inv as (
  insert into public.invitations (label) values ('Amara & Daniel') returning id
)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv,
  (values ('Amara Watson', 1), ('Daniel Lee', 2)) as g(name, ord);

-- 3) A single-person invite.
with inv as (
  insert into public.invitations (label) values ('Priya Nair') returning id
)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, 'Priya Nair', 1 from inv;

-- 4) A family of four.
with inv as (
  insert into public.invitations (label) values ('The Alvarez Family') returning id
)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv,
  (values ('Marco Alvarez', 1), ('Sofia Alvarez', 2),
          ('Mateo Alvarez', 3), ('Lucia Alvarez', 4)) as g(name, ord);

-- 5) Two different "Jonathan"s on separate invites — type "jonathan" to see the
--    autocomplete dropdown list both, each with its own household.
with inv as (
  insert into public.invitations (label) values ('Jonathan Reed') returning id
)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, 'Jonathan Reed', 1 from inv;

with inv as (
  insert into public.invitations (label) values ('Jonathan Park') returning id
)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, 'Jonathan Park', 1 from inv;

-- 6) A household that has already replied — opens with one box checked and one
--    unchecked, so you can see the pre-filled state.
with inv as (
  insert into public.invitations (label) values ('The Okafor Household') returning id
)
insert into public.guests (invitation_id, full_name, attending, responded_at, sort_order)
select inv.id, name, att, now(), ord from inv,
  (values ('Chidi Okafor', true, 1), ('Ada Okafor', false, 2)) as g(name, att, ord);

commit;
