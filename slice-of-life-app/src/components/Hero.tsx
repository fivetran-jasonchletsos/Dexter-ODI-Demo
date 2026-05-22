import Link from "next/link";
import { SUMMARY } from "@/lib/stats";
import { antagonists } from "@/lib/antagonists";

export default function Hero() {
  return (
    <section className="border-b border-bone/10 px-5 py-16 sm:px-6 sm:py-20 md:px-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="type text-[10px] uppercase tracking-[0.35em] text-signal mb-4 slide-mark">
          Slice of Life Archive · 2006 – 2025 · Curated for Jack
        </p>
        <h1 className="serif text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-bone">
          <span className="slide-underline">Dexter Morgan</span> kill record,
          <br className="hidden sm:block" /> indexed and joined.
        </h1>
        <p className="serif mt-7 max-w-2xl text-lg italic text-ash/80 leading-relaxed">
          {SUMMARY.total} on-screen kills across {SUMMARY.seasons} seasons, three canons,
          and {antagonists.length} season antagonists. Method, location, disposal,
          season arc, and Code of Harry adherence — all from the Dexter
          Fandom Wiki, TMDB, and Wikidata; landed by Fivetran; modeled by
          dbt into a Snowflake gold layer; answered by Cortex Analyst.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/kills"        className="px-5 py-2.5 type uppercase tracking-[0.2em] text-xs bg-slide text-bone hover:bg-signal transition border border-signal/40">Kills</Link>
          <Link href="/victims"      className="px-5 py-2.5 type uppercase tracking-[0.2em] text-xs border border-bone/25 text-ash hover:text-bone hover:border-signal/60 transition">Victims</Link>
          <Link href="/antagonists"  className="px-5 py-2.5 type uppercase tracking-[0.2em] text-xs border border-bone/25 text-ash hover:text-bone hover:border-signal/60 transition">Antagonists</Link>
          <Link href="/methods"      className="px-5 py-2.5 type uppercase tracking-[0.2em] text-xs border border-bone/25 text-ash hover:text-bone hover:border-signal/60 transition">Methods</Link>
          <Link href="/code"         className="px-5 py-2.5 type uppercase tracking-[0.2em] text-xs border border-bone/25 text-ash hover:text-bone hover:border-signal/60 transition">The Code</Link>
          <Link href="/ask"          className="px-5 py-2.5 type uppercase tracking-[0.2em] text-xs border border-bone/25 text-ash hover:text-bone hover:border-signal/60 transition">Ask Cortex</Link>
          <Link href="/architecture" className="px-5 py-2.5 type uppercase tracking-[0.2em] text-xs border border-bone/25 text-ash hover:text-bone hover:border-signal/60 transition">ODI Architecture</Link>
        </div>
      </div>
    </section>
  );
}
