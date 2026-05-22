const QUESTIONS = [
  {
    q: "How many kills per season, and what was the dominant method each season?",
    sql: `select canon, season_number, method_key, count(*) as kills
from slice_of_life.gold.fct_kill
group by canon, season_number, method_key
order by canon, season_number, kills desc;`,
  },
  {
    q: "Which season had the highest share of victims who were not serial killers?",
    sql: `select canon, season_number,
       avg(case when not victim_was_serial_killer then 1.0 else 0.0 end) as non_sk_share,
       count(*) as kills
from slice_of_life.gold.fct_kill
group by canon, season_number
order by non_sk_share desc;`,
  },
  {
    q: "Of victims in the Trinity season (S4), which kills broke Harry's Code?",
    sql: `select victim_name, episode_number, method_key, code_of_harry_compliant, season_arc_text
from slice_of_life.gold.fct_kill
where canon = 'original' and season_number = 4
  and code_of_harry_compliant = false
order by episode_number;`,
  },
  {
    q: "How did Dexter's method mix shift in New Blood compared to the original series?",
    sql: `with mix as (
  select canon, method_key, count(*)::float / count(*) over (partition by canon) as share
  from slice_of_life.gold.fct_kill
  group by canon, method_key
)
select canon, method_key, round(share * 100, 1) as pct
from mix
where canon in ('original', 'new_blood')
order by canon, pct desc;`,
  },
  {
    q: "Which season antagonists did Dexter eventually kill, and which escaped?",
    sql: `select a.canon, a.season_number, a.character_name as antagonist, a.alias,
       (k.kill_sk is not null) as killed_by_dexter
from slice_of_life.gold.dim_antagonist a
left join slice_of_life.gold.fct_kill k
  on k.victim_name = a.character_name
 and k.canon = a.canon
 and k.season_number = a.season_number
order by a.canon, a.season_number;`,
  },
  {
    q: "Where do the bodies go? Disposal-site share across the full canon.",
    sql: `select disposal_key, count(*) as kills,
       round(count(*) * 100.0 / sum(count(*)) over (), 1) as pct
from slice_of_life.gold.fct_kill
group by disposal_key
order by kills desc;`,
  },
  {
    q: "Code-of-Harry compliance rate by season, ordered most to least disciplined.",
    sql: `select canon, season_number,
       count(*) as kills,
       sum(case when code_of_harry_compliant then 1 else 0 end) as compliant,
       round(avg(case when code_of_harry_compliant then 1.0 else 0.0 end) * 100, 1) as compliance_pct
from slice_of_life.gold.fct_kill
group by canon, season_number
order by compliance_pct desc;`,
  },
];

export default function AskPage() {
  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="type text-[10px] uppercase tracking-[0.35em] text-signal mb-3 slide-mark">Cortex</p>
        <h1 className="serif text-4xl sm:text-5xl text-bone mb-3">Ask the corpus</h1>
        <p className="serif italic text-ash/65 mb-10 max-w-3xl">
          Snowflake Cortex Analyst is attached to the <span className="font-mono text-bone/80">dexter_corpus</span> semantic model
          over gold.fct_kill (see transform/cortex/dexter_corpus.yaml). The questions below are verified queries that ship
          with the model; in a live deployment a question box here would forward to the Cortex Analyst service.
        </p>

        <div className="space-y-4">
          {QUESTIONS.map((item) => (
            <article key={item.q} className="evidence-card rounded-sm p-5">
              <h2 className="serif text-lg text-bone leading-snug mb-3">{item.q}</h2>
              <pre className="font-mono text-[12px] leading-relaxed text-ash/85 overflow-x-auto bg-ink/60 border border-bone/10 rounded-sm p-3"><code>{item.sql}</code></pre>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
