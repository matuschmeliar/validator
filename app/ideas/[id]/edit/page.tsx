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
      <p className="text-red-400">Len autor môže túto ideu upravovať.</p>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Upraviť ideu</h1>
      <EditIdeaForm idea={idea} />
    </div>
  );
}
