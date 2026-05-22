import { kills, canonLabels, methodLabels, locationLabels, victimTypeLabels,
         type Canon, type Kill, type MethodKey, type LocationKey, type VictimType } from "./kills";

// Aggregate helpers used across pages. Pure functions over the static
// kill list; if you switch this app to query Snowflake directly,
// replace each with a `SELECT … GROUP BY …` against gold.fct_kill.

export function countBy<T extends string>(rows: Kill[], key: (k: Kill) => T): Map<T, number> {
  const out = new Map<T, number>();
  for (const r of rows) out.set(key(r), (out.get(key(r)) ?? 0) + 1);
  return out;
}

export function seasonsForCanon(canon: Canon): number[] {
  const xs = new Set<number>();
  for (const k of kills) if (k.canon === canon) xs.add(k.season);
  return [...xs].sort((a, b) => a - b);
}

export function killsBySeason(): { canon: Canon; season: number; count: number }[] {
  const buckets = new Map<string, number>();
  for (const k of kills) {
    const key = `${k.canon}|${k.season}`;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return [...buckets.entries()].map(([k, count]) => {
    const [canon, season] = k.split("|");
    return { canon: canon as Canon, season: Number(season), count };
  });
}

export function methodMix(): { method: MethodKey; count: number }[] {
  const m = countBy<MethodKey>(kills, (k) => k.method);
  return [...m.entries()]
    .map(([method, count]) => ({ method, count }))
    .sort((a, b) => b.count - a.count);
}

export function locationMix(): { location: LocationKey; count: number }[] {
  const m = countBy<LocationKey>(kills, (k) => k.location);
  return [...m.entries()]
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count);
}

export function victimTypeMix(): { type: VictimType; count: number }[] {
  const m = countBy<VictimType>(kills, (k) => k.victimType);
  return [...m.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

export function codeStats() {
  const compliant = kills.filter((k) => k.codeCompliant).length;
  return {
    total: kills.length,
    compliant,
    nonCompliant: kills.length - compliant,
    rate: compliant / kills.length,
  };
}

export const SUMMARY = {
  total: kills.length,
  canons: Object.keys(canonLabels).length,
  seasons: new Set(kills.map((k) => `${k.canon}|${k.season}`)).size,
  methods: new Set(kills.map((k) => k.method)).size,
};

export { canonLabels, methodLabels, locationLabels, victimTypeLabels };
