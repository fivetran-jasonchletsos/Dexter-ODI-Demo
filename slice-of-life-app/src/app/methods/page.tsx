import { methodMix } from "@/lib/stats";
import { kills, methodLabels, canonLabels, type Canon, type MethodKey } from "@/lib/kills";

export default function MethodsPage() {
  const mix = methodMix();
  const max = Math.max(...mix.map((m) => m.count));

  // Per-canon method breakdown for the second panel.
  const canons: Canon[] = ["original", "new_blood", "original_sin"];
  const perCanon = canons.map((canon) => {
    const subset = kills.filter((k) => k.canon === canon);
    const counts = new Map<MethodKey, number>();
    for (const k of subset) counts.set(k.method, (counts.get(k.method) ?? 0) + 1);
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    return { canon, total: subset.length, methods: sorted };
  });

  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="type text-[10px] uppercase tracking-[0.35em] text-signal mb-3 slide-mark">Methods</p>
        <h1 className="serif text-4xl sm:text-5xl text-bone mb-3">How he does it.</h1>
        <p className="serif text-ash/75 mb-10 max-w-3xl">
          Knife is the ritual. M99 is the sedative — except in <em>Original Sin</em> and <em>New Blood</em>, where M99 finishes the job alone. Watch the bar chart shift.
        </p>

        <div className="evidence-card rounded-sm p-6 mb-12">
          <h2 className="type text-[10px] uppercase tracking-[0.25em] text-ash/55 mb-5">Overall</h2>
          <div className="space-y-3">
            {mix.map(({ method, count }) => (
              <div key={method} className="grid grid-cols-[10rem_1fr_3rem] items-center gap-3 sm:grid-cols-[14rem_1fr_3rem]">
                <span className="serif text-sm text-bone">{methodLabels[method]}</span>
                <div className="h-2 bg-bone/8 rounded-sm overflow-hidden">
                  <div className="h-full bg-slide" style={{ width: `${(count / max) * 100}%` }} />
                </div>
                <span className="font-mono text-xs text-ash/70 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <h2 className="type text-[10px] uppercase tracking-[0.25em] text-signal mb-5">By canon</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {perCanon.map(({ canon, total, methods }) => (
            <div key={canon} className="evidence-card rounded-sm p-5">
              <p className="serif text-lg text-bone mb-1">{canonLabels[canon]}</p>
              <p className="type text-[10px] uppercase tracking-[0.2em] text-ash/55 mb-4">{total} kills</p>
              <ul className="space-y-1.5 text-sm">
                {methods.map(([m, c]) => (
                  <li key={m} className="flex items-baseline justify-between gap-3">
                    <span className="text-ash/85">{methodLabels[m]}</span>
                    <span className="font-mono text-xs text-ash/55">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
