-- One row per kill method. Normalizes the raw Fandom strings (the
-- victim infoboxes are wildly inconsistent: "stabbed", "knife to chest",
-- "throat slit") into a small controlled vocabulary.

with raw as (
    select distinct lower(method_raw) as method_raw
    from {{ ref('stg_fandom_kills') }}
    where method_raw is not null
),
normalized as (
    select
        method_raw,
        case
            when method_raw like '%injection%' or method_raw like '%m99%' or method_raw like '%etorphine%' then 'lethal_injection_m99'
            when method_raw like '%knife%' or method_raw like '%stab%' or method_raw like '%blade%'        then 'knife'
            when method_raw like '%garrote%' or method_raw like '%strangl%' or method_raw like '%wire%'    then 'strangulation'
            when method_raw like '%saw%' or method_raw like '%bone saw%'                                    then 'bone_saw'
            when method_raw like '%gun%' or method_raw like '%shot%' or method_raw like '%firearm%'         then 'firearm'
            when method_raw like '%fire%' or method_raw like '%burn%'                                       then 'fire'
            when method_raw like '%explos%' or method_raw like '%bomb%'                                     then 'explosion'
            when method_raw like '%blunt%' or method_raw like '%hammer%' or method_raw like '%shovel%'      then 'blunt_force'
            when method_raw like '%drown%'                                                                  then 'drowning'
            when method_raw like '%push%' or method_raw like '%fell%' or method_raw like '%fall%'           then 'fall'
            else 'other'
        end as method_key,
        case
            when method_raw like '%injection%' or method_raw like '%m99%' or method_raw like '%etorphine%' then 'Lethal injection (M99 / etorphine)'
            when method_raw like '%knife%' or method_raw like '%stab%' or method_raw like '%blade%'        then 'Knife / blade'
            when method_raw like '%garrote%' or method_raw like '%strangl%' or method_raw like '%wire%'    then 'Strangulation'
            when method_raw like '%saw%' or method_raw like '%bone saw%'                                    then 'Bone saw'
            when method_raw like '%gun%' or method_raw like '%shot%' or method_raw like '%firearm%'         then 'Firearm'
            when method_raw like '%fire%' or method_raw like '%burn%'                                       then 'Fire'
            when method_raw like '%explos%' or method_raw like '%bomb%'                                     then 'Explosion'
            when method_raw like '%blunt%' or method_raw like '%hammer%' or method_raw like '%shovel%'      then 'Blunt force'
            when method_raw like '%drown%'                                                                  then 'Drowning'
            when method_raw like '%push%' or method_raw like '%fell%' or method_raw like '%fall%'           then 'Fall'
            else 'Other'
        end as method_label
    from raw
)

select
    {{ dbt_utils.generate_surrogate_key(['method_key']) }}  as method_sk,
    method_key,
    method_label,
    method_raw

from normalized
