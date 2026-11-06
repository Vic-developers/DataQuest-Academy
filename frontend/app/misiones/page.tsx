"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
export default function Misiones() {
  const [ms, setMs] = useState<any[]>([]), [bs, setBs] = useState<any[]>([]);
  useEffect(() => { api("/api/v1/missions").then(setMs).catch(() => {}); api("/api/v1/badges").then(setBs).catch(() => {}); }, []);
  return <section>
    <h1 className="text-2xl font-bold">Misiones e insignias</h1>
    <h2 className="mt-4 font-bold">Misiones</h2>
    <ul className="list-disc ml-5">{ms.map((m: any) => <li key={m.id}>{m.title} — {m.description} (+{m.xp} XP al completarla en su lección)</li>)}</ul>
    <h2 className="mt-4 font-bold">Insignias</h2>
    <ul className="list-disc ml-5">{bs.map((b: any) => <li key={b.code}>{b.title}</li>)}</ul>
  </section>;
}
