"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
export default function Misiones() {
  const [ms, setMs] = useState<any[]>([]), [bs, setBs] = useState<any[]>([]), [msg, setMsg] = useState("");
  useEffect(() => { api("/api/v1/missions").then(setMs).catch(() => {}); api("/api/v1/badges").then(setBs).catch(() => {}); }, []);
  return <section>
    <h1 className="text-2xl font-bold">Misiones e insignias</h1>
    <h2 className="mt-4 font-bold">Misiones</h2>
    <ul className="list-disc ml-5">{ms.map((m: any) => <li key={m.id}>{m.title} — {m.description} (+{m.xp} XP) <button className="ml-2 rounded border px-2 py-0.5 text-sm" onClick={async () => { try { const r = await api(`/api/v1/missions/${m.id}/complete`, { method: "POST", body: "{}" }); setMsg(`Misión completada. XP total: ${r.xp}`); } catch { setMsg("Inicia sesión para completar misiones."); } }}>Completar</button></li>)}</ul>
    {msg && <p role="status" className="mt-2">{msg}</p>}
    <h2 className="mt-4 font-bold">Insignias</h2>
    <ul className="list-disc ml-5">{bs.map((b: any) => <li key={b.code}>{b.title}</li>)}</ul>
  </section>;
}
