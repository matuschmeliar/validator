import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { requireUserEmail } from "@/lib/auth";
import { errorResponse } from "@/lib/api-error";
import { deleteAttachment } from "@/lib/storage";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const email = await requireUserEmail();
    const db = supabaseAdmin();

    const { data: att, error: getErr } = await db
      .from("idea_attachments")
      .select("id, idea_id, storage_path, uploaded_by_email, ideas:idea_id(author_email)")
      .eq("id", params.id)
      .single();
    if (getErr) throw getErr;

    const ideaAuthor = (att as any).ideas?.author_email as string | undefined;
    if (att.uploaded_by_email !== email && ideaAuthor !== email) {
      return NextResponse.json(
        { error: "Len autor idey alebo nahrávajúci môže prílohu zmazať" },
        { status: 403 }
      );
    }

    await deleteAttachment(att.storage_path);

    const { error: delErr } = await db
      .from("idea_attachments")
      .delete()
      .eq("id", params.id);
    if (delErr) throw delErr;

    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
