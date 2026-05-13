"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewIdeaPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [smer, setSmer] = useState<"A" | "B" | "C" | "">("");
  const [horizont, setHorizont] = useState("");
  const [tags, setTags] = useState("");
  const [bodyMd, setBodyMd] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          smer: smer || null,
          horizont: horizont || null,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          body_md: bodyMd,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Nepodarilo sa uložiť");
      }
      const { idea } = await res.json();
      router.push(`/ideas/${idea.id}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Nepodarilo sa uložiť");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fa-stage">
      <div className="fa-stage-top-light" />
      <div className="fa-chrome" style={{ padding: "32px 40px 40px", minHeight: "calc(100vh - 48px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Link
            href="/"
            style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}
          >
            ← Späť na dashboard
          </Link>
          <h1
            style={{
              margin: "12px 0 6px",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            Pridať ideu
          </h1>
          <p style={{ margin: "0 0 28px", color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            Zapíš víziu, ktorú chceš dať Claude na validáciu proti 6-osému rubricu.
          </p>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Názov *">
              <input
                required
                minLength={3}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="fa-input"
                placeholder="napr. Memory Mesh"
              />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Smer">
                <select
                  value={smer}
                  onChange={(e) => setSmer(e.target.value as "A" | "B" | "C" | "")}
                  className="fa-input"
                >
                  <option value="">—</option>
                  <option value="A">A — Využitie dát</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </Field>
              <Field label="Horizont">
                <input
                  value={horizont}
                  onChange={(e) => setHorizont(e.target.value)}
                  className="fa-input"
                  placeholder="napr. 2026, 2-5 rokov, sci-fi"
                />
              </Field>
            </div>

            <Field label="Tagy (čiarkami oddelené)">
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="fa-input"
                placeholder="LLM, on-device, families"
              />
            </Field>

            <Field label="Telo idey (markdown) *">
              <textarea
                required
                minLength={10}
                value={bodyMd}
                onChange={(e) => setBodyMd(e.target.value)}
                className="fa-input"
                style={{ minHeight: 320, fontFamily: "ui-monospace, monospace", fontSize: 13 }}
                placeholder="Popíš ideu, kontext, prepojenia na iné nápady, čo je potrebné aby existovala…"
              />
            </Field>

            {err && <p style={{ color: "#FF8A95", fontSize: 13, margin: 0 }}>{err}</p>}

            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" disabled={busy} className="fa-pill primary">
                {busy ? "Ukladám…" : "Uložiť ideu"}
              </button>
              <Link href="/" className="fa-pill">
                Zrušiť
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span
        style={{
          display: "block",
          fontSize: 11,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
