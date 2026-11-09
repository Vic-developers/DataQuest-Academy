"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, token } from "@/lib/api";
function LeccionInner() {
  const [lessons, setLessons] = useState<any[]>([]), [detail, setDetail] = useState<any>(null),
        [ans, setAns] = useState(""), [fb, setFb] = useState(""), [msg, setMsg] = useState("");
  const params = useSearchParams();
  const wid = params.get("world") ?? "1";
  useEffect(() => { api(`/api/v1/worlds/${wid}/lessons`).then(setLessons).catch(() => {}); }, [wid]);
  async function open(id: number) { setDetail(await api(`/api/v1/lessons/${id}`)); setFb(""); }
  async function complete() {
    if (!token()) { setMsg("Inicia sesión para guardar el progreso. Puedes seguir leyendo sin cuenta."); return; }
    try { const r = await api(`/api/v1/lessons/${detail.id}/complete`, { method: "POST", body: "{}" }); setMsg(`Completada. XP total: ${r.xp}`); }
    catch { setMsg("No se pudo guardar el progreso. Inicia sesión para guardar tus avances."); }
  }
  async function submitEx(id: number) {
    if (!token()) { setMsg("Inicia sesión para guardar tu respuesta. Puedes seguir practicando sin cuenta."); return; }
    try { const r = await api(`/api/v1/exercises/${id}/submit`, { method: "POST", body: JSON.stringify({ submission: ans }) }); setFb(r.feedback); }
    catch { setFb("No se pudo comprobar. Inicia sesión para guardar tus respuestas."); }
  }
  return <section>
    <h1 className="text-2xl font-bold">Lecciones</h1>
    <ul className="mt-3 space-y-2">{lessons.map((l: any) => <li key={l.id}><button className="border rounded px-3 py-1" onClick={() => open(l.id)}>{l.title}</button> <span className="text-sm text-slate-500">{l.objective}</span></li>)}</ul>
    {detail && <article className="mt-6 rounded border bg-white p-4 dark:bg-slate-900">
      <h2 className="text-xl font-bold">{detail.title}</h2>
      <p><strong>Objetivo:</strong> {detail.objective}</p><p><strong>Competencia:</strong> {detail.competency}</p>
      <p className="mt-2 whitespace-pre-wrap">{detail.content}</p>
      <button className="mt-3 rounded bg-blue-600 px-4 py-2 text-white" onClick={complete}>Marcar completada (+10 XP)</button>
      {msg && <p>{msg}</p>}
      <h3 className="mt-4 font-bold">Ejercicios</h3>
      {detail.exercises.map((e: any) => <div key={e.id} className="border-t py-2">
        <p>{e.prompt}</p>
        {e.kind === "mcq" ? <ul>{(e.options ?? []).map((o: string) => <li key={o}><label><input type="radio" name={`ex${e.id}`} value={o} onChange={() => setAns(o)} /> {o}</label></li>)}</ul>
          : <textarea className="w-full border rounded px-3 py-2" value={ans} onChange={e => setAns(e.target.value)} placeholder={e.kind === "sql" ? "SELECT … FROM ventas …" : "print(…)"} rows={4} />}
        <button className="rounded border px-3 py-1" onClick={() => submitEx(e.id)}>Comprobar</button>
      </div>)}
      {fb && <p role="status">{fb}</p>}
    </article>}
  </section>;
}
export default function Leccion() { return <Suspense fallback={<p>Cargando…</p>}><LeccionInner /></Suspense>; }
