"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
export default function Mapa() {
  const [worlds, setWorlds] = useState<any[]>([]);
  useEffect(() => { api("/api/v1/worlds").then(setWorlds).catch(() => setWorlds([])); }, []);
  return <section>
    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8a8577]">Rutas Data Analyst & Data Scientist</p>
    <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight">Mapa de mundos</h1>
    <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {worlds.map((w: any) => <li key={w.id} className="card card-hover flex flex-col gap-1">
        <div className="flex items-center justify-between"><span className="code-mono text-xs text-[#8a8577]">#{String(w.id).padStart(2, "0")}</span><Link href={`/leccion?world=${w.id}`} className="chip chip-accent">Entrar →</Link></div>
        <h2 className="font-display text-lg font-semibold leading-snug">{w.title}</h2>
        <p className="text-sm text-[#5c574c]">{w.description}</p>
      </li>)}
    </ol>
  </section>;
}
