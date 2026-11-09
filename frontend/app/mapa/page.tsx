"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
export default function Mapa() {
  const [worlds, setWorlds] = useState<any[]>([]);
  useEffect(() => { api("/api/v1/worlds").then(setWorlds).catch(() => setWorlds([])); }, []);
  return <section>
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><p className="chip chip-brand">Ruta Data Scientist</p><h1 className="mt-2 text-3xl font-extrabold">Mapa de mundos</h1></div>
      <p className="text-sm text-[#9aa6c8]">Los nuevos mundos 11–22 amplían la ruta hacia Ciencia de Datos.</p>
    </div>
    <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {worlds.map((w: any) => <li key={w.id} className="card card-hover">
        <div className="flex items-center justify-between"><span className="code-mono text-xs text-[#8b98c0]">#{String(w.id).padStart(2, "0")}</span><Link href={`/leccion?world=${w.id}`} className="chip chip-brand">Entrar →</Link></div>
        <h2 className="mt-2 font-bold leading-snug">{w.title}</h2>
        <p className="mt-1 text-sm text-[#c7cde8]">{w.description}</p>
      </li>)}
    </ol>
  </section>;
}
