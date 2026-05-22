# Fivetran connectors — Slice of Life Archive (3 sources)

Three managed Fivetran connectors feed the archive. All three land into
the same Iceberg lake in S3, mirrored into Snowflake. dbt + Cortex sit
on top of the gold layer.

## The connectors

| Connector | Source | Bronze schema | Sync | Tables we use |
|---|---|---|---|---|
| Dexter Fandom Wiki | `https://dexter.fandom.com/api.php` (MediaWiki API, via Fivetran HTTP source) | `bronze_fandom` | Weekly | `kill_page`, `episode_page`, `character_page`, `infobox_attribute` |
| TMDB | `https://api.themoviedb.org/3/` (Fivetran TMDB / HTTP source) | `bronze_tmdb` | Daily | `tv_series`, `season`, `episode`, `cast_credit`, `crew_credit` |
| Wikidata | SPARQL endpoint at `https://query.wikidata.org/sparql` (Fivetran HTTP source) | `bronze_wikidata` | Weekly | `character`, `place`, `cross_show_link` |

## Dexter Fandom Wiki setup

The Fandom wiki has a category `Category:Dexter Morgan's victims` that
indexes every named victim. The MediaWiki API returns each page as
parsed HTML plus a structured infobox.

Query starter:
```
GET /api.php?action=query&format=json&list=categorymembers
   &cmtitle=Category:Dexter_Morgan%27s_victims&cmlimit=500
GET /api.php?action=parse&format=json&page=<page_title>&prop=text|wikitext|categories
```

Connector config:
```
Connector type:       HTTP source
Auth:                 none (public wiki; respect Wikimedia rate limits — 200 req/min sustained)
Schema:               bronze_fandom
Tables landed:        kill_page, episode_page, character_page, infobox_attribute
Schema inference:     enabled
Sync frequency:       weekly (the wiki churns slowly outside of active airing)
```

Pagination is `cmcontinue` for category listings. Each victim page gets
its own row in `kill_page`; the infobox (Background, Method, Disposal,
Killed by, Status, etc.) is parsed wide-to-long into
`infobox_attribute` so we can re-shape downstream.

## TMDB setup

The Dexter franchise has three TMDB series ids:
- **1405** — *Dexter* (original, 2006-2013, 96 episodes)
- **110492** — *Dexter: New Blood* (2021, 10 episodes)
- **219937** — *Dexter: Original Sin* (2024-, prequel, 10 episodes)

Query starter:
```
GET /tv/1405/season/{season_number}
GET /tv/1405/season/{season_number}/episode/{episode_number}
GET /tv/110492/season/1
GET /tv/219937/season/1
```

Connector config:
```
Connector type:       TMDB (official Fivetran) or HTTP source
API key:              required (free tier OK)
Schema:               bronze_tmdb
Tables landed:        tv_series, season, episode, cast_credit, crew_credit
Schema inference:     enabled
```

Season antagonists are tagged via `crew_credit` (writers/directors) plus
`cast_credit` rows matching the season's named villain — e.g. John
Lithgow as Arthur Mitchell (Trinity) in S4.

## Wikidata setup

A SPARQL query against `https://query.wikidata.org/sparql` for the
season antagonists, real-world locations (Miami; Iron Lake is fictional
but mapped to upstate New York region), and the cross-show character
links (Harry Morgan appears in both the original series and Original
Sin; Hannah McKay reappears in S7-S8; Doakes in original + Original Sin).

Sample query:
```sparql
SELECT ?character ?characterLabel ?work ?workLabel ?seasonOrdinal
WHERE {
  ?work wdt:P31 wd:Q5398426 .                   # television series
  ?work wdt:P179 wd:Q1130678 .                  # part of Dexter franchise (or named-as)
  ?character wdt:P1441 ?work .                  # present in work
  OPTIONAL { ?character wdt:P674 ?antagonistFlag }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
```

Connector config:
```
Connector type:       HTTP source
URL:                  https://query.wikidata.org/sparql
Headers:              { "Accept": "application/sparql-results+json" }
Schema:               bronze_wikidata
Tables landed:        character, place, cross_show_link
Sync frequency:       weekly
```

## Why three connectors and not one

Each source is best at a different question:
- **Fandom Wiki** is the *only* place with the per-kill detail. Method,
  disposal, prior crimes, kill-room layout, the Code annotations — all
  community-curated, all keyed to victim names.
- **TMDB** is the authoritative episode index. Airdates, runtime, guest
  cast (essential for resolving "who plays Trinity?" → "John Lithgow"
  → which episodes he's in), still frames.
- **Wikidata** is where the *cross-show character graph* lives. Harry
  Morgan in both the original and Original Sin; Doakes likewise;
  Hannah's two-season arc. Joining inside Wikidata is cheaper than
  joining at TMDB.

This is the ODI thesis in concrete form: each source is best at what
it's best at, none of them is forced into the others' shape, and a
single Iceberg lake gives BI / dbt / Cortex / the front end one
consistent view.
