# Plan de pruebas
- Unit: `backend/tests/` pytest — gamificación (XP/idempotencia, niveles, racha), seguridad (hash, JWT, roles), labs (SQL real, Python sandbox rechaza imports prohibidos), tutor fallback, certificados.
- Integración: TestClient contra SQLite en memoria.
- Frontend: `npm run build` + chequeo manual/browser (landing, mapa, lección, labs); Playwright en CI.
- Sin fabricar resultados: cada corrida se registra en `docs/evidence/`.
