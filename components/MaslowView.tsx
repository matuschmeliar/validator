import {
  MASLOW_LABELS_SK,
  MASLOW_DESCRIPTIONS_SK,
  MASLOW_HUE,
  MaslowLevel,
} from "@/lib/rubric";

export function MaslowView({
  authorLevel,
  claudeLevel,
  claudeNote,
}: {
  authorLevel: MaslowLevel | null;
  claudeLevel: MaslowLevel | null;
  claudeNote: string | null;
}) {
  if (!authorLevel && !claudeLevel) return null;
  const agrees = authorLevel != null && claudeLevel != null && authorLevel === claudeLevel;

  return (
    <div
      style={{
        marginTop: 18,
        padding: 16,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.45)",
            fontWeight: 500,
          }}
        >
          Maslowova hierarchia potrieb
        </div>
        {authorLevel != null && claudeLevel != null && (
          <div
            style={{
              fontSize: 11,
              padding: "3px 8px",
              borderRadius: 999,
              background: agrees ? "rgba(110,231,166,0.1)" : "rgba(255,138,149,0.1)",
              border: agrees
                ? "1px solid rgba(110,231,166,0.3)"
                : "1px solid rgba(255,138,149,0.3)",
              color: agrees ? "#6EE7A6" : "#FF8A95",
            }}
          >
            {agrees ? "zhoda" : "nezhoda"}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <MaslowSlot label="Autor" level={authorLevel} />
        <MaslowSlot label="Claude" level={claudeLevel} />
      </div>

      {claudeNote && (
        <div
          style={{
            marginTop: 14,
            fontSize: 13,
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.5,
          }}
        >
          {claudeNote}
        </div>
      )}
    </div>
  );
}

function MaslowSlot({ label, level }: { label: string; level: MaslowLevel | null }) {
  const hue = level != null ? MASLOW_HUE[level] : "#71717A";
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 8,
        background: level != null
          ? `linear-gradient(180deg, ${hue}1f 0%, ${hue}08 100%)`
          : "rgba(255,255,255,0.02)",
        border: level != null
          ? `1px solid ${hue}33`
          : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.45)",
          marginBottom: 6,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      {level != null ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 600, color: hue, lineHeight: 1 }}>
              {level}
            </span>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
              {MASLOW_LABELS_SK[level]}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>
            {MASLOW_DESCRIPTIONS_SK[level]}
          </div>
        </>
      ) : (
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
          —
        </div>
      )}
    </div>
  );
}
