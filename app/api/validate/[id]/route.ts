import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db";
import { requireUserEmail } from "@/lib/auth";
import { validateIdea, DEFAULT_MODEL, DEEP_MODEL } from "@/lib/anthropic";
import { weightedScore } from "@/lib/rubric";
import { errorResponse } from "@/lib/api-error";

const Body = z.object({
  deep: z.boolean().optional(),
});

export const maxDuration = 60; // Vercel: allow 60s for Claude call

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const email = await requireUserEmail();
    const { deep } = Body.parse(await req.json().catch(() => ({})));

    const db = supabaseAdmin();
    const { data: idea, error: getErr } = await db
      .from("ideas")
      .select("*")
      .eq("id", params.id)
      .single();
    if (getErr) throw getErr;

    const { data: attachments, error: attErr } = await db
      .from("idea_attachments")
      .select("*")
      .eq("idea_id", params.id)
      .order("created_at", { ascending: true });
    if (attErr) throw attErr;

    const { json, model } = await validateIdea({
      title: idea.title,
      smer: idea.smer,
      horizont: idea.horizont,
      body_md: idea.body_md,
      maslow_level: idea.maslow_level,
      attachments: attachments ?? [],
      model: deep ? DEEP_MODEL : DEFAULT_MODEL,
    });

    const score = weightedScore(json.scores);

    const { data: report, error: insErr } = await db
      .from("validation_reports")
      .insert({
        idea_id: params.id,
        scores: json.scores,
        weighted_score: score,
        summary_md: json.summary_md,
        next_step: json.next_step,
        maslow_level: json.maslow_level,
        maslow_note: json.maslow_note,
        model,
        created_by_email: email,
      })
      .select()
      .single();
    if (insErr) throw insErr;

    return NextResponse.json({ report, axis_notes: json.axis_notes });
  } catch (e) {
    return errorResponse(e);
  }
}
