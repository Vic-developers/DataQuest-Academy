"use client";
import { useState } from "react";
import { api } from "@/lib/api";
export default function Cert() {
  const [out, setOut] = useState<any>(null), [code, setCode] = useState("");
  async function issue() { try { setOut(await api("/api/v1/certificates/issue", { method: "POST", body: "{}" })); } catch { setOut({ error: "Inicia sesión." }); } }
  async function verify() { setOut(await api(`/api/v1/certificates/verify/${code}`)); }
  return <section className="mx-auto max-w-md">
    <h1 className="text-2xl font-bold">Certificados</h1>
    <button className="mt-2 rounded bg-blue-600 px-4 py-2 text-white" onClick={issue}>Emitir certificado Mundo 0</button>
    <div className="mt-4 flex gap-2"><input className="flex-1 border rounded px-3 py-2" value={code} onChange={e => setCode(e.target.value)} placeholder="Código DQ-…" /><button className="border rounded px-3" onClick={verify}>Verificar</button></div>
    {out && <pre className="mt-3 rounded bg-slate-100 p-3 text-sm dark:bg-slate-900">{JSON.stringify(out, null, 2)}</pre>}
  </section>;
}
