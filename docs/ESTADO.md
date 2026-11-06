# Estado del repositorio (para publicación)

**Fecha:** 2026-11-06
**Rama:** `master`
**Commits:** `843bb4f`, `aa8702e`, `76a9c36` (+ este commit)

## Contenido
- `backend/` — API FastAPI (auth, lecciones, ejercicios, labs SQL/Python/stats, tutor local, proyectos, certificados, admin).
- `frontend/` — Web Next.js 14 (17 rutas: landing, auth, dashboard, mapa, lecciones, labs, misiones, admin, etc.).
- `data/curriculum.json` — Mundos 0–10 (Mundo 0 completo + lote 1 de Mundos 2, 5–10).
- `datasets/ventas.csv` — Sintético, identificado.
- `prompt/` — Prompt maestro original del proyecto.
- `docs/phase0/` + `docs/evidence/` — Planificación y evidencia de pruebas (`pytest 11/11`, `next build` OK).

## Cómo publicar
```bash
git remote add origin <URL-DEL-REPO>
git push -u origin master
```

## Pendiente (criterios no cumplidos)
- Lotes restantes del currículo con revisión académica.
- Editor de contenidos completo en admin (hoy: lecciones/ejercicios).
- E2E Playwright navegador (hoy: smoke Python + integración pytest + carga ligera).
- Auditoría de accesibilidad formal.
- Proyecto final de Mundo 10 con modelo evaluable sobre `iris_sintetico.csv` (estructura lista, falta dataset de evaluación).
- ✅ Next.js actualizado a 16.4.5 (`npm audit` 0) — verificado 2026-11-06.
