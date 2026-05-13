-- Remove smer categorization — no longer used by the team.
-- The view depends on ideas.smer via i.* so it must be dropped first.

drop view if exists ideas_with_latest_report;

drop index if exists ideas_smer_created_idx;

alter table ideas
  drop column if exists smer;

-- Recreate the view without smer (it now naturally excludes the dropped column
-- via i.*).
create view ideas_with_latest_report as
select
  i.*,
  r.weighted_score    as latest_score,
  r.scores            as latest_scores,
  r.summary_md        as latest_summary_md,
  r.next_step         as latest_next_step,
  r.maslow_level      as latest_maslow_level,
  r.maslow_note       as latest_maslow_note,
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
