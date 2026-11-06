"use client";
import { useState } from "react";
import { api } from "@/lib/api";
export default function SqlLab() {
  const [q, setQ] = useState("SELECT region, SUM(unidades) AS s FROM ventas GROUP BY region ORDER BY region");
  const [out, setOut] = useState<any>(null);
  async function run() { setOut(await api("/api/v1/labs/sql/run", { method: "POST", body: JSON.stringify({ query: q }) })); }
  return <section>
    <h1 className="text-2xl font-bold">Laboratorio SQL</h1>
    <p className="text-sm">Tabla disponible: <code>ventas(id, region, producto, unidades, precio)</code>. Solo SELECT/WITH.</p>
    <textarea className="mt-2 w-full border rounded px-3 py-2" rows={6} value={q} onChange={e => setQ(e.target.value)} />
    <button className="mt-2 rounded bg-blue-600 px-4 py-2 text-white" onClick={run}>Ejecutar</button>
    {out && (out.ok ? <table className="mt-3 w-full border text-sm"><thead><tr>{out.columns.map((c: string) => <th key={c} className="border px-2">{c}</th>)}</tr></thead><tbody>{out.rows.map((r: any, i: number) => <tr key={i}>{out.columns.map((c: string) => <td key={c} className="border px-2">{String(r[c])}</td>)}</tr>)}</tbody></table> : <p role="alert" className="mt-3">{out.error}</p>)}
  </section>;
}
