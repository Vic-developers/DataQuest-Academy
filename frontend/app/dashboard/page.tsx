"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, token } from "@/lib/api";
export default function Dash() {
  const [d, setD] = useState<any>(null), [err, setErr] = useState("");
  useEffect(() => {
    if (!token()) { setErr("Inicia sesión para guardar tu progreso. Mientras tanto puedes estudiar en el mapa sin cuenta."); return; }
    api("/api/v1/dashboard").then(setD).catch(() => setErr("Inicia sesión para ver tu progreso."));
  }, []);
  if (!token()) return (
    <section className="card max-w-md mx-auto my-8">
      <h1 className="font-display mt-1 text-3xl font-semibold">Estudiar sin cuenta</h1>
      <p className="mt-2 text-sm text-[#5c574c]">Puedes recorrer los mundos y laboratorios sin registrarte. Tu avance no se guardará en el servidor.</p>
      <Link className="btn btn-accent w-full justify-center mt-4" href="/mapa">Ir al mapa →</Link>
      <Link className="btn btn-ghost w-full justify-center mt-2" href="/login">Ya tengo cuenta</Link>
    </section>
  );
  if (!d) return <p className="text-[#5c574c]">Cargando tu progreso…</p>;
  return <section>
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8a8577]">Mi progreso</p><h1 className="font-display mt-1 text-4xl font-semibold tracking-tight">Tu progreso</h1></div>
      <p className="text-sm text-[#9aa6c8]">Mundo 0 · ruta Analyst</p>
    </div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[["XP", d.xp], ["Racha", `${d.streak} días`], ["Lecciones", d.done], ["Eventos", d.recent_xp.length]].map(([l, v]) => (
        <div key={l as string} className="stat-card"><p className="font-mono text-[11px] uppercase tracking-widest text-[#8a8577]">{l}</p><p className="font-display mt-1 text-3xl font-semibold">{v}</p></div>
      ))}
    </div>
    <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="card">
        <h2 className="font-display text-xl font-semibold">Actividad reciente</h2>
        <ul className="mt-3 space-y-2">{d.recent_xp.map((x: any, i: number) => <li key={i} className="flex items-center justify-between py-2.5 text-sm"><span className="text-[#3b382f]">{x.reason}</span><span className="code-mono text-[#166534]">+{x.amount} XP</span></li>)}</ul>
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
