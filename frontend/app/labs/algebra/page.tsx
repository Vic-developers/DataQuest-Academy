"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function Algebra() {
  const [a, setA] = useState("1,2;3,4");
  const [b, setB] = useState("5,6;7,8");
  const [out, setOut] = useState<any>(null);
  async function run() { setOut(await api("/api/v1/labs/algebra/matmul", { method: "POST", body: JSON.stringify({ a, b }) })); }
  return <section>
    <h1 className="text-2xl font-bold">Laboratorio de álgebra lineal</h1>
    <p className="text-sm">Multiplica matrices A·B (stdlib real). Formato: filas con <code>;</code> y columnas con <code>,</code>.</p>
    <label className="block mt-2">A<input className="block w-full border rounded px-3 py-2" value={a} onChange={e => setA(e.target.value)} /></label>
    <label className="block mt-2">B<input className="block w-full border rounded px-3 py-2" value={b} onChange={e => setB(e.target.value)} /></label>
    <button className="mt-3 rounded bg-blue-600 px-4 py-2 text-white" onClick={run}>Multiplicar A·B</button>
    {out && (out.ok ? <pre className="mt-3 rounded bg-slate-100 p-3 dark:bg-slate-900">{JSON.stringify(out.result)}</pre> : <p role="alert">{out.error}</p>)}
  </section>;
}
