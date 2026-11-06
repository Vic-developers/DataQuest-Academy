import "./globals.css";
import Link from "next/link";

export const metadata = { title: "DataQuest Academy", description: "Aprende análisis de datos desde cero" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-10">
          <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3" aria-label="Principal">
            <Link href="/" className="font-extrabold text-lg">DataQuest Academy</Link>
            <Link href="/mapa">Mapa</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/labs/sql">SQL</Link>
            <Link href="/labs/python">Python</Link>
            <Link href="/tutor">Tutor</Link>
            <Link href="/proyectos">Proyectos</Link>
            <Link href="/labs/estadistico">Estadística</Link>
            <Link href="/labs/hojas">Hojas</Link>
            <Link href="/misiones">Misiones</Link>
            <Link href="/admin">Admin</Link>
            <Link href="/login">Entrar</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="border-t py-6 text-center text-sm text-slate-500">DataQuest Academy · Mundo 0 completo · Mundos 1–10 en expansión por fases 9–10</footer>
      </body>
    </html>
  );
}
