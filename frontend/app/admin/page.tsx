"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
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
  </section>;
}
