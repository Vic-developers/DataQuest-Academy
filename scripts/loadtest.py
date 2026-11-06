"""Prueba de carga ligera (50 peticiones concurrentes) sin dependencias extra.
Uso: python scripts/loadtest.py [BASE] [N]
"""
import concurrent.futures, statistics, sys, urllib.request

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8000"
N = int(sys.argv[2]) if len(sys.argv) > 2 else 50

def hit(_):
    try:
        with urllib.request.urlopen(BASE + "/health", timeout=10) as r:
            return r.status == 200
    except Exception:
        return False

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
    results = list(ex.map(hit, range(N)))
print(f"OK {sum(results)}/{N}  tasa={sum(results)/N:.0%}")
assert sum(results) == N
