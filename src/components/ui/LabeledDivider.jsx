export function LabeledDivider({ children }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      <span className="text-xs">{children}</span>
      <div className="h-px flex-1" style={{ background: "var(--border)" }} />
    </div>
  );
}
