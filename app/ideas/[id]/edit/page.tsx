import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/db";
import { readSessionEmail } from "@/lib/auth";
import { EditIdeaForm } from "@/components/EditIdeaForm";

export const dynamic = "force-dynamic";

export default async function EditIdeaPage({ params }: { params: { id: string } }) {
  const email = await readSessionEmail();
  if (!email) redirect("/login");

  const { data: idea, error } = await supabaseAdmin()
    .from("ideas")
    .select("*")
    .eq("id", params.id)
    .single();
  if (error || !idea) notFound();
  if (idea.author_email !== email) {
    return (
      <div className="fa-stage">
        <div className="fa-stage-top-light" />
        <div className="fa-chrome" style={{ padding: 40 }}>
          <p style={{ color: "#FF8A95" }}>Len autor môže túto ideu upravovať.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fa-stage">
      <div className="fa-stage-top-light" />
      <div className="fa-chrome" style={{ padding: "32px 40px 40px", minHeight: "calc(100vh - 48px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Link
            href={`/ideas/${idea.id}`}
            style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}
          >
            ← Späť na ideu
          </Link>
          <h1
            style={{
              margin: "12px 0 24px",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            Upraviť ideu
          </h1>
          <EditIdeaForm idea={idea} />
        </div>
      </div>
    </div>
  );
}
