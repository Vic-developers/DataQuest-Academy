from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_stats_lab():
    r = client.post("/api/v1/labs/stats", json={"values": "2,4,4,10,20"})
    assert r.status_code == 200 and r.json()["ok"]
    assert r.json()["mean"] == 8.0 and r.json()["median"] == 4.0
    r = client.post("/api/v1/labs/stats", json={"values": ""})
    assert r.json()["ok"] is False

def test_missions_badges_lists():
    # pueden estar vacías en BD de test sin semilla, pero el endpoint debe responder 200 con lista
    assert client.get("/api/v1/missions").status_code == 200
    assert client.get("/api/v1/badges").status_code == 200

def test_admin_requiere_auth():
    assert client.get("/api/v1/admin/stats").status_code == 401
    assert client.get("/api/v1/admin/projects").status_code == 401


def test_viz_ventas():
    r = client.get("/api/v1/labs/viz/ventas")
    assert r.status_code == 200 and any(row["region"] == "Norte" for row in r.json()["rows"])


def test_ml_regression():
    r = client.post("/api/v1/labs/ml/regression", json={"xs": "1,2,3", "ys": "2,4,6"})
    assert r.status_code == 200 and r.json()["ok"] and abs(r.json()["b"] - 2.0) < 1e-6 and r.json()["mae"] == 0.0
    r = client.post("/api/v1/labs/ml/regression", json={"xs": "1", "ys": "2"})
    assert r.json()["ok"] is False


def test_gamification_endpoints():
    assert client.get("/api/v1/rankings").status_code == 200
    assert client.post("/api/v1/missions/1/complete").status_code == 401  # requiere auth
    assert client.post("/api/v1/me/avatar", json={"avatar": "avatar-1"}).status_code == 401
