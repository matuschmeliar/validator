"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Pridať ideu</h1>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Názov *">
          <input
            required
            minLength={3}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
            placeholder="napr. Memory Mesh"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Smer">
            <select
              value={smer}
              onChange={(e) => setSmer(e.target.value as "A" | "B" | "C" | "")}
              className={inputCls}
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
              className={inputCls}
              placeholder="napr. 2026, 2-5 rokov, sci-fi"
            />
          </Field>
        </div>

        <Field label="Tagy (čiarkami oddelené)">
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={inputCls}
            placeholder="LLM, on-device, families"
          />
        </Field>

        <Field label="Telo idey (markdown) *">
          <textarea
            required
            minLength={10}
            value={bodyMd}
            onChange={(e) => setBodyMd(e.target.value)}
            className={inputCls + " min-h-[300px] font-mono text-sm"}
            placeholder="Popíš ideu, kontext, prepojenia na iné nápady, čo je potrebné aby existovala..."
          />
        </Field>

        {err && <p className="text-red-400 text-sm">{err}</p>}

        <button
          type="submit"
          disabled={busy}
          className="bg-[var(--accent)] text-black font-medium rounded px-4 py-2 disabled:opacity-50"
        >
          {busy ? "Ukladám…" : "Uložiť ideu"}
        </button>
      </form>
    </div>
  );
}

const inputCls =
  "w-full bg-[#11151a] border border-[var(--border)] rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-[var(--muted)] mb-1">{label}</span>
      {children}
    </label>
  );
}
