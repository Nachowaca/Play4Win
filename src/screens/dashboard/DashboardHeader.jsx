import { Crown, LogOut } from "lucide-react";
import { Play4WinMark } from "../../components/brand/Play4WinMark";
import { formatNumber } from "../../utils/format";

export function DashboardHeader({ user, onLogout }) {
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
