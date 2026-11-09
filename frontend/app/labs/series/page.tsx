"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function Series() {
  const [vals, setVals] = useState("10,12,11,13,12,20");
  const [out, setOut] = useState<any>(null);
  async function run() { setOut(await api("/api/v1/labs/ts/forecast", { method: "POST", body: JSON.stringify({ values: vals, window: 3 }) })); }
  return <section>
    <h1 className="text-2xl font-bold">Laboratorio de series temporales</h1>
    <p className="text-sm">Pronóstico ingenuo, media móvil y anomalías ±3σ (stdlib real).</p>
    <label className="block mt-2">Serie<input className="block w-full border rounded px-3 py-2" value={vals} onChange={e => setVals(e.target.value)} /></label>
    <button className="mt-3 rounded bg-blue-600 px-4 py-2 text-white" onClick={run}>Analizar serie</button>
    {out && (out.ok ? <p className="mt-3">Ingenua: {out.naive} · Media móvil: {out.moving_avg.join(", ")} · Anomalías: {out.anomaly_indices.join(", ") || "ninguna"}</p> : <p role="alert">{out.error}</p>)}
  </section>;
}
