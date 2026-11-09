# DS8 — Despliegue y operación (resumen)

## Stack verificado (2026-11-08)
- Frontend: Next.js 16.4.5 (`npm audit 0`), build 24+ rutas.
- Backend: FastAPI 0.115 + `starlette==0.38.6`, pytest 23 passed.
- Labs sin frameworks pesados (stdlib) para sandbox; sklearn/torch quedan como fase posterior opt-in.

## Arranque recomendado
```bash
cd backend; $env:PYTHONPATH="."; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
cd ../frontend; $env:NEXT_PUBLIC_API_URL="http://127.0.0.1:8000"; npm run start
```
- API: `http://127.0.0.1:8000/docs` · Web: `http://localhost:3000`

## Seguridad aplicada
- Hash argon2, JWT con expiración, roles con enforcement en backend, validación Pydantic, rate limit 200/min/IP, CORS restrictivo, auditoría XP/proyectos/MLOps.

## Deuda documentada (`docs/ds/05-deuda.md`)
- Revisión académica formal, tutor con proveedor IA externo, auditoría a11y formal, despliegue a producción con monitoreo/backups, kernels sklearn/torch reales.
