const CONNECTORS = [
  {
    source:      "Dexter Fandom Wiki",
    fivetranId:  "fandom_mediawiki_dexter",
    schema:      "bronze_fandom",
    descriptor:  "Kill detail, victim biographies, method, disposal, Code annotations",
    tables:      ["kill_page", "episode_page", "character_page", "infobox_attribute"],
    lastSync:    "2026-05-22 03:14:00Z",
    status:      "healthy",
    rows:        412,
    fivetranUrl: "https://fivetran.com/dashboard/connectors/fandom_mediawiki_dexter",
  },
  {
    source:      "TMDB",
    fivetranId:  "tmdb_dexter_series",
    schema:      "bronze_tmdb",
    descriptor:  "Episode metadata, airdates, runtime, guest cast, still frames",
    tables:      ["tv_series", "season", "episode", "cast_credit", "crew_credit"],
    lastSync:    "2026-05-22 02:00:00Z",
    status:      "healthy",
    rows:        1184,
    fivetranUrl: "https://fivetran.com/dashboard/connectors/tmdb_dexter_series",
  },
  {
    source:      "Wikidata",
    fivetranId:  "wikidata_sparql_dexter",
    schema:      "bronze_wikidata",
    descriptor:  "Cross-show character graph, real-world locations, Original Sin links",
    tables:      ["character", "place", "cross_show_link"],
    lastSync:    "2026-05-19 04:30:00Z",
    status:      "healthy",
    rows:        87,
    fivetranUrl: "https://fivetran.com/dashboard/connectors/wikidata_sparql_dexter",
  },
];

const LAYERS = [
  { name: "silver.stg_fandom_kills",        label: "Kill staging view",          type: "view",           rows: 48,  buildSecs: 1.2 },
  { name: "silver.stg_tmdb_episodes",       label: "Episode staging view",       type: "view",           rows: 116, buildSecs: 1.4 },
  { name: "silver.stg_wikidata_antagonists",label: "Antagonist staging view",    type: "view",           rows: 11,  buildSecs: 0.8 },
  { name: "silver.stg_wikidata_locations",  label: "Location staging view",      type: "view",           rows: 32,  buildSecs: 0.7 },
  { name: "gold.dim_episode",               label: "Episode dimension",          type: "dynamic_table",  rows: 116, buildSecs: 2.1 },
  { name: "gold.dim_season",                label: "Season dimension",           type: "dynamic_table",  rows: 10,  buildSecs: 1.5 },
  { name: "gold.dim_victim",                label: "Victim dimension",           type: "dynamic_table",  rows: 48,  buildSecs: 1.7 },
  { name: "gold.dim_antagonist",            label: "Antagonist dimension",       type: "dynamic_table",  rows: 11,  buildSecs: 1.3 },
  { name: "gold.dim_method",                label: "Kill method dimension",      type: "dynamic_table",  rows: 11,  buildSecs: 1.1 },
  { name: "gold.dim_location",              label: "Location dimension",         type: "dynamic_table",  rows: 14,  buildSecs: 1.2 },
  { name: "gold.fct_kill",                  label: "Kill event fact table",      type: "dynamic_table",  rows: 48,  buildSecs: 3.4 },
];

export default function PipelinePage() {
  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="type text-[10px] uppercase tracking-[0.35em] text-signal mb-3 slide-mark">Pipeline</p>
        <h1 className="serif text-4xl sm:text-5xl text-bone mb-3">Connector health, layer status</h1>
        <p className="serif italic text-ash/65 mb-10 max-w-3xl">
          Snapshot of the three Fivetran connectors and the dbt-built silver and gold layers. Sample fixture values in this static export; in production the page reads from Fivetran&apos;s status API and Snowflake&apos;s <span className="font-mono">information_schema</span>.
        </p>

        <section className="evidence-card rounded-sm p-6 mb-10">
          <h2 className="type text-[10px] uppercase tracking-[0.25em] text-ash/55 mb-5">Connectors</h2>
          <div className="space-y-5">
            {CONNECTORS.map((c) => (
              <div key={c.source} className="border-b border-bone/8 pb-5 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="serif text-base text-bone leading-snug">{c.source}</p>
                    <p className="font-mono text-[11px] text-ash/50 mt-0.5">{c.fivetranId}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="pill pill--neon">{c.status}</span>
                    <a
                      href={c.fivetranUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 type uppercase tracking-[0.15em] text-[10px] border border-neon/40 text-neon/80 hover:text-ink hover:bg-neon/80 transition rounded-sm"
                    >
                      Open in Fivetran
                    </a>
                  </div>
                </div>
                <p className="serif text-sm text-ash/75 mb-2">{c.descriptor}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="type uppercase tracking-[0.15em] text-ash/40 text-[9px] block mb-0.5">Schema</span>
                    <span className="font-mono text-ash/70">{c.schema}</span>
                  </div>
                  <div>
                    <span className="type uppercase tracking-[0.15em] text-ash/40 text-[9px] block mb-0.5">Tables</span>
                    <span className="font-mono text-ash/70">{c.tables.length}</span>
                  </div>
                  <div>
                    <span className="type uppercase tracking-[0.15em] text-ash/40 text-[9px] block mb-0.5">Rows</span>
                    <span className="font-mono text-ash/70">{c.rows.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="type uppercase tracking-[0.15em] text-ash/40 text-[9px] block mb-0.5">Last sync</span>
                    <span className="font-mono text-ash/70">{c.lastSync}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="evidence-card rounded-sm p-6">
          <h2 className="type text-[10px] uppercase tracking-[0.25em] text-ash/55 mb-5">dbt layers</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-ash/55 type uppercase tracking-[0.15em] text-[10px] border-b border-bone/10">
              <tr>
                <th className="py-2 pr-3">Layer</th>
                <th className="py-2 pr-3 hidden sm:table-cell">Model</th>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Rows</th>
                <th className="py-2 pr-3">Build</th>
              </tr>
            </thead>
            <tbody>
              {LAYERS.map((l) => (
                <tr key={l.name} className="border-b border-bone/5">
                  <td className="py-2 pr-3 text-bone">{l.label}</td>
                  <td className="py-2 pr-3 font-mono text-ash/55 text-[11px] hidden sm:table-cell">{l.name}</td>
                  <td className="py-2 pr-3 text-ash/75">{l.type}</td>
                  <td className="py-2 pr-3 font-mono text-ash/75">{l.rows}</td>
                  <td className="py-2 pr-3 font-mono text-ash/75">{l.buildSecs}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
