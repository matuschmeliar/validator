"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Idea } from "@/lib/db";
import { MaslowLevel } from "@/lib/rubric";
import { MaslowPicker } from "@/components/MaslowPicker";

export function EditIdeaForm({ idea }: { idea: Idea }) {
  const router = useRouter();
  const [title, setTitle] = useState(idea.title);
  const [horizont, setHorizont] = useState(idea.horizont ?? "");
  const [tags, setTags] = useState(idea.tags?.join(", ") ?? "");
  const [bodyMd, setBodyMd] = useState(idea.body_md);
  const [maslowLevel, setMaslowLevel] = useState<MaslowLevel | null>(idea.maslow_level);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/ideas/${idea.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          horizont: horizont || null,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          body_md: bodyMd,
          maslow_level: maslowLevel,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Save failed");
      }
      router.push(`/ideas/${idea.id}`);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("Zmazať túto ideu? Akcia je nezvratná.")) return;
    setBusy(true);
    const res = await fetch(`/api/ideas/${idea.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setBusy(false);
      setErr("Nepodarilo sa zmazať");
    }
  }

  return (
    <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Field label="Názov">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="fa-input" />
      </Field>
      <Field label="Horizont">
        <input value={horizont} onChange={(e) => setHorizont(e.target.value)} className="fa-input" />
      </Field>
      <Field label="Tagy (čiarkami)">
        <input value={tags} onChange={(e) => setTags(e.target.value)} className="fa-input" />
      </Field>
      <Field label="Maslowova úroveň">
        <MaslowPicker value={maslowLevel} onChange={setMaslowLevel} />
      </Field>
      <Field label="Telo (markdown)">
        <textarea
          value={bodyMd}
          onChange={(e) => setBodyMd(e.target.value)}
          className="fa-input"
          style={{ minHeight: 360, fontFamily: "ui-monospace, monospace", fontSize: 13 }}
        />
      </Field>
      {err && <p style={{ color: "#FF8A95", fontSize: 13, margin: 0 }}>{err}</p>}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" disabled={busy} className="fa-pill primary">
            {busy ? "Ukladám…" : "Uložiť"}
          </button>
        </div>
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          style={{
            background: "transparent",
            border: "none",
            color: "#FF8A95",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Zmazať ideu
        </button>
      </div>
    </form>
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
