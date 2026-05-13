import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { requireUserEmail } from "@/lib/auth";
import { errorResponse } from "@/lib/api-error";
import {
  ALLOWED_EXTENSIONS,
  MAX_FILES_PER_IDEA,
  MAX_FILE_SIZE_BYTES,
  buildStoragePath,
  isAllowedExtension,
  isAllowedMime,
  uploadAttachment,
} from "@/lib/storage";

export const maxDuration = 60;

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireUserEmail();
    const { data, error } = await supabaseAdmin()
      .from("idea_attachments")
      .select("*")
      .eq("idea_id", params.id)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ attachments: data ?? [] });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const email = await requireUserEmail();
    const db = supabaseAdmin();

    const { data: idea, error: ideaErr } = await db
      .from("ideas")
      .select("id, author_email")
      .eq("id", params.id)
      .single();
    if (ideaErr) throw ideaErr;
    if (idea.author_email !== email) {
      return NextResponse.json(
        { error: "Len autor môže pridávať prílohy" },
        { status: 403 }
      );
    }

    const { count, error: cntErr } = await db
      .from("idea_attachments")
      .select("id", { count: "exact", head: true })
      .eq("idea_id", params.id);
    if (cntErr) throw cntErr;

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Chýba pole 'file'" }, { status: 400 });
    }

    if ((count ?? 0) >= MAX_FILES_PER_IDEA) {
      return NextResponse.json(
        { error: `Idea už má max počet príloh (${MAX_FILES_PER_IDEA})` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `Súbor je príliš veľký (max ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB)`,
        },
        { status: 400 }
      );
    }

    if (!isAllowedMime(file.type) || !isAllowedExtension(file.name)) {
      return NextResponse.json(
        {
          error: `Nepodporovaný typ. Povolené: ${ALLOWED_EXTENSIONS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const storagePath = buildStoragePath(params.id, file.name);
    const buf = Buffer.from(await file.arrayBuffer());
    await uploadAttachment({
      path: storagePath,
      body: buf,
      contentType: file.type,
    });

    const { data, error: insErr } = await db
      .from("idea_attachments")
      .insert({
        idea_id: params.id,
        filename: file.name,
        mime: file.type,
        size_bytes: file.size,
        storage_path: storagePath,
        uploaded_by_email: email,
      })
      .select()
      .single();
    if (insErr) throw insErr;

    return NextResponse.json({ attachment: data }, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}
