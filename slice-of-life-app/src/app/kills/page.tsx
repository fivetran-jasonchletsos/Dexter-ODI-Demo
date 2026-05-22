"use client";

import { useMemo, useRef, useState } from "react";
import { kills, canonLabels, methodLabels, locationLabels, victimTypeLabels,
         type Canon, type MethodKey, type LocationKey, type VictimType } from "@/lib/kills";

const ANY = "__any__";

export default function KillsPage() {
  const [canon,  setCanon]  = useState<string>(ANY);
  const [method, setMethod] = useState<string>(ANY);
  const [vtype,  setVtype]  = useState<string>(ANY);
  const [code,   setCode]   = useState<string>(ANY);
  const [query,  setQuery]  = useState<string>("");
  const [spotlightId, setSpotlightId] = useState<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return kills.filter((k) => {
      if (canon  !== ANY && k.canon      !== canon)  return false;
      if (method !== ANY && k.method     !== method) return false;
      if (vtype  !== ANY && k.victimType !== vtype)  return false;
      if (code   !== ANY && String(k.codeCompliant) !== code) return false;
      if (q && !(k.victim.toLowerCase().includes(q) || k.episodeTitle.toLowerCase().includes(q) || k.arc.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [canon, method, vtype, code, query]);

  const surpriseMe = () => {
    const pool = filtered.length > 0 ? filtered : kills;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setSpotlightId(pick.id);
    const row = rowRefs.current[pick.id];
    if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="type text-[10px] uppercase tracking-[0.35em] text-signal mb-3 slide-mark">Case file</p>
        <h1 className="serif text-4xl sm:text-5xl text-bone mb-3">{kills.length} confirmed kills</h1>
        <p className="serif text-ash/75 mb-10 max-w-3xl">
          Filter by canon, method, victim type, or whether the kill held up under Harry&apos;s Code. Hit &ldquo;Pull a slide&rdquo; to spotlight a random one.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <FilterSelect label="Canon"           value={canon}  onChange={setCanon}  options={[[ANY,"Any canon"], ...Object.entries(canonLabels)]}        />
          <FilterSelect label="Method"          value={method} onChange={setMethod} options={[[ANY,"Any method"], ...Object.entries(methodLabels)]}       />
          <FilterSelect label="Victim type"     value={vtype}  onChange={setVtype}  options={[[ANY,"Any victim type"], ...Object.entries(victimTypeLabels)]}/>
          <FilterSelect label="Code compliance" value={code}   onChange={setCode}   options={[[ANY,"Any"], ["true","Compliant"], ["false","Violated"]]}    />
          <label className="block">
            <span className="type text-[10px] uppercase tracking-[0.2em] text-ash/55 block mb-1">Search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Victim, episode, arc"
              className="w-full bg-deep/70 border border-bone/15 rounded-sm px-3 py-2 text-sm text-bone focus:border-signal/60 focus:outline-none"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <p className="type text-[10px] uppercase tracking-[0.25em] text-ash/55">
            {filtered.length} of {kills.length} shown
          </p>
          <button
            onClick={surpriseMe}
            className="px-4 py-2 type uppercase tracking-[0.2em] text-[11px] bg-slide text-bone hover:bg-signal transition border border-signal/40"
          >
            Pull a slide ▸
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-ash/55 type uppercase tracking-[0.15em] text-[10px] border-b border-bone/10">
              <tr>
                <th className="py-2 pr-3">Canon</th>
                <th className="py-2 pr-3">S/E</th>
                <th className="py-2 pr-3">Victim</th>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Method</th>
                <th className="py-2 pr-3">Location</th>
                <th className="py-2 pr-3">Disposal</th>
                <th className="py-2 pr-3">Code</th>
                <th className="py-2 pr-3">Arc</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((k) => (
                <tr
                  key={k.id}
                  ref={(el) => { rowRefs.current[k.id] = el; }}
                  className={`border-b border-bone/5 hover:bg-deep/40 transition-colors ${spotlightId === k.id ? "bg-slide/15 outline outline-1 outline-slide/60" : ""}`}
                >
                  <td className="py-2 pr-3 text-ash/75">{canonLabels[k.canon]}</td>
                  <td className="py-2 pr-3 font-mono text-ash/85">S{k.season}E{String(k.episode).padStart(2, "0")}</td>
                  <td className="py-2 pr-3 text-bone">
                    <a href={k.wiki} target="_blank" rel="noopener noreferrer" className="hover:text-signal">{k.victim}</a>
                  </td>
                  <td className="py-2 pr-3 text-ash/75">{victimTypeLabels[k.victimType]}</td>
                  <td className="py-2 pr-3 text-ash/85">{methodLabels[k.method]}</td>
                  <td className="py-2 pr-3 text-ash/75">{locationLabels[k.location]}</td>
                  <td className="py-2 pr-3 text-ash/75">{k.disposal.replace(/_/g, " ")}</td>
                  <td className="py-2 pr-3">
                    <span className={`code-dot ${k.codeCompliant ? "code-dot--yes" : "code-dot--no"}`} aria-label={k.codeCompliant ? "compliant" : "violated"} />
                  </td>
                  <td className="py-2 pr-3 text-ash/65 italic">{k.arc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function FilterSelect({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="type text-[10px] uppercase tracking-[0.2em] text-ash/55 block mb-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-deep/70 border border-bone/15 rounded-sm px-3 py-2 text-sm text-bone focus:border-signal/60 focus:outline-none"
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}
