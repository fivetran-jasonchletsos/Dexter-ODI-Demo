-- One row per victim of a Dexter Morgan on-screen kill. Background and
-- prior-crime notes come from the Fandom victim pages.

with v as (
    select
        fandom_kill_id,
        victim_name,
        prior_crimes_text,
        canon,
        season_number,
        wiki_url
    from {{ ref('stg_fandom_kills') }}
),
classified as (
    select
        v.*,
        case
            when lower(prior_crimes_text) like '%serial killer%' then 'serial_killer'
            when lower(prior_crimes_text) like '%murder%'        then 'murderer'
            when lower(prior_crimes_text) like '%rape%' or lower(prior_crimes_text) like '%child%' then 'predator'
            when lower(prior_crimes_text) like '%drug%' or lower(prior_crimes_text) like '%traffick%' then 'trafficker'
            when lower(prior_crimes_text) = '' or prior_crimes_text is null then 'unknown'
            else 'other_violent'
        end as victim_type
    from v
)

select
    {{ dbt_utils.generate_surrogate_key(['fandom_kill_id']) }}  as victim_sk,
    fandom_kill_id,
    victim_name,
    victim_type,
    prior_crimes_text,
    canon,
    season_number,
    wiki_url

from classified
