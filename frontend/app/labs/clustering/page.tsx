"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function Clustering() {
  const [vals, setVals] = useState("1,2,1.5,10,11,10.5");
  const [k, setK] = useState(2);
  const [out, setOut] = useState<any>(null);
  async function run() { setOut(await api("/api/v1/labs/ml/clustering", { method: "POST", body: JSON.stringify({ values: vals, k }) })); }
  return <section>
    <h1 className="text-2xl font-bold">Laboratorio de clustering (K-means 1D)</h1>
    <p className="text-sm">Agrupa valores sin etiquetas (stdlib real, determinista).</p>
    <label className="block mt-2">Valores<input className="block w-full border rounded px-3 py-2" value={vals} onChange={e => setVals(e.target.value)} /></label>
    <label className="block mt-2">Clusters (k)<input type="number" min={1} max={5} className="block w-24 border rounded px-3 py-2" value={k} onChange={e => setK(Number(e.target.value))} /></label>
    <button className="mt-3 rounded bg-blue-600 px-4 py-2 text-white" onClick={run}>Agrupar</button>
    {out && (out.ok ? <div className="mt-3"><p>Centroides: {out.centroids.join(", ")}</p><pre className="rounded bg-slate-100 p-3 dark:bg-slate-900">{JSON.stringify(out.groups, null, 2)}</pre></div> : <p role="alert">{out.error}</p>)}
  </section>;
}
