import { useState } from "react";
import {
  Gamepad2,
  ChevronRight,
  Sparkles,
  Trophy,
  Flame,
  Percent,
  Check,
  Copy,
  Crown,
  Lock,
  LogOut,
} from "lucide-react";

// ======================================================================
// Play4Win — flujo completo: Login/Registro → Dashboard de progreso y premios
// ======================================================================

// ---- Tokens de marca compartidos por las dos pantallas ----
const TOKENS = {
  "--bg": "#0B0D17",
  "--panel": "#12152388",
  "--border": "#ffffff14",
  "--cyan": "#00E5FF",
  "--green": "#39FF88",
  "--magenta": "#FF3EA5",
  "--text": "#F2F4F8",
  "--muted": "#8891A6",
  fontFamily: "Arial, -apple-system, BlinkMacSystemFont, sans-serif",
  color: "#F2F4F8", // blanco como base de todo el texto; solo los datos numéricos lo sobreescriben
};

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&display=swap');

  .p4-brand-font { font-family: 'Baloo 2', Arial, sans-serif; }
  .p4-mono { font-family: Consolas, 'SF Mono', ui-monospace, monospace; }
  .p4-muted { color: var(--muted); }

  .p4-scan {
    background-image: repeating-linear-gradient(
      0deg, #ffffff05 0px, #ffffff05 1px, transparent 1px, transparent 3px
    );
  }
  .p4-panel { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; }
  .p4-glow { box-shadow: 0 0 0 1px #ffffff10 inset, 0 20px 60px -20px #00e5ff30; }
  .p4-glow-cyan { box-shadow: 0 0 0 1px var(--cyan) inset, 0 0 24px -8px var(--cyan); }
  .p4-row:hover { background: #ffffff08; }

  .p4-google-btn:hover { background: #f4f4f4; }
  .p4-plat-btn:hover, .p4-tab:hover, .p4-logout-btn:hover { border-color: var(--cyan); }
  .p4-google-btn:focus-visible, .p4-plat-btn:focus-visible,
  .p4-claim-btn:focus-visible, .p4-code-btn:focus-visible {
    outline: 2px solid var(--cyan); outline-offset: 2px;
  }

  .p4-xp-track { background: #ffffff0f; border-radius: 999px; overflow: hidden; }
  .p4-xp-fill {
    background: linear-gradient(90deg, var(--cyan), var(--magenta));
    height: 100%; border-radius: 999px; transition: width 0.6s ease;
  }

  @keyframes p4-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
  .p4-loading-dot { animation: p4-pulse 0.9s ease-in-out infinite; }

  /* ---- Animaciones de presión: todo botón se "hunde" al tocarlo ---- */
  .p4-press {
    transition: transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1),
                filter 0.15s ease, box-shadow 0.15s ease;
  }
  .p4-press:active { transform: scale(0.95); filter: brightness(0.94); }
  .p4-press-lift:hover { transform: translateY(-1px); }
  .p4-press-lift:active { transform: scale(0.96) translateY(0); }

  @keyframes p4-pop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.03); opacity: 1; }
    100% { transform: scale(1); }
  }
  .p4-pop { animation: p4-pop 0.28s cubic-bezier(0.34, 1.56, 0.64, 1); }

  @keyframes p4-logo-glow {
    0%, 100% { box-shadow: 0 0 20px -2px var(--green), 0 0 34px -8px var(--magenta); }
    50% { box-shadow: 0 0 26px 0px var(--green), 0 0 30px -6px var(--magenta); }
  }
  .p4-logo-mark { animation: p4-logo-glow 3.2s ease-in-out infinite; }

  .p4-wordmark { text-shadow: 0 0 14px #39FF8890, 0 0 28px #39FF8850; }
`;

// ---- Datos de referencia (mock — en producción vienen de las APIs) ----
const AUTH_TABS = [
  { id: "login", label: "Iniciar sesión" },
  { id: "register", label: "Crear cuenta" },
];

const PLATFORM_PROVIDERS = [
  { id: "steam", label: "Steam", color: "#66C0F4" },
  { id: "psn", label: "PlayStation", color: "#0070D1" },
  { id: "epic", label: "Epic Games", color: "#CFCFCF" },
];

const PLATFORM_STATS = [
  { id: "steam", name: "Steam", color: "#66C0F4", hours: 214, games: 18, achievements: 132 },
  { id: "epic", name: "Epic Games", color: "#A6A6A6", hours: 76, games: 6, achievements: 41 },
  { id: "psn", name: "PlayStation", color: "#0070D1", hours: 143, games: 11, achievements: 87 },
];

const LEADERBOARD = [
  { rank: 1, name: "kurwa_uy", xp: 18420, tier: "Platino" },
  { rank: 2, name: "negra_del_8bit", xp: 17110, tier: "Platino" },
  { rank: 3, name: "vos", xp: 15980, tier: "Oro", isUser: true },
  { rank: 4, name: "elGordoFrag", xp: 14200, tier: "Oro" },
  { rank: 5, name: "pixelRauch", xp: 12750, tier: "Oro" },
];

const REWARDS = [
  { id: "r1", platform: "Steam", label: "15% en tu próxima compra", code: "NIVEL15-STM", tier: "Oro", unlocked: true },
  { id: "r2", platform: "Epic Games", label: "10% en el catálogo indie", code: "NIVEL10-EPC", tier: "Oro", unlocked: true },
  { id: "r3", platform: "PlayStation Store", label: "20% en un juego de tu wishlist", code: "NIVEL20-PSN", tier: "Platino", unlocked: false },
];

const USER = { name: "vos", xp: 15980, xpToNext: 18000, tier: "Oro", rank: 3, totalPlayers: 4820 };

// ---- Utilidades ----
const formatNumber = (n) => n.toLocaleString("es-UY");

// ======================================================================
// Marca — logo (badge con gradiente verde cyber → magenta) + wordmark
// ======================================================================

function Play4WinMark({ size = 44 }) {
  return (
    <div
      className="p4-logo-mark flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.27,
        background: "linear-gradient(135deg, #39FF88, #FF3EA5)",
      }}
    >
      <Gamepad2 size={size * 0.56} color="#0B0D17" strokeWidth={2.3} />
    </div>
  );
}

function GoogleMark() {
  // Marca abstracta de 4 colores — no el isotipo oficial de Google,
  // para no reproducir la marca registrada, pero se reconoce igual.
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="9" r="7.5" fill="none" stroke="#4285F4" strokeWidth="3" strokeDasharray="11 35" strokeDashoffset="0" />
      <circle cx="9" cy="9" r="7.5" fill="none" stroke="#EA4335" strokeWidth="3" strokeDasharray="11 35" strokeDashoffset="-11" />
      <circle cx="9" cy="9" r="7.5" fill="none" stroke="#FBBC05" strokeWidth="3" strokeDasharray="11 35" strokeDashoffset="-22" />
      <circle cx="9" cy="9" r="7.5" fill="none" stroke="#34A853" strokeWidth="3" strokeDasharray="11 35" strokeDashoffset="-33" />
    </svg>
  );
}

// ---- Primitivas de UI compartidas ----

function SectionLabel({ children }) {
  return <h2 className="text-sm uppercase tracking-wide mb-3 p4-muted">{children}</h2>;
}

function LabeledDivider({ children }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      <span className="text-xs">{children}</span>
      <div className="h-px flex-1" style={{ background: "var(--border)" }} />
    </div>
  );
}

// ======================================================================
// App raíz: controla qué pantalla se muestra
// ======================================================================

export default function Play4WinApp() {
  const [screen, setScreen] = useState("login"); // "login" | "dashboard"

  return (
    <div style={TOKENS} className="min-h-screen w-full">
      <style>{GLOBAL_STYLES}</style>
      <div style={{ background: "var(--bg)" }} className="p4-scan min-h-screen w-full">
        {screen === "login" ? (
          <LoginScreen onAuthenticated={() => setScreen("dashboard")} />
        ) : (
          <DashboardScreen onLogout={() => setScreen("login")} />
        )}
      </div>
    </div>
  );
}

// ======================================================================
// Pantalla 1 — Login / Registro
// ======================================================================

function AuthTabs({ mode, onChange }) {
  return (
    <div className="flex text-sm mb-6 border-b" style={{ borderColor: "var(--border)" }}>
      {AUTH_TABS.map((tab) => {
        const isActive = mode === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="p4-press flex-1 pb-3 font-medium"
            style={{
              color: isActive ? "var(--cyan)" : "var(--text)",
              borderBottom: isActive ? "2px solid var(--cyan)" : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function GoogleButton({ mode, isLoading, onClick }) {
  return (
    <button
      onClick={onClick}
      className="p4-google-btn p4-press p4-press-lift w-full bg-white text-sm font-medium py-3 rounded-lg flex items-center justify-center gap-2.5 transition-colors"
    >
      {isLoading ? (
        <span className="p4-loading-dot p4-mono text-xs" style={{ color: "#6B7280" }}>Conectando…</span>
      ) : (
        <>
          <GoogleMark />
          <span style={{ color: "#1F1F1F" }}>
            {mode === "login" ? "Continuar con Google" : "Registrarte con Google"}
          </span>
        </>
      )}
    </button>
  );
}

function ProviderButton({ provider, isLoading, onClick }) {
  return (
    <button
      onClick={onClick}
      className="p4-plat-btn p4-press p4-press-lift w-full text-sm py-2.5 rounded-lg flex items-center justify-between px-4 border transition-colors"
      style={{ borderColor: "var(--border)" }}
    >
      <span className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full" style={{ background: provider.color }} />
        {isLoading ? (
          <span className="p4-loading-dot p4-mono text-xs p4-muted">Conectando…</span>
        ) : (
          provider.label
        )}
      </span>
      <ChevronRight size={15} className="p4-muted" />
    </button>
  );
}

function LoginScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [loadingProvider, setLoadingProvider] = useState(null);

  function handleProvider(id) {
    setLoadingProvider(id);
    setTimeout(() => {
      setLoadingProvider(null);
      onAuthenticated();
    }, 900);
  }

  return (
    <div className="flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        {/* Marca */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <Play4WinMark size={48} />
          </div>
          <h1 className="p4-wordmark p4-brand-font text-2xl tracking-tight mb-2">Play4Win</h1>
          <p className="text-sm leading-relaxed max-w-[280px]">
            Tu consola de descuentos, cuanto más ganador sos en tus juegos mejores descuentos, demos exclusivas, pre compras anticipadas y mucho más.
          </p>
        </div>

        {/* Card de acceso */}
        <div className="p4-panel p4-glow p-6 sm:p-7">
          <AuthTabs mode={mode} onChange={setMode} />

          <GoogleButton
            mode={mode}
            isLoading={loadingProvider === "google"}
            onClick={() => handleProvider("google")}
          />

          <LabeledDivider>o con tu cuenta de plataforma</LabeledDivider>

          <div className="flex flex-col gap-2.5">
            {PLATFORM_PROVIDERS.map((provider) => (
              <ProviderButton
                key={provider.id}
                provider={provider}
                isLoading={loadingProvider === provider.id}
                onClick={() => handleProvider(provider.id)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-6 text-xs">
          <Sparkles size={12} style={{ color: "var(--magenta)" }} />
          Sumá horas jugadas y subí de tier para desbloquear descuentos reales.
        </div>

        <p className="text-center text-xs mt-6">
          Al continuar aceptás los Términos y la Política de Privacidad de Play4Win.
        </p>
      </div>
    </div>
  );
}

// ======================================================================
// Pantalla 2 — Dashboard de progreso y premios
// ======================================================================

function TierPanel({ user }) {
  const xpPct = Math.min(100, Math.round((user.xp / user.xpToNext) * 100));
  const xpRemaining = user.xpToNext - user.xp;

  return (
    <section className="p4-panel p-6 sm:p-7 mb-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <div>
          <p className="text-xs uppercase tracking-wide mb-1">Tu tier actual</p>
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--cyan)" }}>{user.tier}</h1>
        </div>
        <p className="text-sm p4-mono p4-muted">
          {formatNumber(user.xp)} / {formatNumber(user.xpToNext)} XP
        </p>
      </div>
      <div className="p4-xp-track h-3 mb-2">
        <div className="p4-xp-fill" style={{ width: `${xpPct}%` }} />
      </div>
      <p className="text-xs">
        Te faltan {formatNumber(xpRemaining)} XP para pasar a Platino y desbloquear el próximo descuento.
      </p>
    </section>
  );
}

function PlatformRow({ platform }) {
  return (
    <div className="p4-panel p4-row px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full" style={{ background: platform.color }} />
        <span className="font-medium">{platform.name}</span>
      </div>
      <div className="flex gap-5 text-xs p4-mono p4-muted">
        <span>{platform.hours}h jugadas</span>
        <span>{platform.games} juegos</span>
        <span>{platform.achievements} logros</span>
      </div>
    </div>
  );
}

function LeaderboardRow({ entry }) {
  return (
    <div
      className="p4-row flex items-center justify-between px-4 py-3"
      style={entry.isUser ? { background: "#00E5FF10", borderLeft: "2px solid var(--cyan)" } : undefined}
    >
      <div className="flex items-center gap-3">
        <span className="p4-mono text-sm w-5 text-right" style={{ color: entry.rank <= 3 ? "var(--cyan)" : "var(--muted)" }}>
          {entry.rank}
        </span>
        <span className={entry.isUser ? "font-semibold" : ""}>
          {entry.name}
          {entry.isUser && <span className="ml-2 text-xs p4-muted">(vos)</span>}
        </span>
      </div>
      <span className="p4-mono text-xs p4-muted">{formatNumber(entry.xp)} XP</span>
    </div>
  );
}

function LockedRewardCard({ reward }) {
  return (
    <div className="p4-panel p-4 opacity-50" style={{ borderStyle: "dashed" }}>
      <div className="flex items-center gap-2 mb-1">
        <Lock size={14} className="p4-muted" />
        <p className="text-xs">Requiere tier {reward.tier}</p>
      </div>
      <p className="text-sm font-medium">{reward.label}</p>
      <p className="text-xs mt-1">{reward.platform}</p>
    </div>
  );
}

function UnlockedRewardCard({ reward, isClaimed, isCopied, onClaim, onCopy }) {
  return (
    <div className="p4-panel p4-glow-cyan p-4">
      <div className="flex items-center gap-2 mb-1">
        <Percent size={14} style={{ color: "var(--magenta)" }} />
        <p className="text-xs">{reward.platform}</p>
      </div>
      <p className="text-sm font-medium mb-3">{reward.label}</p>

      {!isClaimed ? (
        <button
          onClick={onClaim}
          className="p4-claim-btn p4-press p4-press-lift w-full text-sm font-medium py-2 rounded-md flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
          style={{ background: "var(--cyan)", color: "#0B0D17" }}
        >
          Reclamar código <ChevronRight size={14} />
        </button>
      ) : (
        <button
          onClick={onCopy}
          className="p4-code-btn p4-press p4-pop w-full text-sm p4-mono py-2 rounded-md flex items-center justify-center gap-2 border"
          style={{ borderColor: "var(--cyan)", color: "var(--cyan)" }}
        >
          {isCopied ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> {reward.code}</>}
        </button>
      )}
    </div>
  );
}

function RewardCard({ reward, isClaimed, isCopied, onClaim, onCopy }) {
  if (!reward.unlocked) return <LockedRewardCard reward={reward} />;
  return (
    <UnlockedRewardCard
      reward={reward}
      isClaimed={isClaimed}
      isCopied={isCopied}
      onClaim={onClaim}
      onCopy={onCopy}
    />
  );
}

function DashboardHeader({ user, onLogout }) {
  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-10">
      <div className="flex items-center gap-3">
        <Play4WinMark size={38} />
        <div>
          <p className="p4-wordmark p4-brand-font text-base">Play4Win</p>
          <p className="text-xs">Tu progreso gamer</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Crown size={16} style={{ color: "var(--cyan)" }} />
          <span className="p4-mono p4-muted">
            Puesto #{user.rank} de {formatNumber(user.totalPlayers)}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="p4-press p4-logout-btn flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-colors"
          style={{ borderColor: "var(--border)" }}
        >
          <LogOut size={13} /> Salir
        </button>
      </div>
    </header>
  );
}

function DashboardScreen({ onLogout }) {
  const [claimed, setClaimed] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  function handleClaim(id) {
    setClaimed((prev) => ({ ...prev, [id]: true }));
  }

  function handleCopy(code, id) {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 sm:px-8">
      <DashboardHeader user={USER} onLogout={onLogout} />
      <TierPanel user={USER} />

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Plataformas + ranking */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          <section>
            <SectionLabel>Tus plataformas</SectionLabel>
            <div className="flex flex-col gap-2">
              {PLATFORM_STATS.map((platform) => (
                <PlatformRow key={platform.id} platform={platform} />
              ))}
            </div>
          </section>

          <section>
            <SectionLabel>Ranking de la semana</SectionLabel>
            <div className="p4-panel divide-y" style={{ borderColor: "var(--border)" }}>
              {LEADERBOARD.map((entry) => (
                <LeaderboardRow key={entry.rank} entry={entry} />
              ))}
            </div>
          </section>
        </div>

        {/* Recompensas */}
        <div className="lg:col-span-2">
          <SectionLabel>Descuentos desbloqueados</SectionLabel>
          <div className="flex flex-col gap-3">
            {REWARDS.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                isClaimed={claimed[reward.id]}
                isCopied={copiedId === reward.id}
                onClaim={() => handleClaim(reward.id)}
                onCopy={() => handleCopy(reward.code, reward.id)}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 mt-5 px-1">
            <Flame size={14} style={{ color: "var(--magenta)" }} />
            <p className="text-xs">Cuanto más jugás, más rápido subís de tier.</p>
          </div>
        </div>
      </div>

      <footer className="mt-10 flex items-center gap-2 text-xs">
        <Trophy size={12} />
        Progreso sincronizado desde Steam, Epic Games y PlayStation Network.
      </footer>
    </div>
  );
}
