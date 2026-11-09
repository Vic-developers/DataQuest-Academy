import Link from "next/link";

const features = [
  { t: "Practica real", d: "SQL, Python, ML, hojas y estadística ejecutables en el navegador, con corrección automática." },
  { t: "Dos rutas profesionales", d: "Data Analyst desde cero · Data Scientist hasta MLOps, IA y ML responsable." },
  { t: "Portafolio serio", d: "Proyectos con rúbrica, certificados verificables y evidencia para empleadores." },
];
const stats = [["50+", "lecciones"], ["20+", "laboratorios"], ["7", "proyectos"]];

export default function Home() {
  return (
    <section className="py-6 lg:py-10">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] items-center">
        <div className="relative">
          <p className="chip chip-brand">Plataforma gamificada · ES</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-[1.05]">
            Del cero absoluto<br />a <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,var(--brand),var(--brand-2))" }}>científico de datos</span>
          </h1>
          <p className="mt-4 text-lg text-[#c7cde8] max-w-xl">Aprende Análisis de Datos y luego Machine Learning con laboratorios reales, misiones, insignias y proyectos listos para tu portafolio.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn btn-primary" href="/register">Empezar gratis →</Link>
            <Link className="btn btn-ghost" href="/mapa">Ver el mapa de mundos</Link>
          </div>
          <div className="mt-6 flex gap-6">
            {stats.map(([n, l]) => (
              <div key={l}><p className="text-2xl font-extrabold">{n}</p><p className="text-xs text-[#8b98c0]">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="card card-hover">
          <p className="text-xs uppercase tracking-widest text-[#8b98c0]">Próximo logro</p>
          <h2 className="mt-1 text-xl font-bold">Mundo 0 — Iniciación Absoluta</h2>
          <div className="mt-3 h-2 w-full rounded-full bg-white/5 overflow-hidden"><div className="h-full w-3/4 rounded-full" style={{ background: "linear-gradient(90deg,var(--brand),var(--brand-2))" }} /></div>
          <p className="mt-2 text-xs text-[#9aa6c8]">+10 XP por lección · desbloquea con evidencias</p>
          <div className="mt-4 flex flex-wrap gap-2">{["SQL", "Python", "Estadística", "ML", "Power BI", "MLOps"].map(c => <span key={c} className="chip">{c}</span>)}</div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {features.map(f => (
          <article key={f.t} className="card card-hover"><h2 className="font-bold text-lg">{f.t}</h2><p className="mt-1 text-sm text-[#c7cde8]">{f.d}</p></article>
        ))}
      </div>
    </section>
  );
}
