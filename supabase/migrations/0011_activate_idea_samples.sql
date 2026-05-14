-- Activate the [Idea] sample documents from 0010 seed.
-- They were seeded inactive out of caution (concrete brainstorms might
-- bias Claude toward matching new ideas against existing specimens),
-- but the upside — better team-context calibration and surfacing
-- relationships between ideas — outweighs that risk in practice.

update knowledge_documents
set active = true
where title like '[Idea] %' and active = false;
