import { kills, canonLabels, victimTypeLabels } from "@/lib/kills";

export default function VictimsPage() {
  const sorted = [...kills].sort((a, b) => a.victim.localeCompare(b.victim));
  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="type text-[10px] uppercase tracking-[0.35em] text-signal mb-3 slide-mark">Victims</p>
        <h1 className="serif text-4xl sm:text-5xl text-bone mb-3">{sorted.length} names. {sorted.length} reasons.</h1>
        <p className="serif text-ash/75 mb-10 max-w-3xl">
          Every one has a prior-crimes record. Green dot means the kill held up under Harry&apos;s Code. Red means it didn&apos;t.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((k) => (
            <article key={k.id} className="evidence-card p-5 rounded-sm">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="serif text-xl text-bone leading-tight">{k.victim}</h2>
                <span className={`code-dot ${k.codeCompliant ? "code-dot--yes" : "code-dot--no"}`} aria-label={k.codeCompliant ? "compliant" : "violated"} />
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="pill">{canonLabels[k.canon]}</span>
                <span className="pill">S{k.season}·E{String(k.episode).padStart(2, "0")}</span>
                <span className="pill pill--slide">{victimTypeLabels[k.victimType]}</span>
              </div>
              <p className="serif text-sm text-ash/85 leading-relaxed">{k.priorCrimes}</p>
              <p className="type text-[10px] uppercase tracking-[0.25em] text-ash/45 mt-4">
                {k.episodeTitle}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
