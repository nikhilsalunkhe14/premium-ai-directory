This folder contains SQL snippets for manual application to your Supabase database.

## 1. Create `affiliate_clicks` Table

Track outbound affiliate clicks for analytics:

```sql
create table public.affiliate_clicks (
  id bigint generated always as identity primary key,
  tool_id text,
  affiliate_url text not null,
  user_agent text null,
  referrer text null,
  created_at timestamptz not null default now()
);
```

## 2. Add `approved` Column to `tool_submissions`

Enable admin approval workflow:

```sql
alter table public.tool_submissions
  add column approved boolean default false;
```

## 3. Configure Row Level Security (RLS)

RLS protects your database by enforcing row-level access control. Since this app uses a **service role key** for admin operations (which bypasses RLS), the policies below are primarily for public read access and optional authenticated writes.

### Enable RLS on all tables:

```sql
alter table public.tool_submissions enable row level security;
alter table public.tools enable row level security;
alter table public.affiliate_clicks enable row level security;
```

### Allow Public Reads and Tool Submissions:

```sql
-- Public users can read published tools
create policy "public_read_tools" on public.tools
  for select using (true);

-- Public users can submit new tools (inserts only, not updates)
create policy "public_insert_submissions" on public.tool_submissions
  for insert with (true);
```

### Optional: Authenticated Admin Policies

If you migrate admin authentication to Supabase Auth in the future (instead of using service role), add these policies:

```sql
-- Authenticated admins can update and delete submissions
create policy "admin_update_submissions" on public.tool_submissions
  for update using (auth.role() = 'authenticated') with check (true);

create policy "admin_delete_submissions" on public.tool_submissions
  for delete using (auth.role() = 'authenticated');
```

### Affiliate Clicks Tracking:

```sql
-- Allow public inserts for affiliate click tracking
create policy "public_track_clicks" on public.affiliate_clicks
  for insert with (true);

-- Allow admin reads for analytics (via service role)
-- No explicit policy needed; service role bypasses RLS
```

## Current Setup

- **Admin Operations**: Use `SUPABASE_SERVICE_ROLE_KEY` in server routes (e.g., `/api/admin/submissions/[id]/route.ts`)
- **Public Operations**: Use anon key for reads and submissions
- **Service Role Bypass**: Admin operations with service role key automatically bypass all RLS policies

## Testing RLS

Verify policies work correctly:

```sql
-- Test: Public user can read tools (via anon key)
select * from public.tools limit 1;

-- Test: Public user can insert submissions (via anon key)
insert into public.tool_submissions (name, website, category, pricing, description)
  values ('Test Tool', 'https://test.com', 'Testing', 'Free', 'Test');

-- Test: Admin can update/delete (via service role key, bypasses RLS)
-- No explicit RLS test needed; service role always has access
```

Run these in the Supabase SQL editor for your project.
