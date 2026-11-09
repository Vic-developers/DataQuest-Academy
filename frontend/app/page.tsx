import Link from "next/link";

export default function Home() {
  return (
    <section>
      {/* Top strip */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 border-b border-[var(--line)] pb-3 text-[11px] text-[#8a8577]">
        <span><strong className="text-[var(--ink)]">72</strong> lecciones</span>
        <span><strong className="text-[var(--ink)]">24</strong> laboratorios</span>
        <span><strong className="text-[var(--ink)]">7</strong> proyectos con rúbrica</span>
        <span className="ml-auto">En español · España</span>
      </div>

      {/* HERO */}
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_.9fr] lg:items-center">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent-dark)]">De analista a científico de datos</p>
          <h1 className="font-display mt-3 text-[40px] sm:text-5xl font-semibold leading-[1.02] tracking-tight text-[var(--ink)]">Aprende datos<br /><span className="italic text-[var(--accent-dark)]">de verdad, practicando.</span></h1>
          <p className="mt-5 max-w-lg text-lg text-[#3b382f]">SQL, Python, estadística, Power BI y Machine Learning. Sin vídeos interminables: escribes, ejecutas, te equivocas y entiendes.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/register" className="btn btn-accent text-base px-6 py-3">Empieza gratis</Link>
            <Link href="/mapa" className="btn btn-ghost text-base px-6 py-3">Ver mapa de 22 mundos</Link>
          </div>
          <p className="mt-4 text-xs text-[#8a8577]">Sin tarjeta · sin humo · datos sintéticos desde el día 1.</p>
        </div>

        {/* Illustrative product mock */}
        <div aria-hidden className="card !p-0 overflow-hidden select-none">
          <div className="bg-[#171512] px-5 py-2.5 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#e5484d]" /><span className="h-3 w-3 rounded-full bg-[#f2b544]" /><span className="h-3 w-3 rounded-full bg-[#3dd68c]" />
            <span className="ml-3 code-mono text-[10px] text-[#8a8577]">lab_sql.py — ventas.csv</span>
          </div>
          <div className="bg-[#1c1a16] p-5 code-mono text-[11px] leading-6 text-[#d6d2c6]">
            <p><span className="text-[#8ab4ff]">SELECT</span> region, <span className="text-[#8ab4ff]">SUM</span>(unidades)</p>
            <p><span className="text-[#8ab4ff]">FROM</span> ventas</p>
            <p><span className="text-[#8ab4ff]">GROUP BY</span> region;</p>
            <div className="mt-3 border-l-2 border-[var(--green)] pl-3 text-[#7ee2a8]">
              <p>region   sum</p>
              <p>Este     3</p>
              <p>Norte    18</p>
              <p>Sur      5</p>
            </div>
          </div>
          <div className="px-5 py-4 flex items-center justify-between bg-[var(--card)]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#8a8577]">Ejercicio aprobado</p>
              <p className="text-sm font-bold">Agregación por región</p>
            </div>
            <span className="chip chip-accent">+20 XP</span>
          </div>
        </div>
      </div>

      {/* Routes */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {[["Ruta 1 · Data Analyst", "Iniciación, Excel, SQL, Python, Power BI, análisis avanzado.", "/mapa"], ["Ruta 2 · Data Scientist", "Álgebra, ML, Deep Learning, NLP, IA, MLOps y ética.", "/mapa"]].map(([t, d, h]) => (
          <Link key={t} href={h} className="card card-hover group">
            <h2 className="font-display text-2xl font-semibold">{t}</h2>
            <p className="mt-2 text-sm text-[#57534a]">{d}</p>
            <span className="mt-4 inline-block code-mono text-xs text-[var(--accent-dark)] group-hover:translate-x-1 transition-transform">explorar →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
