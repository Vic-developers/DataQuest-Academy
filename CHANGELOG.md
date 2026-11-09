# Changelog
## [0.15.0] — DS2: métricas y álgebra lineal (2026-11-08)
- `POST /labs/ml/metrics` (TP/FP/FN/TN + precisión/recall/F1) y `POST /labs/algebra/matmul` (stdlib real) + páginas `/labs/metricas` y `/labs/algebra`.
- Verificado en vivo (`F1 0.5`, `[[19,22],[43,50]]`).
- Tests: 19 passed.

## [0.14.0] — DS1: ruta Data Scientist (2026-11-08)
- Mundos 11–22 (27 lecciones), +3 ejercicios, +1 proyecto p6-ds, +1 badge científico de datos. Total: 23 mundos, 72 lecciones, 21 ejercicios, 7 proyectos.
- `data/prereqs.json` (grafo Analyst → Scientist) + `docs/ds/04-impacto-tecnico.md`.
- Fix: `starlette==0.38.6` para FastAPI 0.115 (antes 1.10 incompatible); smoke/tests actualizados a 23 mundos.
- Tests: 18 passed.

## [0.13.0] — Rate limit + carga en CI (2026-11-06)
- Rate limit en memoria (200 req/min por IP, `/health` exento) + paso de carga en CI con `loadtest_adv.py`.
- Verificado en vivo: smoke OK + carga 30/30 OK.

## [0.12.0] — Split train/test formal en lab ML (2026-11-06)
- `POST /labs/ml/split`: split determinista 80/20 (seed 42), regresión en train, MAE train/test. Verificado en vivo (`mae_test=0.0`, 8/2).
- Tests: 18 passed.

## [0.11.0] — Gamificación (2026-11-06)
- Misiones completables con XP idempotente (`POST /missions/{id}/complete`), rankings anónimos (`GET /rankings`), avatar cosmético persistente (`POST /me/avatar`) + páginas `/rankings` y `/perfil`.
- Tests: 17 passed.

## [0.10.0] — Carga avanzada (2026-11-06)
- `scripts/loadtest_adv.py`: 90 peticiones (health/worlds/SQL), p50=20.5ms, p95=49.2ms, 100% OK en vivo.

## [0.9.0] — Mundo 9 empleo (2026-11-06)
- Lecciones m9-entrevista (prueba técnica SQL) y m9-caso (estudio de caso completo) + 2 ejercicios. Total: 43 lecciones, 16 ejercicios.
- Tests: 16 passed.

## [0.8.0] — E2E navegador + fix CORS/IPv6 (2026-11-06)
- `scripts/e2e_browser.mjs` (landing → registro → lab SQL vía patchright) verificado: requests failed 0.
- Fix CORS/IPv6: `localhost` → `::1` en Windows rompía fetch al backend IPv4. Unificado a `http://127.0.0.1:8000` (frontend default + build + compose `http://api:8000`; backend `--host 0.0.0.0`).
- `npm audit 0`, `pytest 16 passed`.

## [0.7.0] — Puente ML evaluable (2026-11-06)
- Lab `/labs/ml` + `POST /labs/ml/regression`: regresión lineal por mínimos cuadrados y MAE (stdlib, verificado: y=2x → b=2.0, MAE=0).
- Proyecto final p5-ml conectado al lab.
- Tests: 16 passed.

## [0.6.0] — Visualización interactiva (2026-11-06)
- Lab `/labs/viz` con Recharts (barras unidades por región, eje desde 0) + `GET /labs/viz/ventas` real sobre `ventas`.
- Mundo 7 (funnels, series) + Mundo 8 (Docker) + ejercicio. Total: 41 lecciones, 14 ejercicios.
- Tests: 15 passed.

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
