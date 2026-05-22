const CONNECTORS = [
  { source: "Dexter Fandom Wiki", schema: "bronze_fandom",   tables: ["kill_page", "episode_page", "character_page", "infobox_attribute"], lastSync: "2026-05-22 03:14:00Z", status: "healthy",  rows: 412 },
  { source: "TMDB",                schema: "bronze_tmdb",     tables: ["tv_series", "season", "episode", "cast_credit", "crew_credit"],     lastSync: "2026-05-22 02:00:00Z", status: "healthy",  rows: 1184 },
  { source: "Wikidata",            schema: "bronze_wikidata", tables: ["character", "place", "cross_show_link"],                            lastSync: "2026-05-19 04:30:00Z", status: "healthy",  rows: 87 },
];

const LAYERS = [
  { name: "silver.stg_fandom_kills",        type: "view",           rows: 48,  buildSecs: 1.2 },
  { name: "silver.stg_tmdb_episodes",       type: "view",           rows: 116, buildSecs: 1.4 },
  { name: "silver.stg_wikidata_antagonists",type: "view",           rows: 11,  buildSecs: 0.8 },
  { name: "silver.stg_wikidata_locations",  type: "view",           rows: 32,  buildSecs: 0.7 },
  { name: "gold.dim_episode",               type: "dynamic_table",  rows: 116, buildSecs: 2.1 },
  { name: "gold.dim_season",                type: "dynamic_table",  rows: 10,  buildSecs: 1.5 },
  { name: "gold.dim_victim",                type: "dynamic_table",  rows: 48,  buildSecs: 1.7 },
  { name: "gold.dim_antagonist",            type: "dynamic_table",  rows: 11,  buildSecs: 1.3 },
  { name: "gold.dim_method",                type: "dynamic_table",  rows: 11,  buildSecs: 1.1 },
  { name: "gold.dim_location",              type: "dynamic_table",  rows: 14,  buildSecs: 1.2 },
  { name: "gold.fct_kill",                  type: "dynamic_table",  rows: 48,  buildSecs: 3.4 },
];

export default function PipelinePage() {
  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="type text-[10px] uppercase tracking-[0.35em] text-signal mb-3 slide-mark">Pipeline</p>
        <h1 className="serif text-4xl sm:text-5xl text-bone mb-3">Connector health, layer status</h1>
        <p className="serif italic text-ash/65 mb-10 max-w-3xl">
          Snapshot of the three Fivetran connectors and the dbt-built silver and gold layers. Sample fixture values in this static export; in production the page reads from Fivetran's status API and Snowflake's <span className="font-mono">information_schema</span>.
        </p>

        <section className="evidence-card rounded-sm p-6 mb-10">
          <h2 className="type text-[10px] uppercase tracking-[0.25em] text-ash/55 mb-5">Connectors</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-ash/55 type uppercase tracking-[0.15em] text-[10px] border-b border-bone/10">
              <tr>
                <th className="py-2 pr-3">Source</th>
                <th className="py-2 pr-3">Schema</th>
                <th className="py-2 pr-3">Tables</th>
                <th className="py-2 pr-3">Last sync</th>
                <th className="py-2 pr-3">Rows</th>
                <th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {CONNECTORS.map((c) => (
                <tr key={c.source} className="border-b border-bone/5">
                  <td className="py-2 pr-3 text-bone">{c.source}</td>
                  <td className="py-2 pr-3 font-mono text-ash/75">{c.schema}</td>
                  <td className="py-2 pr-3 text-ash/75">{c.tables.join(", ")}</td>
                  <td className="py-2 pr-3 font-mono text-[11px] text-ash/65">{c.lastSync}</td>
                  <td className="py-2 pr-3 font-mono text-ash/75">{c.rows}</td>
                  <td className="py-2 pr-3">
                    <span className="pill pill--neon">{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="evidence-card rounded-sm p-6">
          <h2 className="type text-[10px] uppercase tracking-[0.25em] text-ash/55 mb-5">dbt layers</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-ash/55 type uppercase tracking-[0.15em] text-[10px] border-b border-bone/10">
              <tr>
                <th className="py-2 pr-3">Model</th>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Rows</th>
                <th className="py-2 pr-3">Build time</th>
              </tr>
            </thead>
            <tbody>
              {LAYERS.map((l) => (
                <tr key={l.name} className="border-b border-bone/5">
                  <td className="py-2 pr-3 font-mono text-bone">{l.name}</td>
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
