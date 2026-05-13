"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Idea } from "@/lib/db";

export function EditIdeaForm({ idea }: { idea: Idea }) {
  const router = useRouter();
  const [title, setTitle] = useState(idea.title);
  const [smer, setSmer] = useState<"A" | "B" | "C" | "">(idea.smer ?? "");
  const [horizont, setHorizont] = useState(idea.horizont ?? "");
  const [tags, setTags] = useState(idea.tags?.join(", ") ?? "");
  const [bodyMd, setBodyMd] = useState(idea.body_md);
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
          smer: smer || null,
          horizont: horizont || null,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          body_md: bodyMd,
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

  const inputCls =
    "w-full bg-[#11151a] border border-[var(--border)] rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]";

  return (
    <form onSubmit={save} className="space-y-4">
      <Field label="Názov">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Smer">
          <select
            value={smer}
            onChange={(e) => setSmer(e.target.value as "A" | "B" | "C" | "")}
            className={inputCls}
          >
            <option value="">—</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </Field>
        <Field label="Horizont">
          <input value={horizont} onChange={(e) => setHorizont(e.target.value)} className={inputCls} />
        </Field>
      </div>
      <Field label="Tagy (čiarkami)">
        <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Telo (markdown)">
        <textarea
          value={bodyMd}
          onChange={(e) => setBodyMd(e.target.value)}
          className={inputCls + " min-h-[400px] font-mono text-sm"}
        />
      </Field>
      {err && <p className="text-red-400 text-sm">{err}</p>}
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={busy}
          className="bg-[var(--accent)] text-black font-medium rounded px-4 py-2 disabled:opacity-50"
        >
          {busy ? "Ukladám…" : "Uložiť"}
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className="text-sm text-red-400 hover:text-red-300"
        >
          Zmazať ideu
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-[var(--muted)] mb-1">{label}</span>
      {children}
    </label>
  );
}
