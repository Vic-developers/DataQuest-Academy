"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function Equidad() {
  const [g, setG] = useState("A,A,A,A,B,B,B,B");
  const [yt, setYt] = useState("1,1,0,0,1,1,0,0");
  const [yp, setYp] = useState("1,0,0,0,1,0,0,0");
  const [out, setOut] = useState<any>(null);
  async function run() { setOut(await api("/api/v1/labs/ml/fairness", { method: "POST", body: JSON.stringify({ groups: g, y_true: yt, y_pred: yp }) })); }
  return <section>
    <h1 className="text-2xl font-bold">Laboratorio de auditoría de equidad</h1>
    <p className="text-sm">Precisión/recall por grupo (stdlib real). Datos sintéticos de demo.</p>
    <label className="block mt-2">Grupos<input className="block w-full border rounded px-3 py-2" value={g} onChange={e => setG(e.target.value)} /></label>
    <label className="block mt-2">y_true<input className="block w-full border rounded px-3 py-2" value={yt} onChange={e => setYt(e.target.value)} /></label>
    <label className="block mt-2">y_pred<input className="block w-full border rounded px-3 py-2" value={yp} onChange={e => setYp(e.target.value)} /></label>
    <button className="mt-3 rounded bg-blue-600 px-4 py-2 text-white" onClick={run}>Auditar</button>
    {out && (out.ok ? <pre className="mt-3 rounded bg-slate-100 p-3 dark:bg-slate-900">{JSON.stringify(out.by_group, null, 2)}</pre> : <p role="alert">{out.error}</p>)}
  </section>;
}
