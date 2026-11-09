import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "DataQuest Academy — Aprende análisis y ciencia de datos de verdad",
  description: "Plataforma de formación con laboratorios ejecutables, proyectos evaluados y rutas para Data Analyst y Data Scientist. En español.",
};

const groups: { title: string; items: [string, string, boolean?][] }[] = [
  { title: "Aprendizaje", items: [["/mapa", "Mapa de mundos", true], ["/dashboard", "Mi progreso"], ["/proyectos", "Proyectos"], ["/misiones", "Misiones diarias"], ["/rankings", "Rankings"]] },
  { title: "Laboratorios", items: [["/labs/sql", "SQL"], ["/labs/python", "Python"], ["/labs/estadistico", "Estadística"], ["/labs/hojas", "Hojas de cálculo"], ["/labs/viz", "Visualización"], ["/labs/ml", "Regresión ML"], ["/labs/metricas", "Métricas ML"], ["/labs/algebra", "Álgebra lineal"], ["/labs/clustering", "Clustering"], ["/labs/series", "Series temporales"], ["/labs/equidad", "Equidad IA"], ["/labs/nlp", "NLP"], ["/labs/dl", "Deep Learning"]] },
  { title: "Cuenta", items: [["/tutor", "DataMentor"], ["/certificados", "Certificados"], ["/perfil", "Perfil"], ["/admin", "Admin"]] },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-[var(--line-2)] bg-[#fcfbf8]" aria-label="Navegación principal">
            <div className="px-6 pt-6 pb-4 border-b border-[var(--line)]">
              <Link href="/" className="flex items-center gap-3 focus-ring rounded-lg w-max">
                <span aria-hidden className="grid h-11 w-11 place-items-center rounded-xl bg-[#171512] text-[#f7f5ef] font-display text-2xl leading-none">D</span>
                <span>
                  <strong className="font-display text-xl leading-none tracking-tight block">DataQuest</strong>
                  <span className="text-[11px] font-medium text-[#8a8577] tracking-wide">ACADEMY</span>
                </span>
              </Link>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              {groups.map(g => (
                <div key={g.title}>
                  <p className="px-3 mb-1.5 text-[10px] uppercase tracking-[0.22em] text-[#a8a294]">{g.title}</p>
                  <ul className="space-y-0.5">{g.items.map(([href, label, active]) => (
                    <li key={label}><Link href={href} className={"nav-link" + (active ? " active" : "")}>{label}</Link></li>
                  ))}</ul>
                </div>
              ))}
            </nav>
            <div className="p-4 border-t border-[var(--line)]">
              <Link href="/login" className="btn btn-primary w-full justify-center text-sm">Entrar / Mi cuenta</Link>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[#f7f5ef]/85 backdrop-blur-md">
              <div className="mx-auto max-w-6xl flex items-center gap-4 px-4 sm:px-6 h-14">
                <nav className="hidden sm:flex items-center gap-5 text-sm font-medium text-[#57534a]" aria-label="Accesos rápidos">
                  <Link href="/mapa" className="hover:text-[var(--ink)]">Mapa</Link>
                  <Link href="/dashboard" className="hover:text-[var(--ink)]">Progreso</Link>
                  <Link href="/proyectos" className="hover:text-[var(--ink)]">Proyectos</Link>
                  <Link href="/misiones" className="hover:text-[var(--ink)]">Misiones</Link>
                </nav>
                <div className="ml-auto flex items-center gap-3">
                  <span aria-label="Disponible" className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--green)]" />
                  <p className="text-xs font-medium text-[#57534a] hidden sm:block">Plataforma en vivo</p>
                </div>
              </div>
            </header>
            <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">{children}</main>
            <footer className="border-t border-[var(--line)] px-4 sm:px-6 py-5 text-xs text-[#8a8577] flex flex-wrap justify-between gap-2">
              <span>DataQuest Academy · Laboratorios ejecutables, proyectos con rúbrica.</span>
              <span>Mundo 0 completo · Ruta Data Scientist 11–22</span>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
