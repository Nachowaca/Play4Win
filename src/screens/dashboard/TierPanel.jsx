import { formatNumber } from "../../utils/format";

export function TierPanel({ user }) {
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
