-- ============================================================================
-- Play4Win — Esquema de base de datos (PostgreSQL / Supabase)
-- Diseñado con seguridad desde el modelo, no como capa agregada después.
-- ============================================================================

create extension if not exists pgcrypto; -- para gen_random_uuid()

-- ----------------------------------------------------------------------------
-- users
-- Identidad mínima. Nunca guardamos contraseñas: todo el login es OAuth.
-- deleted_at habilita "soft delete" — el usuario pide borrado, se marca acá,
-- y un job programado hace el borrado real (hard delete) a los N días,
-- cumpliendo el derecho de borrado de la Ley 18.331 con margen para
-- arrepentimiento / disputas de facturación.
-- ----------------------------------------------------------------------------
create table users (
  id uuid primary key default gen_random_uuid(),
  google_sub text unique not null,        -- ID de Google, no el email en crudo como clave
  email text not null,
  display_name text,
  created_at timestamptz not null default now(),
  deleted_at timestamptz                  -- null = cuenta activa
);

-- ----------------------------------------------------------------------------
-- platform_connections
-- Los tokens NUNCA se guardan en texto plano. Se encriptan a nivel de
-- aplicación (AES-256, clave gestionada por KMS) antes de llegar acá —
-- esta columna ya recibe el valor cifrado, la base nunca ve el token real.
-- El scope guardado sirve de evidencia de qué permisos se pidieron
-- (auditoría de consentimiento).
-- ----------------------------------------------------------------------------
create table platform_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  platform text not null check (platform in ('steam', 'epic', 'psn')),
  oauth_access_token_encrypted bytea not null,
  oauth_refresh_token_encrypted bytea,
  granted_scope text not null,            -- ej: 'read:library,read:achievements'
  connected_at timestamptz not null default now(),
  revoked_at timestamptz,                 -- se llena cuando el usuario desconecta la plataforma
  unique (user_id, platform)
);

-- ----------------------------------------------------------------------------
-- progress_snapshots
-- Datos AGREGADOS por plataforma (horas, juegos, logros) — nunca el detalle
-- de cada sesión de juego. Esto reduce la superficie de datos sensibles:
-- si se filtra esta tabla, no hay un historial de actividad minuto a minuto.
-- ----------------------------------------------------------------------------
create table progress_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  platform text not null check (platform in ('steam', 'epic', 'psn')),
  hours_played integer not null default 0,
  games_count integer not null default 0,
  achievements_count integer not null default 0,
  captured_at timestamptz not null default now()
);
create index idx_progress_user on progress_snapshots(user_id, captured_at desc);

-- ----------------------------------------------------------------------------
-- tier_history
-- Cada cambio de tier queda registrado — permite auditar por qué a alguien
-- se le desbloqueó un descuento, y alimenta el modelo de detección de
-- anomalías (subidas de XP demasiado rápidas para ser orgánicas).
-- ----------------------------------------------------------------------------
create table tier_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  tier text not null,
  xp integer not null,
  changed_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- rewards_catalog
-- El catálogo de recompensas disponibles. No tiene datos de usuario.
-- ----------------------------------------------------------------------------
create table rewards_catalog (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('steam', 'epic', 'psn')),
  label text not null,
  discount_pct integer not null,
  min_tier text not null,
  active boolean not null default true
);

-- ----------------------------------------------------------------------------
-- reward_redemptions
-- El código en sí (code_issued) es sensible por ser canjeable — se trata
-- como un secreto: se muestra una sola vez en el frontend y no se vuelve
-- a exponer en logs ni en respuestas de API salvo al dueño de la cuenta.
-- ----------------------------------------------------------------------------
create table reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  reward_id uuid not null references rewards_catalog(id),
  code_issued text not null,
  claimed_at timestamptz not null default now(),
  redeemed_at timestamptz                 -- null hasta que se confirma el uso en la tienda
);

-- ----------------------------------------------------------------------------
-- audit_log
-- Registro de acciones sensibles (conexión/desconexión de plataforma,
-- solicitud de borrado de cuenta, acceso de administrador a datos de un
-- usuario). No es un log de toda la actividad — es específicamente para
-- rendir cuentas si alguna vez hay que responder "¿quién tocó qué y cuándo?".
-- ----------------------------------------------------------------------------
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_type text not null check (actor_type in ('user', 'system', 'admin')),
  actor_id uuid,
  action text not null,                   -- ej: 'platform.connect', 'account.delete_requested'
  target_table text,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security (RLS) — cada usuario solo puede ver/tocar sus propias
-- filas. Esto es la red de seguridad de fondo: aunque un bug en el backend
-- arme mal una query, la base misma rechaza el acceso a datos ajenos.
-- ============================================================================

alter table platform_connections enable row level security;
alter table progress_snapshots enable row level security;
alter table tier_history enable row level security;
alter table reward_redemptions enable row level security;

create policy "usuarios ven solo sus conexiones"
  on platform_connections for select
  using (user_id = auth.uid());

create policy "usuarios ven solo su progreso"
  on progress_snapshots for select
  using (user_id = auth.uid());

create policy "usuarios ven solo su historial de tier"
  on tier_history for select
  using (user_id = auth.uid());

create policy "usuarios ven solo sus canjes"
  on reward_redemptions for select
  using (user_id = auth.uid());

-- rewards_catalog y audit_log no llevan RLS de usuario: el catálogo es público
-- de lectura, y el audit_log solo lo lee el rol de servicio/admin (nunca el cliente).
