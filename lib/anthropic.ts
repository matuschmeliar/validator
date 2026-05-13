import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, ValidationJson, AxisKey } from "./rubric";

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
  model?: string;
}): Promise<{ json: ValidationJson; model: string }> {
  const model = opts.model ?? DEFAULT_MODEL;

  const userMessage = [
    `# Idea: ${opts.title}`,
    opts.smer ? `**Smer:** ${opts.smer}` : null,
    opts.horizont ? `**Horizont:** ${opts.horizont}` : null,
    "",
    "## Telo",
    opts.body_md,
  ]
    .filter(Boolean)
    .join("\n");

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
    messages: [{ role: "user", content: userMessage }],
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
  return parsed as ValidationJson;
}
