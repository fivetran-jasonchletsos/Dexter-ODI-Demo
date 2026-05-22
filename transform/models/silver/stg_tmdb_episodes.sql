-- One row per Dexter franchise episode (S1-S8 + New Blood + Original Sin).
-- TMDB series ids: 1405 (original), 110492 (New Blood), 219937 (Original Sin).

with e as (
    select
        episode_id                           as tmdb_episode_id,
        tv_series_id,
        case tv_series_id
            when 1405   then 'original'
            when 110492 then 'new_blood'
            when 219937 then 'original_sin'
        end                                  as canon,
        season_number,
        episode_number,
        name                                 as episode_title,
        air_date                             as aired_on,
        runtime_minutes,
        overview                             as synopsis,
        still_path
    from {{ source('tmdb', 'episode') }}
)

select * from e
