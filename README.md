# DataQuest Academy

Plataforma educativa en español: análisis de datos desde cero hasta preparación para Ciencia de Datos.

> MVP vertical verificado: Mundo 0 completo + intro Excel/SQL/Python + proyecto de ventas. Mundos 1–10 planificados por fases (ver `docs/phase0/`).

## Arranque rápido
```bash
# backend
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000

# frontend (otra terminal)
cd ../frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```
- API: `http://localhost:8000/docs`
- Web: `http://localhost:3000`

## Docker
```bash
docker compose up --build
```
Servicios: api (8000), web (3000), postgres (5432, perfil por defecto existe).

## Tests
```bash
cd backend; $env:PYTHONPATH="."; python -m pytest tests/ -v
```
8 tests reales: auth, XP idempotente, SQL real, sandbox Python, niveles, certificados y tutor local. Evidencia en `docs/evidence/`.

## Laboratorios
- SQL: tabla `ventas` sintética, solo SELECT/WITH.
- Python: subproceso aislado, timeout 5s, imports restringidos (documentados en UI). Sin ejecución arbitraria en el servidor principal.

## Datos
- `datasets/ventas.csv` — sintético, identificado como tal.
- `data/curriculum.json` — mundos 0–10, lecciones, ejercicios y proyectos (MVP vertical + roadmap).

## Documentación
- Visión y arquitectura: `docs/phase0/`
- Modelo de datos: `docs/phase0/03-modelo-datos.md`
- roadmap y criterios: `docs/phase0/07-roadmap.md`
- Estado para publicación: `docs/ESTADO.md`
- Prompt maestro original: `prompt/PROMPT_MAESTRO.md`

## Seguridad y honestidad
Sin botones falsos: lo marcado `planned` está en desarrollo. IA opcional: sin proveedor, el tutor usa KB local.
