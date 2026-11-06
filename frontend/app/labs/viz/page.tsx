"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "@/lib/api";

export default function Viz() {
  const [rows, setRows] = useState<any[]>([]), [err, setErr] = useState("");
  useEffect(() => { api("/api/v1/labs/viz/ventas").then((r: any) => setRows(r.rows ?? [])).catch(() => setErr("No se pudo cargar.")); }, []);
  return <section>
    <h1 className="text-2xl font-bold">Laboratorio de visualización</h1>
    <p className="text-sm">Unidades vendidas por región (dataset sintético <code>ventas</code>). Eje Y desde 0 para no engañar.</p>
    {err ? <p role="alert">{err}</p> : rows.length === 0 ? <p>Cargando…</p> :
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="region" />
          <YAxis domain={[0, "auto"]} />
          <Tooltip />
          <Bar dataKey="u" name="Unidades" />
        </BarChart>
      </ResponsiveContainer>}
    {rows.length > 0 && <ul className="mt-2 list-disc ml-5">{rows.map((r: any) => <li key={r.region}>{r.region}: {r.u} unidades</li>)}</ul>}
  </section>;
}
