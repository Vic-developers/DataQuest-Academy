from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict
import time

_hits: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT_PER_MIN = 200
from app.core.config import settings
from app.api.v1 import router
from app.core.db import engine, SessionLocal
from app.models.models import Base
import json
from pathlib import Path

Base.metadata.create_all(bind=engine)
app = FastAPI(title="DataQuest Academy API", version="0.1.0")


@app.middleware("http")
async def rate_limit(request: Request, call_next):  # type: ignore[no-untyped-def]
    if request.url.path == "/health":
        return await call_next(request)
    ip = request.client.host if request.client else "?"
    now = time.time()
    _hits[ip] = [t for t in _hits[ip] if now - t < 60]
    if len(_hits[ip]) > RATE_LIMIT_PER_MIN:
        from fastapi.responses import JSONResponse
        return JSONResponse({"detail": "Demasiadas peticiones (rate limit)"}, status_code=429)
    _hits[ip].append(now)
    return await call_next(request)
app.add_middleware(CORSMiddleware, allow_origins=settings.CORS_ORIGINS.split(","), allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(router)


def seed() -> None:
    """Crea mundos/lecciones del curriculum JSON (idempotente)."""
    from app.models.models import World, Lesson, Project
    p = Path(__file__).resolve().parents[2] / "data" / "curriculum.json"
    if not p.exists():
        return
    data = json.loads(p.read_text(encoding="utf-8"))
    db = SessionLocal()
    try:
        for w in data["worlds"]:
            world = db.query(World).filter(World.code == w["code"]).first()
            if not world:
                world = World(code=w["code"], title=w["title"], description=w.get("description", ""), order=w.get("order", 0))
                db.add(world); db.flush()
            for l in w.get("lessons", []):
                if not db.query(Lesson).filter(Lesson.code == l["code"]).first():
                    db.add(Lesson(world_id=world.id, code=l["code"], title=l["title"], objective=l.get("objective", ""),
                                  competency=l.get("competency", ""), content=l.get("content", ""),
                                  duration_min=l.get("duration", 15), order=l.get("order", 0), status=l.get("status", "published")))
        for pr in data.get("projects", []):
            if not db.query(Project).filter(Project.code == pr["code"]).first():
                db.add(Project(code=pr["code"], title=pr["title"], description=pr.get("description", ""), rubric=pr.get("rubric", "")))
        from app.models.models import Exercise as ExModel
        for ex in data.get("exercises", []):
            lesson = db.query(Lesson).filter(Lesson.code == ex["lesson"]).first()
            if lesson and not db.query(ExModel).filter(ExModel.lesson_id == lesson.id, ExModel.prompt == ex["prompt"]).first():
                db.add(ExModel(lesson_id=lesson.id, kind=ex["kind"], prompt=ex["prompt"],
                               expected_sql=ex.get("expected_sql"), expected_output=ex.get("expected_output"),
                               options=json.dumps(ex["options"]) if ex.get("options") else None,
                               answer=ex.get("answer"), xp=ex.get("xp", 20)))
        from app.models.models import Mission as MModel, Badge as BModel
        for m in data.get("missions", []):
            if not db.query(MModel).filter(MModel.title == m["title"]).first():
                db.add(MModel(title=m["title"], description=m.get("description", ""), xp=m.get("xp", 100)))
        for b in data.get("badges", []):
            if not db.query(BModel).filter(BModel.code == b["code"]).first():
                db.add(BModel(code=b["code"], title=b["title"]))
        db.commit()
    finally:
        db.close()


@app.on_event("startup")
def boot():
    seed()


@app.get("/health")
def health():
    return {"status": "ok", "service": "dataquest-api"}
