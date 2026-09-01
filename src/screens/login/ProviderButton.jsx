import { ChevronRight } from "lucide-react";

export function ProviderButton({ provider, isLoading, onClick }) {
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
