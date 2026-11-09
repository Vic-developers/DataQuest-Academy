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
  return <div className="min-h-[75vh] grid place-items-center py-10">
    <form onSubmit={go} className="card w-full max-w-md">
      <p className="font-mono text-[11px] uppercase tracking-widest text-[#8a8577]">Acceso</p>
      <h1 className="font-display mt-1 text-3xl font-semibold">Entrar</h1>
      <label className="block mt-5 text-sm font-medium">Email<input className="input mt-1" value={email} onChange={e => setEmail(e.target.value)} required /></label>
      <label className="block mt-4 text-sm font-medium">Contraseña<input type="password" className="input mt-1" value={password} onChange={e => setPassword(e.target.value)} required /></label>
      <button className="btn btn-accent w-full justify-center mt-5">Entrar</button>
      {msg && <p role="alert" className="mt-3 text-sm text-red-700">{msg}</p>}
      <p className="mt-5 text-sm text-[#5c574c]">¿Sin cuenta? <Link className="font-semibold text-[var(--accent-dark)] underline underline-offset-2" href="/register">Regístrate</Link></p>
    </form>
  </div>;
}
