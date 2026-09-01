import { Percent, Check, Copy, Lock, ChevronRight } from "lucide-react";

function LockedRewardCard({ reward }) {
  return (
    <div className="p4-panel p-4 opacity-50" style={{ borderStyle: "dashed" }}>
      <div className="flex items-center gap-2 mb-1">
        <Lock size={14} className="p4-muted" />
        <p className="text-xs">Requiere tier {reward.tier}</p>
      </div>
      <p className="text-sm font-medium">{reward.label}</p>
      <p className="text-xs mt-1">{reward.platform}</p>
    </div>
  );
}

function UnlockedRewardCard({ reward, isClaimed, isCopied, onClaim, onCopy }) {
  return (
    <div className="p4-panel p4-glow-cyan p-4">
      <div className="flex items-center gap-2 mb-1">
        <Percent size={14} style={{ color: "var(--magenta)" }} />
        <p className="text-xs">{reward.platform}</p>
      </div>
      <p className="text-sm font-medium mb-3">{reward.label}</p>

      {!isClaimed ? (
        <button
          onClick={onClaim}
          className="p4-claim-btn p4-press p4-press-lift w-full text-sm font-medium py-2 rounded-md flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
          style={{ background: "var(--cyan)", color: "#0B0D17" }}
        >
          Reclamar código <ChevronRight size={14} />
        </button>
      ) : (
        <button
          onClick={onCopy}
          className="p4-code-btn p4-press p4-pop w-full text-sm p4-mono py-2 rounded-md flex items-center justify-center gap-2 border"
          style={{ borderColor: "var(--cyan)", color: "var(--cyan)" }}
        >
          {isCopied ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> {reward.code}</>}
        </button>
      )}
    </div>
  );
}

export function RewardCard({ reward, isClaimed, isCopied, onClaim, onCopy }) {
  if (!reward.unlocked) return <LockedRewardCard reward={reward} />;
  return (
    <UnlockedRewardCard
      reward={reward}
      isClaimed={isClaimed}
      isCopied={isCopied}
      onClaim={onClaim}
      onCopy={onCopy}
    />
  );
}
