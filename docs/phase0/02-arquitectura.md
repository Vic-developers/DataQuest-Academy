# Arquitectura propuesta
Monorepo `backend/ (FastAPI) + frontend/ (Next.js) + data/ (curriculum JSON) + datasets/`.
- API REST `/api/v1/*` documentada (OpenAPI). Frontend consume API, nunca acceso directo a BD.
- Desbloqueo: mastery de competencias >= umbral + evaluación aprobada.
- XP: tabla `xp_transactions` con `idempotency_key UNIQUE` (user+activity).
- SQL lab: SQLite in-memory por sesión con datasets semilla. Python lab: subproceso `python -I -s`, variables de entorno mínimas, kill tras timeout, imports restringidos documentados.
- Tutor: `services/tutor.py` busca en contenido oficial; si `AI_PROVIDER` configurado, llama proveedor; si no, responde con KB local (nunca bloquea aprendizaje).
- Infra: Docker Compose (api, web, postgres, redis perfil). Migraciones Alembic. Logging JSON, health `/health`.
- Escalado: workers separados para jobs largos, sandbox remoto futuro; Pyodide/duckdb-wasm como evolución frontend (no fingida como implementada).
