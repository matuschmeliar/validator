"use client";

import {
  MASLOW_LEVELS,
  MASLOW_LABELS_SK,
  MASLOW_DESCRIPTIONS_SK,
  MASLOW_HUE,
  MaslowLevel,
} from "@/lib/rubric";

export function MaslowPicker({
  value,
  onChange,
}: {
  value: MaslowLevel | null;
  onChange: (v: MaslowLevel | null) => void;
}) {
  return (
    <div className="fa-maslow-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
      {MASLOW_LEVELS.map((lvl) => {
        const active = value === lvl;
        const hue = MASLOW_HUE[lvl];
        return (
          <button
            key={lvl}
            type="button"
            onClick={() => onChange(active ? null : lvl)}
            title={MASLOW_DESCRIPTIONS_SK[lvl]}
            style={{
              padding: "10px 8px",
              borderRadius: 10,
              cursor: "pointer",
              textAlign: "left",
              minWidth: 0,
              background: active
                ? `linear-gradient(180deg, ${hue}33 0%, ${hue}14 100%)`
                : "rgba(255,255,255,0.03)",
              border: active
                ? `1px solid ${hue}66`
                : "1px solid rgba(255,255,255,0.08)",
              color: active ? "#fff" : "rgba(255,255,255,0.75)",
              transition: "all 120ms ease",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: active ? hue : "rgba(255,255,255,0.4)",
                marginBottom: 4,
                letterSpacing: "0.04em",
              }}
            >
              {lvl}
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.25 }}>
              {MASLOW_LABELS_SK[lvl]}
            </div>
          </button>
        );
      })}
    </div>
  );
}
