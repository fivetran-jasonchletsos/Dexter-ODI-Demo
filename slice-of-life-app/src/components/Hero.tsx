import Link from "next/link";
import { SUMMARY, codeStats } from "@/lib/stats";
import { antagonists } from "@/lib/antagonists";

export default function Hero() {
  const cs = codeStats();
  return (
    <section className="relative overflow-hidden border-b border-slide/30 px-5 py-16 sm:px-6 sm:py-20 md:px-16 md:py-24">
      <div className="blood-spatter absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl">
        <p className="type text-[10px] uppercase tracking-[0.35em] text-signal mb-4 slide-mark">
          Evidence Locker · Archivist: J. Chletsos
        </p>
        <h1 className="serif text-6xl sm:text-7xl md:text-8xl leading-[0.92] text-bone">
          <span className="slide-underline">Every kill.</span> Every season.<br className="hidden sm:block" /> Every blood slide.
        </h1>
        <p className="serif mt-7 max-w-2xl text-xl text-ash/90 leading-relaxed">
          The full Dexter Morgan case file. Filter it, rank it, find out which kills broke the Code.
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
          <BigStat value={SUMMARY.total}       label="Confirmed kills"      tint="slide" />
          <BigStat value={SUMMARY.seasons}     label="Seasons logged"       />
          <BigStat value={antagonists.length}  label="Big Bads"             />
          <BigStat value={`${Math.round(cs.rate * 100)}%`} label="Code compliance"  tint="neon" />
        </div>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/kills"        className="px-5 py-2.5 type uppercase tracking-[0.2em] text-xs bg-slide text-bone hover:bg-signal transition border border-signal/40">Open the case file</Link>
          <Link href="/tier"         className="px-5 py-2.5 type uppercase tracking-[0.2em] text-xs border border-signal/50 text-signal hover:text-bone hover:bg-slide/30 transition">Tier list</Link>
          <Link href="/code"         className="px-5 py-2.5 type uppercase tracking-[0.2em] text-xs border border-bone/25 text-ash hover:text-bone hover:border-signal/60 transition">The Code</Link>
          <Link href="/antagonists"  className="px-5 py-2.5 type uppercase tracking-[0.2em] text-xs border border-bone/25 text-ash hover:text-bone hover:border-signal/60 transition">Big Bads</Link>
          <Link href="/methods"      className="px-5 py-2.5 type uppercase tracking-[0.2em] text-xs border border-bone/25 text-ash hover:text-bone hover:border-signal/60 transition">Methods</Link>
        </div>

        <p className="serif italic text-ash/55 text-base mt-12 max-w-xl">
          &ldquo;Tonight&apos;s the night. And it&apos;s going to happen again, and again.&rdquo;
          <span className="not-italic type text-[10px] tracking-[0.25em] uppercase text-ash/40 ml-2 align-middle">— S1E1</span>
        </p>
      </div>
    </section>
  );
}

function BigStat({ value, label, tint }: { value: number | string; label: string; tint?: "slide" | "neon" }) {
  const color =
    tint === "slide" ? "text-signal" :
    tint === "neon"  ? "text-neon"   :
                       "text-bone";
  return (
    <div className="evidence-card rounded-sm p-4">
      <p className={`serif text-5xl sm:text-6xl leading-none ${color}`}>{value}</p>
      <p className="type text-[10px] uppercase tracking-[0.25em] text-ash/55 mt-3">{label}</p>
    </div>
  );
}
