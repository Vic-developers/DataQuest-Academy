"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

function Editor() {
  const [lessons, setLessons] = useState<any[]>([]), [worlds, setWorlds] = useState<any[]>([]),
        [f, setF] = useState({ world_id: 1, code: "", title: "", objective: "", content: "" }),
        [ex, setEx] = useState({ lesson_id: "", kind: "mcq", prompt: "", answer: "" }), [msg, setMsg] = useState("");
  async function load() { setLessons(await api("/api/v1/admin/lessons").catch(() => [])); setWorlds(await api("/api/v1/worlds").catch(() => [])); }
  useEffect(() => { load(); }, []);
  async function createLesson(e: React.FormEvent) { e.preventDefault();
    try { await api("/api/v1/admin/lessons", { method: "POST", body: JSON.stringify(f) }); setMsg("Lección creada."); load(); setF({ world_id: 1, code: "", title: "", objective: "", content: "" }); }
    catch { setMsg("Error: necesitas rol admin/author y código único."); } }
  async function createEx(e: React.FormEvent) { e.preventDefault();
    try { await api("/api/v1/admin/exercises", { method: "POST", body: JSON.stringify({ lesson_id: Number(ex.lesson_id), kind: ex.kind, prompt: ex.prompt, answer: ex.answer }) }); setMsg("Ejercicio creado."); }
    catch { setMsg("Error al crear ejercicio."); } }
  return <section className="mt-8">
    <h2 className="text-xl font-bold">Editor de contenidos (admin/author)</h2>
    <p className="text-sm text-slate-500">{lessons.length} lecciones existentes.</p>
    <form onSubmit={createLesson} className="mt-3 space-y-2">
      <label className="block">Mundo
        <select className="block w-full border rounded px-3 py-2" value={f.world_id} onChange={e => setF({ ...f, world_id: Number(e.target.value) })}>
          {worlds.map((w: any) => <option key={w.id} value={w.id}>{w.title}</option>)}
        </select></label>
      <label className="block">Código<input className="block w-full border rounded px-3 py-2" value={f.code} onChange={e => setF({ ...f, code: e.target.value })} required /></label>
      <label className="block">Título<input className="block w-full border rounded px-3 py-2" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} required /></label>
      <label className="block">Objetivo<input className="block w-full border rounded px-3 py-2" value={f.objective} onChange={e => setF({ ...f, objective: e.target.value })} /></label>
      <label className="block">Contenido<textarea className="block w-full border rounded px-3 py-2" rows={3} value={f.content} onChange={e => setF({ ...f, content: e.target.value })} required /></label>
      <button className="rounded bg-blue-600 px-4 py-2 text-white">Crear lección</button>
    </form>
    <form onSubmit={createEx} className="mt-4 space-y-2">
      <label className="block">Lección
        <select className="block w-full border rounded px-3 py-2" value={ex.lesson_id} onChange={e => setEx({ ...ex, lesson_id: e.target.value })} required>
          <option value="">Elige…</option>
          {lessons.map((l: any) => <option key={l.id} value={l.id}>{l.code} — {l.title}</option>)}
        </select></label>
      <label className="block">Tipo
        <select className="block w-full border rounded px-3 py-2" value={ex.kind} onChange={e => setEx({ ...ex, kind: e.target.value })}>
          <option value="mcq">mcq</option><option value="sql">sql</option><option value="python">python</option>
        </select></label>
      <label className="block">Pregunta<textarea className="block w-full border rounded px-3 py-2" rows={2} value={ex.prompt} onChange={e => setEx({ ...ex, prompt: e.target.value })} required /></label>
      <label className="block">Respuesta (mcq)<input className="block w-full border rounded px-3 py-2" value={ex.answer} onChange={e => setEx({ ...ex, answer: e.target.value })} /></label>
      <button className="rounded border px-4 py-2">Crear ejercicio</button>
    </form>
    {msg && <p role="status" className="mt-2">{msg}</p>}
  </section>;
}

export default function Admin() {
  const [s, setS] = useState<any>(null), [err, setErr] = useState("");
  useEffect(() => { api("/api/v1/admin/stats").then(setS).catch(() => setErr("Requiere rol admin/author/reviewer.")); }, []);
  if (err) return <p>{err}</p>;
  if (!s) return <p>Cargando…</p>;
  return <section>
    <h1 className="text-2xl font-bold">Panel administrativo</h1>
    <dl className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
      <div className="border rounded p-3"><dt>Usuarios</dt><dd className="text-xl font-bold">{s.users}</dd></div>
      <div className="border rounded p-3"><dt>Lecciones</dt><dd className="text-xl font-bold">{s.lessons}</dd></div>
      <div className="border rounded p-3"><dt>Ejercicios</dt><dd className="text-xl font-bold">{s.exercises}</dd></div>
      <div className="border rounded p-3"><dt>Intentos</dt><dd className="text-xl font-bold">{s.attempts}</dd></div>
      <div className="border rounded p-3"><dt>Acertadas</dt><dd className="text-xl font-bold">{Math.round(s.correct_rate * 100)}%</dd></div>
      <div className="border rounded p-3"><dt>Transacciones XP</dt><dd className="text-xl font-bold">{s.xp_total}</dd></div>
      <div className="border rounded p-3"><dt>Certificados</dt><dd className="text-xl font-bold">{s.certificates}</dd></div>
    </dl>
    <Editor />
  </section>;
}
