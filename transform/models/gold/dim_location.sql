-- One row per location category (kill site + disposal site).
-- The show's geography splits cleanly: Miami waters / Miami structures
-- in the original, Iron Lake woods / cabins in New Blood, Miami-1991
-- in Original Sin.

with raw as (
    select distinct lower(location_raw) as location_raw, canon
    from {{ ref('stg_fandom_kills') }}
    where location_raw is not null
),
normalized as (
    select
        location_raw,
        canon,
        case
            when location_raw like '%boat%' or location_raw like '%slice of life%' or location_raw like '%marina%' or location_raw like '%dock%' then 'boat_marina'
            when location_raw like '%ocean%' or location_raw like '%water%' or location_raw like '%gulf stream%'                                  then 'open_water'
            when location_raw like '%kill room%' or location_raw like '%plastic%'                                                                  then 'kill_room'
            when location_raw like '%cabin%' or location_raw like '%woods%' or location_raw like '%forest%'                                        then 'iron_lake_woods'
            when location_raw like '%apartment%' or location_raw like '%condo%' or location_raw like '%house%' or location_raw like '%home%'       then 'residence'
            when location_raw like '%warehouse%' or location_raw like '%storage%'                                                                  then 'warehouse'
            when location_raw like '%motel%' or location_raw like '%hotel%'                                                                        then 'hotel_motel'
            when location_raw like '%miami metro%' or location_raw like '%station%' or location_raw like '%precinct%'                              then 'police_facility'
            when location_raw like '%highway%' or location_raw like '%road%' or location_raw like '%car%'                                          then 'vehicle_road'
            else 'other'
        end as location_key
    from raw
)

select
    {{ dbt_utils.generate_surrogate_key(['location_key']) }}  as location_sk,
    location_key,
    canon,
    location_raw

from normalized
