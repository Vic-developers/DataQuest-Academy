# DS1 — Impacto técnico de la expansión Data Scientist

## Ya existente (reutilizado sin cambios)

- Backend FastAPI (auth, motor educativo, XP, labs, admin) y frontend Next.js 16 (0 vulnerabilidades, 22 rutas).
- Modelo World/Lesson/Exercise/Project validado; seed idempotente desde `data/curriculum.json`.
- Labs ejecutables con sandbox (SQL/Python/stats/hojas/viz/ML). CI + rate limit + CORS/IPv6 corregido.

## Impacto de Mundos 11–22 (este incremento)

1. **Sin cambios de backend salvo seed:** el modelo soporta 12 mundos más; `curriculum.json` crece de 11 a 23 mundos.
2. **Estimación:** +27 lecciones, +3 ejercicios, +1 proyecto (p6-ds), +1 badge. Sin nuevas dependencias.
3. **Frontend:** el mapa/lecciones existentes listan los nuevos mundos automáticamente. Sin nuevas rutas en DS1.
4. **Riesgos:** currículos largos — mitigado con lecciones 25–45 min y ejercicios corregibles.
5. **No simulado:** cada lección nueva tiene contenido real aplicable con datasets existentes; la ejecución sklearn/torch queda para DS3+ (stdlib hasta entonces) y se documenta en `docs/ds/05-deuda.md`.
6. **Prerrequisitos:** nuevo `data/prereqs.json` (grafo mundo→mundos); se expone en docs, no aún como UI de grafo.

## Criterios de aceptación DS1

- `GET /api/v1/worlds` → 23 mundos; Mundos 11–22 con ≥1 lección publicada cada uno.
- Todos los tests pasan; semilla idempotente (sin duplicados).
