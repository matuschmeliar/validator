"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "manifest" | "yc" | "deep";

export function ValidateButton({ ideaId }: { ideaId: string }) {
  const router = useRouter();
  const [busyMode, setBusyMode] = useState<Mode | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function run(mode: Mode) {
    setBusyMode(mode);
    setErr(null);
    try {
      const body =
        mode === "yc"
          ? { rubric: "yc" }
          : mode === "deep"
          ? { deep: true }
          : {};
      const res = await fetch(`/api/validate/${ideaId}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Validation failed");
      }
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Validation failed");
    } finally {
      setBusyMode(null);
    }
  }

  const busy = busyMode !== null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {err && <span style={{ fontSize: 11, color: "#FF8A95" }}>{err}</span>}
      <button onClick={() => run("manifest")} disabled={busy} className="fa-pill primary">
        {busyMode === "manifest" ? "Validujem…" : "Validovať"}
      </button>
      <button
        onClick={() => run("yc")}
        disabled={busy}
        className="fa-pill"
        title="YC office hours — 6 forcing questions (Garry Tan)"
      >
        {busyMode === "yc" ? "Validujem…" : "YC validácia"}
      </button>
      <button
        onClick={() => run("deep")}
        disabled={busy}
        className="fa-pill"
        title="Hlbšia validácia s Claude Opus (manifest rubric)"
        style={{ fontSize: 11 }}
      >
        {busyMode === "deep" ? "Validujem…" : "Deep"}
      </button>
    </div>
  );
}
