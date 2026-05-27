# RSVP backend setup (Supabase)

The RSVP page talks to a free Supabase project entirely from the browser — no
server to run. This walks you through it once, end to end.

## 1. Create the project

1. Go to <https://supabase.com> and sign up (free tier is plenty).
2. Click **New project**. Pick any name (e.g. `irisxjohn`), set a database
   password (save it somewhere — you won't need it for the website), choose the
   region closest to your guests, and create it. Give it a minute to spin up.

## 2. Create the tables and functions

1. In the project, open **SQL Editor** (left sidebar) → **New query**.
2. Open [`supabase/schema.sql`](supabase/schema.sql), copy the whole file, paste
   it in, and click **Run**. You should see "Success. No rows returned".

This creates the `invitations` and `guests` tables and the three functions the
website uses. The tables are locked down so the public website key can only
search names, open one invitation, and save a single person's yes/no — it can't
read or rewrite your whole guest list.

## 3. Get your two public keys

1. Open **Project Settings** (gear icon) → **API**.
2. Copy these two values:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon public** key (under "Project API keys") — a long string.

These are *meant* to be public — they're safe to commit to this repo. (The
`service_role` key is the secret one; never put that on the website.)

## 4. Plug the keys into the site

Open [`rsvp.js`](rsvp.js) and fill in the two lines at the top:

```js
const SUPABASE_URL = "https://YOUR-PROJECT-ref.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-PUBLIC-ANON-KEY";
```

Save, reload `rsvp.html`, and the search box is live.

## 5. Add your real guest list

Each **invitation** is one household; each **guest** is a person on it. Both
names on a shared invite open the same RSVP. Two ways to add people:

### Option A — SQL (fastest for a big list)

In **SQL Editor**, run one block per household. Example:

```sql
with inv as (
  insert into public.invitations (label) values ('The Craige Household')
  returning id
)
insert into public.guests (invitation_id, full_name, sort_order)
select inv.id, name, ord
from inv, (values ('Gigi Craige', 1), ('Steven Craige', 2)) as g(name, ord);
```

Change the label and the `(name, order)` pairs for each household. A
single-person invite is just one pair.

### Option B — Table Editor (point and click)

1. **Table Editor** → `invitations` → **Insert row**. Set `label`, save. Copy
   the new row's `id`.
2. **Table Editor** → `guests` → **Insert row** for each person, pasting that
   `id` into `invitation_id` and typing their `full_name`.

> The example block at the bottom of `schema.sql` is commented out. You can
> uncomment it to load the Craige test household while you build, then delete
> those rows later from the Table Editor.

## 6. See who's replied

Anytime, open **Table Editor → `guests`**. The `attending` column shows the
answers: `true` = coming, `false` = can't make it, empty = hasn't replied yet.
`responded_at` shows when they last saved.

For a quick summary, run this in the SQL Editor:

```sql
select i.label,
       count(*)                                   as on_invite,
       count(*) filter (where g.attending)        as coming,
       count(*) filter (where g.attending = false) as declined,
       count(*) filter (where g.attending is null) as no_reply
from public.guests g
join public.invitations i on i.id = g.invitation_id
group by i.label
order by i.label;
```
