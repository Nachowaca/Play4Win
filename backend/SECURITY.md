# Play4Win — Arquitectura de backend y seguridad

Este documento complementa a `schema.sql`. Explica las decisiones de stack y las
medidas de seguridad por capa, para que cualquiera (un socio técnico, un
inversor, una empresa de gaming evaluando integrar) entienda cómo se protegen
los datos sin tener que leer código.

## Stack recomendado

**Supabase (Postgres + Auth + Row Level Security) + un backend liviano
(Node/Express o funciones serverless) para la lógica de negocio.**

¿Por qué esta combinación y no armar todo desde cero?
- Row Level Security de Postgres ya resuelve gran parte del aislamiento de
  datos entre usuarios (ver `schema.sql`), sin tener que confiar 100% en que
  el código del backend nunca tenga un bug de autorización.
- Supabase Auth maneja el flujo OAuth de Google de forma estándar y probada,
  en vez de reinventar manejo de sesiones.
- Permite moverse rápido (consistente con cómo trabajás) sin sacrificar las
  prácticas de seguridad de fondo — no es "elegir velocidad en vez de
  seguridad", es que la herramienta ya trae la seguridad incorporada.

Los OAuth de Steam/Epic/PSN sí necesitan lógica propia (no son parte de
Supabase Auth), así que esos flujos viven en el backend liviano.

## Capas y qué protege cada una

### 1. Autenticación
- Google: OAuth 2.0 estándar vía Supabase Auth.
- Steam / Epic / PSN: OAuth propio de cada plataforma, con scope de **solo
  lectura** de biblioteca/logros — nunca wallet ni compras.
- Sesión del usuario: JWT de corta duración (15 min) + refresh token en
  cookie `httpOnly` + `Secure` + `SameSite=Strict` (no accesible desde
  JavaScript del cliente, mitiga robo de sesión vía XSS).

### 2. Tokens de las plataformas (el dato más sensible que manejamos)
- Se encriptan a nivel de aplicación (AES-256) **antes** de tocar la base —
  la base nunca almacena el token en texto plano, ni siquiera un admin con
  acceso a la base puede leerlos directo.
- La clave de encriptación vive en un gestor de secretos (no en el código,
  no en variables de entorno del repo) — ej. AWS KMS, Doppler, o el vault de
  Supabase.
- Rotación: cuando el usuario desconecta una plataforma, el token se
  revoca del lado de la plataforma (no solo se borra localmente) y se
  registra en `audit_log`.

### 3. Base de datos
- Row Level Security en todas las tablas con datos de usuario (ver
  `schema.sql`) — un usuario autenticado solo puede leer sus propias filas,
  reforzado a nivel de base, no solo a nivel de código de la API.
- El rol de servicio que usa el backend tiene permisos mínimos: puede
  leer/escribir en las tablas que necesita, no puede `DROP` ni `ALTER`.
- Backups encriptados, con proceso de restauración probado (un backup que
  nunca se probó restaurar no es un backup confiable).

### 4. API
- Rate limiting por usuario e IP — evita que alguien vacíe la base pidiendo
  datos en loop, o fuerce bruta el sistema de canje de códigos.
- Todo el tráfico sobre HTTPS/TLS, sin excepciones.
- Los IDs que se le pasan a la IA (para normalización de catálogo o
  generación de mensajes, ver el plan de IA) son referencias internas
  anonimizadas — nunca el `user_id` real ni datos de contacto.

### 5. Observabilidad y respuesta a incidentes
- `audit_log` registra acciones sensibles: conexión/desconexión de
  plataforma, solicitud de borrado de cuenta, accesos administrativos.
- Los logs de aplicación **nunca** incluyen tokens, códigos de descuento
  sin canjear, ni el email completo del usuario.
- Alertas automáticas sobre patrones anómalos (esto conecta directo con el
  modelo de detección de fraude del plan de IA: picos de horas jugadas
  imposibles, muchos canjes desde la misma sesión, etc.).
- Runbook básico de incidente: si hay una filtración, primero se revoca
  todo token activo del alcance afectado, después se notifica según lo que
  exige la Ley 18.331, y recién después se investiga la causa raíz — en ese
  orden, para minimizar daño mientras se diagnostica.

## Derecho de borrado (Ley 18.331) — cómo se implementa técnicamente

1. El usuario pide borrado de cuenta desde la app.
2. Se marca `users.deleted_at` (soft delete) — la cuenta deja de ser
   funcional de inmediato, pero los datos no se destruyen todavía.
3. Un job programado, pasados N días (a definir — recomendable 30), hace
   el borrado real: elimina la fila de `users`, lo cual en cascada borra
   `platform_connections`, `progress_snapshots`, `tier_history` y
   `reward_redemptions` (todas tienen `on delete cascade` en el esquema).
4. `audit_log` conserva un registro de que la cuenta fue borrada — sin
   datos personales, solo el hecho y la fecha — como evidencia de
   cumplimiento.

## Qué falta definir (próximos pasos técnicos)

- Elegir el proveedor de gestión de secretos definitivo.
- Definir el N de días del período de gracia antes del hard delete.
- Armar el runbook de incidente completo (a quién se notifica primero,
  plantilla de comunicación a usuarios).
- Pentesting básico antes de manejar datos de usuarios reales en producción.
