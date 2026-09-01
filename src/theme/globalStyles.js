// Estilos globales inyectados una sola vez por <App />.
export const GLOBAL_STYLES = `
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
