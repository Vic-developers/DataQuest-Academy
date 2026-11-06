"use client";
import { useState } from "react";
import { api } from "@/lib/api";
export default function Register() {
  const [email, setEmail] = useState(""), [password, setPassword] = useState(""), [msg, setMsg] = useState("");
  async function go(e: React.FormEvent) {
    e.preventDefault();
    try { await api("/api/v1/auth/register", { method: "POST", body: JSON.stringify({ email, password }) });
      const r = await api("/api/v1/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      localStorage.setItem("dq_token", r.access_token); window.location.href = "/dashboard";
    } catch { setMsg("Error al registrarse. Prueba con otro email."); }
  }
  return <form onSubmit={go} className="mx-auto max-w-md space-y-3">
    <h1 className="text-2xl font-bold">Crear cuenta</h1>
    <label className="block">Email<input className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required /></label>
    <label className="block">Contraseña (mín. 8)<input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} required /></label>
    <button className="rounded bg-blue-600 px-4 py-2 text-white">Registrarse</button>
    {msg && <p role="alert">{msg}</p>}
  </form>;
}
