import { Gamepad2 } from "lucide-react";

// Badge con gradiente verde cyber → magenta, glow animado.
export function Play4WinMark({ size = 44 }) {
  return (
    <div
      className="p4-logo-mark flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.27,
        background: "linear-gradient(135deg, #39FF88, #FF3EA5)",
      }}
    >
      <Gamepad2 size={size * 0.56} color="#0B0D17" strokeWidth={2.3} />
    </div>
  );
}
