export default function Footer() {
  return (
    <footer className="border-t border-slide/15 px-5 pt-12 pb-10 sm:px-6 md:px-16" style={{ background: "linear-gradient(0deg, rgba(8,4,6,1) 0%, rgba(6,8,13,1) 100%)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between mb-10">
          <div>
            <p className="type text-[9px] uppercase tracking-[0.35em] text-ash/35 mb-3">
              Slice of Life Archive · Volume I
            </p>
            <p className="serif text-2xl font-light text-bone/85 leading-snug max-w-md italic">
              &ldquo;Tonight&apos;s the night. And it&apos;s going to happen again, and again.&rdquo;
            </p>
            <p className="serif mt-2 text-sm text-ash/50">— Dexter Morgan, S1E1</p>
            <p className="type text-[10px] uppercase tracking-[0.3em] text-signal/70 mt-6">
              Curated for Jack Chletsos
            </p>
          </div>
          <nav className="flex flex-col gap-2" aria-label="Footer navigation">
            <a href="https://github.com/fivetran-jasonchletsos/Dexter-ODI-Demo" target="_blank" rel="noopener noreferrer"
               className="type text-[10px] uppercase tracking-[0.25em] text-ash/40 hover:text-signal transition-colors">GitHub</a>
            <a href="https://dexter.fandom.com" target="_blank" rel="noopener noreferrer"
               className="type text-[10px] uppercase tracking-[0.25em] text-ash/40 hover:text-signal transition-colors">Dexter Fandom Wiki</a>
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer"
               className="type text-[10px] uppercase tracking-[0.25em] text-ash/40 hover:text-signal transition-colors">TMDB</a>
            <a href="https://www.wikidata.org" target="_blank" rel="noopener noreferrer"
               className="type text-[10px] uppercase tracking-[0.25em] text-ash/40 hover:text-signal transition-colors">Wikidata</a>
            <a href="https://www.fivetran.com" target="_blank" rel="noopener noreferrer"
               className="type text-[10px] uppercase tracking-[0.25em] text-ash/40 hover:text-signal transition-colors">Fivetran</a>
          </nav>
        </div>
        <div className="specimen-rule" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="type text-[9px] uppercase tracking-[0.3em] text-ash/30">
              Fivetran + Iceberg/S3 + Snowflake + dbt + Cortex Analyst
            </p>
            <p className="type text-[9px] uppercase tracking-[0.3em] text-ash/25">
              Set in Playfair Display, Courier Prime, JetBrains Mono
            </p>
          </div>
          <div className="text-right">
            <p className="type text-[9px] uppercase tracking-[0.3em] text-ash/25">v1.0 · 2026</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
