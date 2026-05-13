import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { requireUserEmail } from "@/lib/auth";
import { errorResponse } from "@/lib/api-error";
import { createSignedDownloadUrl } from "@/lib/storage";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireUserEmail();
    const { data: att, error } = await supabaseAdmin()
      .from("idea_attachments")
      .select("storage_path")
      .eq("id", params.id)
      .single();
    if (error) throw error;

    const url = await createSignedDownloadUrl(att.storage_path, 5 * 60);
    return NextResponse.redirect(url);
  } catch (e) {
    return errorResponse(e);
  }
}
