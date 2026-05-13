"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IdeaAttachment } from "@/lib/db";

const ALLOWED_EXT = ".pdf,.docx,.xlsx,.png,.jpg,.jpeg";
const MAX_MB = 25;

export function AttachmentManager({
  ideaId,
  initial,
  canEdit,
}: {
  ideaId: string;
  initial: IdeaAttachment[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState<IdeaAttachment[]>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload(file: File) {
    setErr(null);
    if (file.size > MAX_MB * 1024 * 1024) {
      setErr(`Súbor je príliš veľký (max ${MAX_MB} MB)`);
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/ideas/${ideaId}/attachments`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Nepodarilo sa nahrať");
      }
      const { attachment } = await res.json();
      setItems((prev) => [...prev, attachment]);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Nepodarilo sa nahrať");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Zmazať túto prílohu?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/attachments/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Nepodarilo sa zmazať");
      }
      setItems((prev) => prev.filter((a) => a.id !== id));
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Nepodarilo sa zmazať");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.length === 0 ? (
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          Žiadne prílohy.
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          {items.map((a) => (
            <li
              key={a.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                padding: "8px 12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 8,
              }}
            >
              <a
                href={`/api/attachments/${a.id}/download`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <span style={{ fontSize: 14 }}>{iconFor(a.mime)}</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {a.filename}
                </span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>
                  {formatSize(a.size_bytes)}
                </span>
              </a>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  disabled={busy}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#FF8A95",
                    fontSize: 11,
                    cursor: "pointer",
                    padding: "2px 6px",
                  }}
                >
                  Zmazať
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {canEdit && (
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            border: "1px dashed rgba(255,255,255,0.15)",
            borderRadius: 8,
            cursor: busy ? "not-allowed" : "pointer",
            fontSize: 13,
            color: "rgba(255,255,255,0.7)",
            width: "fit-content",
          }}
        >
          {busy ? "Nahrávam…" : "+ Pridať prílohu"}
          <input
            type="file"
            accept={ALLOWED_EXT}
            disabled={busy}
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </label>
      )}

      {err && <p style={{ color: "#FF8A95", fontSize: 12, margin: 0 }}>{err}</p>}

      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
        Povolené: PDF, .docx, .xlsx, .png, .jpg · max {MAX_MB} MB / súbor · max 10 / ideu
      </div>
    </div>
  );
}

function iconFor(mime: string): string {
  if (mime === "application/pdf") return "📄";
  if (mime.includes("wordprocessingml")) return "📝";
  if (mime.includes("spreadsheetml")) return "📊";
  if (mime.startsWith("image/")) return "🖼";
  return "📎";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} kB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
