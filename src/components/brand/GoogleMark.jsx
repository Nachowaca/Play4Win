// Marca abstracta de 4 colores — no el isotipo oficial de Google,
// para no reproducir la marca registrada, pero se reconoce igual.
export function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="9" r="7.5" fill="none" stroke="#4285F4" strokeWidth="3" strokeDasharray="11 35" strokeDashoffset="0" />
      <circle cx="9" cy="9" r="7.5" fill="none" stroke="#EA4335" strokeWidth="3" strokeDasharray="11 35" strokeDashoffset="-11" />
      <circle cx="9" cy="9" r="7.5" fill="none" stroke="#FBBC05" strokeWidth="3" strokeDasharray="11 35" strokeDashoffset="-22" />
      <circle cx="9" cy="9" r="7.5" fill="none" stroke="#34A853" strokeWidth="3" strokeDasharray="11 35" strokeDashoffset="-33" />
    </svg>
  );
}
