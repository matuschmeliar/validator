"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MarkdownView } from "./MarkdownView";

type Comment = {
  id: string;
  idea_id: string;
  author_email: string;
  body_md: string;
  created_at: string;
};

export function CommentList({
  ideaId,
  comments,
  myEmail,
}: {
  ideaId: string;
  comments: Comment[];
  myEmail: string;
}) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/ideas/${ideaId}/comments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body_md: text }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Nepodarilo sa odoslať");
      }
      setText("");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Nepodarilo sa odoslať");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Zmazať komentár?")) return;
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div>
      <ul className="space-y-3 mb-6">
        {comments.length === 0 && (
          <li className="text-[var(--muted)] text-sm">Žiadne komentáre.</li>
        )}
        {comments.map((c) => (
          <li key={c.id} className="border border-[var(--border)] rounded p-3">
            <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-2">
              <span>{c.author_email}</span>
              <div className="flex items-center gap-3">
                <span>{new Date(c.created_at).toLocaleString("sk-SK")}</span>
                {c.author_email === myEmail && (
                  <button
                    onClick={() => remove(c.id)}
                    className="hover:text-red-400"
                  >
                    zmazať
                  </button>
                )}
              </div>
            </div>
            <div className="prose-sk text-sm">
              <MarkdownView source={c.body_md} />
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Markdown podporovaný…"
          className="w-full bg-[#11151a] border border-[var(--border)] rounded px-3 py-2 text-sm min-h-[100px] font-mono"
        />
        {err && <p className="text-red-400 text-xs">{err}</p>}
        <button
          type="submit"
          disabled={busy || !text.trim()}
          className="text-sm bg-[var(--accent)] text-black rounded px-3 py-1.5 disabled:opacity-50"
        >
          {busy ? "Posielam…" : "Pridať komentár"}
        </button>
      </form>
    </div>
  );
}
