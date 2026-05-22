#!/usr/bin/env node
/**
 * Fetch TMDB episode stills + Dexter Fandom Wiki victim portraits
 * for the Slice of Life Archive.
 *
 *   Episodes — TMDB still_path via /tv/{series_id}/season/{n}/episode/{m}.
 *              Series ids: 1405 (original), 110492 (New Blood), 219937 (Original Sin).
 *   Victims  — Fandom MediaWiki API: action=parse on the victim page,
 *              extract og:image from the parsed text, fall back to the
 *              first File:* image in the page wikitext.
 *
 *   TMDB_API_KEY=xxxx node scripts/fetch-assets.mjs [--force]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, "..");
const APP       = resolve(ROOT, "slice-of-life-app");
const EPISODES  = resolve(APP, "public/episodes");
const VICTIMS   = resolve(APP, "public/victims");
mkdirSync(EPISODES, { recursive: true });
mkdirSync(VICTIMS,  { recursive: true });

const TMDB_KEY = process.env.TMDB_API_KEY;
const FORCE    = process.argv.includes("--force");
const SERIES = {
  original:     1405,
  new_blood:    110492,
  original_sin: 219937,
};

function djb2(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(16);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Pull the kill list from the TypeScript source. Light parse — we just
// need (canon, season, episode, victim, wiki) for asset lookup.
function parseKills() {
  const text = readFileSync(resolve(APP, "src/lib/kills.ts"), "utf8");
  const re = /id:\s*"(k\d+)",\s*canon:\s*"([^"]+)",\s*season:\s*(\d+),\s*episode:\s*(\d+),\s*episodeTitle:\s*"([^"]+)",\s*victim:\s*"([^"]+)"[\s\S]*?wiki:\s*"([^"]+)"/g;
  const kills = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    kills.push({
      id: m[1], canon: m[2], season: Number(m[3]), episode: Number(m[4]),
      episodeTitle: m[5], victim: m[6], wiki: m[7],
    });
  }
  return kills;
}

// ───── TMDB episode stills ─────
async function fetchEpisodeStill(canon, season, episode) {
  if (!TMDB_KEY) return null;
  const seriesId = SERIES[canon];
  if (!seriesId) return null;
  const url = `https://api.themoviedb.org/3/tv/${seriesId}/season/${season}/episode/${episode}?api_key=${TMDB_KEY}`;
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const data = await r.json();
    if (!data.still_path) return null;
    const img = `https://image.tmdb.org/t/p/w780${data.still_path}`;
    const ir = await fetch(img);
    if (!ir.ok) return null;
    const buf = Buffer.from(await ir.arrayBuffer());
    if (buf.length < 2000) return null;
    return buf;
  } catch (e) {
    return null;
  }
}

// ───── Fandom victim portraits ─────
//   The Dexter Fandom URLs are like /wiki/Mike_Donovan. The MediaWiki API
//   exposes /api.php?action=query&prop=pageimages&format=json&piprop=original
//   which gives the canonical infobox image URL.
async function fetchVictimPortrait(wikiUrl) {
  const match = wikiUrl.match(/\/wiki\/(.+)$/);
  if (!match) return null;
  const pageTitle = decodeURIComponent(match[1]);
  const api = `https://dexter.fandom.com/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(pageTitle)}`;
  try {
    const r = await fetch(api, { headers: { "User-Agent": "slice-of-life-archive/1.0" } });
    if (!r.ok) return null;
    const data = await r.json();
    const pages = data?.query?.pages ?? {};
    const first = Object.values(pages)[0];
    const url   = first?.original?.source;
    if (!url) return null;
    const ir = await fetch(url);
    if (!ir.ok) return null;
    const buf = Buffer.from(await ir.arrayBuffer());
    if (buf.length < 2000) return null;
    return buf;
  } catch (e) {
    return null;
  }
}

const kills = parseKills();
console.log(`Kills in source: ${kills.length}`);

// ───── Episodes ─────
const episodeManifest = {};
const uniqueEpisodes = new Map();
for (const k of kills) {
  uniqueEpisodes.set(`${k.canon}|${k.season}|${k.episode}`, k);
}
console.log(`Unique episodes: ${uniqueEpisodes.size}`);

for (const [key, k] of uniqueEpisodes.entries()) {
  const slug = djb2(key);
  const out  = resolve(EPISODES, `${slug}.jpg`);
  if (FORCE && existsSync(out)) unlinkSync(out);

  const entry = { found: false, episodeTitle: k.episodeTitle, canon: k.canon, season: k.season, episode: k.episode };
  if (existsSync(out)) {
    entry.found = true;
    entry.source = "cached";
  } else {
    const buf = await fetchEpisodeStill(k.canon, k.season, k.episode);
    if (buf) {
      writeFileSync(out, buf);
      entry.found = true;
      entry.source = "tmdb";
      console.log(`  still   ✓ ${k.canon} S${k.season}E${String(k.episode).padStart(2, "0")} ${k.episodeTitle}`);
    } else {
      console.log(`  still   ✗ ${k.canon} S${k.season}E${String(k.episode).padStart(2, "0")} ${k.episodeTitle}`);
    }
    await sleep(120);
  }
  episodeManifest[slug] = entry;
}
writeFileSync(resolve(EPISODES, "manifest.json"), JSON.stringify(episodeManifest, null, 2));

// ───── Victims ─────
const victimManifest = {};
for (const k of kills) {
  const slug = djb2(k.victim);
  const out  = resolve(VICTIMS, `${slug}.jpg`);
  if (FORCE && existsSync(out)) unlinkSync(out);

  const entry = { found: false, victim: k.victim, canon: k.canon };
  if (existsSync(out)) {
    entry.found = true;
    entry.source = "cached";
  } else {
    const buf = await fetchVictimPortrait(k.wiki);
    if (buf) {
      writeFileSync(out, buf);
      entry.found = true;
      entry.source = "fandom";
      console.log(`  portrait ✓ ${k.victim}`);
    } else {
      console.log(`  portrait ✗ ${k.victim}`);
    }
    await sleep(180);
  }
  victimManifest[slug] = entry;
}
writeFileSync(resolve(VICTIMS, "manifest.json"), JSON.stringify(victimManifest, null, 2));

const ec = Object.values(episodeManifest).filter((x) => x.found).length;
const vc = Object.values(victimManifest).filter((x) => x.found).length;
console.log(`Done. Episodes with stills:  ${ec}/${Object.keys(episodeManifest).length}`);
console.log(`     Victims with portraits: ${vc}/${Object.keys(victimManifest).length}`);
