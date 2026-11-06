from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import router
from app.core.db import engine, SessionLocal
from app.models.models import Base
import json
from pathlib import Path

Base.metadata.create_all(bind=engine)
app = FastAPI(title="DataQuest Academy API", version="0.1.0")
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
        db.commit()
    finally:
        db.close()


@app.on_event("startup")
def boot():
    seed()


@app.get("/health")
def health():
    return {"status": "ok", "service": "dataquest-api"}
