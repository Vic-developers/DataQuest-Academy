# Requisitos
## Funcionales (resumen)
- Auth registro/login, JWT, roles (student, tutor, author, reviewer, admin); recuperación de contraseña.
- CRUD mundos/rutas/módulos/lecciones/competencias/ejercicios/datasets (solo admin/author, backend enforcement).
- Laboratorios SQL (SQLite aislado) y Python (subproceso con límites, AST permitido, timeout 5s, sin red).
- XP idempotente/auditable, niveles (10 rangos), insignias, rachas, misiones, mapa con desbloqueo por dominio.
- Evaluaciones con rúbrica, progreso persistente, dashboard, proyectos con entregas, certificados con código verificable, tutor (RAG local + proveedor opcional), admin + analítica.
## No funcionales
- WCAG 2.2 AA objetivo, responsive, temas claro/oscuro, reduced-motion.
- Seguridad: bcrypt/argon2, validación Pydantic, rate-limit, CORS restrictivo, sin secretos en repo, auditoría.
- Tests pytest + Vitest/Playwright, CI GitHub Actions, Docker Compose.
## Stack justificado
- Frontend Next.js 14 + React 18 + TypeScript + Tailwind + Monaco + Recharts.
- Backend FastAPI + Pydantic v2 + SQLAlchemy 2 + PostgreSQL (prod) / SQLite (dev/test).
- Docker Compose. IA desacoplada: fallback local siempre funciona.
