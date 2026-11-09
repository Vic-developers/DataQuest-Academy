import Link from "next/link";

export default function Home() {
  return (
    <section className="py-4 sm:py-10">
      <div className="border-y border-[var(--line)] py-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-[#5c574c]">
        <span><strong className="text-[var(--ink)]">72</strong> lecciones</span>
        <span><strong className="text-[var(--ink)]">24</strong> laboratorios</span>
        <span><strong className="text-[var(--ink)]">7</strong> proyectos</span>
        <span><strong className="text-[var(--ink)]">free</strong> modulo inicial</span>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] items-start">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent-dark)]">Análisis · Ciencia de Datos · España</p>
          <h1 className="font-display mt-4 text-5xl sm:text-6xl font-semibold leading-[0.98] tracking-tight">Del cero<br /> absoluto a<br /> <em className="not-italic text-[var(--accent-dark)]">analista de datos</em></h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[#3b382f]">Excel, SQL, Python, estadística y una ruta completa hacia Machine Learning. Sin destrozos: laboratorios en el navegador, proyectos reales y retroalimentación.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/register" className="btn btn-accent">Empieza ahora</Link>
            <Link href="/mapa" className="btn btn-ghost">Ver el mapa →</Link>
          </div>
          <p className="mt-4 text-xs text-[#8a8577]">Sin tarjeta. Practica con datos sintéticos desde el primer día.</p>
        </div>

        <div className="card">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#8a8577]">Cómo se aprende aquí</p>
          <ol className="mt-4 space-y-4">
            {[["1. Practica con datos reales","Ejecuta SQL y Python en el navegador. Corrige hasta entenderlo."],["2. Demuestra con proyectos","Rúbricas y entregas; nada de acumular XP sin aprender."],["3. Muestra tu trabajo","Portafolio + certificado interno verificable, no oficial."]].map(([t,d]) => (
              <li key={t} className="border-l-2 border-[var(--accent)] pl-4"><strong className="block">{t}</strong><span className="text-sm text-[#5c574c]">{d}</span></li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {[["Ruta Data Analyst","Desde cero: iniciación, Excel, SQL, Python, Power BI y análisis avanzado.","/mapa"],["Ruta Data Scientist","Mundos 11–22: álgebra, ML, Deep Learning, NLP, IA generativa, MLOps y ética.","/mapa"]].map(([t,d,h]) => (
          <Link key={t} href={h} className="card card-hover group">
            <h2 className="font-display text-2xl font-semibold">{t}</h2>
            <p className="mt-2 text-sm text-[#5c574c]">{d}</p>
            <span className="mt-4 inline-block font-mono text-xs text-[var(--accent-dark)] group-hover:translate-x-1 transition-transform">explorar →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
