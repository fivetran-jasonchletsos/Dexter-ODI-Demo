import { kills, canonLabels } from "@/lib/kills";
import { codeStats } from "@/lib/stats";

const RULES = [
  { n: 1, rule: "Don't get caught.",                                                     gloss: "Operational discipline. Forensic counter-measures, kill rooms, disposal." },
  { n: 2, rule: "Never kill an innocent. Be sure.",                                      gloss: "Proof, not suspicion. The blood slide goes in the box only after." },
  { n: 3, rule: "Target killers. People who have already killed and will kill again.",   gloss: "Harry's filter. Not justice in general — specific killers who escaped the law." },
];

export default function CodePage() {
  const s = codeStats();
  const violators = kills.filter((k) => !k.codeCompliant);
  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="type text-[10px] uppercase tracking-[0.35em] text-signal mb-3 slide-mark">The Code</p>
        <h1 className="serif text-4xl sm:text-5xl text-bone mb-3">Harry's Code, scored against {kills.length} kills</h1>
        <p className="serif italic text-ash/65 mb-10 max-w-3xl">
          The Code is three rules. Each kill in gold.fct_kill carries a single boolean: did all three hold at once? The compliance rate is {(s.rate * 100).toFixed(1)}% — Dexter breaks his own rule a non-trivial share of the time, mostly when emotion overrides ritual.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Stat label="Total kills"          value={s.total} />
          <Stat label="Code-compliant"       value={s.compliant} accent="neon" />
          <Stat label="Violations"           value={s.nonCompliant} accent="slide" />
        </div>

        <div className="evidence-card rounded-sm p-6 mb-12">
          <h2 className="type text-[10px] uppercase tracking-[0.25em] text-ash/55 mb-5">The three rules</h2>
          <ol className="space-y-5">
            {RULES.map((r) => (
              <li key={r.n} className="grid grid-cols-[2rem_1fr] gap-4">
                <span className="font-mono text-signal/70 text-sm pt-0.5">{String(r.n).padStart(2, "0")}</span>
                <div>
                  <p className="serif text-lg text-bone leading-snug">{r.rule}</p>
                  <p className="serif italic text-sm text-ash/60 mt-1">{r.gloss}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <h2 className="type text-[10px] uppercase tracking-[0.25em] text-signal mb-5">Code violations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {violators.map((k) => (
            <article key={k.id} className="evidence-card p-5 rounded-sm border-slide/30">
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <h3 className="serif text-lg text-bone">{k.victim}</h3>
                <span className="pill pill--slide">Violation</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="pill">{canonLabels[k.canon]}</span>
                <span className="pill">S{k.season}·E{String(k.episode).padStart(2, "0")}</span>
              </div>
              <p className="serif text-sm text-ash/85 leading-relaxed">{k.arc}</p>
              <p className="serif italic text-sm text-ash/55 mt-2">{k.priorCrimes}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: "neon" | "slide" }) {
  const color =
    accent === "neon"  ? "text-neon"  :
    accent === "slide" ? "text-signal" :
                         "text-bone";
  return (
    <div className="evidence-card rounded-sm p-5">
      <p className="type text-[10px] uppercase tracking-[0.2em] text-ash/55 mb-2">{label}</p>
      <p className={`serif text-5xl ${color}`}>{value}</p>
    </div>
  );
}
