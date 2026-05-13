-- Store Claude's per-axis notes alongside scores so the report UI can
-- show the reasoning next to each score.

alter table validation_reports
  add column if not exists axis_notes jsonb;
