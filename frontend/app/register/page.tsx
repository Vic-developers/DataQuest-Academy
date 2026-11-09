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
    } catch { setMsg("Error al registrarse. Prueba con otro email (mín. 8 caracteres)."); }
  }
  return <div className="min-h-[75vh] grid place-items-center py-10">
    <form onSubmit={go} className="card w-full max-w-md">
      <p className="font-mono text-[11px] uppercase tracking-widest text-[#8a8577]">Empieza hoy</p>
      <h1 className="font-display mt-1 text-3xl font-semibold">Crear cuenta</h1>
      <p className="mt-2 text-sm text-[#5c574c]">Acceso gratuito a los primeros mundos.</p>
      <label className="block mt-5 text-sm font-medium">Email<input className="input mt-1" value={email} onChange={e => setEmail(e.target.value)} required /></label>
      <label className="block mt-4 text-sm font-medium">Contraseña (mín. 8)<input type="password" className="input mt-1" value={password} onChange={e => setPassword(e.target.value)} required /></label>
      <button className="btn btn-accent w-full justify-center mt-5">Crear cuenta</button>
      {msg && <p role="alert" className="mt-3 text-sm text-red-700">{msg}</p>}
    </form>
  </div>;
}
