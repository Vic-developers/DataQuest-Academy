"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function Dl() {
  const [xs, setXs] = useState("1,2,3,4");
  const [ys, setYs] = useState("1,2,3,4");
  const [out, setOut] = useState<any>(null);
  async function run() { setOut(await api("/api/v1/labs/dl/perceptron", { method: "POST", body: JSON.stringify({ xs, ys, epochs: 50 }) })); }
  return <section>
    <h1 className="text-2xl font-bold">Laboratorio Deep Learning (perceptrón)</h1>
    <p className="text-sm">Descenso de gradiente 1D real (stdlib). Sin frameworks.</p>
    <label className="block mt-2">x<input className="block w-full border rounded px-3 py-2" value={xs} onChange={e => setXs(e.target.value)} /></label>
    <label className="block mt-2">y<input className="block w-full border rounded px-3 py-2" value={ys} onChange={e => setYs(e.target.value)} /></label>
    <button className="mt-3 rounded bg-blue-600 px-4 py-2 text-white" onClick={run}>Entrenar</button>
    {out && (out.ok ? <p className="mt-3">w={out.w}, b={out.b}, MAE={out.mae}</p> : <p role="alert">{out.error}</p>)}
  </section>;
}
