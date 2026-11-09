"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
export default function Dash() {
  const [d, setD] = useState<any>(null), [err, setErr] = useState("");
  useEffect(() => { api("/api/v1/dashboard").then(setD).catch(() => setErr("Inicia sesión para ver tu progreso.")); }, []);
  if (err) return <div className="card"><p>{err}</p><Link className="btn btn-primary mt-3" href="/login">Ir a login</Link></div>;
  if (!d) return <p className="text-[#9aa6c8]">Cargando tu progreso…</p>;
  return <section>
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><p className="chip chip-brand">Tu progreso</p><h1 className="mt-2 text-3xl font-extrabold">Bienvenido de vuelta ⚡</h1></div>
      <p className="text-sm text-[#9aa6c8]">Mundo 0 · ruta Analyst</p>
    </div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="stat-card"><span className="text-xs uppercase tracking-widest text-[#8b98c0]">XP</span><p className="text-3xl font-extrabold">{d.xp}</p></div>
      <div className="stat-card"><span className="text-xs uppercase tracking-widest text-[#8b98c0]">Racha</span><p className="text-3xl font-extrabold">{d.streak} <span className="text-base font-medium text-[#9aa6c8]">días</span></p></div>
      <div className="stat-card"><span className="text-xs uppercase tracking-widest text-[#8b98c0]">Lecciones</span><p className="text-3xl font-extrabold">{d.done}<span className="text-base font-medium text-[#9aa6c8]">/{d.total}</span></p></div>
      <div className="stat-card"><span className="text-xs uppercase tracking-widest text-[#8b98c0]">Actividad</span><p className="text-3xl font-extrabold">{d.recent_xp.length}<span className="text-base font-medium text-[#9aa6c8]"> eventos</span></p></div>
    </div>
    <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="card">
        <h2 className="font-bold">Actividad reciente</h2>
        <ul className="mt-3 space-y-2">{d.recent_xp.map((x: any, i: number) => <li key={i} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[.02] px-3 py-2 text-sm"><span className="text-[#c7cde8]">{x.reason}</span><span className="font-semibold text-amber-300">+{x.amount} XP</span></li>)}</ul>
      </div>
      <div className="card">
        <h2 className="font-bold">Siguiente mejor paso</h2>
        <p className="mt-2 text-sm text-[#c7cde8]">Completa el Mundo 0 y entrega el proyecto p0-ventas para desbloquear la Introducción a SQL avanzado.</p>
        <Link href="/mapa" className="btn btn-primary w-full justify-center mt-4">Ir al mapa →</Link>
        <Link href="/misiones" className="btn btn-ghost w-full justify-center mt-2">Ver misiones</Link>
      </div>
    </div>
  </section>;
}
