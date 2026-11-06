"""Carga avanzada: mide latencias de endpoints clave y reporta p50/p95.
Uso: python scripts/loadtest_adv.py [BASE] [N]
Endpoints: /health, /api/v1/worlds, /api/v1/labs/sql/run (POST)
"""
import concurrent.futures, json, statistics, sys, time, urllib.request

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8000"
N = int(sys.argv[2]) if len(sys.argv) > 2 else 30
ENDPOINTS = [
    ("GET", "/health", None),
    ("GET", "/api/v1/worlds", None),
    ("POST", "/api/v1/labs/sql/run", {"query": "SELECT 1 AS x"}),
]

def hit(ep):
    method, path, body = ep
    try:
        r = urllib.request.Request(BASE + path, method=method,
            data=json.dumps(body).encode() if body else None,
            headers={"Content-Type": "application/json"})
        t0 = time.perf_counter()
        with urllib.request.urlopen(r, timeout=10) as resp:
            ok = resp.status == 200
        return (time.perf_counter() - t0) * 1000, ok
    except Exception:
        return None, False

tasks = [ep for ep in ENDPOINTS for _ in range(N)]
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
    results = list(ex.map(hit, tasks))
ok = sum(1 for _, o in results if o)
lat = sorted(v for v, o in results if o)
print(f"total {len(results)} ok {ok} tasa={ok/len(results):.0%}")
if lat:
    print(f"p50={statistics.median(lat):.1f}ms p95={lat[int(len(lat)*0.95)-1]:.1f}ms max={max(lat):.1f}ms")
assert ok == len(results)
print("LOAD ADVANCED OK")
