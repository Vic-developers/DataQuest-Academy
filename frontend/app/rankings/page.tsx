"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
export default function Rankings() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { api("/api/v1/rankings").then(setRows).catch(() => setRows([])); }, []);
  return <section>
    <h1 className="text-2xl font-bold">Rankings (top XP)</h1>
    <p className="text-sm text-slate-500">Anónimo: solo XP y nivel, sin datos personales.</p>
    <ol className="mt-3 list-decimal ml-5">{rows.map((r: any, i: number) => <li key={i}>{r.xp} XP — Nivel {r.level}</li>)}</ol>
  </section>;
}
