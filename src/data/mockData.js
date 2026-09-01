// Datos de referencia (mock — en producción vienen de las APIs de Steam / Epic / PSN).

export const AUTH_TABS = [
  { id: "login", label: "Iniciar sesión" },
  { id: "register", label: "Crear cuenta" },
];

export const PLATFORM_PROVIDERS = [
  { id: "steam", label: "Steam", color: "#66C0F4" },
  { id: "psn", label: "PlayStation", color: "#0070D1" },
  { id: "epic", label: "Epic Games", color: "#CFCFCF" },
];

export const PLATFORM_STATS = [
  { id: "steam", name: "Steam", color: "#66C0F4", hours: 214, games: 18, achievements: 132 },
  { id: "epic", name: "Epic Games", color: "#A6A6A6", hours: 76, games: 6, achievements: 41 },
  { id: "psn", name: "PlayStation", color: "#0070D1", hours: 143, games: 11, achievements: 87 },
];

export const LEADERBOARD = [
  { rank: 1, name: "kurwa_uy", xp: 18420, tier: "Platino" },
  { rank: 2, name: "negra_del_8bit", xp: 17110, tier: "Platino" },
  { rank: 3, name: "vos", xp: 15980, tier: "Oro", isUser: true },
  { rank: 4, name: "elGordoFrag", xp: 14200, tier: "Oro" },
  { rank: 5, name: "pixelRauch", xp: 12750, tier: "Oro" },
];

export const REWARDS = [
  { id: "r1", platform: "Steam", label: "15% en tu próxima compra", code: "NIVEL15-STM", tier: "Oro", unlocked: true },
  { id: "r2", platform: "Epic Games", label: "10% en el catálogo indie", code: "NIVEL10-EPC", tier: "Oro", unlocked: true },
  { id: "r3", platform: "PlayStation Store", label: "20% en un juego de tu wishlist", code: "NIVEL20-PSN", tier: "Platino", unlocked: false },
];

export const USER = { name: "vos", xp: 15980, xpToNext: 18000, tier: "Oro", rank: 3, totalPlayers: 4820 };
