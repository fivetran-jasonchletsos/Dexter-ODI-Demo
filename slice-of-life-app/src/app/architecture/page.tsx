const SOURCES = [
  { name: "Dexter Fandom Wiki", role: "Per-kill detail — method, disposal, prior crimes, kill-room layout, Code annotations.", schema: "bronze_fandom",   freq: "Weekly" },
  { name: "TMDB",                role: "Episode index — airdates, runtime, guest cast for season antagonists, still frames.",   schema: "bronze_tmdb",     freq: "Daily" },
  { name: "Wikidata",            role: "Cross-show character graph — Harry Morgan / Doakes / Hannah across canons; locations.", schema: "bronze_wikidata", freq: "Weekly" },
];

const LAYERS = [
  { name: "bronze_*",  what: "Raw landings from Fivetran. One row per API response page." },
  { name: "silver.*",  what: "Stg_ views: stable column names, parsed dates, typed booleans, no business logic." },
  { name: "gold.*",    what: "dim_episode, dim_season, dim_victim, dim_antagonist, dim_method, dim_location, fct_kill." },
  { name: "semantic",  what: "Cortex Analyst dexter_corpus model over gold — verified queries + dimensions + measures." },
];

export default function ArchitecturePage() {
  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="type text-[10px] uppercase tracking-[0.35em] text-signal mb-3 slide-mark">ODI Architecture</p>
        <h1 className="serif text-4xl sm:text-5xl text-bone mb-3">One lake. Many engines.</h1>
        <p className="serif italic text-ash/65 mb-10 max-w-3xl">
          Three managed connectors land into the same Iceberg lake in S3, mirrored into Snowflake. dbt models bronze → silver → gold. Cortex Analyst, BI tools, the Next.js front end, and ad-hoc notebooks all read the same gold tables.
        </p>

        <section className="evidence-card rounded-sm p-6 mb-10">
          <h2 className="type text-[10px] uppercase tracking-[0.25em] text-ash/55 mb-5">Sources</h2>
          <ul className="divide-y divide-bone/10">
            {SOURCES.map((s) => (
              <li key={s.name} className="grid grid-cols-1 sm:grid-cols-[12rem_1fr_6rem] gap-3 py-3">
                <div>
                  <p className="serif text-base text-bone leading-snug">{s.name}</p>
                  <p className="font-mono text-[11px] text-ash/55 mt-0.5">{s.schema}</p>
                </div>
                <p className="serif text-sm text-ash/80 leading-relaxed">{s.role}</p>
                <span className="pill self-start">{s.freq}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="evidence-card rounded-sm p-6 mb-10">
          <h2 className="type text-[10px] uppercase tracking-[0.25em] text-ash/55 mb-5">Pipeline diagram</h2>
          <pre className="font-mono text-[12px] leading-relaxed text-ash/80 overflow-x-auto">{`       Fandom Wiki    TMDB    Wikidata
              \\        |        /
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
                   Analyst         front end`}</pre>
        </section>

        <section className="evidence-card rounded-sm p-6 mb-10">
          <h2 className="type text-[10px] uppercase tracking-[0.25em] text-ash/55 mb-5">Layers</h2>
          <ul className="divide-y divide-bone/10">
            {LAYERS.map((l) => (
              <li key={l.name} className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-3 py-3">
                <p className="font-mono text-bone text-sm">{l.name}</p>
                <p className="serif text-sm text-ash/80 leading-relaxed">{l.what}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="evidence-card rounded-sm p-6">
          <h2 className="type text-[10px] uppercase tracking-[0.25em] text-signal mb-3">Why Cortex</h2>
          <p className="serif text-sm text-ash/85 leading-relaxed">
            The gold layer is small but the joins are rich. A question like
            <em> "in seasons where Dexter killed the season antagonist, what share of his other kills that season followed the Code?"</em> exercises four joins across <span className="font-mono">fct_kill</span>, <span className="font-mono">dim_antagonist</span>, <span className="font-mono">dim_season</span>, and <span className="font-mono">dim_victim</span>. Cortex Analyst resolves it in a single round-trip; see /ask for the verified-query set the model ships with.
          </p>
        </section>
      </div>
    </main>
  );
}
