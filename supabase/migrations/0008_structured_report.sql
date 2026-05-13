-- Structured validation output: instead of one summary_md blob, Claude now
-- returns a verdict + confidence + lists of strengths/weaknesses/red_flags
-- + a single critical question. summary_md stays as a short TLDR.

alter table validation_reports
  add column if not exists verdict text
    check (verdict in ('go', 'caution', 'no-go')),
  add column if not exists confidence text
    check (confidence in ('high', 'medium', 'low')),
  add column if not exists strengths jsonb,        -- array of strings
  add column if not exists weaknesses jsonb,       -- array of strings
  add column if not exists red_flags jsonb,        -- array of strings (may be empty)
  add column if not exists critical_question text;
