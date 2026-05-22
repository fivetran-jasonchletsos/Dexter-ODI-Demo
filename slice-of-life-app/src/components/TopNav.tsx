"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { num: "01", href: "/",             label: "Archive" },
  { num: "02", href: "/kills",        label: "Kills" },
  { num: "03", href: "/victims",      label: "Victims" },
  { num: "04", href: "/antagonists",  label: "Big Bads" },
  { num: "05", href: "/tier",         label: "Tier" },
  { num: "06", href: "/methods",      label: "Methods" },
  { num: "07", href: "/locations",    label: "Locations" },
  { num: "08", href: "/code",         label: "The Code" },
  { num: "09", href: "/ask",          label: "Cortex" },
  { num: "10", href: "/architecture", label: "ODI" },
  { num: "11", href: "/pipeline",     label: "Pipeline" },
];

export default function TopNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname?.startsWith(href + "/");

  return (
    <header className="meta-bar">
      <div className="mx-auto flex max-w-7xl items-center gap-x-6 gap-y-2 px-4 py-3 overflow-x-auto sm:px-6 sm:py-4 md:px-10">
        <Link href="/" className="flex-none flex items-center gap-2.5 text-bone hover:text-signal focus:outline-none focus:ring-2 focus:ring-slide/40">
          <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true" className="flex-none flicker">
            <rect x="3" y="3" width="26" height="26" rx="1" fill="#06080d" stroke="rgba(163,20,35,0.45)" strokeWidth="1" />
            <rect x="7" y="14" width="18" height="4" rx="0" fill="#a31423" transform="rotate(-6 16 16)" />
            <circle cx="22" cy="9" r="1.2" fill="#cf2030" opacity="0.7" />
            <circle cx="10" cy="23" r="0.9" fill="#a31423" opacity="0.5" />
            <line x1="3" y1="3" x2="8" y2="8" stroke="rgba(163,20,35,0.3)" strokeWidth="0.5" />
            <line x1="29" y1="3" x2="24" y2="8" stroke="rgba(163,20,35,0.3)" strokeWidth="0.5" />
          </svg>
          <span className="serif text-base sm:text-lg leading-none">Slice of Life</span>
          <span className="hidden sm:inline type text-[10px] text-ash/50 leading-none tracking-widest">/ Archive</span>
        </Link>
        <nav aria-label="Primary" className="flex flex-1 flex-nowrap items-center gap-x-4 sm:gap-x-6">
          {NAV.map((n) => {
            const a = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className="group flex flex-none items-baseline gap-2 focus:outline-none focus:ring-2 focus:ring-slide/40"
                aria-current={a ? "page" : undefined}
              >
                <span className={`font-mono text-xs tracking-[0.25em] uppercase ${a ? "text-signal" : "text-signal/45"}`}>
                  {n.num}
                </span>
                <span className={`serif text-base sm:text-lg transition-colors ${a ? "nav-active text-bone" : "text-ash/65 group-hover:text-bone"}`}>
                  {n.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
