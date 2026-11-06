from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.models import XPTransaction, Profile, AuditLog

LEVELS = [
    (1, "Explorador de Datos", 0),
    (2, "Aprendiz de Datos", 100),
    (3, "Investigador", 300),
    (4, "Analista Junior", 600),
    (5, "Analista Intermedio", 1000),
    (6, "Analista Avanzado", 1500),
    (7, "Especialista en BI", 2200),
    (8, "Maestro de Datos", 3000),
    (9, "Arquitecto Analítico", 4000),
    (10, "Explorador de Ciencia de Datos", 5500),
]

XP_LESSON, XP_EXERCISE, XP_EVAL, XP_MISSION, XP_PROJECT, XP_FINAL = 10, 20, 50, 100, 300, 500


def level_for_xp(xp: int) -> tuple[int, str]:
    lvl, name = 1, LEVELS[0][1]
    for n, t, min_xp in LEVELS:
        if xp >= min_xp:
            lvl, name = n, t
    return lvl, name


def award_xp(db: Session, user_id: int, amount: int, reason: str, key: str) -> tuple[int, bool]:
    """Idempotente: si la clave ya existe no otorga XP de nuevo. Retorna (total, nuevo?)."""
    existing = db.query(XPTransaction).filter(XPTransaction.idempotency_key == key).first()
    if existing:
        prof = db.query(Profile).filter(Profile.user_id == user_id).first()
        return (prof.total_xp if prof else 0), False
    tx = XPTransaction(user_id=user_id, amount=amount, reason=reason, idempotency_key=key)
    db.add(tx)
    prof = db.query(Profile).filter(Profile.user_id == user_id).first()
    if prof is None:
        prof = Profile(user_id=user_id)
        db.add(prof)
        db.flush()
    prof.total_xp += amount
    lvl, _ = level_for_xp(prof.total_xp)
    prof.level = lvl
    db.add(AuditLog(actor=str(user_id), action="xp_award", detail=f"{reason} +{amount} key={key}"))
    db.commit()
    db.refresh(prof)
    return prof.total_xp, True


def update_streak(profile: Profile, today: datetime | None = None) -> int:
    today = today or datetime.now(timezone.utc)
    last = profile.last_activity
    if last is None:
        profile.streak_days = 1
    else:
        delta = (today.date() - last.date()).days
        if delta == 0:
            pass
        elif delta == 1:
            profile.streak_days += 1
        else:
            profile.streak_days = 1  # racha reinicia, sin castigo adicional
    profile.last_activity = today
    return profile.streak_days
