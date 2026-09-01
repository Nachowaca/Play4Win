import { GoogleMark } from "../../components/brand/GoogleMark";

export function GoogleButton({ mode, isLoading, onClick }) {
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
