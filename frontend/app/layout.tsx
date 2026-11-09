import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "DataQuest Academy — Del cero a analista y científico de datos",
  description: "Plataforma gamificada: Excel, SQL, Python, estadística, ML y MLOps con laboratorios reales y proyectos de portafolio.",
};

const groups: { title: string; items: [string, string][] }[] = [
  { title: "Aprender", items: [["/mapa", "Mapa de mundos"], ["/dashboard", "Mi panel"], ["/proyectos", "Proyectos"], ["/misiones", "Misiones"], ["/misiones", "Insignias"], ["/rankings", "Rankings"]] },
  { title: "Laboratorios", items: [["/labs/sql", "SQL"], ["/labs/python", "Python"], ["/labs/estadistico", "Estadística"], ["/labs/hojas", "Hojas de cálculo"], ["/labs/viz", "Gráficos"], ["/labs/ml", "ML"], ["/labs/metricas", "Métricas"], ["/labs/algebra", "Álgebra"], ["/labs/clustering", "Clustering"], ["/labs/series", "Series temporales"], ["/labs/equidad", "Equidad"], ["/labs/nlp", "NLP"], ["/labs/dl", "Deep Learning"]] },
  { title: "Consejo", items: [["/tutor", "DataMentor"], ["/certificados", "Certificados"], ["/perfil", "Perfil"], ["/admin", "Admin"]] },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-white/5 bg-[#0d1326]/80 backdrop-blur px-4 py-5" aria-label="Navegación principal">
            <Link href="/" className="flex items-center gap-2 px-2 mb-6 focus-ring rounded-lg">
              <span aria-hidden className="grid h-9 w-9 place-items-center rounded-xl text-[#0b1020] font-extrabold"
                    style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-2))" }}>DQ</span>
              <span className="leading-tight"><strong className="text-base">DataQuest</strong><br /><span className="text-xs text-[#9aa6c8]">Academy</span></span>
            </Link>
            <nav className="flex-1 overflow-y-auto space-y-4">
              {groups.map(g => (
                <div key={g.title}>
                  <p className="px-3 text-[11px] uppercase tracking-widest text-[#8b98c0]">{g.title}</p>
                  <ul className="mt-1 space-y-0.5">{g.items.map(([href, label]) => (
                    <li key={label + href}><Link href={href} className="block rounded-lg px-3 py-1.5 text-sm text-[#c7cde8] hover:bg-white/[.06] hover:text-white focus-ring">{label}</Link></li>
                  ))}</ul>
                </div>
              ))}
            </nav>
            <Link href="/login" className="btn btn-ghost w-full justify-center text-sm">Entrar / Mi cuenta</Link>
          </aside>

          {/* Main */}
          <div className="flex-1 flex flex-col min-w-0">
            <header className="sticky top-0 z-10 border-b border-white/5 bg-[#0b1020]/70 backdrop-blur px-4 py-3 flex items-center gap-3">
              <span aria-hidden className="md:hidden font-extrabold text-white">DQ</span>
              <nav className="hidden sm:flex items-center gap-4 text-sm text-[#c7cde8]" aria-label="Accesos rápidos">
                <Link href="/mapa" className="hover:text-white">Mapa</Link>
                <Link href="/dashboard" className="hover:text-white">Mi panel</Link>
                <Link href="/misiones" className="hover:text-white">Misiones</Link>
                <Link href="/tutor" className="hover:text-white">Tutor</Link>
              </nav>
              <div className="ml-auto flex items-center gap-2">
                <Link href="/perfil" className="chip chip-brand">Mi progreso</Link>
              </div>
            </header>
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">{children}</main>
            <footer className="border-t border-white/5 px-4 py-5 text-xs text-[#8b98c0] flex flex-wrap justify-between gap-2">
              <span>DataQuest Academy · Aprendizaje real: labs ejecutables, proyectos y evidencias.</span>
              <span>Mundo 0 completo · Ruta Data Scientist 11–22.</span>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
