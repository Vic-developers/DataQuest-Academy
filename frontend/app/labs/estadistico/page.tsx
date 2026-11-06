"use client";
import { useState } from "react";
import { api } from "@/lib/api";
export default function StatsLab() {
  const [vals, setVals] = useState("2,4,4,10,20");
  const [out, setOut] = useState<any>(null);
  async function run() { setOut(await api("/api/v1/labs/stats", { method: "POST", body: JSON.stringify({ values: vals }) })); }
  return <section>
    <h1 className="text-2xl font-bold">Laboratorio estadístico</h1>
    <p className="text-sm">Ingresa números separados por comas. Calcula n, media, mediana, desviación (poblacional), min y max.</p>
    <input className="mt-2 w-full border rounded px-3 py-2" value={vals} onChange={e => setVals(e.target.value)} />
    <button className="mt-2 rounded bg-blue-600 px-4 py-2 text-white" onClick={run}>Calcular</button>
    {out && (out.ok ? <pre className="mt-3 rounded bg-slate-100 p-3 dark:bg-slate-900">{JSON.stringify(out, null, 2)}</pre> : <p role="alert">{out.error}</p>)}
  </section>;
}
