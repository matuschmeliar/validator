import Anthropic from "@anthropic-ai/sdk";
import {
  SYSTEM_PROMPT,
  ValidationJson,
  AxisKey,
  MaslowLevel,
  MASLOW_LABELS_SK,
} from "./rubric";
import type { IdeaAttachment } from "./db";
import { attachmentsToContentBlocks } from "./attachments";

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY");
  _client = new Anthropic({ apiKey });
  return _client;
}

export const DEFAULT_MODEL = "claude-sonnet-4-6";
export const DEEP_MODEL = "claude-opus-4-7";

export async function validateIdea(opts: {
  title: string;
  smer: string | null;
  horizont: string | null;
  body_md: string;
  maslow_level: MaslowLevel | null;
  attachments?: IdeaAttachment[];
  model?: string;
}): Promise<{ json: ValidationJson; model: string }> {
  const model = opts.model ?? DEFAULT_MODEL;

  const authorMaslow =
    opts.maslow_level != null
      ? `## Autorov Maslow odhad\n${opts.maslow_level} — ${MASLOW_LABELS_SK[opts.maslow_level]}`
      : null;

  const headerText = [
    `# Idea: ${opts.title}`,
    opts.smer ? `**Smer:** ${opts.smer}` : null,
    opts.horizont ? `**Horizont:** ${opts.horizont}` : null,
    "",
    "## Telo",
    opts.body_md,
    authorMaslow ? "" : null,
    authorMaslow,
  ]
    .filter((x) => x !== null)
    .join("\n");

  const userContent: Anthropic.ContentBlockParam[] = [
    { type: "text", text: headerText },
  ];

  if (opts.attachments && opts.attachments.length > 0) {
    userContent.push({
      type: "text",
      text: `\n## Prílohy\nIdea má ${opts.attachments.length} priložených súborov. Posúď ich obsah ako kontext, ale rubric stále aplikuj na ideu ako celok.`,
    });
    const attBlocks = await attachmentsToContentBlocks(opts.attachments);
    userContent.push(...attBlocks);
  }

  const res = await client().messages.create({
    model,
    max_tokens: 2000,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        // Cache the rubric — it's identical for every call
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userContent }],
  });

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  const json = parseValidationJson(text);
  return { json, model };
}

function parseValidationJson(text: string): ValidationJson {
  // Strip ```json fences if model still wraps despite instruction
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  const parsed = JSON.parse(cleaned);

  const axes: AxisKey[] = ["alignment", "tech", "ethics", "economy", "deps", "moat"];
  for (const a of axes) {
    const s = parsed.scores?.[a];
    if (typeof s !== "number" || s < 1 || s > 5) {
      throw new Error(`Invalid score for axis "${a}": ${s}`);
    }
  }
  if (typeof parsed.summary_md !== "string" || !parsed.summary_md.trim()) {
    throw new Error("Missing summary_md");
  }
  const ml = parsed.maslow_level;
  if (typeof ml !== "number" || ml < 1 || ml > 5 || !Number.isInteger(ml)) {
    throw new Error(`Invalid maslow_level: ${ml}`);
  }
  if (typeof parsed.maslow_note !== "string") {
    parsed.maslow_note = "";
  }
  return parsed as ValidationJson;
}
