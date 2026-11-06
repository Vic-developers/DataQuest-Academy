import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from app.models.models import Base, User, Profile, World, Lesson, Exercise, Certificate
from app.main import app
from app.core.db import get_db
from app.services.labs import run_sql, run_python
from app.services.gamification import level_for_xp

from sqlalchemy.pool import StaticPool
engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestingSession = sessionmaker(bind=engine)
Base.metadata.create_all(bind=engine)

def override():
    db = TestingSession()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override
client = TestClient(app)

# seed mínimo
db = TestingSession()
w = World(code="m0", title="Mundo 0", description="x", order=0); db.add(w); db.flush()
l1 = Lesson(world_id=w.id, code="m0-a", title="A", objective="o", content="c"); db.add(l1); db.flush()
l2 = Lesson(world_id=w.id, code="m0-b", title="B", objective="o", content="c"); db.add(l2); db.flush()
ex = Exercise(lesson_id=l2.id, kind="mcq", prompt="Q?", options='["1","2"]', answer="1", xp=20); db.add(ex); db.flush()
db.commit()
L1_ID = l1.id
db.close()

def test_health():
    assert client.get("/health").json()["status"] == "ok"

def test_register_login_me():
    r = client.post("/api/v1/auth/register", json={"email": "a@test.com", "password": "password123", "full_name": "A"})
    assert r.status_code == 200, r.text
    r = client.post("/api/v1/auth/login", json={"email": "a@test.com", "password": "password123"})
    assert r.status_code == 200
    tok = r.json()["access_token"]
    r = client.get("/api/v1/me", headers={"Authorization": f"Bearer {tok}"})
    assert r.status_code == 200 and r.json()["xp"] == 0

def _login():
    client.post("/api/v1/auth/register", json={"email": "a@test.com", "password": "password123", "full_name": "A"})
    r = client.post("/api/v1/auth/login", json={"email": "a@test.com", "password": "password123"})
    return r.json()["access_token"]


def test_xp_idempotencia():
    r = client.post("/api/v1/auth/login", json={"email": "a@test.com", "password": "password123"})
    if "access_token" not in r.json():
        _login()
        r = client.post("/api/v1/auth/login", json={"email": "a@test.com", "password": "password123"})
    tok = r.json()["access_token"]
    H = {"Authorization": f"Bearer {tok}"}
    r = client.post(f"/api/v1/lessons/{L1_ID}/complete", headers=H); assert r.json()["xp"] == 10
    r2 = client.post(f"/api/v1/lessons/{L1_ID}/complete", headers=H); assert r2.json()["xp"] == 10  # no duplica

def test_sql_lab_real():
    out = run_sql("SELECT region, SUM(unidades) AS s FROM ventas GROUP BY region ORDER BY region")
    assert out["ok"] and out["rows"][0]["region"] == "Este"
    assert run_sql("DROP TABLE ventas")["ok"] is False  # bloqueado

def test_python_sandbox():
    assert run_python("print(10+5)")["stdout"].strip() == "15"
    assert "no permitido" in run_python("import os\nprint(1)")["error"].lower()

def test_niveles():
    assert level_for_xp(0)[0] == 1 and level_for_xp(600)[0] == 4

def test_certificado_verificable():
    _login()
    r = client.post("/api/v1/auth/login", json={"email": "a@test.com", "password": "password123"})
    tok = r.json()["access_token"]
    r = client.post("/api/v1/certificates/issue", headers={"Authorization": f"Bearer {tok}"})
    code = r.json()["code"]
    assert client.get(f"/api/v1/certificates/verify/{code}").json()["valid"] is True
    assert client.get("/api/v1/certificates/verify/NOEXISTE").json()["valid"] is False

def test_tutor_sin_ia():
    _login()
    r = client.post("/api/v1/auth/login", json={"email": "a@test.com", "password": "password123"})
    tok = r.json()["access_token"]
    r = client.post("/api/v1/tutor/ask", json={"question": "qué es SELECT"}, headers={"Authorization": f"Bearer {tok}"})
    assert "socrático" in r.json()["answer"].lower() or "pista" in r.json()["answer"].lower()
