import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db";
import { requireUserEmail } from "@/lib/auth";
import { errorResponse } from "@/lib/api-error";

const UpdateIdea = z.object({
  title: z.string().min(3).max(200).optional(),
  smer: z.enum(["A", "B", "C"]).nullable().optional(),
  horizont: z.string().max(50).nullable().optional(),
  tags: z.array(z.string()).max(20).optional(),
  body_md: z.string().min(10).max(50000).optional(),
  maslow_level: z.number().int().min(1).max(5).nullable().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireUserEmail();
    const db = supabaseAdmin();

    const [ideaRes, reportsRes, ratingsRes, commentsRes] = await Promise.all([
      db.from("ideas").select("*").eq("id", params.id).single(),
      db.from("validation_reports").select("*").eq("idea_id", params.id).order("created_at", { ascending: false }),
      db.from("ratings").select("*").eq("idea_id", params.id),
      db.from("comments").select("*").eq("idea_id", params.id).order("created_at", { ascending: true }),
    ]);

    if (ideaRes.error) {
      if (ideaRes.error.code === "PGRST116") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      throw ideaRes.error;
    }

    const ratings = ratingsRes.data ?? [];
    const avg =
      ratings.length > 0 ? ratings.reduce((a, r) => a + r.stars, 0) / ratings.length : null;

    return NextResponse.json({
      idea: ideaRes.data,
      reports: reportsRes.data ?? [],
      ratings,
      avg_stars: avg,
      comments: commentsRes.data ?? [],
    });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const email = await requireUserEmail();
    const body = UpdateIdea.parse(await req.json());
    const db = supabaseAdmin();

    const { data: existing, error: getErr } = await db
      .from("ideas")
      .select("author_email")
      .eq("id", params.id)
      .single();
    if (getErr) throw getErr;
    if (existing.author_email !== email) {
      return NextResponse.json({ error: "Only the author can edit this idea" }, { status: 403 });
    }

    const { data, error } = await db
      .from("ideas")
      .update(body)
      .eq("id", params.id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ idea: data });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const email = await requireUserEmail();
    const db = supabaseAdmin();

    const { data: existing, error: getErr } = await db
      .from("ideas")
      .select("author_email")
      .eq("id", params.id)
      .single();
    if (getErr) throw getErr;
    if (existing.author_email !== email) {
      return NextResponse.json({ error: "Only the author can delete this idea" }, { status: 403 });
    }

    const { error } = await db.from("ideas").delete().eq("id", params.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
