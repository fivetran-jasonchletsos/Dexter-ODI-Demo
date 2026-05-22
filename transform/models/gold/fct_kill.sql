-- One row per on-screen Dexter Morgan kill.
--
-- Joins:
--   victim       — Fandom victim page (1:1 with the kill)
--   episode      — TMDB episode metadata for airdate / runtime
--   method       — normalized method controlled vocabulary
--   location     — normalized kill-site category
--   antagonist   — season "Big Bad" if the victim is the season antagonist
--
-- Flags:
--   code_of_harry_compliant   — did Harry's three rules hold (target is a killer,
--                                no innocents, don't get caught)?
--   was_season_antagonist     — victim was the named season Big Bad
--   victim_was_serial_killer  — derived from prior_crimes_text in dim_victim

with k as (
    select * from {{ ref('stg_fandom_kills') }}
),
v as (
    select * from {{ ref('dim_victim') }}
),
e as (
    select * from {{ ref('dim_episode') }}
),
m as (
    select method_sk, method_key, method_raw from {{ ref('dim_method') }}
),
loc as (
    select location_sk, location_key, location_raw, canon from {{ ref('dim_location') }}
),
a as (
    select antagonist_sk, character_name, canon, season_number from {{ ref('dim_antagonist') }}
)

select
    {{ dbt_utils.generate_surrogate_key(['k.fandom_kill_id']) }}  as kill_sk,
    k.fandom_kill_id,
    k.canon,
    k.season_number,
    k.episode_number,
    e.episode_sk,
    e.episode_title,
    e.aired_on,
    v.victim_sk,
    v.victim_name,
    v.victim_type,
    v.victim_type = 'serial_killer'                              as victim_was_serial_killer,
    m.method_sk,
    m.method_key,
    loc.location_sk,
    loc.location_key,
    k.disposal_raw,
    case
        when lower(k.disposal_raw) like '%ocean%' or lower(k.disposal_raw) like '%bay%'
          or lower(k.disposal_raw) like '%gulf stream%' or lower(k.disposal_raw) like '%water%' then 'open_water'
        when lower(k.disposal_raw) like '%lake%'                                                 then 'iron_lake'
        when lower(k.disposal_raw) like '%fire%' or lower(k.disposal_raw) like '%incinerat%'     then 'fire'
        when lower(k.disposal_raw) like '%buried%' or lower(k.disposal_raw) like '%grave%'       then 'buried'
        when lower(k.disposal_raw) like '%left%' or lower(k.disposal_raw) like '%scene%'         then 'left_at_scene'
        else 'other'
    end                                                          as disposal_key,
    k.code_of_harry_flag                                         as code_of_harry_compliant,
    a.antagonist_sk,
    a.antagonist_sk is not null                                  as was_season_antagonist,
    k.season_arc_text,
    k.wiki_url

from k
left join v   on v.fandom_kill_id = k.fandom_kill_id
left join e   on e.canon = k.canon and e.season_number = k.season_number and e.episode_number = k.episode_number
left join m   on m.method_raw = lower(k.method_raw)
left join loc on loc.location_raw = lower(k.location_raw) and loc.canon = k.canon
left join a   on a.character_name = k.victim_name and a.canon = k.canon and a.season_number = k.season_number
