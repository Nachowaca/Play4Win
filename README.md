# PLAY4Win

Tu consola de descuentos gamer oficial. Plataforma que trackea tu progreso en Steam, Epic Games y PlayStation, y convierte tus horas jugadas en descuentos reales en esas mismas tiendas.

## Qué tiene este prototipo

- **Login/registro** con Google como opción principal, y Steam / Epic / PlayStation Store como accesos alternativos.
- **Dashboard de progreso**: horas jugadas, logros y juegos trackeados por plataforma.
- **Ranking semanal** entre jugadores.
- **Sistema de tiers y recompensas**: subís de nivel jugando y desbloqueás códigos de descuento reales (Steam, Epic, PSN), con estado de bloqueado/desbloqueado y copiado de código.

## Estructura del proyecto

```
play4win-repo/
├── README.md                    -> este archivo
├── DATA_ROOM_CHECKLIST.md       -> qué falta armar para vender/asociarse con empresas de gaming
├── LICENSE                      -> MIT
├── src/
│   ├── App.jsx                  -> raíz: controla qué pantalla se muestra
│   ├── theme/                   -> tokens de marca y estilos globales
│   ├── data/                    -> datos mock (plataformas, ranking, recompensas)
│   ├── utils/                   -> helpers (formateo de números, etc.)
│   ├── components/
│   │   ├── brand/                -> logo, isotipo, marca de Google
│   │   └── ui/                   -> primitivas compartidas (labels, dividers)
│   └── screens/
│       ├── login/                -> pantalla de login/registro y sus piezas
│       └── dashboard/            -> pantalla de dashboard y sus piezas
├── backend/
│   ├── schema.sql                -> esquema de base de datos con seguridad por diseño
│   └── SECURITY.md               -> arquitectura de backend, auth, encriptación, derecho de borrado
└── docs/
    └── Play4Win_Plan_IA.pptx     -> deck de arquitectura de IA (qué usa Claude vs. modelos clásicos)
```

Todo lo que vayamos armando de acá en más (nuevos docs, decks, código) suma
a esta misma carpeta — es el lugar único con la verdad del proyecto.

## Stack

- React, componentes chicos con responsabilidad única (ver `src/`)
- Tailwind (utilidades core)
- [lucide-react](https://lucide.dev) para íconos
- Backend recomendado: Supabase (Postgres + Auth + Row Level Security) — ver `backend/SECURITY.md`

## Estado

Prototipo funcional con datos mock. Los datos de plataformas, ranking y recompensas están en `src/data/mockData.js`, listos para reemplazarse por las APIs reales de Steam / Epic / PSN.

## Licencia

MIT — ver `LICENSE`.
