import Link from "next/link";
export default function Home() {
  return (
    <section className="py-10">
      <h1 className="text-4xl font-bold">Del cero absoluto a analista de datos</h1>
      <p className="mt-3 max-w-2xl">Aprende Análisis de Datos con rutas progresivas, laboratorios reales y proyectos de portafolio. Empieza en el Mundo 0.</p>
      <div className="mt-6 flex gap-3">
        <Link className="rounded bg-blue-600 px-4 py-2 text-white" href="/register">Crear cuenta</Link>
        <Link className="rounded border px-4 py-2" href="/mapa">Ver mapa de mundos</Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded border bg-white p-4 dark:bg-slate-900"><h2 className="font-bold">Practica real</h2><p>SQL y Python ejecutables con corrección automática.</p></article>
        <article className="rounded border bg-white p-4 dark:bg-slate-900"><h2 className="font-bold">Gamificación</h2><p>XP, niveles, rachas e insignias verificables.</p></article>
        <article className="rounded border bg-white p-4 dark:bg-slate-900"><h2 className="font-bold">Tutor DataMentor</h2><p>Acompaña con pistas socráticas, con o sin IA externa.</p></article>
      </div>
    </section>
  );
}
