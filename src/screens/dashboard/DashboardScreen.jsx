import { useState } from "react";
import { Trophy, Flame } from "lucide-react";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { PLATFORM_STATS, LEADERBOARD, REWARDS, USER } from "../../data/mockData";
import { DashboardHeader } from "./DashboardHeader";
import { TierPanel } from "./TierPanel";
import { PlatformRow } from "./PlatformRow";
import { LeaderboardRow } from "./LeaderboardRow";
import { RewardCard } from "./RewardCard";

export function DashboardScreen({ onLogout }) {
  const [claimed, setClaimed] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  function handleClaim(id) {
    setClaimed((prev) => ({ ...prev, [id]: true }));
  }

  function handleCopy(code, id) {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 sm:px-8">
      <DashboardHeader user={USER} onLogout={onLogout} />
      <TierPanel user={USER} />

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Plataformas + ranking */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          <section>
            <SectionLabel>Tus plataformas</SectionLabel>
            <div className="flex flex-col gap-2">
              {PLATFORM_STATS.map((platform) => (
                <PlatformRow key={platform.id} platform={platform} />
              ))}
            </div>
          </section>

          <section>
            <SectionLabel>Ranking de la semana</SectionLabel>
            <div className="p4-panel divide-y" style={{ borderColor: "var(--border)" }}>
              {LEADERBOARD.map((entry) => (
                <LeaderboardRow key={entry.rank} entry={entry} />
              ))}
            </div>
          </section>
        </div>

        {/* Recompensas */}
        <div className="lg:col-span-2">
          <SectionLabel>Descuentos desbloqueados</SectionLabel>
          <div className="flex flex-col gap-3">
            {REWARDS.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                isClaimed={claimed[reward.id]}
                isCopied={copiedId === reward.id}
                onClaim={() => handleClaim(reward.id)}
                onCopy={() => handleCopy(reward.code, reward.id)}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 mt-5 px-1">
            <Flame size={14} style={{ color: "var(--magenta)" }} />
            <p className="text-xs">Cuanto más jugás, más rápido subís de tier.</p>
          </div>
        </div>
      </div>

      <footer className="mt-10 flex items-center gap-2 text-xs">
        <Trophy size={12} />
        Progreso sincronizado desde Steam, Epic Games y PlayStation Network.
      </footer>
    </div>
  );
}
