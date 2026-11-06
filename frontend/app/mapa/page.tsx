"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
export default function Mapa() {
  const [worlds, setWorlds] = useState<any[]>([]);
  useEffect(() => { api("/api/v1/worlds").then(setWorlds).catch(() => setWorlds([])); }, []);
  return <section>
    <h1 className="text-2xl font-bold">Mapa de mundos</h1>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {worlds.map((w: any) => <article key={w.id} className="rounded border bg-white p-4 dark:bg-slate-900">
        <h2 className="font-bold">{w.title}</h2><p>{w.description}</p>
        <Link className="text-blue-600" href={`/leccion?world=${w.id}`}>Ver lecciones</Link>
      </article>)}
    </div>
  </section>;
}
