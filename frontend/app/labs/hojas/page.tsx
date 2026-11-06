"use client";
import { useState } from "react";
import { api } from "@/lib/api";

const COLS = ["A", "B", "C", "D"], ROWS = [1, 2, 3, 4, 5];
const initial = [["10", "20", "30", "=SUMA(A1:C1)"], ["5", "15", "25", "=PROMEDIO(A2:C2)"], ["1", "2", "3", "=SI(A3>1; \"SI\"; \"NO\")"], ["", "", "", ""], ["", "", "", ""]];

export default function Hojas() {
  const [grid, setGrid] = useState(initial), [out, setOut] = useState<any>(null);
  function set(r: number, c: number, v: string) {
    const g = grid.map((row, i) => row.map((cell, j) => (i === r && j === c) ? v : cell));
    setGrid(g);
  }
  async function run() { setOut(await api("/api/v1/labs/sheet/evaluate", { method: "POST", body: JSON.stringify({ grid }) })); }
  return <section>
    <h1 className="text-2xl font-bold">Laboratorio de hojas de cálculo</h1>
    <p className="text-sm">Funciones soportadas: <code>SUMA, PROMEDIO, CONTAR, MIN, MAX, SI(cond; a; b)</code>. Rangos como <code>A1:C2</code>. No es Excel completo.</p>
    <table className="mt-3 border text-sm">
      <thead><tr><th className="border px-2"></th>{COLS.map(c => <th key={c} className="border px-2">{c}</th>)}</tr></thead>
      <tbody>{ROWS.map((r, i) => <tr key={r}><th className="border px-2">{r}</th>
        {COLS.map((_, j) => <td key={j} className="border px-1"><input aria-label={`celda ${COLS[j]}${r}`} className="w-24 px-1 py-1" value={grid[i][j]} onChange={e => set(i, j, e.target.value)} /></td>)}
      </tr>)}</tbody>
    </table>
    <button className="mt-3 rounded bg-blue-600 px-4 py-2 text-white" onClick={run}>Evaluar fórmulas</button>
    {out && <div className="mt-3"><h2 className="font-bold">Resultado</h2>
      <table className="border text-sm"><tbody>
        {out.computed.map((row: string[], i: number) => <tr key={i}>{row.map((cell: string, j: number) => <td key={j} className="border px-2">{cell}</td>)}</tr>)}
      </tbody></table>
      {out.errors.length > 0 && <p role="alert">Errores: {out.errors.join("; ")}</p>}
    </div>}
  </section>;
}
