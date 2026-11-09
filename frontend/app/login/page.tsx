"use client";
import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
export default function Login() {
  const [email, setEmail] = useState(""), [password, setPassword] = useState(""), [msg, setMsg] = useState("");
  async function go(e: React.FormEvent) {
    e.preventDefault();
    try { const r = await api("/api/v1/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      localStorage.setItem("dq_token", r.access_token); window.location.href = "/dashboard";
    } catch { setMsg("Credenciales inválidas o cuenta inexistente."); }
  }
  return <div className="min-h-[70vh] grid place-items-center">
    <form onSubmit={go} className="card w-full max-w-md">
      <span className="chip chip-brand">Bienvenido de vuelta</span>
      <h1 className="mt-3 text-2xl font-bold">Iniciar sesión</h1>
      <label className="block mt-4 text-sm text-[#c7cde8]">Email<input className="input mt-1" value={email} onChange={e => setEmail(e.target.value)} required /></label>
      <label className="block mt-3 text-sm text-[#c7cde8]">Contraseña<input type="password" className="input mt-1" value={password} onChange={e => setPassword(e.target.value)} required /></label>
      <button className="btn btn-primary w-full justify-center mt-4">Entrar</button>
      {msg && <p role="alert" className="mt-3 text-sm text-rose-300">{msg}</p>}
      <p className="mt-4 text-sm text-[#8b98c0]">¿Sin cuenta? <Link className="text-[var(--brand-2)] hover:underline" href="/register">Regístrate</Link></p>
    </form>
  </div>;
}
