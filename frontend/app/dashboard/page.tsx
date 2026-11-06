"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
export default function Dash() {
  const [d, setD] = useState<any>(null), [err, setErr] = useState("");
  useEffect(() => { api("/api/v1/dashboard").then(setD).catch(() => setErr("Inicia sesión para ver tu progreso.")); }, []);
  if (err) return <p>{err}</p>;
  if (!d) return <p>Cargando…</p>;
  return <section>
    <h1 className="text-2xl font-bold">Tu panel</h1>
    <p className="mt-2">XP: {d.xp} · Racha: {d.streak} días · Progreso: {d.done}/{d.total} lecciones</p>
    <h2 className="mt-4 font-bold">Actividad reciente</h2>
    <ul className="list-disc ml-5">{d.recent_xp.map((x: any, i: number) => <li key={i}>+{x.amount} XP — {x.reason}</li>)}</ul>
  </section>;
}
