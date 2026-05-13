"use client";

import { useState } from "react";
import { MarkdownView } from "./MarkdownView";

type Comment = {
  id: string;
  idea_id: string;
  author_email: string;
  body_md: string;
  created_at: string;
};

type Pending = Comment & { _pending?: boolean };

export function CommentList({
  ideaId,
  comments: initial,
  myEmail,
}: {
  ideaId: string;
  comments: Comment[];
  myEmail: string;
}) {
  const [comments, setComments] = useState<Pending[]>(initial);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic: Pending = {
      id: tempId,
      idea_id: ideaId,
      author_email: myEmail,
      body_md: trimmed,
      created_at: new Date().toISOString(),
      _pending: true,
    };
    setComments((prev) => [...prev, optimistic]);
    setText("");
    setBusy(true);
    setErr(null);

    try {
      const res = await fetch(`/api/ideas/${ideaId}/comments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body_md: trimmed }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Nepodarilo sa odoslať");
      }
      const { comment } = await res.json();
      setComments((prev) => prev.map((c) => (c.id === tempId ? comment : c)));
    } catch (e) {
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      setText(trimmed);
      setErr(e instanceof Error ? e.message : "Nepodarilo sa odoslať");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Zmazať komentár?")) return;
    const removed = comments.find((c) => c.id === id);
    setComments((prev) => prev.filter((c) => c.id !== id));
    try {
      const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      if (removed) {
        setComments((prev) => {
          const i = initial.findIndex((c) => c.id === id);
          const next = [...prev];
          next.splice(i >= 0 ? i : next.length, 0, removed);
          return next;
        });
      }
    }
  }

  return (
    <div>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {comments.length === 0 && (
          <li style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>Žiadne komentáre.</li>
        )}
        {comments.map((c) => (
          <li
            key={c.id}
            style={{
              padding: "12px 14px",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              background: "rgba(255,255,255,0.02)",
              opacity: c._pending ? 0.6 : 1,
              transition: "opacity 200ms",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 8,
              }}
            >
              <span style={{ fontWeight: 500 }}>
                {c.author_email.split("@")[0]}
                {c._pending && (
                  <span style={{ marginLeft: 8, color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>
                    posielam…
                  </span>
                )}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span>{new Date(c.created_at).toLocaleString("sk-SK")}</span>
                {c.author_email === myEmail && !c._pending && (
                  <button
                    onClick={() => remove(c.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                  >
                    zmazať
                  </button>
                )}
              </div>
            </div>
            <div className="prose-sk" style={{ fontSize: 13 }}>
              <MarkdownView source={c.body_md} />
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Markdown podporovaný…"
          className="fa-input"
          style={{ minHeight: 90, fontFamily: "ui-monospace, monospace", fontSize: 13 }}
        />
        {err && <p style={{ color: "#FF8A95", fontSize: 12, margin: 0 }}>{err}</p>}
        <button
          type="submit"
          disabled={busy || !text.trim()}
          className="fa-pill primary"
          style={{ alignSelf: "flex-start" }}
        >
          {busy ? "Posielam…" : "Pridať komentár"}
        </button>
      </form>
    </div>
  );
}
