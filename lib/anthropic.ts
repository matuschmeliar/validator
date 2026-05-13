import Anthropic from "@anthropic-ai/sdk";
import {
  SYSTEM_PROMPT,
  ValidationJson,
  AxisKey,
  MaslowLevel,
  MASLOW_LABELS_SK,
} from "./rubric";
import {
  YC_SYSTEM_PROMPT,
  YCValidationJson,
  YCAxisKey,
} from "./yc-rubric";
import type { IdeaAttachment, IdeaAmendment } from "./db";
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

type IdeaContext = {
  title: string;
  horizont: string | null;
  body_md: string;
  maslow_level: MaslowLevel | null;
  amendments?: IdeaAmendment[];
  attachments?: IdeaAttachment[];
};

async function buildUserContent(
  opts: IdeaContext
): Promise<Anthropic.ContentBlockParam[]> {
  const authorMaslow =
    opts.maslow_level != null
      ? `## Autorov Maslow odhad\n${opts.maslow_level} — ${MASLOW_LABELS_SK[opts.maslow_level]}`
      : null;

  const amendmentsBlock =
    opts.amendments && opts.amendments.length > 0
      ? [
          "",
          "## Doplnenia (chronologicky, najnovšie posledné)",
          ...opts.amendments.map((a) => {
            const ts = new Date(a.created_at).toLocaleString("sk-SK");
            return `### ${ts} — ${a.author_email}\n${a.body_md}`;
          }),
        ].join("\n")
      : null;

  const headerText = [
    `# Idea: ${opts.title}`,
    opts.horizont ? `**Horizont:** ${opts.horizont}` : null,
    "",
    "## Telo",
    opts.body_md,
    amendmentsBlock,
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

  return userContent;
}

function stripFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function extractText(res: Anthropic.Message): string {
  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

export async function validateIdea(
  opts: IdeaContext & { model?: string }
): Promise<{ json: ValidationJson; model: string }> {
  const model = opts.model ?? DEFAULT_MODEL;
  const userContent = await buildUserContent(opts);

  const res = await client().messages.create({
    model,
    max_tokens: 2000,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userContent }],
  });

  const json = parseValidationJson(extractText(res));
  return { json, model };
}

export async function validateIdeaYC(
  opts: IdeaContext & { model?: string }
): Promise<{ json: YCValidationJson; model: string }> {
  const model = opts.model ?? DEFAULT_MODEL;
  const userContent = await buildUserContent(opts);

  const res = await client().messages.create({
    model,
    max_tokens: 2000,
    system: [
      {
        type: "text",
        text: YC_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userContent }],
  });

  const json = parseYCValidationJson(extractText(res));
  return { json, model };
}

function normalizeStructured(parsed: Record<string, unknown>): void {
  // verdict / confidence — coerce to known values or null
  const v = parsed.verdict;
  if (v !== "go" && v !== "caution" && v !== "no-go") {
    parsed.verdict = "caution";
  }
  const c = parsed.confidence;
  if (c !== "high" && c !== "medium" && c !== "low") {
    parsed.confidence = "medium";
  }
  // arrays
  for (const key of ["strengths", "weaknesses", "red_flags"]) {
    const val = parsed[key];
    if (!Array.isArray(val)) {
      parsed[key] = [];
    } else {
      parsed[key] = val.filter((x: unknown) => typeof x === "string" && x.trim());
    }
  }
  if (typeof parsed.critical_question !== "string") {
    parsed.critical_question = "";
  }
}

function parseValidationJson(text: string): ValidationJson {
  const parsed = JSON.parse(stripFences(text));

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
  normalizeStructured(parsed);
  return parsed as ValidationJson;
}

function parseYCValidationJson(text: string): YCValidationJson {
  const parsed = JSON.parse(stripFences(text));

  const axes: YCAxisKey[] = [
    "demand",
    "specificity",
    "status_quo",
    "wedge",
    "observation",
    "future_fit",
  ];
  for (const a of axes) {
    const s = parsed.scores?.[a];
    if (typeof s !== "number" || s < 1 || s > 5) {
      throw new Error(`Invalid YC score for axis "${a}": ${s}`);
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
  normalizeStructured(parsed);
  return parsed as YCValidationJson;
}
