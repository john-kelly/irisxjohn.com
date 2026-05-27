-- Iris & John — REAL guest list (57 invitations)
-- Run in the Supabase SQL Editor after schema.sql. Assumes the tables are empty.
-- One insert per group so duplicate labels (e.g. two "Craige Family") stay as
-- separate invitations rather than merging.

begin;

-- To reload from scratch, uncomment the next line (WIPES all rows + any RSVPs):
-- truncate public.guests, public.invitations cascade;

with inv as (insert into public.invitations (label) values ('Dennis Orason Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Dennis Orason',1),('Sarah Sussan',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('John Lasack') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('John Lasack',1)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Craige Family') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Alex Craige',1),('Norm Craige',2),('Anne Craige',3)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Christian and Lourdes Viloria Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Christian Viloria',1),('Lourdes Viloria',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Elena Gonzalez Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Elena Gonzalez',1),('Plus One',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Hutchins Family') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Kelsey Hutchins',1),('Nathan Hutchins',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Zoe Frumin Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Zoe Frumin',1),('Elliott Soong Shaw',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Greer Cowan Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Greer Cowan',1),('Bryan Arita',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Grace Hut') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Grace Hut',1)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Alan and Martina Hoshida Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Alan Hoshida',1),('Martina Hoshida',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Kai and Bowser Freitas Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Kai Freitas',1),('Bowser Freitas',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Ana Waishwile') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Ana Waishwile',1)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Hannah Flanery Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Hannah Flanery',1),('Dmitry Filimonov',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Chris Tyler Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Chris Tyler',1),('Cody Lowe',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Jessica Lozada and Jeff Rillera Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Jessica Lozada',1),('Jeff Rillera',2),('Brandon Rillera',3),('Becky Kuang',4)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Melissa Alvarez-Viloria and Michael Viloria Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Melissa Alvarez-Viloria',1),('Michael Viloria',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Laura and Alfonso Carillo Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Laura Carillo',1),('Alfonso Carillo',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Carly Tomaine Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Carly Tomaine',1),('Alicia Tapia',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Gian-Paul Bergeron Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Gian-Paul Bergeron',1),('Kathryn Lane Davis',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Corinne Odom') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Corinne Odom',1)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Maya and Juna Skrami Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Maya Skrami',1),('Juna Skrami',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Megan and Mnm Serrato Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Megan Serrato',1),('Mnm Serrato',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Craige Family') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Steven',1),('Gigi',2),('Zachary',3),('Natalia',4)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Shoshana Reist') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Shoshana Reist',1)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Maria and Otis Jones Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Maria Jones',1),('Otis Jones',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Andrew Bayer Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Andrew Bayer',1),('Alyssa Travitz',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Justine Kelley Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Justine Kelley',1),('James Cuarto',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Jin Zhang') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Jin Zhang',1)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Olivia and Connor Murray Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Olivia Murray',1),('Connor Murray',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Stephenie and Derek Kelly Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Stephenie Kelly',1),('Derek Kelly',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Jennifer and Andrew Baldovino Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Jennifer Baldovino',1),('Andrew Baldovino',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Brian Baldovino Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Brian Baldovino',1),('Margie Nguyen',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Nelo and Tess Baldovino Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Nelo Baldovino',1),('Tess Baldovino',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Michael and Mageline Kelley Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Michael Kelley',1),('Mageline Kelley',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Evelyn Hunter') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Evelyn Hunter',1)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Ethan Daniel Bridges') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Ethan Daniel Bridges',1)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Marshall and Mileena Kelly Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Marshall Kelly',1),('Mileena Kelly',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Einxel Reyes') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Einxel Reyes',1)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Matthew Meneses') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Matthew Meneses',1)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Michelle Lee Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Michelle Lee',1),('Eric Goodwin',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Kelly Family') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Amelia Kelly',1),('Josephine Kelly',2),('Michael Kelly',3),('Darren Kelly',4),('Tracy Kelly',5)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Krista Howk Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Krista Howk',1),('Plus One',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Diego Rodriguez') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Diego Rodriguez',1)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Danielle and Adam Yacek Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Danielle Yacek',1),('Adam Yacek',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Lisa Muetzel') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Lisa Muetzel',1)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Thérèse Soong Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Thérèse Soong',1),('Neil White',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Robert and Sandy Kelly Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Robert Kelly',1),('Sandy Kelly',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Sharon Laura Kelly Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Sharon Laura Kelly',1),('Mitzi Chaves',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Shallyn Wells Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Shallyn Wells',1),('Grant Marr',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Dr. Louis & Mrs. Tiffany Radden Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Dr. Louis Radden',1),('Mrs. Tiffany Radden',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Isabella Victoria Del Moral Tioseco') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Isabella Victoria Del Moral Tioseco',1)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Elisa Savorgnan Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Elisa Savorgnan',1),('Saar Sayfan',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Ben Milliken Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Ben Milliken',1),('Plus One',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Isaiah Zeavin-Moss') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Isaiah Zeavin-Moss',1)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Ale Campillo') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Ale Campillo',1)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Randy and Congo Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Randy',1),('Congo',2)) as g(name,ord);

with inv as (insert into public.invitations (label) values ('Camille and Husband Group') returning id)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord from inv, (values ('Camille',1),('Husband',2)) as g(name,ord);

commit;

-- Sanity check — expect 57 invitations and 107 guests.
select
  (select count(*) from public.invitations) as invitations,
  (select count(*) from public.guests)      as guests;
