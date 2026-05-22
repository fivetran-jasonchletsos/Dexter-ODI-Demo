-- Real-world Miami + Iron Lake + Miami-1991 locations referenced by the show.

with p as (
    select
        wikidata_qid,
        label                                as location_name,
        coalesce(city, 'Unknown')            as city,
        country_code,
        coalesce(location_kind, 'urban')     as location_kind,
        latitude,
        longitude
    from {{ source('wikidata', 'place') }}
)

select * from p
