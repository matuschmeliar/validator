import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db";
import { requireUserEmail } from "@/lib/auth";
import {
  validateIdea,
  validateIdeaYC,
  DEFAULT_MODEL,
  DEEP_MODEL,
} from "@/lib/anthropic";
import { weightedScore } from "@/lib/rubric";
import { ycWeightedScore } from "@/lib/yc-rubric";
import { errorResponse } from "@/lib/api-error";

const Body = z.object({
  deep: z.boolean().optional(),
  rubric: z.enum(["manifest", "yc"]).optional().default("manifest"),
});

export const maxDuration = 60;

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const email = await requireUserEmail();
    const { deep, rubric } = Body.parse(await req.json().catch(() => ({})));

    const db = supabaseAdmin();
    const { data: idea, error: getErr } = await db
      .from("ideas")
      .select("*")
      .eq("id", params.id)
      .single();
    if (getErr) throw getErr;

    const [{ data: attachments, error: attErr }, { data: amendments, error: amErr }] =
      await Promise.all([
        db
          .from("idea_attachments")
          .select("*")
          .eq("idea_id", params.id)
          .order("created_at", { ascending: true }),
        db
          .from("idea_amendments")
          .select("*")
          .eq("idea_id", params.id)
          .order("created_at", { ascending: true }),
      ]);
    if (attErr) throw attErr;
    if (amErr) throw amErr;

    const ctx = {
      title: idea.title,
      horizont: idea.horizont,
      body_md: idea.body_md,
      maslow_level: idea.maslow_level,
      amendments: amendments ?? [],
      attachments: attachments ?? [],
      model: deep ? DEEP_MODEL : DEFAULT_MODEL,
    };

    let score: number;
    let scores: Record<string, number>;
    let summary_md: string;
    let next_step: string;
    let maslow_level: number;
    let maslow_note: string;
    let axis_notes: Record<string, string>;
    let model: string;

    if (rubric === "yc") {
      const r = await validateIdeaYC(ctx);
      scores = r.json.scores;
      score = ycWeightedScore(r.json.scores);
      summary_md = r.json.summary_md;
      next_step = r.json.next_step;
      maslow_level = r.json.maslow_level;
      maslow_note = r.json.maslow_note;
      axis_notes = r.json.axis_notes;
      model = r.model;
    } else {
      const r = await validateIdea(ctx);
      scores = r.json.scores;
      score = weightedScore(r.json.scores);
      summary_md = r.json.summary_md;
      next_step = r.json.next_step;
      maslow_level = r.json.maslow_level;
      maslow_note = r.json.maslow_note;
      axis_notes = r.json.axis_notes;
      model = r.model;
    }

    const { data: report, error: insErr } = await db
      .from("validation_reports")
      .insert({
        idea_id: params.id,
        scores,
        weighted_score: score,
        summary_md,
        next_step,
        maslow_level,
        maslow_note,
        rubric_type: rubric,
        model,
        created_by_email: email,
      })
      .select()
      .single();
    if (insErr) throw insErr;

    return NextResponse.json({ report, axis_notes });
  } catch (e) {
    return errorResponse(e);
  }
}
