export function PlatformRow({ platform }) {
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
