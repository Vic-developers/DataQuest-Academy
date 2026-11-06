"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function Ml() {
  const [xs, setXs] = useState("5.1,4.9,5.8,6.4,6.0,5.9,6.5,6.7,6.3,7.0"), [ys, setYs] = useState("3.5,3.0,2.7,2.9,2.2,3.0,2.8,3.1,2.5,3.2"), [out, setOut] = useState<any>(null), [sp, setSp] = useState<any>(null);
  async function run() { setOut(await api("/api/v1/labs/ml/regression", { method: "POST", body: JSON.stringify({ xs, ys }) })); }
  async function split() { setSp(await api("/api/v1/labs/ml/split", { method: "POST", body: JSON.stringify({ xs, ys }) })); }
  return <section>
    <h1 className="text-2xl font-bold">Laboratorio de regresión (puente ML)</h1>
    <p className="text-sm">Ajusta <code>y = a + b·x</code> por mínimos cuadrados y mide el MAE. Ejemplo con columnas de <code>iris_sintetico.csv</code>.</p>
    <label className="block mt-2">x (separados por comas)<input className="block w-full border rounded px-3 py-2" value={xs} onChange={e => setXs(e.target.value)} /></label>
    <label className="block mt-2">y<input className="block w-full border rounded px-3 py-2" value={ys} onChange={e => setYs(e.target.value)} /></label>
    <button className="mt-3 rounded bg-blue-600 px-4 py-2 text-white" onClick={run}>Ajustar regresión</button>
    {out && (out.ok ? <p className="mt-3">a = {out.a}, b = {out.b}, MAE = {out.mae} (n = {out.n}). Ecuación: y = {out.a} + {out.b}·x.</p> : <p role="alert">{out.error}</p>)}
    <button className="ml-2 rounded border px-4 py-2" onClick={split}>Evaluar train/test (80/20, seed 42)</button>
    {sp && (sp.ok ? <p className="mt-2">Train n={sp.n_train} (MAE {sp.mae_train}) · Test n={sp.n_test} (MAE {sp.mae_test}) · y = {sp.a} + {sp.b}·x</p> : <p role="alert">{sp.error}</p>)}
    <p className="mt-4 text-sm">Proyecto final (p5-ml): divide un dataset en train/test, ajusta aquí, documenta métricas y limitaciones, y entrégalo en <code>Proyectos</code>.</p>
  </section>;
}
