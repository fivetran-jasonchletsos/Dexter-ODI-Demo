-- Wikidata characters tagged as antagonists of a Dexter season.
-- The cross_show_link edge resolves Harry Morgan etc. across canons.

with c as (
    select
        wikidata_qid,
        label                                as character_name,
        narrative_role,
        canon_show,
        antagonist_season,
        nemesis_killer_alias,
        actor_label                          as portrayed_by,
        description
    from {{ source('wikidata', 'character') }}
    where antagonist_season is not null
)

select * from c
