import Image from "next/image";
import jackPhoto from "../../public/jack.png";

// Dedication card — Jack Chletsos, archivist. Framed as a Miami Metro
// case file with his photo as the evidence-locker badge, NOT as a
// passive subject. Top blood drip caps the card; bracket corners
// frame the photo; blood spatter washes the right column.

export default function Dedication() {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-20 md:px-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <article className="relative overflow-hidden rounded-sm border border-slide/40 bg-deep/70 pulse-blood">
          <div className="blood-drip-top" aria-hidden="true" />

          <div className="grid grid-cols-1 md:grid-cols-[18rem_1fr] gap-8 p-6 pt-14 sm:p-10 sm:pt-16">
            <div>
              <p className="type text-[10px] uppercase tracking-[0.3em] text-signal/80 mb-3">
                Miami Metro · Evidence
              </p>
              <div className="evidence-frame w-full max-w-[18rem]">
                <span className="corner-tl" />
                <span className="corner-br" />
                <Image
                  src={jackPhoto}
                  alt="Jack Chletsos"
                  className="block w-full h-auto select-none"
                  priority
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px] type uppercase tracking-[0.2em] text-ash/65">
                <span>ID</span><span className="text-bone justify-self-end">JC-2026</span>
                <span>Role</span><span className="text-bone justify-self-end">Archivist</span>
                <span>Clearance</span><span className="text-bone justify-self-end">All Canons</span>
              </div>
            </div>

            <div className="relative blood-spatter">
              <p className="type text-[10px] uppercase tracking-[0.35em] text-signal mb-4 slide-mark">
                Archivist of Record
              </p>
              <h2 className="serif text-3xl sm:text-4xl text-bone leading-[1.05] mb-5">
                <span className="slide-underline">Jack Chletsos.</span><br className="hidden sm:block" /> Fourteen. Dexter-fluent.
              </h2>
              <p className="serif text-base sm:text-lg text-ash/85 leading-relaxed max-w-prose">
                He can tell you why Trinity got the hammer and not the knife.
                Why M99 doesn&apos;t show up until <em>Original Sin</em>.
                Which of the Barrel Girls&apos; rapists held up under Harry&apos;s rules.
                Whether <em>New Blood</em> counts.
              </p>
              <p className="serif text-base text-ash/80 leading-relaxed mt-4 max-w-prose">
                This is his archive. Every kill below is here because he wanted to know.
              </p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                <span className="pill pill--slide">Volume I</span>
                <span className="pill">2026</span>
                <span className="pill pill--neon">Family Build</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
