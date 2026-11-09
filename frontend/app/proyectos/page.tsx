"use client";
"use client";
import { useEffect, useState } from "react";
import { api, token } from "@/lib/api";
export default function Proyectos() {
  const [ps, setPs] = useState<any[]>([]), [code, setCode] = useState(""), [text, setText] = useState(""), [msg, setMsg] = useState("");
  useEffect(() => { api("/api/v1/projects").then(setPs).catch(() => {}); }, []);
  async function send() {
    if (!token()) { setMsg("Inicia sesión para guardar tu entrega. Puedes escribirla y guardarla localmente."); return; }
    try { const r = await api(`/api/v1/projects/${code}/submit`, { method: "POST", body: JSON.stringify({ content: text }) }); setMsg(`Entregado. Puntuación provisional: ${r.score}`); }
    catch { setMsg("No se pudo entregar. Inicia sesión para guardar tu proyecto."); }
  }
  return <section>
    <h1 className="text-2xl font-bold">Centro de proyectos</h1>
    <ul className="mt-2 list-disc ml-5">{ps.map(p => <li key={p.code}>{p.title} <button className="border rounded px-2" onClick={() => setCode(p.code)}>Elegir</button></li>)}</ul>
    {code && <div className="mt-4">
      <p>Proyecto: {code}. Entrega (mín. 50 caracteres): análisis, método, hallazgos, limitaciones.</p>
      <textarea className="w-full border rounded px-3 py-2" rows={6} value={text} onChange={e => setText(e.target.value)} />
      <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={send}>Entregar</button>
      {msg && <p>{msg}</p>}
    </div>}
  </section>;
}
