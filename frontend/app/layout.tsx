import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "DataQuest Academy — Análisis de datos y ciencia de datos en español",
  description: "Aprende análisis de datos con laboratorios ejecutables, proyectos con rúbrica y certificados verificables. Sin atajos, sin humo.",
};

const navGroups: { title: string; items: [string, string][] }[] = [
  { title: "Aprender", items: [["/mapa", "Mapa de mundos"], ["/dashboard", "Mi panel"], ["/proyectos", "Proyectos"], ["/misiones", "Misiones"], ["/rankings", "Rankings"]] },
  { title: "Laboratorios", items: [["/labs/sql", "SQL"], ["/labs/python", "Python"], ["/labs/estadistico", "Estadística"], ["/labs/hojas", "Hojas de cálculo"], ["/labs/viz", "Visualización"], ["/labs/ml", "Regresión"], ["/labs/metricas", "Métricas"], ["/labs/algebra", "Álgebra"], ["/labs/clustering", "Clustering"], ["/labs/series", "Series temporales"], ["/labs/equidad", "Equidad"], ["/labs/nlp", "NLP"], ["/labs/dl", "Deep Learning"]] },
  { title: "Cuenta", items: [["/tutor", "DataMentor"], ["/certificados", "Certificados"], ["/perfil", "Perfil"], ["/admin", "Admin"]] },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen text-[#1c1a16] bg-[#faf7ef]">
        <div className="flex min-h-screen">
          <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-[var(--line)] bg-[#f4f1e8] px-6 py-6" aria-label="Navegación principal">
            <Link href="/" className="flex items-center gap-3 focus-ring rounded-lg w-max px-1">
              <span aria-hidden className="grid h-10 w-10 place-items-center rounded-md bg-[#c2410c] text-white font-display text-xl font-semibold">D</span>
              <span className="leading-tight">
                <strong className="font-display text-lg tracking-tight">DataQuest</strong><br />
                <span className="text-xs text-[#5c574c]">Academy</span>
              </span>
            </Link>
            <nav className="mt-8 flex-1 overflow-y-auto space-y-6">
              {navGroups.map(g => (
                <div key={g.title}>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a8577]">{g.title}</p>
                  <ul className="mt-2 space-y-1">{g.items.map(([href, label]) => (
                    <li key={label + href}><Link href={href} className="block rounded-md px-2 py-1.5 text-sm font-medium text-[#3b382f] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-dark)]">{label}</Link></li>
                  ))}</ul>
                </div>
              ))}
            </nav>
            <Link href="/login" className="btn btn-primary w-full justify-center text-sm">Entrar / Mi cuenta</Link>
          </aside>

          <div className="flex-1 flex flex-col min-w-0">
            <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-[#faf7ef]/90 backdrop-blur px-4 sm:px-6 py-3 flex items-center gap-4">
              <span aria-hidden className="md:hidden font-display font-bold">DataQuest</span>
              <nav className="hidden sm:flex items-center gap-5 text-sm font-medium text-[#3b382f]" aria-label="Accesos rápidos">
                <Link href="/mapa" className="hover:text-[var(--accent-dark)]">Mapa</Link>
                <Link href="/dashboard" className="hover:text-[var(--accent-dark)]">Mi panel</Link>
                <Link href="/proyectos" className="hover:text-[var(--accent-dark)]">Proyectos</Link>
                <Link href="/tutor" className="hover:text-[var(--accent-dark)]">Tutor</Link>
              </nav>
              <p className="ml-auto text-xs text-[#8a8577] hidden lg:block">España · ES</p>
            </header>
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">{children}</main>
            <footer className="border-t border-[var(--line)] px-4 sm:px-6 py-5 text-xs text-[#8a8577] flex flex-wrap justify-between gap-2">
              <span>DataQuest Academy · Formación con evidencia, no con humo.</span>
              <span>Mundo 0 + Ruta Data Scientist (11–22). Certificados internos, no oficiales.</span>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
