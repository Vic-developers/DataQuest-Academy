"""Laboratorios reales: SQL con SQLite y Python en subproceso aislado."""
from __future__ import annotations
import ast, csv, io, sqlite3, subprocess, sys, tempfile, os
from pathlib import Path

ALLOWED_IMPORTS = {"math", "statistics", "itertools", "collections", "datetime", "json", "csv", "re"}

SAMPLE_TABLES = {
    "ventas": "CREATE TABLE ventas (id INTEGER, region TEXT, producto TEXT, unidades INTEGER, precio REAL); INSERT INTO ventas VALUES (1,'Norte','A',10,100),(2,'Sur','A',5,120),(3,'Norte','B',8,50),(4,'Este','B',3,60);",
}


def new_sql_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    for ddl in SAMPLE_TABLES.values():
        conn.executescript(ddl)
    return conn


def run_sql(query: str) -> dict:
    q = query.strip()
    if not q:
        return {"ok": False, "error": "Escribe una consulta SQL."}
    if any(p in q.lower() for p in ["drop table", "delete from", "insert into", "update "]):
        return {"ok": False, "error": "Solo se permiten consultas de lectura (SELECT/WITH)."}
    if not q.lower().startswith(("select", "with", "show", "describe", "pragma")):
        return {"ok": False, "error": "Solo se permiten SELECT/WITH."}
    conn = new_sql_conn()
    try:
        cur = conn.execute(q)
        rows = [dict(r) for r in cur.fetchall()]
        return {"ok": True, "columns": list(rows[0].keys()) if rows else [], "rows": rows}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def run_python(code: str) -> dict:
    if not code.strip():
        return {"ok": False, "error": "Escribe código Python."}
    tree = ast.parse(code)
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for a in node.names:
                if a.name.split(".")[0] not in ALLOWED_IMPORTS:
                    return {"ok": False, "error": f"Import no permitido en MVP: {a.name}. Permitidos: {sorted(ALLOWED_IMPORTS)}."}
        if isinstance(node, ast.ImportFrom):
            if (node.module or "").split(".")[0] not in ALLOWED_IMPORTS:
                return {"ok": False, "error": f"Import no permitido: {node.module}."}
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in {"open", "eval", "exec", "__import__"}:
            return {"ok": False, "error": f"Función no permitida: {node.func.id}."}
    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False) as f:
        f.write(code)
        path = f.name
    env = {"PATH": os.environ.get("PATH", "")}
    try:
        r = subprocess.run([sys.executable, "-I", "-s", path], capture_output=True, text=True, timeout=5, env=env)
        return {"ok": r.returncode == 0, "stdout": r.stdout, "stderr": r.stderr}
    except subprocess.TimeoutExpired:
        return {"ok": False, "error": "Tiempo agotado (5s). Optimiza tu código."}
    finally:
        Path(path).unlink(missing_ok=True)
