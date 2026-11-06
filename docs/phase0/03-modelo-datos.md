# Modelo de datos inicial
Tablas: `users, profiles, roles, user_roles, worlds, modules (dentro de mundos), lessons, competencies, prerequisites, exercises, exercise_attempts, code_submissions, evaluations, assessments, rubrics, learning_progress, mastery_records, review_schedules, projects, project_submissions, xp_transactions, achievements, badges, user_badges, missions, mission_progress, streaks, wallet, virtual_currency` (moneda solo cosmética), `certificates, tutor_conversations, notifications, audit_logs, content_versions`.
- Índices en FKs, unique en `(user,lesson)` para progreso, `xp_transactions.idempotency_key`.
- Contraseñas: hash (security_service). Tokens JWT con expiración.
- Migraciones numeradas en `backend/alembic/versions/` (inicio: `0001_init.py` crea tablas principales vía SQLAlchemy create_all para dev/test).
- Retención: intentos conservados; certificados inmutables.
