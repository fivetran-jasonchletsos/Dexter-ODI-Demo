-- One row per season across all three canons. Antagonist label is the
-- season's "Big Bad" — the killer Dexter or the narrative is chasing.

with seasons as (
    select distinct canon, season_number from {{ ref('stg_tmdb_episodes') }}
),
antag as (
    select canon_show as canon, antagonist_season as season_number, character_name as antagonist_name
    from {{ ref('stg_wikidata_antagonists') }}
),
joined as (
    select s.canon, s.season_number, a.antagonist_name
    from seasons s
    left join antag a
      on a.canon = s.canon
     and a.season_number = s.season_number
)

select
    {{ dbt_utils.generate_surrogate_key(['canon', 'season_number']) }}  as season_sk,
    canon,
    season_number,
    antagonist_name

from joined
