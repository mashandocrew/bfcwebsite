-- ================================================================
-- BFC · SUPABASE SETUP — SCRIPT COMPLETO Y CORREGIDO
-- Supabase Dashboard → SQL Editor → New query → Run All
--
-- Funciona sobre bases de datos nuevas O ya existentes.
-- Idempotente: se puede correr más de una vez sin problemas.
-- ================================================================


-- ════════════════════════════════════════════════
-- SECCIÓN 1 — TABLA site_reviews
-- ════════════════════════════════════════════════

create table if not exists public.site_reviews (
  id          uuid         primary key default gen_random_uuid(),
  author_name text         not null,
  discipline  text,
  rating      smallint     not null default 5,
  review_text text         not null default '',
  approved    boolean      not null default false,
  created_at  timestamptz  not null default now()
);

-- Añade columnas faltantes si la tabla ya existía con esquema viejo
alter table public.site_reviews add column if not exists author_name text;
alter table public.site_reviews add column if not exists review_text text;
alter table public.site_reviews add column if not exists discipline  text;
alter table public.site_reviews add column if not exists approved    boolean not null default false;

-- Elimina restricción NOT NULL de discipline (idempotente si ya es nullable)
alter table public.site_reviews alter column discipline drop not null;


-- ════════════════════════════════════════════════
-- SECCIÓN 2 — TABLA community_photos
-- ════════════════════════════════════════════════

create table if not exists public.community_photos (
  id         bigserial    primary key,
  url        text         not null,
  category   text,
  author     text,
  approved   boolean      not null default false,
  created_at timestamptz  not null default now()
);


-- ════════════════════════════════════════════════
-- SECCIÓN 3 — TABLA contact_leads
-- ════════════════════════════════════════════════

create table if not exists public.contact_leads (
  id             bigserial   primary key,
  nombre         text        not null,
  edad           integer,
  modalidad      text,
  franja_horaria text,
  created_at     timestamptz not null default now()
);


-- ════════════════════════════════════════════════
-- SECCIÓN 4 — ROW LEVEL SECURITY
-- ════════════════════════════════════════════════

alter table public.site_reviews     enable row level security;
alter table public.community_photos enable row level security;
alter table public.contact_leads    enable row level security;


-- ════════════════════════════════════════════════
-- SECCIÓN 5 — POLÍTICAS (drop + recreate para evitar conflictos)
-- ════════════════════════════════════════════════

-- site_reviews
drop policy if exists "read_reviews"   on public.site_reviews;
drop policy if exists "insert_reviews" on public.site_reviews;

create policy "read_reviews"
  on public.site_reviews for select using (approved = true);

create policy "insert_reviews"
  on public.site_reviews for insert with check (true);

-- community_photos
drop policy if exists "read_photos"         on public.community_photos;
drop policy if exists "insert_photos"       on public.community_photos;
drop policy if exists "admin_update_photos" on public.community_photos;
drop policy if exists "admin_delete_photos" on public.community_photos;

create policy "read_photos"
  on public.community_photos for select using (true);

create policy "insert_photos"
  on public.community_photos for insert with check (true);

create policy "admin_update_photos"
  on public.community_photos for update using (true) with check (true);

create policy "admin_delete_photos"
  on public.community_photos for delete using (true);

-- contact_leads
drop policy if exists "insert_leads" on public.contact_leads;

create policy "insert_leads"
  on public.contact_leads for insert with check (true);


-- ════════════════════════════════════════════════
-- SECCIÓN 6 — RESEÑAS REALES
-- Solo inserta si no hay ninguna reseña aprobada todavía.
-- ════════════════════════════════════════════════

do $$
begin
  if not exists (select 1 from public.site_reviews where approved = true limit 1) then
    insert into public.site_reviews (author_name, review_text, rating, discipline, approved) values
      (
        'Francisco Farjo',
        'Excelente academia, muy buena ubicación y un espacio amplio como pocas academias, además de muy buena predisposición del profesor y un ambiente de compañerismo muy presente la verdad que 10/10.',
        5, 'General', true
      ),
      (
        'Pablo Badui',
        'Más que una academia una familia de luchadores, desde los nuevos hasta los profesionales entrenando a la par en el mismo tatami. El verdadero espíritu del guerrero.',
        5, 'General', true
      ),
      (
        'Fernando Tabarelli',
        'Muy profesionales, se preocupan que cada alumno logre lo que se propuso al ingresar. Muy buen ambiente.',
        5, 'General', true
      ),
      (
        'Fernando Vater',
        'Excelente atención, totalmente limpio y con constantes innovaciones y mejoras, clases personalizadas de alto nivel, el profe Walter Bonati un apasionado y 100% dedicado a sus alumnos.',
        5, 'General', true
      );
    raise notice '✓ 4 reseñas insertadas correctamente.';
  else
    raise notice '✓ Ya hay reseñas aprobadas — no se insertó nada.';
  end if;
end $$;


-- ════════════════════════════════════════════════
-- VERIFICACIÓN FINAL (corre automático al terminar)
-- ════════════════════════════════════════════════

select id, author_name, rating, approved, created_at
  from public.site_reviews
  order by created_at;
