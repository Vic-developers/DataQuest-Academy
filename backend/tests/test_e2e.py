"""Recorrido completo E2E (integración): registro → lección → ejercicio → proyecto → certificado → dashboard."""
import uuid
from fastapi.testclient import TestClient
from app.main import app, seed

client = TestClient(app)


def test_recorrido_completo_y_editor_admin():
    # Aislamiento: test_api.py instala un override global (BD en memoria).
    # Aquí lo quitamos para usar la BD real (archivo) semillada.
    app.dependency_overrides.clear()
    seed()
    email = f"e2e-{uuid.uuid4().hex[:8]}@test.com"
    client.post("/api/v1/auth/register", json={"email": email, "password": "password123"})
    tok = client.post("/api/v1/auth/login", json={"email": email, "password": "password123"}).json()["access_token"]
    H = {"Authorization": f"Bearer {tok}"}
    worlds = client.get("/api/v1/worlds", headers=H).json()
    assert len(worlds) == 23
    assert worlds[-1]["code"] == "mundo-22"
    lessons = client.get(f"/api/v1/worlds/{worlds[0]['id']}/lessons").json()
    assert len(lessons) > 0
    # el usuario estudiante NO puede usar el editor (403)
    assert client.get("/api/v1/admin/lessons", headers=H).status_code == 403
    # completar lección otorga XP (idempotente ya cubierto en test_api)
    r = client.post(f"/api/v1/lessons/{lessons[0]['id']}/complete", json={}, headers=H)
    assert r.status_code == 200 and r.json()["xp"] >= 10
    # proyecto + certificado + dashboard
    assert client.post("/api/v1/projects/p0-ventas/submit", json={"content": "x" * 60}, headers=H).json()["ok"] is True
    code = client.post("/api/v1/certificates/issue", json={}, headers=H).json()["code"]
    assert client.get(f"/api/v1/certificates/verify/{code}").json()["valid"] is True
    assert client.get("/api/v1/dashboard", headers=H).json()["xp"] > 0
    # editor admin: promover a autor en BD y crear lección
    from app.core.db import SessionLocal
    from app.models.models import User
    db = SessionLocal()
    u = db.query(User).filter(User.email == email).first()
    u.role = "author"
    db.commit(); db.close()
    # token sigue válido (role se lee de BD por email)
    r = client.post("/api/v1/admin/lessons", json={"world_id": worlds[0]["id"], "code": "m0-test-" + uuid.uuid4().hex[:6],
                                 "title": "Lección de prueba", "content": "contenido"}, headers=H)
    assert r.status_code == 200, r.text
    lid = r.json()["id"]
    r = client.post("/api/v1/admin/exercises", json={"lesson_id": lid, "kind": "mcq", "prompt": "2+2?", "answer": "4"}, headers=H)
    assert r.status_code == 200
