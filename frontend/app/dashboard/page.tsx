"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
export default function Dash() {
  const [d, setD] = useState<any>(null), [err, setErr] = useState("");
  useEffect(() => { api("/api/v1/dashboard").then(setD).catch(() => setErr("Inicia sesión para ver tu progreso.")); }, []);
  if (err) return <div className="card max-w-md"><p className="text-[#c2410c]">{err}</p><Link className="btn btn-accent mt-3" href="/login">Ir a login</Link></div>;
  if (!d) return <p className="text-[#5c574c]">Cargando tu progreso…</p>;
  return <section>
    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8a8577]">Mi panel</p>
    <h1 className="font-display mt-1 text-4xl font-semibold tracking-tight">Tu progreso, sin filtros</h1>

    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[["XP", d.xp], ["Racha", `${d.streak} días`], ["Lecciones", d.done], ["Eventos", d.recent_xp.length]].map(([l, v]) => (
        <div key={l as string} className="stat-card"><p className="font-mono text-[11px] uppercase tracking-widest text-[#8a8577]">{l}</p><p className="font-display mt-1 text-3xl font-semibold">{v}</p></div>
      ))}
    </div>

    <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="card">
        <h2 className="font-display text-xl font-semibold">Actividad reciente</h2>
        <ul className="mt-3 divide-y divide-[var(--line)]">{d.recent_xp.map((x: any, i: number) => <li key={i} className="flex items-center justify-between py-2.5 text-sm"><span className="text-[#3b382f]">{x.reason}</span><span className="code-mono text-[#166534]">+{x.amount} XP</span></li>)}</ul>
      </div>
      <div className="card" style={{ background: "#1c1a16", borderColor: "#1c1a16" }}>
        <p className="font-mono text-[11px] uppercase tracking-widest text-[#a8a294]">Siguiente paso</p>
        <h2 className="font-display mt-2 text-xl font-semibold text-[#faf7ef]">Entrega p0-ventas</h2>
        <p className="mt-2 text-sm text-[#d6d2c6]">Completa el Mundo 0 y entrega el proyecto de ventas para desbloquear la Introducción a SQL avanzado.</p>
        <Link href="/proyectos" className="btn btn-accent w-full justify-center mt-4">Ir a proyectos →</Link>
      </div>
    </div>
  </section>;
}
