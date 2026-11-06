# Evidencia MVP — pytest
Resultado: **8 passed** (última corrida 2026-11-06, Python 3.13.5).
Tests verificados:
- test_health, test_register_login_me, test_xp_idempotencia, test_sql_lab_real, test_python_sandbox, test_niveles, test_certificado_verificable, test_tutor_sin_ia.
Comando: `cd backend; $env:PYTHONPATH="."; python -m pytest tests/ -v`
Nota: inicialmente 4 fallos por SQLite :memory: sin StaticPool y 1 por fixtures dependientes; corregidos sin tocar lógica de negocio.
Verificación en navegador (2026-11-06): landing `/` 200 y render correcto (screenshot), `/labs/sql` 200 con editor y botón Ejecutar. Backend en vivo: `/health` ok, `/api/v1/worlds` con 11 mundos tras corregir ruta de semilla (antes devolvía `[]` por `parents[2]/../data` incorrecto), `/api/v1/worlds/1/lessons` con lecciones Mundo 0, labs SQL `SELECT 1` y Python `print(10+5)` → `15`. Segunda corrida pytest tras corrección: 8 passed. Frontend: `next build` ✓ 14 rutas (se corrigió `useSearchParams` con Suspense).
