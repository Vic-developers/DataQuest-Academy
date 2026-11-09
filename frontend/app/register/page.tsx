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
  return <div className="min-h-[70vh] grid place-items-center">
    <form onSubmit={go} className="card w-full max-w-md">
      <span className="chip chip-brand">Empieza hoy</span>
      <h1 className="mt-3 text-2xl font-bold">Crear cuenta</h1>
      <label className="block mt-4 text-sm text-[#c7cde8]">Email<input className="input mt-1" value={email} onChange={e => setEmail(e.target.value)} required /></label>
      <label className="block mt-3 text-sm text-[#c7cde8]">Contraseña (mín. 8)<input type="password" className="input mt-1" value={password} onChange={e => setPassword(e.target.value)} required /></label>
      <button className="btn btn-primary w-full justify-center mt-4">Crear cuenta</button>
      {msg && <p role="alert" className="mt-3 text-sm text-rose-300">{msg}</p>}
    </form>
  </div>;
}
