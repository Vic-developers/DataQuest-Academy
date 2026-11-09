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


def test_ds6_mlops():
    import uuid as _u
    em = f"mlops2-{_u.uuid4().hex[:8]}@test.com"
    client.post("/api/v1/auth/register", json={"email": em, "password": "password123"})
    tok = client.post("/api/v1/auth/login", json={"email": em, "password": "password123"}).json()["access_token"]
    H = {"Authorization": f"Bearer {tok}"}
    r = client.post("/api/v1/labs/mlops/log", json={"name": "regresion-v1", "params": "seed=42,lr=0.1", "metrics": "mae=0.5"}, headers=H)
    assert r.status_code == 200 and r.json()["run_id"] >= 1
    assert len(client.get("/api/v1/labs/mlops/runs").json()) >= 1


def test_ds5_nlp_dl():
    r = client.post("/api/v1/labs/nlp/tokenize", json={"text": "Hola Hola mundo"})
    assert r.json()["ok"] and r.json()["vocab_size"] == 2
    r = client.post("/api/v1/labs/dl/perceptron", json={"xs": "1,2,3,4", "ys": "1,2,3,4", "epochs": 200})
    assert r.json()["ok"] and r.json()["mae"] < 0.5


def test_ds4_series_equidad():
    r = client.post("/api/v1/labs/ts/forecast", json={"values": "10,12,11,13,12,20", "window": 3})
    assert r.json()["ok"] and r.json()["naive"] == 20.0
    r = client.post("/api/v1/labs/ml/fairness", json={"groups": "A,A,B,B", "y_true": "1,1,0,0", "y_pred": "1,0,0,0"})
    assert r.json()["ok"] and "A" in r.json()["by_group"]


def test_ds3_clustering():
    r = client.post("/api/v1/labs/ml/clustering", json={"values": "1,2,1.5,10,11,10.5", "k": 2})
    assert r.status_code == 200 and r.json()["ok"]
    assert len(r.json()["groups"]) == 2
    assert max(r.json()["centroids"]) > 10


def test_ds2_metrics_algebra():
    r = client.post("/api/v1/labs/ml/metrics", json={"y_true": "1,0,1,0", "y_pred": "1,0,0,1"})
    assert r.status_code == 200 and r.json()["ok"]
    assert r.json()["tp"] == 1 and r.json()["fp"] == 1 and r.json()["fn"] == 1
    r = client.post("/api/v1/labs/algebra/matmul", json={"a": "1,2;3,4", "b": "5,6;7,8"})
    assert r.json()["result"] == [[19.0, 22.0], [43.0, 50.0]]


def test_ml_split():
    r = client.post("/api/v1/labs/ml/split", json={"xs": "1,2,3,4,5,6,7,8,9,10", "ys": "2,4,6,8,10,12,14,16,18,20"})
    assert r.status_code == 200 and r.json()["ok"] and r.json()["n_train"] == 8 and r.json()["n_test"] == 2
    assert r.json()["mae_test"] == 0.0
    r = client.post("/api/v1/labs/ml/split", json={"xs": "1,2", "ys": "1,2"})
    assert r.json()["ok"] is False
