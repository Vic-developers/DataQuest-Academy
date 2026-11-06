# Changelog
## [0.5.0] — Lab de hojas + Power BI práctico (2026-11-06)
- Laboratorio de hojas `/labs/hojas` + `POST /labs/sheet/evaluate`: cuadrícula editable, SUMA/PROMEDIO/CONTAR/MIN/MAX/SI reales (documenta límites, no es Excel completo).
- `datasets/ventas_powerbi.csv` + `DICCIONARIO_DATOS.md` para práctica guiada Power BI/Excel.
- Lecciones m1-hojas y m6-dashboard + ejercicio. Total: 38 lecciones, 13 ejercicios.
- `scripts/a11y_check.py`: chequeo estático (lang, landmarks, labels, focus, reduced-motion) sin navegador.
- Tests: 14 passed.

## [0.4.0] — Editor admin + E2E + carga (2026-11-06)
- Editor de contenidos en `/admin`: crear lecciones/ejercicios (`POST /admin/lessons`, `POST /admin/exercises`, rol author/admin, auditoría).
- Currículo: Mundo 3 (ventanas, CTE) + Mundo 4 (listas, funciones) + 2 ejercicios. Total: 36 lecciones, 12 ejercicios.
- `backend/tests/test_e2e.py`: recorrido completo con promoción a autor y creación vía API.
- `scripts/loadtest.py`: 50/50 OK en `/health`; `scripts/smoke_e2e.py` verificado en vivo.
- Frontend admin verificado en navegador (200, estado de carga sin auth).

## [0.3.0] — Lote 2 + seguridad (2026-11-06)
- Currículo lote 2: Excel avanzado/Power Query, pandas/visualización, proyecto final ML (p5-ml) + 2 ejercicios + `datasets/iris_sintetico.csv`.
- Seguridad: Next.js 14.2.5 → 16.4.5 (`npm audit: 0 vulnerabilidades`). Build verificado con 17 rutas.
- `scripts/smoke_e2e.py` (auth + mundos + labs + stats) verificado en vivo.

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
