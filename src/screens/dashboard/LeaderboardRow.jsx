import { formatNumber } from "../../utils/format";

export function LeaderboardRow({ entry }) {
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
