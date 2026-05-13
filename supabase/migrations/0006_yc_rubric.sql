-- Add rubric type to validation reports so we can run the YC rubric
-- alongside the DIUS manifest rubric. 'manifest' is the original 6-axis
-- prompt; 'yc' is the YC Office Hours six forcing questions rubric.

alter table validation_reports
  add column if not exists rubric_type text not null default 'manifest'
    check (rubric_type in ('manifest', 'yc'));

create index if not exists reports_rubric_idx
  on validation_reports (idea_id, rubric_type, created_at desc);

-- Recreate the view so latest_* fields can be filtered to a specific rubric
-- if needed; for backwards compatibility we still take the latest of any
-- rubric type. The detail page reads validation_reports directly.
drop view if exists ideas_with_latest_report;

create view ideas_with_latest_report as
select
  i.*,
  r.weighted_score    as latest_score,
  r.scores            as latest_scores,
  r.summary_md        as latest_summary_md,
  r.next_step         as latest_next_step,
  r.maslow_level      as latest_maslow_level,
  r.maslow_note       as latest_maslow_note,
  r.rubric_type       as latest_rubric_type,
  r.created_at        as latest_validated_at,
  (select avg(stars)::numeric(3,2) from ratings where idea_id = i.id) as avg_stars,
  (select count(*) from ratings where idea_id = i.id) as ratings_count,
  (select count(*) from comments where idea_id = i.id) as comments_count
from ideas i
left join lateral (
  select * from validation_reports
  where idea_id = i.id
  order by created_at desc
  limit 1
) r on true;
