// Antagonist tier list — Jack's defaults, designed to start arguments.
// S = canonically untouchable; A = elite season; B = great but flawed;
// C = solid but not iconic; D = the ones the fandom keeps off lists.

import type { Antagonist } from "./antagonists";

export type TierKey = "S" | "A" | "B" | "C" | "D";

export const TIER_META: Record<TierKey, { label: string; blurb: string; accent: "slide" | "signal" | "neon" | "bone" | "ash" }> = {
  S: { label: "S",  blurb: "Untouchable. The season that defined the show.",       accent: "slide"  },
  A: { label: "A",  blurb: "Elite. Top-tier seasons people quote forever.",         accent: "signal" },
  B: { label: "B",  blurb: "Great arc, one or two weak episodes.",                  accent: "neon"   },
  C: { label: "C",  blurb: "Solid villain, mid-tier season overall.",               accent: "bone"   },
  D: { label: "D",  blurb: "The ones the rewatch fandom argues to skip.",           accent: "ash"    },
};

// Default placements. These are intentionally opinionated.
export const DEFAULT_TIER: Record<string, TierKey> = {
  // S — Trinity is the consensus best villain
  "Q1928568": "S", // Arthur Mitchell — Trinity Killer
  "Q1063232": "S", // Brian Moser — Ice Truck Killer

  // A — high-tier villains
  "Q1936213": "A", // Miguel Prado
  "Q7777122": "A", // Hannah McKay
  "Q108991213": "A", // Kurt Caldwell — Iron Lake Trapper

  // B
  "Q5860421": "B", // Jordan Chase
  "Q7777121": "B", // Isaak Sirko
  "Q7777123": "B", // Oliver Saxon — Brain Surgeon

  // C
  "Q5965021": "C", // Travis Marshall — Doomsday
  "Q124800001": "C", // Aaron Spencer — Original Sin pilot kill

  // D
  "Q5260054": "D", // James Doakes (framed)
};

export function tierFor(a: Antagonist): TierKey {
  return DEFAULT_TIER[a.qid] ?? "C";
}
