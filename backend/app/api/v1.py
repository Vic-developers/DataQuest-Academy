from __future__ import annotations
import secrets, json
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.security import hash_password, verify_password, create_token, decode_token
from app.models.models import User, Profile, World, Lesson, Progress, Exercise, ExerciseAttempt, XPTransaction, Project, ProjectSubmission, Certificate, Mission, Badge, UserBadge
from app.services.gamification import award_xp, level_for_xp, update_streak, XP_LESSON, XP_EXERCISE, XP_EVAL
from app.services.labs import run_sql, run_python, eval_sheet
from app.services import tutor as tutor_svc
from fastapi.security import OAuth2PasswordBearer
from app.models.models import AuditLog

router = APIRouter(prefix="/api/v1")
oauth = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


class Register(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str = ""


class Login(BaseModel):
    email: EmailStr
    password: str


class Complete(BaseModel):
    pass


class Submit(BaseModel):
    submission: str = ""


class SqlIn(BaseModel):
    query: str


class PyIn(BaseModel):
    code: str


class TutorIn(BaseModel):
    question: str


class ProjectIn(BaseModel):
    content: str


class StatsIn(BaseModel):
    values: str  # ej. "2,4,4,10"


class LessonIn(BaseModel):
    world_id: int
    code: str = Field(min_length=3, max_length=100)
    title: str
    objective: str = ""
    competency: str = ""
    content: str = ""
    duration: int = 15


class ExerciseIn(BaseModel):
    lesson_id: int
    kind: str
    prompt: str
    answer: str = ""


class SheetIn(BaseModel):
    grid: list[list[str]]


class MlIn(BaseModel):
    xs: str = ""  # "1,2,3"
    ys: str = ""


class ProjectIn2(BaseModel):
    code: str = Field(min_length=3, max_length=100)
    title: str
    description: str = ""
    rubric: str = ""


def current_user(token: str | None = Depends(oauth), db: Session = Depends(get_db)) -> User:
    if not token:
        raise HTTPException(401, "Token requerido")
    email = decode_token(token)
    u = db.query(User).filter(User.email == email).first()
    if not u:
        raise HTTPException(401, "Usuario inválido")
    return u


@router.post("/auth/register")
def register(b: Register, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == b.email).first():
        raise HTTPException(400, "Email ya registrado")
    u = User(email=b.email, password_hash=hash_password(b.password), full_name=b.full_name)
    db.add(u); db.flush()
    db.add(Profile(user_id=u.id))
    db.commit()
    return {"ok": True, "email": u.email}


@router.post("/auth/login")
def login(b: Login, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == b.email).first()
    if not u or not verify_password(b.password, u.password_hash):
        raise HTTPException(401, "Credenciales inválidas")
    return {"access_token": create_token(u.email), "token_type": "bearer"}


@router.get("/me")
def me(u: User = Depends(current_user), db: Session = Depends(get_db)):
    p = db.query(Profile).filter(Profile.user_id == u.id).first()
    lvl, rank = level_for_xp(p.total_xp if p else 0)
    return {"email": u.email, "full_name": u.full_name, "role": u.role, "xp": p.total_xp if p else 0, "level": lvl, "rank": rank, "streak": p.streak_days if p else 0}


@router.get("/worlds")
def worlds(db: Session = Depends(get_db)):
    return [{"id": w.id, "code": w.code, "title": w.title, "description": w.description} for w in db.query(World).order_by(World.order).all()]


@router.get("/worlds/{world_id}/lessons")
def lessons(world_id: int, db: Session = Depends(get_db)):
    return [{"id": l.id, "code": l.code, "title": l.title, "objective": l.objective, "competency": l.competency, "duration": l.duration_min, "status": l.status} for l in db.query(Lesson).filter(Lesson.world_id == world_id).order_by(Lesson.order).all()]


@router.get("/lessons/{lesson_id}")
def lesson(lesson_id: int, db: Session = Depends(get_db)):
    l = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not l:
        raise HTTPException(404, "Lección no encontrada")
    ex = [{"id": e.id, "kind": e.kind, "prompt": e.prompt, "options": json.loads(e.options) if e.options else None} for e in db.query(Exercise).filter(Exercise.lesson_id == l.id).all()]
    return {"id": l.id, "code": l.code, "title": l.title, "objective": l.objective, "competency": l.competency, "content": l.content, "duration": l.duration_min, "exercises": ex}


@router.post("/lessons/{lesson_id}/complete")
def complete(lesson_id: int, u: User = Depends(current_user), db: Session = Depends(get_db)):
    l = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not l:
        raise HTTPException(404, "No encontrada")
    pr = db.query(Progress).filter(Progress.user_id == u.id, Progress.lesson_id == l.id).first()
    if not pr:
        pr = Progress(user_id=u.id, lesson_id=l.id, completed=True, score=1.0)
        db.add(pr)
    else:
        pr.completed = True
    total, _ = award_xp(db, u.id, XP_LESSON, f"Lección: {l.code}", f"lesson:{u.id}:{l.id}")
    update_streak(db.query(Profile).filter(Profile.user_id == u.id).first())
    db.commit()
    return {"ok": True, "xp": total}


@router.post("/exercises/{exercise_id}/submit")
def submit(exercise_id: int, b: Submit, u: User = Depends(current_user), db: Session = Depends(get_db)):
    e = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not e:
        raise HTTPException(404, "Ejercicio no encontrado")
    correct, feedback = False, ""
    if e.kind == "mcq":
        correct = (b.submission.strip().lower() == (e.answer or "").strip().lower())
        feedback = "Correcto" if correct else f"Incorrecto. La respuesta es: {e.answer}"
    elif e.kind == "sql":
        res = run_sql(b.submission)
        if not res["ok"]:
            feedback = "Error SQL: " + res["error"]
        else:
            exp = run_sql(e.expected_sql or "SELECT 1")
            correct = res["rows"] == exp["rows"]
            feedback = "Correcto" if correct else f"Resultado distinto al esperado: {exp['rows']}"
    elif e.kind == "python":
        res = run_python(b.submission)
        if not res["ok"]:
            feedback = "Error: " + (res.get("error") or res.get("stderr", "")[:500])
        else:
            correct = (res.get("stdout", "").strip() == (e.expected_output or "").strip())
            feedback = "Correcto" if correct else f"Salida esperada: {e.expected_output!r}, obtuviste: {res.get('stdout')!r}"
    db.add(ExerciseAttempt(user_id=u.id, exercise_id=e.id, submission=b.submission[:4000], correct=correct, feedback=feedback))
    if correct:
        award_xp(db, u.id, e.xp, f"Ejercicio: {exercise_id}", f"exercise:{u.id}:{e.id}")
    db.commit()
    return {"correct": correct, "feedback": feedback}


@router.post("/labs/sql/run")
def labsql(b: SqlIn):
    return run_sql(b.query)


@router.post("/labs/python/run")
def labpy(b: PyIn):
    return run_python(b.code)


@router.post("/tutor/ask")
def ask(b: TutorIn, u: User = Depends(current_user), db: Session = Depends(get_db)):
    return {"answer": tutor_svc.answer(db, u.id, b.question)}


@router.get("/projects")
def projects(db: Session = Depends(get_db)):
    return [{"code": p.code, "title": p.title} for p in db.query(Project).all()]


@router.post("/projects/{code}/submit")
def submit_project(code: str, b: ProjectIn, u: User = Depends(current_user), db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.code == code).first()
    if not p:
        raise HTTPException(404, "Proyecto no encontrado")
    sub = ProjectSubmission(user_id=u.id, project_id=p.id, content=b.content)
    db.add(sub)
    if len(b.content.strip()) >= 50:
        sub.score = 0.8
        award_xp(db, u.id, 300, f"Proyecto: {p.code}", f"project:{u.id}:{p.id}")
    db.commit()
    return {"ok": True, "score": sub.score}


@router.post("/certificates/issue")
def issue(u: User = Depends(current_user), db: Session = Depends(get_db)):
    code = f"DQ-{secrets.token_hex(4).upper()}"
    c = Certificate(user_id=u.id, code=code, title="Certificado Mundo 0 — DataQuest Academy")
    db.add(c); db.commit()
    return {"code": code}


@router.get("/certificates/verify/{code}")
def verify(code: str, db: Session = Depends(get_db)):
    c = db.query(Certificate).filter(Certificate.code == code).first()
    return {"valid": c is not None, "title": c.title if c else None, "issued_at": str(c.issued_at) if c else None}


@router.get("/dashboard")
def dash(u: User = Depends(current_user), db: Session = Depends(get_db)):
    p = db.query(Profile).filter(Profile.user_id == u.id).first()
    done = db.query(Progress).filter(Progress.user_id == u.id, Progress.completed == True).count()
    total = db.query(Lesson).count()
    xp = db.query(XPTransaction).filter(XPTransaction.user_id == u.id).order_by(XPTransaction.id.desc()).limit(10).all()
    return {"xp": p.total_xp if p else 0, "streak": p.streak_days if p else 0, "done": done, "total": total,
            "recent_xp": [{"amount": t.amount, "reason": t.reason} for t in xp]}


@router.post("/labs/sheet/evaluate")
def sheet_eval(b: SheetIn):
    return eval_sheet(b.grid)


@router.get("/labs/viz/ventas")
def viz_ventas():
    from app.services.labs import run_sql
    res = run_sql("SELECT region, SUM(unidades) AS u FROM ventas GROUP BY region ORDER BY region")
    return {"rows": res.get("rows", [])} if res["ok"] else {"ok": False, "error": res["error"]}


@router.post("/labs/ml/regression")
def ml_regression(b: MlIn):
    """Regresión lineal y = a + b*x por mínimos cuadrados + MAE (stdlib, sin sklearn)."""
    try:
        xs = [float(v) for v in b.xs.replace(";", ",").split(",") if v.strip()]
        ys = [float(v) for v in b.ys.replace(";", ",").split(",") if v.strip()]
        if len(xs) != len(ys) or len(xs) < 2:
            return {"ok": False, "error": "Indica al menos 2 pares x, y con la misma longitud."}
        n = len(xs)
        mx, my = sum(xs) / n, sum(ys) / n
        num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
        den = sum((x - mx) ** 2 for x in xs)
        if den == 0:
            return {"ok": False, "error": "Todos los x son iguales: no se puede ajustar la pendiente."}
        b_ = num / den
        a = my - b_ * mx
        mae = sum(abs(y - (a + b_ * x)) for x, y in zip(xs, ys)) / n
        return {"ok": True, "a": round(a, 4), "b": round(b_, 4), "mae": round(mae, 4), "n": n}
    except Exception as e:
        return {"ok": False, "error": str(e)}


@router.post("/labs/stats")
def labs_stats(b: StatsIn):
    import statistics
    try:
        vals = [float(x) for x in b.values.replace(";", ",").split(",") if x.strip()]
        if not vals:
            return {"ok": False, "error": "Ingresa al menos un número."}
        return {"ok": True, "n": len(vals), "mean": statistics.mean(vals), "median": statistics.median(vals),
                "pstdev": statistics.pstdev(vals) if len(vals) > 1 else 0.0,
                "min": min(vals), "max": max(vals)}
    except Exception as e:
        return {"ok": False, "error": str(e)}


@router.get("/missions")
def missions(db: Session = Depends(get_db)):
    return [{"id": m.id, "title": m.title, "description": m.description, "xp": m.xp} for m in db.query(Mission).all()]


@router.get("/badges")
def badges(db: Session = Depends(get_db)):
    return [{"code": b.code, "title": b.title} for b in db.query(Badge).all()]


@router.get("/admin/stats")
def admin_stats(u: User = Depends(current_user), db: Session = Depends(get_db)):
    if u.role not in ("admin", "author", "reviewer"):
        raise HTTPException(403, "Sin permiso")
    return {"users": db.query(User).count(), "lessons": db.query(Lesson).count(),
            "exercises": db.query(Exercise).count(), "xp_total": db.query(XPTransaction).count(),
            "certificates": db.query(Certificate).count(), "attempts": db.query(ExerciseAttempt).count(),
            "correct_rate": (db.query(ExerciseAttempt).filter(ExerciseAttempt.correct == True).count() / max(db.query(ExerciseAttempt).count(), 1))}


@router.get("/admin/lessons")
def admin_lessons(u: User = Depends(current_user), db: Session = Depends(get_db)):
    if u.role not in ("admin", "author", "reviewer"):
        raise HTTPException(403, "Sin permiso")
    return [{"id": l.id, "code": l.code, "title": l.title, "world_id": l.world_id} for l in db.query(Lesson).all()]


@router.post("/admin/lessons")
def admin_create_lesson(b: LessonIn, u: User = Depends(current_user), db: Session = Depends(get_db)):
    if u.role not in ("admin", "author"):
        raise HTTPException(403, "Sin permiso")
    if db.query(Lesson).filter(Lesson.code == b.code).first():
        raise HTTPException(400, "Código de lección duplicado")
    w = db.query(World).filter(World.id == b.world_id).first()
    if not w:
        raise HTTPException(404, "Mundo no encontrado")
    l = Lesson(world_id=w.id, code=b.code, title=b.title, objective=b.objective, competency=b.competency,
               content=b.content, duration_min=b.duration, status="published")
    db.add(l)
    db.add(AuditLog(actor=u.email, action="lesson_create", detail=b.code))
    db.commit()
    db.refresh(l)
    return {"id": l.id, "code": l.code, "title": l.title}


@router.post("/admin/exercises")
def admin_create_exercise(b: ExerciseIn, u: User = Depends(current_user), db: Session = Depends(get_db)):
    if u.role not in ("admin", "author"):
        raise HTTPException(403, "Sin permiso")
    if b.kind not in ("mcq", "sql", "python"):
        raise HTTPException(400, "kind debe ser mcq, sql o python")
    l = db.query(Lesson).filter(Lesson.id == b.lesson_id).first()
    if not l:
        raise HTTPException(404, "Lección no encontrada")
    e = Exercise(lesson_id=l.id, kind=b.kind, prompt=b.prompt, answer=b.answer)
    db.add(e)
    db.add(AuditLog(actor=u.email, action="exercise_create", detail=f"{l.code}:{b.kind}"))
    db.commit()
    db.refresh(e)
    return {"id": e.id, "kind": e.kind}


@router.get("/admin/projects")
def admin_projects(u: User = Depends(current_user), db: Session = Depends(get_db)):
    if u.role not in ("admin", "author", "reviewer"):
        raise HTTPException(403, "Sin permiso")
    return [{"code": p.code, "title": p.title} for p in db.query(Project).all()]


@router.post("/admin/projects")
def admin_create_project(b: ProjectIn2, u: User = Depends(current_user), db: Session = Depends(get_db)):
    if u.role not in ("admin", "author"):
        raise HTTPException(403, "Sin permiso")
    if db.query(Project).filter(Project.code == b.code).first():
        raise HTTPException(400, "Código de proyecto duplicado")
    p = Project(code=b.code, title=b.title, description=b.description, rubric=b.rubric)
    db.add(p)
    db.add(AuditLog(actor=u.email, action="project_create", detail=b.code))
    db.commit()
    db.refresh(p)
    return {"code": p.code, "title": p.title}


@router.get("/admin/audit")
def audit(u: User = Depends(current_user), db: Session = Depends(get_db)):
    if u.role not in ("admin", "author", "reviewer"):
        raise HTTPException(403, "Sin permiso")
    return [{"action": a.action, "detail": a.detail} for a in db.query(AuditLog).order_by(AuditLog.id.desc()).limit(50).all()]
