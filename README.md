# Dexter-ODI-Demo · Slice of Life Archive

> Curated for Jack Chletsos.

End-to-end ODI demonstration built around Dexter Morgan's on-screen
kills across the full Showtime canon: the original series (S1–S8,
2006–2013), the *Dexter: New Blood* revival (2021), and the *Original
Sin* prequel (2024). Episode metadata, victim biographies, methods,
locations, season antagonists, and Code of Harry adherence — pulled
from open sources by Fivetran, modeled by dbt into a Snowflake gold
layer, and answered by Snowflake **Cortex Analyst**.

Same ODI shape as the LinerNotes, Peter's Movies, and Castle Rock
archives: multiple public sources, one open Iceberg lake mirrored into
Snowflake, many engines (BI, dbt, Cortex, the Next.js front end)
reading the same bytes.

## Sources

| Source | Connector | What it gives us | Bronze schema |
|---|---|---|---|
| Dexter Fandom Wiki | Fivetran HTTP source (MediaWiki API) | Kill list per episode, victim biography, method, disposal, code-compliance notes | `bronze_fandom` |
| TMDB | Fivetran TMDB / HTTP source | Episode metadata (titles, airdates, runtime, still frames), guest-cast for season antagonists | `bronze_tmdb` |
| Wikidata | Fivetran HTTP source (SPARQL endpoint) | Season antagonists as recurring characters, real-world Miami locations, cross-show links (Original Sin → original series) | `bronze_wikidata` |

The /architecture page walks visitors through the pipeline with the
same lineage diagram the other ODI demos use.

## Stack

- **Ingest**: Fivetran managed connectors (3 sources, hands-off after setup)
- **Storage**: Apache Iceberg in S3 → mirrored into Snowflake managed tables
- **Transform**: dbt Cloud or dbt Core targeting Snowflake; bronze → silver → gold + a small Semantic Layer
- **Activation**: Snowflake Cortex Analyst on `gold.*` tables for NL Q&A
- **Surface**: Next.js 14 static export → GitHub Pages

```
       Fandom Wiki   TMDB   Wikidata
              \       |       /
               Fivetran (3 connectors)
                       |
        S3 + Iceberg  ⇄  Snowflake (managed tables)
                       |
                      dbt
                       |
   gold.dim_episode · gold.dim_season · gold.dim_victim
   gold.dim_antagonist · gold.dim_method · gold.dim_location
   gold.fct_kill (one row per on-screen Dexter kill)
                       |
        ┌──────────────┼──────────────┬──────────────┐
       BI          Cortex         Slice of Life   Notebooks
                   Analyst         front end
```

## Layout

| Path | What lives there |
|---|---|
| `connectors/` | Fivetran connector recipes for each source |
| `infra/` | `snowflake.sql` DDL for the warehouse, db, schemas, external volume, roles |
| `transform/` | dbt project `slice_of_life` — bronze sources, silver staging, gold dims/facts, semantic model |
| `slice-of-life-app/` | Next.js 14 + Tailwind 3 Miami-noir front end |
| `scripts/` | Node script to refresh episode stills + victim portraits |

## Pages

- `/` — Hero + season-by-season kill counts
- `/kills` — Full kill table, filterable by season, method, location, victim type
- `/victims` — Victim roster with backstory and prior-crime notes
- `/antagonists` — Season antagonist arcs (Ice Truck Killer, Bay Harbor Butcher arc, Trinity, Lumen / Barrel Girls, Doomsday, Wayne Randall, Hannah McKay arc, Brain Surgeon, Kurt Caldwell, Harry/Original Sin)
- `/methods` — M99 + knife distribution; method shifts across seasons
- `/code` — Each kill scored against Harry's Code (target is a killer, no innocents, don't get caught)
- `/locations` — Miami / Iron Lake / Miami-1991 split with kill density
- `/ask` — Cortex Analyst panel with example NL questions
- `/architecture` — ODI pipeline diagram and source rationale
- `/pipeline` — Connector health + layer status

## Why Cortex sits on this data

The gold layer is small (~140 kills, ~10 season antagonists, ~100
episodes) but the joins are unusually rich for the size. A question
like *"In seasons where the antagonist was a serial killer Dexter
eventually killed, what share of his other kills that season followed
the Code of Harry?"* exercises four joins across the gold layer.
Cortex Analyst answers it in one shot. The /ask page (or the Cortex
panel on /architecture) ships with a starter set of those questions.

## Local dev

```bash
cd slice-of-life-app
npm ci
npm run dev   # http://localhost:3000
```

## License

Demo code. Data is derived from public sources (Dexter Fandom Wiki,
TMDB, Wikidata) about an established work of fiction. All character
names, episode titles, and plot details are the property of their
respective rights holders (Showtime / Paramount); used here for
non-commercial educational demonstration.
