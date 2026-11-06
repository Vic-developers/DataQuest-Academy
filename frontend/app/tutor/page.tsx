"use client";
import { useState } from "react";
import { api } from "@/lib/api";
export default function Tutor() {
  const [q, setQ] = useState(""), [a, setA] = useState("");
  async function ask(e: React.FormEvent) { e.preventDefault();
    try { setA((await api("/api/v1/tutor/ask", { method: "POST", body: JSON.stringify({ question: q }) })).answer); }
    catch { setA("Inicia sesión para consultar al tutor."); } }
  return <section className="mx-auto max-w-2xl">
    <h1 className="text-2xl font-bold">DataMentor</h1>
    <p>Modo socrático: te guía sin darte directamente la solución de evaluaciones.</p>
    <form onSubmit={ask} className="mt-3 flex gap-2">
      <input className="flex-1 border rounded px-3 py-2" value={q} onChange={e => setQ(e.target.value)} placeholder="¿Qué duda tienes?" required />
      <button className="rounded bg-blue-600 px-4 py-2 text-white">Preguntar</button>
    </form>
    {a && <article className="mt-4 rounded border bg-white p-4 dark:bg-slate-900 whitespace-pre-wrap">{a}</article>}
  </section>;
}
