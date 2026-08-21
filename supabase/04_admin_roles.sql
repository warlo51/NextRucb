-- =============================================================================
-- 04_admin_roles.sql — Droits par section pour les administrateurs
-- =============================================================================
-- À exécuter dans Supabase → SQL Editor (après 01_, 02_, 03_).
-- Le script est idempotent : on peut le rejouer sans risque.
--
-- Principe : chaque utilisateur Supabase Auth qui doit accéder à /admin a une
-- ligne dans `admin_profile`. Deux rôles :
--   • superadmin → accès total + gestion des autres admins
--   • editeur    → accès uniquement aux sections listées dans `sections`
--
-- L'ACL est appliquée par la RLS (pas seulement par l'UI) : même en appelant
-- l'API Supabase directement avec la clé anon, un éditeur ne peut écrire que
-- dans les tables/buckets de ses sections.
-- =============================================================================

-- 1) TABLE --------------------------------------------------------------------
create table if not exists public.admin_profile (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  nom        text,
  role       text not null default 'editeur' check (role in ('superadmin', 'editeur')),
  sections   text[] not null default '{}',
  actif      boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.admin_profile is 'Droits d''accès au panel /admin, section par section.';
comment on column public.admin_profile.sections is 'Clés de sections autorisées (ignoré si role = superadmin).';

-- Supabase accorde déjà ces droits par défaut sur les nouvelles tables de
-- `public` ; on les pose explicitement pour ne pas en dépendre.
grant select, insert, update, delete on public.admin_profile to authenticated;

-- 2) HELPERS ------------------------------------------------------------------
-- SECURITY DEFINER : les politiques RLS peuvent interroger admin_profile sans
-- déclencher la RLS de cette même table (récursion infinie).

create or replace function public.admin_is_superadmin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.admin_profile p
    where p.user_id = auth.uid() and p.actif and p.role = 'superadmin'
  );
$$;

create or replace function public.admin_can(section text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.admin_profile p
    where p.user_id = auth.uid()
      and p.actif
      and (p.role = 'superadmin' or section = any (p.sections))
  );
$$;

-- Buckets de stockage → section correspondante.
create or replace function public.admin_can_bucket(bucket text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select case bucket
    when 'actus'       then public.admin_can('actus')
    when 'partenaires' then public.admin_can('partenaires')
    when 'comite'      then public.admin_can('comite')
    when 'entraineurs' then public.admin_can('entraineurs')
    when 'complexe'    then public.admin_can('complexe')
    when 'mini-basket' then public.admin_can('minibasket')
    when 'bandeau'     then public.admin_can('bandeau')
    -- « dossiers » sert à la fois au dossier de licence (planning)
    -- et au dossier de partenariat (partenaires).
    when 'dossiers'    then public.admin_can('planning') or public.admin_can('partenaires')
    else true -- bucket inconnu : on ne bloque pas
  end;
$$;

grant execute on function public.admin_is_superadmin() to anon, authenticated;
grant execute on function public.admin_can(text)       to anon, authenticated;
grant execute on function public.admin_can_bucket(text) to anon, authenticated;

-- 3) GARDE-FOU : ne jamais perdre le dernier superadmin ------------------------
create or replace function public.admin_profile_guard()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  uid       uuid;
  remaining int;
begin
  if tg_op = 'DELETE' then uid := old.user_id; else uid := new.user_id; end if;

  select count(*) into remaining
  from public.admin_profile
  where role = 'superadmin' and actif and user_id <> uid;

  if remaining = 0 then
    if tg_op = 'DELETE' then
      raise exception 'Impossible de supprimer le dernier superadmin actif.';
    elsif new.role <> 'superadmin' or not new.actif then
      raise exception 'Impossible de retirer les droits du dernier superadmin actif.';
    end if;
  end if;

  if tg_op = 'DELETE' then return old; else return new; end if;
end;
$$;

drop trigger if exists admin_profile_guard on public.admin_profile;
create trigger admin_profile_guard
  before update or delete on public.admin_profile
  for each row
  when (old.role = 'superadmin' and old.actif)
  execute function public.admin_profile_guard();

-- 4) RLS SUR admin_profile ----------------------------------------------------
alter table public.admin_profile enable row level security;

drop policy if exists admin_profile_read      on public.admin_profile;
drop policy if exists admin_profile_insert    on public.admin_profile;
drop policy if exists admin_profile_update    on public.admin_profile;
drop policy if exists admin_profile_delete    on public.admin_profile;

-- Chacun lit sa propre fiche ; un superadmin lit tout le monde.
create policy admin_profile_read on public.admin_profile
  for select to authenticated
  using (user_id = auth.uid() or public.admin_is_superadmin());

create policy admin_profile_insert on public.admin_profile
  for insert to authenticated with check (public.admin_is_superadmin());

create policy admin_profile_update on public.admin_profile
  for update to authenticated
  using (public.admin_is_superadmin()) with check (public.admin_is_superadmin());

create policy admin_profile_delete on public.admin_profile
  for delete to authenticated using (public.admin_is_superadmin());

-- 5) RLS SUR LES TABLES DE CONTENU --------------------------------------------
-- Lecture publique conservée (le site public lit avec la clé anon) ;
-- écriture réservée aux admins ayant la section correspondante.
do $$
declare
  m record;
  p record;
begin
  for m in
    select * from (values
      ('creneau',          'planning'),
      ('creneau_equipe',   'planning'),
      ('gymnase',          'planning'),
      ('licence_file',     'planning'),
      ('actu',             'actus'),
      ('partenaire',       'partenaires'),
      ('sponsor_file',     'partenaires'),
      ('comite',           'comite'),
      ('entraineur',       'entraineurs'),
      ('entraineur_equipe','entraineurs'),
      ('formation',        'formation'),
      ('historique',       'historique'),
      ('complexe_photo',   'complexe'),
      ('mini_photo',       'minibasket'),
      ('mini_evenement',   'minibasket'),
      ('mini_plateau',     'minibasket'),
      ('mecenat',          'mecenat'),
      ('equipe',           'equipe'),
      ('equipe_resultat',  'resultats'),
      ('bandeau',          'bandeau'),
      ('theme_settings',   'themes'),
      ('theme_schedules',  'themes')
    ) as t(tbl, sect)
  loop
    if to_regclass('public.' || m.tbl) is null then
      raise notice 'Table public.% absente — ignorée.', m.tbl;
      continue;
    end if;

    execute format('alter table public.%I enable row level security', m.tbl);

    -- On repart d'un état propre : les anciennes politiques « tout
    -- authentifié peut écrire » seraient sinon cumulées (OR) avec les nouvelles.
    for p in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = m.tbl
    loop
      execute format('drop policy %I on public.%I', p.policyname, m.tbl);
    end loop;

    execute format(
      'create policy %I on public.%I for select using (true)',
      m.tbl || '_public_read', m.tbl);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.admin_can(%L))',
      m.tbl || '_admin_insert', m.tbl, m.sect);
    execute format(
      'create policy %I on public.%I for update to authenticated using (public.admin_can(%L)) with check (public.admin_can(%L))',
      m.tbl || '_admin_update', m.tbl, m.sect, m.sect);
    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.admin_can(%L))',
      m.tbl || '_admin_delete', m.tbl, m.sect);
  end loop;
end;
$$;

-- 6) RLS SUR LE STOCKAGE ------------------------------------------------------
-- Politiques RESTRICTIVE : elles se combinent en AND avec les politiques
-- existantes de storage.objects, donc pas besoin de connaître/supprimer
-- ce que les scripts précédents ont créé.
drop policy if exists rucb_bucket_insert on storage.objects;
drop policy if exists rucb_bucket_update on storage.objects;
drop policy if exists rucb_bucket_delete on storage.objects;

create policy rucb_bucket_insert on storage.objects
  as restrictive for insert to authenticated
  with check (public.admin_can_bucket(bucket_id));

create policy rucb_bucket_update on storage.objects
  as restrictive for update to authenticated
  using (public.admin_can_bucket(bucket_id))
  with check (public.admin_can_bucket(bucket_id));

create policy rucb_bucket_delete on storage.objects
  as restrictive for delete to authenticated
  using (public.admin_can_bucket(bucket_id));

-- 7) AMORÇAGE -----------------------------------------------------------------
-- Les comptes qui existent déjà ont aujourd'hui un accès total : on préserve
-- exactement ce comportement en les passant superadmin. À exécuter une fois.
insert into public.admin_profile (user_id, email, nom, role, sections)
select u.id, u.email, split_part(coalesce(u.email, ''), '@', 1), 'superadmin', '{}'
from auth.users u
on conflict (user_id) do nothing;
