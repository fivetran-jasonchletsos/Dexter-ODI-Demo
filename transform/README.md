# slice_of_life — dbt project

Transforms Fivetran-landed bronze data into the silver and gold layers
in Snowflake. The gold layer is what Cortex Analyst sees.

## Run

```bash
cp profiles.yml.example ~/.dbt/profiles.yml
export SNOWFLAKE_ACCOUNT=... SNOWFLAKE_USER=... SNOWFLAKE_PASSWORD=...
dbt deps
dbt build
```

## Models

- `bronze/sources.yml` — declares the three bronze schemas Fivetran lands
- `silver/` — staging models per source (one row per kill / per episode / per character)
- `gold/` — `dim_episode`, `dim_season`, `dim_victim`, `dim_antagonist`, `dim_method`, `dim_location`, `fct_kill`
- `gold/_gold__models.yml` — tests + the semantic model definition Cortex Analyst attaches to
- `seeds/` — curated CSVs of canonical Dexter kills so the demo runs end-to-end without the live Fandom pull

## Cortex Analyst

Once `dbt build` has populated `gold.*`:

1. In Snowsight, create a Cortex Analyst service pointing at
   `slice_of_life.gold.dexter_corpus` (the semantic model in
   `_gold__models.yml`).
2. Add NL question suggestions like:
   - "How many kills per season, and what was the dominant method each season?"
   - "Which season had the highest share of victims who were not serial killers?"
   - "Of the Trinity Killer's victims that Dexter avenged, how many followed the Code of Harry?"
   - "How did Dexter's method mix shift after Rita's death?"
   - "Which locations show up most often as kill sites versus disposal sites?"

The `/architecture` and `/ask` pages reference Cortex as the
natural-language interface; wire it through the Cortex Analyst
Streamlit shim or a small Cloudflare Worker if you want browser-side
calls.
