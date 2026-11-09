"use client";
import { useState } from "react";
import { api } from "@/lib/api";

const INITIAL_CODE = `def sumar(a, b):
    # Escribe tu código aquí
    pass`;

const INITIAL_ASSERTS = `assert sumar(2, 3) == 5
assert sumar(0, 0) == 0
assert sumar(-1, 1) == 0`;

export default function PyGuided() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [asserts, setAsserts] = useState(INITIAL_ASSERTS);
  const [out, setOut] = useState<any>(null);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setOut(null);
    try {
      const r = await api("/api/v1/labs/python/check", {
        method: "POST",
        body: JSON.stringify({ code, asserts }),
      });
      setOut(r);
    } catch (e: any) {
      setOut({ ok: false, error: "Error de red o servidor: " + e.message });
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="py-6 sm:py-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8a8577] mb-2">
        Laboratorio Python — Ejercicio guiado
      </p>
      <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">
        Escribe código que pase los tests
      </h1>
      <p className="mt-2 text-sm text-[#5c574c]">
        Escribe tu código en el editor. Al ejecutar, se comprobará cada assert.
        Cada assert que pase suma puntos.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card">
          <label className="block text-xs uppercase tracking-widest text-[#8a8577] mb-2">
            Código Python
          </label>
          <textarea
            className="w-full h-64 border border-[var(--line-2)] rounded-lg px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-[var(--accent)] outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Escribe tu código Python aquí..."
          />
        </div>

        <div className="card">
          <label className="block text-xs uppercase tracking-widest text-[#8a8577] mb-2">
            Tests (asserts)
          </label>
          <textarea
            className="w-full h-64 border border-[var(--line-2)] rounded-lg px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-[var(--accent)] outline-none"
            value={asserts}
            onChange={(e) => setAsserts(e.target.value)}
            placeholder="assert mi_funcion(...) == valor"
          />
        </div>

        <div className="card flex flex-col justify-between">
          <label className="block text-xs uppercase tracking-widest text-[#8a8577] mb-2">
            Ejecutar
          </label>
          <button
            className="btn btn-accent w-full justify-center text-sm"
            onClick={run}
            disabled={running}
          >
            {running ? "Ejecutando…" : "Ejecutar tests"}
          </button>
          {out && (
            <div className="mt-3 p-3 rounded-lg text-sm">
              {out.ok ? (
                <>
                  <p className="text-[var(--green)] font-semibold">
                    ✓ Todos los tests pasaron ({out.passed}/{out.total})
                  </p>
                  {out.stdout && (
                    <pre className="mt-2 font-mono text-[10px] text-[#3b382f] bg-white/50 p-2 rounded">
                      {out.stdout}
                    </pre>
                  )}
                </>
              ) : (
                <>
                  <p className="text-[var(--accent-dark)] font-semibold">
                    ✗ Test falló
                  </p>
                  <pre className="mt-2 font-mono text-[10px] text-[#3b382f] bg-white/50 p-2 rounded">
                    {out.error || out.stderr || "Resultado inesperado"}
                  </pre>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
