import { kills, locationLabels, disposalLabels, canonLabels, type Canon, type LocationKey, type DisposalKey } from "@/lib/kills";

export default function LocationsPage() {
  const locCounts = new Map<LocationKey, number>();
  const dispCounts = new Map<DisposalKey, number>();
  for (const k of kills) {
    locCounts.set(k.location, (locCounts.get(k.location) ?? 0) + 1);
    dispCounts.set(k.disposal, (dispCounts.get(k.disposal) ?? 0) + 1);
  }
  const locRows  = [...locCounts.entries()].sort((a, b) => b[1] - a[1]);
  const dispRows = [...dispCounts.entries()].sort((a, b) => b[1] - a[1]);
  const locMax  = Math.max(...locRows.map(([, c]) => c));
  const dispMax = Math.max(...dispRows.map(([, c]) => c));

  // Canon-level geography note.
  const canons: Canon[] = ["original", "new_blood", "original_sin"];
  const canonLocations = canons.map((canon) => ({
    canon,
    rows: [...kills.filter((k) => k.canon === canon).reduce((m, k) => {
      m.set(k.location, (m.get(k.location) ?? 0) + 1);
      return m;
    }, new Map<LocationKey, number>()).entries()].sort((a, b) => b[1] - a[1]),
  }));

  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="type text-[10px] uppercase tracking-[0.35em] text-signal mb-3 slide-mark">Locations</p>
        <h1 className="serif text-4xl sm:text-5xl text-bone mb-3">Where it happens. Where it goes.</h1>
        <p className="serif text-ash/75 mb-10 max-w-3xl">
          Kill room dominates the original. Iron Lake&apos;s woods take over in <em>New Blood</em>. Bodies go to open water more than anywhere else — Miami delivers.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Panel title="Kill site" rows={locRows.map(([k, c]) => ({ label: locationLabels[k], count: c }))} max={locMax} />
          <Panel title="Body disposal" rows={dispRows.map(([k, c]) => ({ label: disposalLabels[k], count: c }))} max={dispMax} />
        </div>

        <h2 className="type text-[10px] uppercase tracking-[0.25em] text-signal mb-5">By canon</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {canonLocations.map(({ canon, rows }) => (
            <div key={canon} className="evidence-card rounded-sm p-5">
              <p className="serif text-lg text-bone mb-1">{canonLabels[canon]}</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {rows.map(([k, c]) => (
                  <li key={k} className="flex items-baseline justify-between gap-3">
                    <span className="text-ash/85">{locationLabels[k]}</span>
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

function Panel({ title, rows, max }: { title: string; rows: { label: string; count: number }[]; max: number; }) {
  return (
    <div className="evidence-card rounded-sm p-6">
      <h2 className="type text-[10px] uppercase tracking-[0.25em] text-ash/55 mb-5">{title}</h2>
      <div className="space-y-3">
        {rows.map(({ label, count }) => (
          <div key={label} className="grid grid-cols-[10rem_1fr_3rem] items-center gap-3 sm:grid-cols-[12rem_1fr_3rem]">
            <span className="serif text-sm text-bone">{label}</span>
            <div className="h-2 bg-bone/8 rounded-sm overflow-hidden">
              <div className="h-full bg-slide" style={{ width: `${(count / max) * 100}%` }} />
            </div>
            <span className="font-mono text-xs text-ash/70 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
