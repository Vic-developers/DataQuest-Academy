"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
const AVATARS = ["avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5"];
export default function Perfil() {
  const [me, setMe] = useState<any>(null), [av, setAv] = useState("avatar-1"), [msg, setMsg] = useState("");
  useEffect(() => { api("/api/v1/me").then(setMe).catch(() => setMsg("Inicia sesión para ver tu perfil.")); }, []);
  async function choose(a: string) { setAv(a); try { await api("/api/v1/me/avatar", { method: "POST", body: JSON.stringify({ avatar: a }) }); setMsg(`Avatar (${a}) guardado.`); } catch { setMsg("Inicia sesión para guardar."); } }
  if (msg && !me) return <p>{msg}</p>;
  if (!me) return <p>Cargando…</p>;
  return <section>
    <h1 className="text-2xl font-bold">Perfil</h1>
    <p>{me.full_name || me.email} — Nivel {me.level} ({me.rank}) · {me.xp} XP · Racha {me.streak} días</p>
    <h2 className="mt-4 font-bold">Avatar cosmético</h2>
    <div className="mt-2 flex gap-2">{AVATARS.map(a => <button key={a} className={"rounded border px-3 py-2 " + (av === a ? "bg-blue-600 text-white" : "")} onClick={() => choose(a)} aria-pressed={av === a}>{a}</button>)}</div>
    {msg && <p role="status" className="mt-2">{msg}</p>}
  </section>;
}
