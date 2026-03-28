"use client";

export type Mode = "narrative" | "architecture";

interface NavBarProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

const MODES: { key: Mode; label: string }[] = [
  { key: "narrative", label: "Narrative" },
  { key: "architecture", label: "Architecture" },
];

export default function NavBar({ mode, onModeChange }: NavBarProps) {
  return (
    <nav
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #E8E8E4",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 24px",
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "#1a1a1a",
          letterSpacing: "-0.01em",
        }}
      >
        Brand Gravity — Nucleus Architecture
      </span>
      <div style={{ display: "flex", gap: 4 }}>
        {MODES.map(({ key, label }) => {
          const active = mode === key;
          return (
            <button
              key={key}
              onClick={() => onModeChange(key)}
              style={{
                padding: "5px 16px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.04em",
                cursor: "pointer",
                border: "1px solid",
                backgroundColor: active ? "#1a1a1a" : "transparent",
                borderColor: active ? "#1a1a1a" : "#D0D0CC",
                color: active ? "#ffffff" : "#666666",
                transition: "all 0.15s ease",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
