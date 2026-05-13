-- Maslow hierarchy of needs — classification axis for ideas
-- 1=Physiological, 2=Safety, 3=Belonging, 4=Esteem, 5=Self-actualization

alter table ideas
  add column maslow_level smallint check (maslow_level between 1 and 5);

alter table validation_reports
  add column maslow_level smallint check (maslow_level between 1 and 5),
  add column maslow_note text;

-- Recreate view to expose Maslow fields
create or replace view ideas_with_latest_report as
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
