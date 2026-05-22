import { antagonists } from "@/lib/antagonists";
import { kills, canonLabels } from "@/lib/kills";

export default function AntagonistsPage() {
  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="type text-[10px] uppercase tracking-[0.35em] text-signal mb-3 slide-mark">Antagonists</p>
        <h1 className="serif text-4xl sm:text-5xl text-bone mb-3">{antagonists.length} season antagonists</h1>
        <p className="serif italic text-ash/65 mb-10 max-w-3xl">
          The named "Big Bad" of each season. Some Dexter eventually kills; some he doesn't. The kill-by-Dexter column joins gold.fct_kill on victim_name + season.
        </p>

        <div className="space-y-4">
          {antagonists.map((a) => {
            const killedByDexter = kills.find((k) => k.victim === a.name && k.canon === a.canon && k.season === a.season);
            return (
              <article key={a.qid} className="evidence-card p-5 rounded-sm">
                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                  <h2 className="serif text-2xl text-bone leading-tight">{a.alias}</h2>
                  <span className="type text-xs text-ash/55">— {a.name}, portrayed by {a.portrayedBy}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="pill">{canonLabels[a.canon]}</span>
                  <span className="pill">Season {a.season}</span>
                  {killedByDexter ? (
                    <span className="pill pill--slide">Killed by Dexter · S{killedByDexter.season}E{String(killedByDexter.episode).padStart(2,"0")}</span>
                  ) : (
                    <span className="pill pill--neon">Not killed by Dexter</span>
                  )}
                </div>
                <p className="serif text-sm text-ash/85 leading-relaxed max-w-3xl">{a.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
