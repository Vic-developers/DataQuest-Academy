from __future__ import annotations
from datetime import datetime, timezone
from sqlalchemy import String, Text, Integer, Float, Boolean, ForeignKey, DateTime, UniqueConstraint, Index
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(255), default="")
    role: Mapped[str] = mapped_column(String(50), default="student", index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Profile(Base):
    __tablename__ = "profiles"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    avatar: Mapped[str] = mapped_column(String(50), default="avatar-1")
    theme: Mapped[str] = mapped_column(String(50), default="light")
    total_xp: Mapped[int] = mapped_column(Integer, default=0)
    level: Mapped[int] = mapped_column(Integer, default=1)
    streak_days: Mapped[int] = mapped_column(Integer, default=0)
    last_activity: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class World(Base):
    __tablename__ = "worlds"
    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text, default="")
    order: Mapped[int] = mapped_column(Integer, default=0)


class Lesson(Base):
    __tablename__ = "lessons"
    __table_args__ = (UniqueConstraint("code", name="uq_lesson_code"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    world_id: Mapped[int] = mapped_column(ForeignKey("worlds.id"), index=True)
    code: Mapped[str] = mapped_column(String(100), index=True)
    title: Mapped[str] = mapped_column(String(255))
    objective: Mapped[str] = mapped_column(Text, default="")
    competency: Mapped[str] = mapped_column(String(255), default="")
    content: Mapped[str] = mapped_column(Text, default="")
    duration_min: Mapped[int] = mapped_column(Integer, default=15)
    order: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(50), default="published")


class Exercise(Base):
    __tablename__ = "exercises"
    id: Mapped[int] = mapped_column(primary_key=True)
    lesson_id: Mapped[int] = mapped_column(ForeignKey("lessons.id"), index=True)
    kind: Mapped[str] = mapped_column(String(50))  # mcq, sql, python
    prompt: Mapped[str] = mapped_column(Text)
    expected_sql: Mapped[str | None] = mapped_column(Text, nullable=True)
    expected_output: Mapped[str | None] = mapped_column(Text, nullable=True)
    options: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON string
    answer: Mapped[str | None] = mapped_column(Text, nullable=True)
    xp: Mapped[int] = mapped_column(Integer, default=20)


class Progress(Base):
    __tablename__ = "progress"
    __table_args__ = (UniqueConstraint("user_id", "lesson_id", name="uq_progress"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    lesson_id: Mapped[int] = mapped_column(ForeignKey("lessons.id"), index=True)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    score: Mapped[float] = mapped_column(Float, default=0.0)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class WorldEval(Base):
    __tablename__ = "world_evals"
    __table_args__ = (UniqueConstraint("user_id", "world_id", name="uq_world_eval"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    world_id: Mapped[int] = mapped_column(ForeignKey("worlds.id"), index=True)
    score: Mapped[float] = mapped_column(Float, default=0.0)
    passed: Mapped[bool] = mapped_column(Boolean, default=False)


class MissionProgress(Base):
    __tablename__ = "mission_progress"
    __table_args__ = (UniqueConstraint("user_id", "mission_id", "day", name="uq_mission_day"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    mission_id: Mapped[int] = mapped_column(ForeignKey("missions.id"), index=True)
    day: Mapped[str] = mapped_column(String(10), index=True)


class ExerciseAttempt(Base):
    __tablename__ = "exercise_attempts"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    exercise_id: Mapped[int] = mapped_column(ForeignKey("exercises.id"), index=True)
    submission: Mapped[str] = mapped_column(Text, default="")
    correct: Mapped[bool] = mapped_column(Boolean, default=False)
    feedback: Mapped[str] = mapped_column(Text, default="")


class XPTransaction(Base):
    __tablename__ = "xp_transactions"
    __table_args__ = (UniqueConstraint("idempotency_key", name="uq_xp_idem"), Index("ix_xp_user", "user_id"))
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    amount: Mapped[int] = mapped_column(Integer)
    reason: Mapped[str] = mapped_column(String(255))
    idempotency_key: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Badge(Base):
    __tablename__ = "badges"
    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(100), unique=True)
    title: Mapped[str] = mapped_column(String(255))


class UserBadge(Base):
    __tablename__ = "user_badges"
    __table_args__ = (UniqueConstraint("user_id", "badge_id", name="uq_user_badge"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    badge_id: Mapped[int] = mapped_column(ForeignKey("badges.id"))


class Mission(Base):
    __tablename__ = "missions"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text, default="")
    xp: Mapped[int] = mapped_column(Integer, default=100)


class Project(Base):
    __tablename__ = "projects"
    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(100), unique=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text, default="")
    rubric: Mapped[str] = mapped_column(Text, default="")


class ProjectSubmission(Base):
    __tablename__ = "project_submissions"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), index=True)
    content: Mapped[str] = mapped_column(Text, default="")
    score: Mapped[float] = mapped_column(Float, default=0.0)


class Certificate(Base):
    __tablename__ = "certificates"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    code: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    issued_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class TutorConversation(Base):
    __tablename__ = "tutor_conversations"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    question: Mapped[str] = mapped_column(Text)
    answer: Mapped[str] = mapped_column(Text)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[int] = mapped_column(primary_key=True)
    actor: Mapped[str] = mapped_column(String(255), default="")
    action: Mapped[str] = mapped_column(String(255))
    detail: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
