"""Smoke E2E contra API en vivo (con urllib, sin dependencias).
Uso: python scripts/smoke_e2e.py [BASE]  (por defecto http://127.0.0.1:8000)
"""
import json, sys, urllib.request, uuid

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8000"

def req(method, path, body=None, token=None):
    r = urllib.request.Request(BASE + path, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Content-Type": "application/json", **({"Authorization": f"Bearer {token}"} if token else {})})
    try:
        with urllib.request.urlopen(r) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode() or "{}")

def main():
    s, h = req("GET", "/health"); assert h["status"] == "ok", h
    email = f"e2e-{uuid.uuid4().hex[:8]}@test.com"
    s, _ = req("POST", "/api/v1/auth/register", {"email": email, "password": "password123"}); assert s == 200
    s, t = req("POST", "/api/v1/auth/login", {"email": email, "password": "password123"}); tok = t["access_token"]
    s, worlds = req("GET", "/api/v1/worlds"); assert len(worlds) == 23, worlds
    s, sql = req("POST", "/api/v1/labs/sql/run", {"query": "SELECT 1 AS x"}); assert sql["ok"]
    s, py = req("POST", "/api/v1/labs/python/run", {"code": "print(10+5)"}); assert py["stdout"].strip() == "15"
    s, st = req("POST", "/api/v1/labs/stats", {"values": "1,2,3"}); assert abs(st["mean"] - 2.0) < 1e-9
    print("SMOKE OK: auth + mundos(23) + sql + python + stats")

if __name__ == "__main__":
    main()
