import { AUTH_TABS } from "../../data/mockData";

export function AuthTabs({ mode, onChange }) {
  return (
    <div className="flex text-sm mb-6 border-b" style={{ borderColor: "var(--border)" }}>
      {AUTH_TABS.map((tab) => {
        const isActive = mode === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="p4-press flex-1 pb-3 font-medium"
            style={{
              color: isActive ? "var(--cyan)" : "var(--text)",
              borderBottom: isActive ? "2px solid var(--cyan)" : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
