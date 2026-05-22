import { antagonists } from "@/lib/antagonists";
import { TIER_META, tierFor, type TierKey } from "@/lib/tiers";
import { canonLabels } from "@/lib/kills";

const ORDER: TierKey[] = ["S", "A", "B", "C", "D"];

export default function TierPage() {
  const rows = ORDER.map((tier) => ({
    tier,
    meta: TIER_META[tier],
    antagonists: antagonists.filter((a) => tierFor(a) === tier),
  }));

  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="type text-[10px] uppercase tracking-[0.35em] text-signal mb-3 slide-mark">Tier list</p>
        <h1 className="serif text-4xl sm:text-5xl text-bone mb-3">Big Bads, ranked.</h1>
        <p className="serif text-lg text-ash/85 mb-2 max-w-3xl">
          The official Jack ranking. Fight us about Trinity.
        </p>
        <p className="serif italic text-sm text-ash/55 mb-12 max-w-3xl">
          &ldquo;You can&apos;t be a killer and a hero. It doesn&apos;t work that way.&rdquo; — Debra Morgan, S8
        </p>

        <div className="space-y-3">
          {rows.map(({ tier, meta, antagonists: list }) => (
            <div key={tier} className="grid grid-cols-[5rem_1fr] sm:grid-cols-[7rem_1fr] gap-3 items-stretch">
              <TierBadge tier={tier} accent={meta.accent} blurb={meta.blurb} />
              <div className="evidence-card rounded-sm p-4 min-h-[6rem]">
                {list.length === 0 ? (
                  <p className="serif italic text-sm text-ash/40">Empty. Move someone here.</p>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {list.map((a) => (
                      <li key={a.qid} className="px-3 py-2 border border-bone/15 rounded-sm bg-ink/70">
                        <p className="serif text-base text-bone leading-tight">{a.alias}</p>
                        <p className="type text-[10px] uppercase tracking-[0.2em] text-ash/55 mt-0.5">
                          {a.name} · {canonLabels[a.canon]} S{a.season}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 evidence-card rounded-sm p-5 max-w-3xl">
          <p className="type text-[10px] uppercase tracking-[0.25em] text-signal mb-2">Rules of the ranking</p>
          <ul className="serif text-sm text-ash/80 space-y-1.5 list-disc list-inside marker:text-signal/70">
            <li>S-tier is reserved for villains who define their season. Trinity, Ice Truck Killer, and nobody else.</li>
            <li>Hannah McKay counts as an antagonist even though Dexter doesn&apos;t kill her. Romance ≠ ally.</li>
            <li>Doakes is in D because he isn&apos;t the actual Bay Harbor Butcher — he was framed for it.</li>
            <li>Original Sin is a prequel — Aaron Spencer is the antagonist of the pilot, not the season.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

function TierBadge({ tier, accent, blurb }: { tier: TierKey; accent: "slide" | "signal" | "neon" | "bone" | "ash"; blurb: string }) {
  const colorMap: Record<typeof accent, { bg: string; text: string; border: string }> = {
    slide:  { bg: "bg-slide",           text: "text-bone",   border: "border-signal/60" },
    signal: { bg: "bg-signal/80",       text: "text-bone",   border: "border-signal/50" },
    neon:   { bg: "bg-neon/70",         text: "text-ink",    border: "border-neon/50"   },
    bone:   { bg: "bg-bone/85",         text: "text-ink",    border: "border-bone/50"   },
    ash:    { bg: "bg-ash/50",          text: "text-ink",    border: "border-ash/40"    },
  };
  const c = colorMap[accent];
  return (
    <div className={`relative ${c.bg} ${c.text} ${c.border} border rounded-sm flex flex-col items-center justify-center text-center px-2`}>
      <span className="serif text-5xl sm:text-6xl leading-none">{tier}</span>
      <span className="type text-[8px] sm:text-[9px] uppercase tracking-[0.15em] mt-1 px-1 leading-tight">{blurb}</span>
    </div>
  );
}
