"use client";
import { useState } from "react";
import { api } from "@/lib/api";
export default function PyLab() {
  const [code, setCode] = useState("import statistics\nprint(statistics.mean([10, 15, 20]))");
  const [out, setOut] = useState<any>(null);
  async function run() { setOut(await api("/api/v1/labs/python/run", { method: "POST", body: JSON.stringify({ code }) })); }
  return <section>
    <h1 className="text-2xl font-bold">Laboratorio Python</h1>
    <p className="text-sm">Imports permitidos (MVP): math, statistics, itertools, collections, datetime, json, csv, re. Timeout 5s.</p>
    <textarea className="mt-2 w-full border rounded px-3 py-2 font-mono" rows={8} value={code} onChange={e => setCode(e.target.value)} />
    <button className="mt-2 rounded bg-blue-600 px-4 py-2 text-white" onClick={run}>Ejecutar</button>
    {out && <pre className="mt-3 rounded bg-slate-900 p-3 text-white text-sm">{out.stdout}{out.stderr}{out.error}</pre>}
  </section>;
}
