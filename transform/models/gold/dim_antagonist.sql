-- One row per season antagonist. The "Big Bad" Dexter or the narrative
-- chases for a season. Some antagonists Dexter eventually kills
-- (Trinity, Doomsday, Kurt Caldwell); some he doesn't (Ice Truck Killer
-- is killed by Debra; Hannah escapes).

with a as (
    select
        wikidata_qid,
        character_name,
        canon_show                          as canon,
        antagonist_season                   as season_number,
        nemesis_killer_alias                as alias,
        portrayed_by,
        description
    from {{ ref('stg_wikidata_antagonists') }}
)

select
    {{ dbt_utils.generate_surrogate_key(['wikidata_qid']) }}  as antagonist_sk,
    wikidata_qid,
    character_name,
    alias,
    canon,
    season_number,
    portrayed_by,
    description

from a
