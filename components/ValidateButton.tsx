"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ValidateButton({ ideaId }: { ideaId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function run(deep = false) {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/validate/${ideaId}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deep }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Validation failed");
      }
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Validation failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {err && <span style={{ fontSize: 11, color: "#FF8A95" }}>{err}</span>}
      <button onClick={() => run(false)} disabled={busy} className="fa-pill primary">
        {busy ? "Validujem…" : "Validovať"}
      </button>
      <button
        onClick={() => run(true)}
        disabled={busy}
        className="fa-pill"
        title="Hlbšia validácia s Claude Opus"
        style={{ fontSize: 11 }}
      >
        Deep
      </button>
    </div>
  );
}
