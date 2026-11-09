"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function Metricas() {
  const [yt, setYt] = useState("1,0,1,0,1,0,0,1");
  const [yp, setYp] = useState("1,0,0,0,1,1,0,1");
  const [out, setOut] = useState<any>(null);
  async function run() { setOut(await api("/api/v1/labs/ml/metrics", { method: "POST", body: JSON.stringify({ y_true: yt, y_pred: yp }) })); }
  return <section>
    <h1 className="text-2xl font-bold">Laboratorio de métricas (clasificación)</h1>
    <p className="text-sm">Ingresa etiquetas binarias 0/1. Calcula matriz, precisión, recall y F1 (stdlib real).</p>
    <label className="block mt-2">y_true<input className="block w-full border rounded px-3 py-2" value={yt} onChange={e => setYt(e.target.value)} /></label>
    <label className="block mt-2">y_pred<input className="block w-full border rounded px-3 py-2" value={yp} onChange={e => setYp(e.target.value)} /></label>
    <button className="mt-3 rounded bg-blue-600 px-4 py-2 text-white" onClick={run}>Calcular métricas</button>
    {out && (out.ok ? <p className="mt-3">TP {out.tp} · FP {out.fp} · FN {out.fn} · TN {out.tn} · Precisión {out.precision} · Recall {out.recall} · F1 {out.f1}</p> : <p role="alert">{out.error}</p>)}
  </section>;
}
