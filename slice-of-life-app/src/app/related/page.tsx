"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildGraph,
  caseColor,
  relatedFor,
  type GraphEdge,
  type GraphNode,
} from "@/lib/related";
import { methodLabels, victimTypeLabels, canonLabels } from "@/lib/kills";

// ---------------------------------------------------------------------------
// Force simulation — no external dependency
// ---------------------------------------------------------------------------
type Vec2 = { x: number; y: number };

function runSimulation(
  nodes: GraphNode[],
  edges: GraphEdge[],
  width: number,
  height: number,
  onTick: (positions: Vec2[], alpha: number) => void,
  onDone: (positions: Vec2[]) => void
) {
  const n = nodes.length;
  const pos: Vec2[] = nodes.map(() => ({
    x: width / 2 + (Math.random() - 0.5) * Math.min(width, height) * 0.6,
    y: height / 2 + (Math.random() - 0.5) * Math.min(width, height) * 0.6,
  }));
  const vel: Vec2[] = nodes.map(() => ({ x: 0, y: 0 }));

  const idToIdx = new Map(nodes.map((nd, i) => [nd.id, i]));
  const adjMap = new Map<string, { target: number; score: number }[]>();
  for (const e of edges) {
    const si = idToIdx.get(e.source);
    const ti = idToIdx.get(e.target);
    if (si == null || ti == null) continue;
    if (!adjMap.has(e.source)) adjMap.set(e.source, []);
    if (!adjMap.has(e.target)) adjMap.set(e.target, []);
    adjMap.get(e.source)!.push({ target: ti, score: e.score });
    adjMap.get(e.target)!.push({ target: si, score: e.score });
  }

  const REPEL    = 2800;
  const SPRING_K = 0.045;
  const REST_LEN = 110;
  const CENTER_G = 0.009;
  const DAMP     = 0.80;

  let alpha = 1.0;
  let frame = 0;
  let rafId: number;

  function tick() {
    alpha *= 0.991;
    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < n; i++) {
      let fx = 0;
      let fy = 0;

      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const dx = pos[i].x - pos[j].x;
        const dy = pos[i].y - pos[j].y;
        const dist2 = dx * dx + dy * dy + 1;
        const dist  = Math.sqrt(dist2);
        const str   = REPEL / dist2;
        fx += (dx / dist) * str;
        fy += (dy / dist) * str;
      }

      const nbrs = adjMap.get(nodes[i].id) ?? [];
      for (const { target: j, score } of nbrs) {
        const dx = pos[j].x - pos[i].x;
        const dy = pos[j].y - pos[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
        const stretch = dist - REST_LEN * (1 - score * 0.4);
        fx += (dx / dist) * SPRING_K * stretch;
        fy += (dy / dist) * SPRING_K * stretch;
      }

      fx += (cx - pos[i].x) * CENTER_G;
      fy += (cy - pos[i].y) * CENTER_G;

      vel[i].x = (vel[i].x + fx * alpha) * DAMP;
      vel[i].y = (vel[i].y + fy * alpha) * DAMP;
      pos[i].x = Math.max(20, Math.min(width - 20, pos[i].x + vel[i].x));
      pos[i].y = Math.max(20, Math.min(height - 20, pos[i].y + vel[i].y));
    }

    frame++;
    if (frame % 4 === 0) onTick([...pos.map((p) => ({ ...p }))], alpha);

    if (alpha > 0.01 && frame < 700) {
      rafId = requestAnimationFrame(tick);
    } else {
      onDone([...pos.map((p) => ({ ...p }))]);
    }
  }

  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}

// ---------------------------------------------------------------------------
// Canvas renderer
// ---------------------------------------------------------------------------
const NODE_R     = 6;
const NODE_R_SEL = 11;
const NODE_R_HOV = 9;

function drawGraph(
  ctx: CanvasRenderingContext2D,
  nodes: GraphNode[],
  edges: GraphEdge[],
  positions: Vec2[],
  idToIdx: Map<string, number>,
  selectedId: string | null,
  hoveredId: string | null,
  dpr: number
) {
  const W = ctx.canvas.width / dpr;
  const H = ctx.canvas.height / dpr;
  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = "#06080d";
  ctx.fillRect(0, 0, W, H);

  // Fine grid — forensic lab reticle
  ctx.strokeStyle = "rgba(212,208,196,0.022)";
  ctx.lineWidth = 0.5;
  for (let gx = 0; gx < W; gx += 80) {
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
  }
  for (let gy = 0; gy < H; gy += 80) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
  }

  // Edges
  for (const e of edges) {
    const si = idToIdx.get(e.source);
    const ti = idToIdx.get(e.target);
    if (si == null || ti == null) continue;
    const sp = positions[si];
    const tp = positions[ti];
    if (!sp || !tp) continue;

    const isHighlighted =
      e.source === selectedId || e.target === selectedId ||
      e.source === hoveredId  || e.target === hoveredId;

    ctx.beginPath();
    ctx.moveTo(sp.x, sp.y);
    ctx.lineTo(tp.x, tp.y);
    if (isHighlighted) {
      ctx.strokeStyle = `rgba(163,20,35,${0.25 + e.score * 0.45})`;
      ctx.lineWidth   = 0.8 + e.score * 1.8;
    } else {
      ctx.strokeStyle = `rgba(231,224,201,${0.018 + e.score * 0.05})`;
      ctx.lineWidth   = 0.3 + e.score * 0.7;
    }
    ctx.stroke();
  }

  // Nodes
  const specialIds = new Set([selectedId, hoveredId].filter(Boolean) as string[]);

  const drawNode = (node: GraphNode, i: number) => {
    const p = positions[i];
    if (!p) return;
    const isSel = node.id === selectedId;
    const isHov = node.id === hoveredId;
    const r     = isSel ? NODE_R_SEL : isHov ? NODE_R_HOV : NODE_R;
    const color = caseColor(node.kill.victimType);

    if (isSel) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r + 9, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(163,20,35,0.16)";
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = isSel
      ? "#cf2030"
      : isHov
      ? "rgba(231,224,201,0.7)"
      : "rgba(231,224,201,0.15)";
    ctx.lineWidth = isSel ? 1.5 : 0.8;
    ctx.stroke();

    if (isSel || isHov) {
      const label = node.kill.victim.length > 22
        ? node.kill.victim.slice(0, 20) + "…"
        : node.kill.victim;
      ctx.font      = `600 10px 'JetBrains Mono', monospace`;
      ctx.fillStyle = isSel ? "#cf2030" : "#e7e0c9";
      ctx.textAlign = "center";
      ctx.fillText(label, p.x, p.y + r + 13);
      ctx.font      = `9px 'JetBrains Mono', monospace`;
      ctx.fillStyle = "rgba(189,180,160,0.55)";
      ctx.fillText(`S${node.kill.season}E${String(node.kill.episode).padStart(2, "0")}`, p.x, p.y + r + 24);
    }
  };

  nodes.forEach((nd, i) => { if (!specialIds.has(nd.id)) drawNode(nd, i); });
  nodes.forEach((nd, i) => { if (specialIds.has(nd.id))  drawNode(nd, i); });

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function RelatedPage() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const posRef     = useRef<Vec2[]>([]);
  const dragging   = useRef<{ startX: number; startY: number; tx: number; ty: number } | null>(null);
  const rafRef     = useRef<number>(0);

  const [positions,  setPositions]  = useState<Vec2[]>([]);
  const [simDone,    setSimDone]    = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId,  setHoveredId]  = useState<string | null>(null);
  const [transform,  setTransform]  = useState({ x: 0, y: 0, scale: 1 });
  const [size,       setSize]       = useState({ w: 900, h: 650 });

  const { nodes, edges } = useMemo(() => buildGraph(), []);
  const idToIdx = useMemo(() => new Map(nodes.map((n, i) => [n.id, i])), [nodes]);

  // Measure canvas
  useEffect(() => {
    function measure() {
      const el = canvasRef.current?.parentElement;
      if (el) setSize({ w: el.clientWidth, h: Math.min(el.clientWidth * 0.68, 650) });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Run simulation
  useEffect(() => {
    if (size.w < 100) return;
    setSimDone(false);
    const cleanup = runSimulation(
      nodes, edges, size.w, size.h,
      (pos) => { posRef.current = pos; setPositions([...pos]); },
      (pos) => { posRef.current = pos; setPositions([...pos]); setSimDone(true); }
    );
    return cleanup;
  }, [nodes, edges, size.w, size.h]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || posRef.current.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    canvas.width        = size.w * dpr;
    canvas.height       = size.h * dpr;
    canvas.style.width  = `${size.w}px`;
    canvas.style.height = `${size.h}px`;

    cancelAnimationFrame(rafRef.current);

    function frame() {
      if (!ctx) return;
      const logW = canvas!.width / dpr;
      const logH = canvas!.height / dpr;

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.fillStyle = "#06080d";
      ctx.fillRect(0, 0, logW, logH);
      ctx.translate(transform.x + logW / 2, transform.y + logH / 2);
      ctx.scale(transform.scale, transform.scale);
      ctx.translate(-logW / 2, -logH / 2);

      drawGraph(ctx, nodes, edges, posRef.current, idToIdx, selectedId, hoveredId, 1);

      ctx.restore();
      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [positions, selectedId, hoveredId, transform, size, nodes, edges, idToIdx]);

  // Mouse → canvas space
  const toCanvas = useCallback((clientX: number, clientY: number, canvas: HTMLCanvasElement): Vec2 => {
    const rect = canvas.getBoundingClientRect();
    const lx = clientX - rect.left;
    const ly = clientY - rect.top;
    const cx = size.w / 2;
    const cy = size.h / 2;
    return {
      x: (lx - cx - transform.x) / transform.scale + cx,
      y: (ly - cy - transform.y) / transform.scale + cy,
    };
  }, [size, transform]);

  const nearestNode = useCallback((cx: number, cy: number): GraphNode | null => {
    let best: GraphNode | null = null;
    let bestDist = 22;
    posRef.current.forEach((p, i) => {
      if (!p) return;
      const d = Math.hypot(p.x - cx, p.y - cy);
      if (d < bestDist) { bestDist = d; best = nodes[i]; }
    });
    return best;
  }, [nodes]);

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (dragging.current) {
      const dx = e.clientX - dragging.current.startX;
      const dy = e.clientY - dragging.current.startY;
      setTransform(t => ({ ...t, x: dragging.current!.tx + dx, y: dragging.current!.ty + dy }));
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = toCanvas(e.clientX, e.clientY, canvas);
    const node = nearestNode(x, y);
    setHoveredId(node?.id ?? null);
    canvas.style.cursor = node ? "pointer" : "grab";
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    dragging.current = { startX: e.clientX, startY: e.clientY, tx: transform.x, ty: transform.y };
  }

  function onMouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
    const moved = dragging.current
      ? Math.hypot(e.clientX - dragging.current.startX, e.clientY - dragging.current.startY) > 4
      : false;
    dragging.current = null;
    if (!moved) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { x, y } = toCanvas(e.clientX, e.clientY, canvas);
      const node = nearestNode(x, y);
      setSelectedId(node?.id ?? null);
    }
  }

  function onWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setTransform(t => ({ ...t, scale: Math.max(0.3, Math.min(5, t.scale * factor)) }));
  }

  const selected  = selectedId ? nodes.find(n => n.id === selectedId) ?? null : null;
  const neighbors = selectedId ? relatedFor(selectedId) : [];

  return (
    <main className="min-h-screen" style={{ background: "#06080d" }}>

      {/* Header */}
      <section className="border-b border-slide/20 px-5 py-5 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="type text-[10px] uppercase tracking-[0.35em] text-signal mb-2 slide-mark">
              Case Network
            </p>
            <h1 className="serif text-3xl font-light text-bone leading-tight sm:text-4xl">
              Related Cases
            </h1>
            <p className="type text-[11px] text-ash/50 mt-2">
              <span className="scan-badge mr-2">{nodes.length}</span>
              cases &middot;
              <span className="scan-badge mx-2">{edges.length}</span>
              similarity edges &middot;{" "}
              <span className={simDone ? "text-neon/70" : "text-scan/70 animate-pulse"}>
                {simDone ? "settled" : "settling…"}
              </span>
            </p>
          </div>
          <div className="type text-[9px] uppercase tracking-[0.25em] text-ash/30 text-right max-w-xs">
            Drag to pan &middot; scroll to zoom &middot; click any node
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row">

        {/* Canvas */}
        <div
          className="flex-1 min-w-0 relative"
          style={{ minHeight: `${size.h}px`, background: "#06080d" }}
        >
          <canvas
            ref={canvasRef}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={() => { setHoveredId(null); dragging.current = null; }}
            onWheel={onWheel}
            style={{ display: "block", cursor: "grab", userSelect: "none" }}
          />

          {!simDone && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="type text-[10px] uppercase tracking-[0.3em] text-ash/30 animate-pulse">
                Calculating similarity graph…
              </p>
            </div>
          )}

          {/* Victim-type legend */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1">
            {[
              ["serial_killer", "#cf2030", "Serial killer"],
              ["predator",      "#a31423", "Predator"],
              ["murderer",      "#7a3a10", "Murderer"],
              ["trafficker",    "#4a6a40", "Trafficker"],
              ["other_violent", "#4a4070", "Other violent"],
              ["unknown",       "#3a3a4a", "Unknown"],
            ].map(([, color, label]) => (
              <span key={label} className="flex items-center gap-1.5">
                <span
                  className="inline-block rounded-full"
                  style={{ width: 7, height: 7, background: color }}
                />
                <span className="type text-[9px] uppercase tracking-[0.18em] text-ash/40">{label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <aside
          className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slide/15 flex-none overflow-y-auto"
          style={{ maxHeight: `${size.h + 80}px`, background: "rgba(6,8,13,0.95)" }}
        >
          {selected ? (
            <div className="p-5">

              {/* Case header */}
              <div className="mb-4">
                <p className="type text-[9px] uppercase tracking-[0.3em] text-signal/70 mb-1">
                  {canonLabels[selected.kill.canon]} &middot; S{selected.kill.season}E{String(selected.kill.episode).padStart(2, "0")}
                </p>
                <h2 className="serif text-xl text-bone leading-tight">{selected.kill.victim}</h2>
                <p className="type text-[10px] uppercase tracking-[0.2em] text-ash/50 mt-1">
                  {selected.kill.episodeTitle}
                </p>
              </div>

              {/* Attribute pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="pill pill--slide">{victimTypeLabels[selected.kill.victimType]}</span>
                <span className="pill">{methodLabels[selected.kill.method]}</span>
                <span className={`pill ${selected.kill.codeCompliant ? "pill--neon" : "pill--slide"}`}>
                  {selected.kill.codeCompliant ? "Code compliant" : "Code violated"}
                </span>
              </div>

              <p className="serif text-sm text-ash/75 leading-relaxed mb-4">{selected.kill.priorCrimes}</p>

              <Link
                href="/kills"
                className="inline-block type text-[9px] uppercase tracking-[0.25em] text-signal border border-signal/35 px-3 py-1.5 hover:bg-signal hover:text-bone transition mb-5"
              >
                View all kills
              </Link>

              {/* Related neighbors */}
              <div className="border-t border-slide/15 pt-4">
                <p className="type text-[9px] uppercase tracking-[0.3em] text-ash/40 mb-3">
                  Related cases
                </p>
                <ol className="space-y-1">
                  {neighbors.map((nb) => (
                    <li key={nb.id}>
                      <button
                        onClick={() => setSelectedId(nb.id)}
                        className="w-full text-left px-2 py-1.5 border-l-2 border-ash/10 hover:border-signal hover:bg-slide/5 transition"
                      >
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="serif text-sm text-bone truncate">{nb.kill.victim}</span>
                          <span className="type text-[9px] text-signal flex-none">{Math.round(nb.score * 100)}%</span>
                        </div>
                        <p className="type text-[9px] uppercase tracking-[0.18em] text-ash/45 truncate">
                          {canonLabels[nb.kill.canon]} S{nb.kill.season}E{String(nb.kill.episode).padStart(2, "0")}
                        </p>
                        <p className="type text-[9px] uppercase tracking-[0.15em] text-ash/40 truncate mt-0.5">
                          {nb.why}
                        </p>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Engine note */}
              <div className="mt-5 border-t border-ash/8 pt-4">
                <p className="type text-[9px] text-ash/30 leading-relaxed uppercase tracking-[0.15em]">
                  Similarity scored over modus operandi, victim profile, arc, location,
                  disposal, and season proximity. Top-8 per case, Jaccard-weighted.
                  In production: <span className="text-signal/60">CORTEX.EMBED_TEXT_768</span>.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5 flex flex-col gap-3">
              <p className="type text-[10px] uppercase tracking-[0.3em] text-ash/40">
                Click any node to examine
              </p>
              <p className="serif text-sm text-ash/50 leading-relaxed">
                Every kill is a node. Edges connect the most similar cases by method,
                victim profile, season arc, location, and disposal signature. Clusters
                form around the major arcs — Trinity, Barrel Girls, Brain Surgeon.
              </p>
              <div className="mt-2 space-y-1">
                <p className="type text-[9px] uppercase tracking-[0.25em] text-ash/30">
                  <span className="scan-badge mr-2">{nodes.length}</span>
                  cases in network
                </p>
                <p className="type text-[9px] uppercase tracking-[0.25em] text-ash/30">
                  <span className="scan-badge mr-2">{edges.length}</span>
                  similarity edges
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
