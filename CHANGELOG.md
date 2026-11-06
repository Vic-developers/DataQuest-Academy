# Changelog
## [0.2.0] — Fases 9-11 parcial (2026-11-06)
- Currículo ampliado: Mundos 2, 5-10 con lecciones reales (lote 1), 4 ejercicios nuevos, 5 proyectos, misiones e insignias semilladas.
- Laboratorio estadístico (`POST /labs/stats`), endpoints `/missions`, `/badges`, `/admin/stats`.
- Frontend: `/labs/estadistico`, `/misiones`, `/admin`.
- CI GitHub Actions (backend pytest + frontend build).
- Tests: 11/11 pasando.

## [0.1.0] — MVP vertical (2026-11-06)
- Fase 0: documentos de visión, requisitos, arquitectura, datos, currículo, gamificación, navegación, roadmap, criterios y plan de pruebas.
- Backend FastAPI: auth JWT + argon2, mundos/lecciones/ejercicios, progreso, XP idempotente, labs SQL/Python reales, tutor RAG local, proyectos, certificados verificables, auditoría.
- Frontend Next.js: landing, login/register, dashboard, mapa, lecciones con ejercicios, labs SQL/Python, tutor, proyectos y certificados.
- Datos: curriculum.json (Mundo 0 completo + intros), ventas.csv sintético.
- Tests: 8/8 pytest pasando.
