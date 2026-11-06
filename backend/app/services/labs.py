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


def _col_idx(s: str) -> int:
    n = 0
    for ch in s.upper():
        n = n * 26 + (ord(ch) - 64)
    return n - 1


def _ref(grid, ref: str) -> str:
    name = ref.strip().upper()
    parts = "".join(c for c in name if c.isalpha())
    nums = "".join(c for c in name if c.isdigit())
    if not parts or not nums:
        raise ValueError(f"Referencia inválida: {ref}")
    r, c = int(nums) - 1, _col_idx(parts)
    return grid[r][c] if 0 <= r < len(grid) and 0 <= c < len(grid[r]) else ""


def _num(v: str) -> float:
    v = v.strip().replace(",", ".")
    return float(v) if v else 0.0


def _range_vals(grid, rng: str) -> list[float]:
    rng = rng.strip().upper()
    if ":" not in rng:
        return [_num(_ref(grid, rng))]
    a, b = rng.split(":", 1)
    pa = "".join(c for c in a if c.isalpha()); na = int("".join(c for c in a if c.isdigit()))
    pb = "".join(c for c in b if c.isalpha()); nb = int("".join(c for c in b if c.isdigit()))
    r1, c1, r2, c2 = na - 1, _col_idx(pa), nb - 1, _col_idx(pb)
    vals = []
    for r in range(min(r1, r2), max(r1, r2) + 1):
        for c in range(min(c1, c2), max(c1, c2) + 1):
            vals.append(_num(grid[r][c] if 0 <= r < len(grid) and 0 <= c < len(grid[r]) else ""))
    return vals


SHEET_FUNCS = {"SUMA", "PROMEDIO", "CONTAR", "MIN", "MAX"}


def eval_sheet(grid: list[list[str]]) -> dict:
    """Evalúa celdas con fórmulas =SUMA(A1:A3) etc. Funciones: SUMA, PROMEDIO, CONTAR, MIN, MAX, SI(A1>10; x; y)."""
    computed, errors = [], []
    g = [row[:] for row in grid]
    for i, row in enumerate(grid):
        out_row = []
        for j, cell in enumerate(row):
            c = (cell or "").strip()
            if not c.startswith("="):
                out_row.append(cell)
                continue
            f = c[1:].strip().upper()
            try:
                if f.startswith("SI("):
                    inner = f[3:-1] if f.endswith(")") else f[3:]
                    parts = [p.strip() for p in inner.split(";")]
                    cond = parts[0].replace(" ", "")
                    op, l, r = None, "", ""
                    for cand in (">=", "<=", "<>", ">", "<", "="):
                        if cand in cond:
                            op, l, r = cand, cond.split(cand, 1)[0], cond.split(cand, 1)[1]
                            break
                    left = _num(_ref(g, l)) if l and l[0].isalpha() else _num(l)
                    right = _num(_ref(g, r)) if r and r[0].isalpha() else _num(r)
                    ok = {">": left > right, "<": left < right, ">=": left >= right,
                          "<=": left <= right, "=": left == right, "<>": left != right}[op]
                    raw = (parts[1] if ok else parts[2]) if len(parts) > 2 else ("VERDADERO" if ok else "FALSO")
                    out_row.append(raw.strip().strip('"').strip("'"))
                    continue
                name, rest = f.split("(", 1) if "(" in f else (f, "")
                if name not in SHEET_FUNCS:
                    out_row.append("#FUNCION?"); errors.append(f"{i+1},{chr(65+j)}: {name}")
                    continue
                vals = _range_vals(g, rest[:-1] if rest.endswith(")") else rest)
                val = sum(vals) if name == "SUMA" else (sum(vals) / len(vals) if name == "PROMEDIO" and vals else
                       len(vals) if name == "CONTAR" else (min(vals) if name == "MIN" and vals else max(vals) if name == "MAX" and vals else 0))
                out_row.append(str(round(val, 4)))
            except Exception as e:
                out_row.append("#ERROR"); errors.append(f"{i+1},{chr(65+j)}: {e}")
        computed.append(out_row)
    return {"ok": True, "computed": computed, "errors": errors,
            "supported": "SUMA, PROMEDIO, CONTAR, MIN, MAX, SI(cond; a; b). Rangos A1:B5."}
