import { useState } from "react";
import { TOKENS } from "./theme/tokens";
import { GLOBAL_STYLES } from "./theme/globalStyles";
import { LoginScreen } from "./screens/login/LoginScreen";
import { DashboardScreen } from "./screens/dashboard/DashboardScreen";

// ======================================================================
// Play4Win — flujo completo: Login/Registro → Dashboard de progreso y premios
// App raíz: solo controla qué pantalla se muestra.
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
