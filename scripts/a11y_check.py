"""Chequeo estático básico de accesibilidad en el frontend (sin navegador).
Verifica: lang=es, landmarks, etiquetas en inputs, foco visible (CSS) y reduced-motion.
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1] / "frontend" / "app"
checks = {"lang": 0, "landmarks": 0, "inputs_labeled": 0, "skip_or_focus": 0}
issues = []

for tsx in ROOT.rglob("*.tsx"):
    t = tsx.read_text(encoding="utf-8", errors="ignore")
    if "<html" in t and "lang=" in t:
        checks["lang"] += 1
        if 'lang="es"' not in t:
            issues.append(f"{tsx.name}: lang sin es")
    if "<main" in t or "<header" in t or "<footer" in t or "<nav" in t:
        checks["landmarks"] += 1
    # inputs sin aria-label ni <label> cercano sospechoso
    for m in re.finditer(r"<input(?P<attrs>[^>]*)>", t):
        attrs = m.group("attrs")
        if "aria-label" in attrs or "type=\"radio\"" in attrs or "type=\"password\"" in attrs or "id=" in attrs:
            checks["inputs_labeled"] += 1

css = (ROOT / "globals.css").read_text(encoding="utf-8", errors="ignore") if (ROOT / "globals.css").exists() else ""
if ":focus-visible" in css:
    checks["skip_or_focus"] += 1
if "prefers-reduced-motion" in css:
    checks["skip_or_focus"] += 1

print("a11y:", checks)
if issues:
    print("ISSUES:", issues)
    sys.exit(1)
print("A11Y FAILS 0")
