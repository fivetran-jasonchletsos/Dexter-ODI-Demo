-- One row per Dexter franchise episode (any canon).

with e as (
    select * from {{ ref('stg_tmdb_episodes') }}
)

select
    {{ dbt_utils.generate_surrogate_key(['canon', 'season_number', 'episode_number']) }}  as episode_sk,
    canon,
    season_number,
    episode_number,
    episode_title,
    aired_on,
    runtime_minutes,
    synopsis,
    still_path,
    tmdb_episode_id

from e
