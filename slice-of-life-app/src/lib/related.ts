// Related-cases similarity engine for the Slice of Life Archive.
//
// Computes a top-K nearest-neighbor list for each kill/case using weighted
// Jaccard overlap across modus operandi, signature tags, victim profile,
// location, season proximity, and arc.
//
// Mirrors what a Cortex embedding pipeline would produce in production —
// the math runs locally so the static site ships the network without a
// runtime API.

import { kills, type Kill } from "./kills";

export type RelatedCase = {
  id: string;
  kill: Kill;
  score: number;        // 0..1
  why: string;          // human-readable reason shown in UI
  sharedMethod: boolean;
  sharedVictimType: boolean;
  sharedLocation: boolean;
};

// ---------------------------------------------------------------------------
// Weights — modus operandi + signature highest, then victim profile, then
// season proximity. Location is a supporting signal.
// ---------------------------------------------------------------------------
const W_METHOD       = 1.6;  // modus operandi / murder weapon
const W_VICTIM_TYPE  = 1.2;  // victim profile category
const W_ARC          = 1.4;  // same season arc is the strongest narrative bond
const W_LOCATION     = 0.8;  // kill location type
const W_DISPOSAL     = 0.6;  // disposal method (signature)
const W_CODE         = 0.5;  // both compliant or both violations
const W_SEASON       = 0.5;  // season proximity
const W_CANON        = 0.3;  // same canon series

const MAX_WEIGHT = W_METHOD + W_VICTIM_TYPE + W_ARC + W_LOCATION + W_DISPOSAL + W_CODE + W_SEASON + W_CANON;

const K = 8; // neighbors per case

// ---------------------------------------------------------------------------
// Pairwise scoring
// ---------------------------------------------------------------------------
function seasonProximity(a: Kill, b: Kill): number {
  // Normalise both into a global season-ish number for proximity.
  // Treat New Blood / Original Sin as season 9/10 for spacing purposes.
  const canonOffset = (c: string) =>
    c === "original" ? 0 : c === "new_blood" ? 8 : 10;
  const sa = a.season + canonOffset(a.canon);
  const sb = b.season + canonOffset(b.canon);
  const gap = Math.abs(sa - sb);
  if (gap === 0) return 1;
  if (gap >= 6) return 0;
  return 1 - gap / 6;
}

function scoreKills(a: Kill, b: Kill): {
  score: number;
  sharedMethod: boolean;
  sharedVictimType: boolean;
  sharedLocation: boolean;
  whyParts: string[];
  why: string;
} {
  const whyParts: string[] = [];

  // Arc — same named arc is the tightest thematic bond.
  // Strip trailing "(finale)" / "(finale lead-up)" etc. before comparing.
  const arcCore = (arc: string) => arc.replace(/\s*\(.*\)/, "").trim();
  const arcMatch = arcCore(a.arc) === arcCore(b.arc) ? 1 : 0;
  if (arcMatch) whyParts.push(`Same arc: ${arcCore(a.arc)}`);

  const methodMatch = a.method === b.method ? 1 : 0;
  const victimMatch = a.victimType === b.victimType ? 1 : 0;
  const locationMatch = a.location === b.location ? 1 : 0;
  const disposalMatch = a.disposal === b.disposal ? 1 : 0;
  const codeMatch = a.codeCompliant === b.codeCompliant ? 1 : 0;
  const seasonScore = seasonProximity(a, b);
  const canonMatch = a.canon === b.canon ? 1 : 0;

  const raw =
    W_ARC        * arcMatch     +
    W_METHOD     * methodMatch  +
    W_VICTIM_TYPE * victimMatch +
    W_LOCATION   * locationMatch +
    W_DISPOSAL   * disposalMatch +
    W_CODE       * codeMatch    +
    W_SEASON     * seasonScore  +
    W_CANON      * canonMatch;

  const norm = raw / MAX_WEIGHT;

  // Build "why" string — lead with the most salient signal.
  if (arcMatch) {
    // already pushed above
  } else if (methodMatch && victimMatch) {
    whyParts.push(`Same method and victim type`);
  } else if (methodMatch) {
    whyParts.push(`Same kill method`);
  } else if (victimMatch) {
    whyParts.push(`Same victim profile`);
  }

  if (!arcMatch && locationMatch) whyParts.push(`Same location type`);
  if (!arcMatch && disposalMatch) whyParts.push(`Same disposal`);
  if (codeMatch && !a.codeCompliant) whyParts.push(`Both code violations`);
  if (seasonScore >= 0.8 && !arcMatch) whyParts.push(`Same season`);

  const why = whyParts.slice(0, 2).join("; ") || "Related case";

  return {
    score: norm,
    sharedMethod: methodMatch === 1,
    sharedVictimType: victimMatch === 1,
    sharedLocation: locationMatch === 1,
    whyParts,
    why,
  };
}

// ---------------------------------------------------------------------------
// Top-K neighbor cache — built once, reused
// ---------------------------------------------------------------------------
let _cache: Map<string, RelatedCase[]> | null = null;

function build(): Map<string, RelatedCase[]> {
  const result = new Map<string, RelatedCase[]>();

  for (let i = 0; i < kills.length; i++) {
    const a = kills[i];
    const scored: (RelatedCase & { _why: string })[] = [];

    for (let j = 0; j < kills.length; j++) {
      if (i === j) continue;
      const b = kills[j];
      const s = scoreKills(a, b);
      if (s.score <= 0) continue;
      scored.push({
        id: b.id,
        kill: b,
        score: s.score,
        why: s.why,
        sharedMethod: s.sharedMethod,
        sharedVictimType: s.sharedVictimType,
        sharedLocation: s.sharedLocation,
        _why: s.why,
      });
    }

    scored.sort((x, y) => y.score - x.score);

    result.set(a.id, scored.slice(0, K).map(({ _why: _, ...rest }) => rest));
  }

  return result;
}

export function relatedFor(killId: string): RelatedCase[] {
  if (!_cache) _cache = build();
  return _cache.get(killId) ?? [];
}

// Returns all cases as node + edge data for the force-directed graph.
export type GraphNode = {
  id: string;
  kill: Kill;
};

export type GraphEdge = {
  source: string;
  target: string;
  score: number;
  why: string;
};

let _graph: { nodes: GraphNode[]; edges: GraphEdge[] } | null = null;

export function buildGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  if (_graph) return _graph;
  if (!_cache) _cache = build();

  const nodes: GraphNode[] = kills.map((k) => ({ id: k.id, kill: k }));
  const seen = new Set<string>();
  const edges: GraphEdge[] = [];

  for (const [sourceId, neighbors] of _cache.entries()) {
    for (const nb of neighbors) {
      const key = [sourceId, nb.id].sort().join("--");
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ source: sourceId, target: nb.id, score: nb.score, why: nb.why });
    }
  }

  _graph = { nodes, edges };
  return _graph;
}

// Color by victim type for the canvas visualization.
const victimTypeColors: Record<string, string> = {
  serial_killer:  "#cf2030",
  predator:       "#a31423",
  murderer:       "#7a3a10",
  trafficker:     "#4a6a40",
  other_violent:  "#4a4070",
  unknown:        "#3a3a4a",
};

export function caseColor(victimType: string): string {
  return victimTypeColors[victimType] ?? "#3a3a4a";
}
