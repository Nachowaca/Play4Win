import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Play4WinMark } from "../../components/brand/Play4WinMark";
import { LabeledDivider } from "../../components/ui/LabeledDivider";
import { PLATFORM_PROVIDERS } from "../../data/mockData";
import { AuthTabs } from "./AuthTabs";
import { GoogleButton } from "./GoogleButton";
import { ProviderButton } from "./ProviderButton";

export function LoginScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [loadingProvider, setLoadingProvider] = useState(null);

  function handleProvider(id) {
    setLoadingProvider(id);
    setTimeout(() => {
      setLoadingProvider(null);
      onAuthenticated();
    }, 900);
  }

  return (
    <div className="flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        {/* Marca */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <Play4WinMark size={48} />
          </div>
          <h1 className="p4-wordmark p4-brand-font text-2xl tracking-tight mb-2">Play4Win</h1>
          <p className="text-sm leading-relaxed max-w-[280px]">
            Tu consola de descuentos, cuanto más ganador sos en tus juegos mejores descuentos, demos exclusivas, pre compras anticipadas y mucho más.
          </p>
        </div>

        {/* Card de acceso */}
        <div className="p4-panel p4-glow p-6 sm:p-7">
          <AuthTabs mode={mode} onChange={setMode} />

          <GoogleButton
            mode={mode}
            isLoading={loadingProvider === "google"}
            onClick={() => handleProvider("google")}
          />

          <LabeledDivider>o con tu cuenta de plataforma</LabeledDivider>

          <div className="flex flex-col gap-2.5">
            {PLATFORM_PROVIDERS.map((provider) => (
              <ProviderButton
                key={provider.id}
                provider={provider}
                isLoading={loadingProvider === provider.id}
                onClick={() => handleProvider(provider.id)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-6 text-xs">
          <Sparkles size={12} style={{ color: "var(--magenta)" }} />
          Sumá horas jugadas y subí de tier para desbloquear descuentos reales.
        </div>

        <p className="text-center text-xs mt-6">
          Al continuar aceptás los Términos y la Política de Privacidad de Play4Win.
        </p>
      </div>
    </div>
  );
}
