-- Fandom-page-level extraction of every named Dexter Morgan kill across
-- the original series, New Blood, and Original Sin. Wide infobox parsed
-- via stg_infobox_pivot then joined in. Bronze layer is verbatim from
-- the Fandom API; here we normalize column names + types.

with k as (
    select
        kill_id                              as fandom_kill_id,
        page_slug,
        page_title                           as victim_name,
        coalesce(canon_show, 'original')     as canon,
        season_number,
        episode_number,
        episode_title,
        kill_method_raw                      as method_raw,
        kill_location_raw                    as location_raw,
        disposal_raw                         as disposal_raw,
        prior_crimes_text,
        code_of_harry_flag,
        season_arc_text,
        wiki_url,
        scraped_at
    from {{ source('fandom', 'kill_page') }}
)

select * from k
