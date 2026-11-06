from fastapi.testclient import TestClient
from app.main import app
from app.services.labs import eval_sheet

client = TestClient(app)

def test_eval_sheet():
    r = eval_sheet([["10", "20", "30", "=SUMA(A1:C1)"], ["5", "15", "25", "=PROMEDIO(A2:C2)"], ["2", "2", "3", "=SI(A3>1; \"SI\"; \"NO\")"]])
    assert r["ok"] and r["computed"][0][3] == "60.0"
    assert r["computed"][1][3] == "15.0"
    assert r["computed"][2][3] == "SI"
    r = eval_sheet([["5", "=CONTAR(A1:A1)"]])
    assert r["computed"][0][1] in ("1", "1.0")

def test_sheet_endpoint():
    r = client.post("/api/v1/labs/sheet/evaluate", json={"grid": [["2", "3", "=SUMA(A1:B1)"]]})
    assert r.status_code == 200 and r.json()["computed"][0][2] == "5.0"
