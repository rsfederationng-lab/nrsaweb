-- NRSA Supabase RLS hardening
-- Run this once in the Supabase SQL editor. It is safe to run repeatedly.
-- The Express server uses the service_role key, which bypasses RLS. Public
-- access is limited to intentionally public reads and form submissions.

do $$
begin
  if to_regclass('public.admins') is not null
    and not exists (
      select 1 from pg_constraint
      where conrelid = 'public.admins'::regclass
        and conname = 'admins_nrsa_email_check'
    ) then
    alter table public.admins
      add constraint admins_nrsa_email_check
      check (email ~* '^[^[:space:]@]+@nrsa[.]com[.]ng$');
  end if;
end $$;

do $$
declare
  table_name text;
  policy_name record;
begin
  foreach table_name in array array[
    'admins', 'users', 'affiliations', 'ambassadors', 'clubs', 'contacts',
    'events', 'featured_banners', 'hero_slides', 'interschool_news',
    'interschool_years', 'school_activations', 'school_registrations',
    'school_standings', 'championship_phases', 'leaders', 'media',
    'member_states', 'news', 'players', 'site_settings', 'store_products',
    'store_orders', 'store_order_items', 'subscribers'
  ] loop
    if to_regclass('public.' || table_name) is not null then
      execute format('alter table public.%I enable row level security', table_name);
      for policy_name in
        select policyname from pg_policies
        where schemaname = 'public' and tablename = table_name
      loop
        execute format('drop policy if exists %I on public.%I', policy_name.policyname, table_name);
      end loop;
    end if;
  end loop;
end $$;

-- Public content: read-only to anonymous/authenticated clients.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'affiliations', 'ambassadors', 'clubs', 'events', 'hero_slides',
    'interschool_news', 'interschool_years', 'school_activations',
    'school_standings', 'championship_phases', 'leaders', 'media',
    'member_states', 'news', 'players'
  ] loop
    if to_regclass('public.' || table_name) is not null then
      execute format(
        'create policy %I on public.%I for select to anon, authenticated using (true)',
        table_name || '_public_read', table_name
      );
    end if;
  end loop;
end $$;

-- Homepage banner and store products are public only when active.
do $$
begin
  if to_regclass('public.featured_banners') is not null then
    create policy featured_banners_public_read on public.featured_banners
      for select to anon, authenticated
      using (
        is_active = true
        and (start_date is null or start_date <= now())
        and (end_date is null or end_date >= now())
      );
  end if;
  if to_regclass('public.store_products') is not null then
    create policy store_products_public_read on public.store_products
      for select to anon, authenticated using (is_active = true);
  end if;
end $$;

-- Public forms may submit data, but may not read, modify, or delete it.
do $$
begin
  if to_regclass('public.contacts') is not null then
    create policy contacts_public_insert on public.contacts
      for insert to anon, authenticated with check (true);
  end if;
  if to_regclass('public.school_registrations') is not null then
    create policy school_registrations_public_insert on public.school_registrations
      for insert to anon, authenticated with check (true);
  end if;
  if to_regclass('public.subscribers') is not null then
    create policy subscribers_public_insert on public.subscribers
      for insert to anon, authenticated with check (true);
  end if;
end $$;

-- Sensitive tables intentionally have no anon/authenticated policies.
-- service_role continues to manage them through the trusted Express server:
-- admins, users, contacts (read/update/delete), school_registrations,
-- subscribers (read/delete), site_settings, featured_banners, store_products,
-- store_orders, store_order_items.
