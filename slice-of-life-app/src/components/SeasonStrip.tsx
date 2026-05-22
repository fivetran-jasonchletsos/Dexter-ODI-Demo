import { killsBySeason, canonLabels } from "@/lib/stats";
import type { Canon } from "@/lib/kills";

export default function SeasonStrip() {
  const rows = killsBySeason();
  const max = Math.max(...rows.map((r) => r.count));
  const grouped = (["original", "new_blood", "original_sin"] as Canon[]).map((canon) => ({
    canon,
    seasons: rows.filter((r) => r.canon === canon).sort((a, b) => a.season - b.season),
  }));

  return (
    <section className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 section-ornament">
          <span className="type text-[11px] uppercase tracking-[0.35em] text-signal">Kills by season</span>
        </div>
        <div className="space-y-12">
          {grouped.map(({ canon, seasons }) => (
            <div key={canon}>
              <p className="type text-[10px] uppercase tracking-[0.3em] text-ash/55 mb-4">{canonLabels[canon]}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {seasons.map(({ season, count }) => (
                  <div key={`${canon}-${season}`} className="evidence-card rounded-sm p-4">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="type text-[10px] uppercase tracking-[0.2em] text-ash/55">
                        Season {season}
                      </span>
                      <span className="serif text-3xl text-bone">{count}</span>
                    </div>
                    <div className="h-1.5 bg-bone/8 rounded-sm overflow-hidden">
                      <div className="h-full bg-slide" style={{ width: `${(count / max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
