"""Tutor DataMentor: socrático, RAG local + proveedor opcional. Funciona sin IA externa."""
from sqlalchemy.orm import Session
from app.models.models import Lesson, TutorConversation
from app.core.config import settings

def answer(db: Session, user_id: int, question: str) -> str:
    q = question.lower()
    # RAG mínimo sobre lecciones publicadas
    lessons = db.query(Lesson).filter(Lesson.status == "published").limit(50).all()
    hits = [l for l in lessons if any(w in (l.title + " " + l.content).lower() for w in q.split() if len(w) > 3)]
    ctx = "\n".join(f"- {l.title}: {l.objective}" for l in hits[:3]) or "Sin contexto directo en el contenido oficial."
    if settings.AI_PROVIDER and settings.AI_API_KEY:
        try:
            import httpx
            url = settings.AI_PROVIDER  # se espera URL compatible OpenAI
            r = httpx.post(url, headers={"Authorization": f"Bearer {settings.AI_API_KEY}"},
                           json={"model": settings.AI_MODEL or "gpt-4o-mini", "messages": [
                               {"role": "system", "content": "Eres DataMentor, tutor socrático de DataQuest Academy. Da pistas progresivas, no resuelvas evaluaciones calificadas."},
                               {"role": "user", "content": f"Contexto oficial:\n{ctx}\n\nPregunta: {question}"}]}, timeout=15)
            text = r.json()["choices"][0]["message"]["content"]
        except Exception:
            text = _fallback(ctx, question)
    else:
        text = _fallback(ctx, question)
    db.add(TutorConversation(user_id=user_id, question=question[:2000], answer=text[:4000]))
    db.commit()
    return text


def _fallback(ctx: str, q: str) -> str:
    return (f"¡Buena pregunta! Modo socrático:\n1. ¿Qué has intentado hasta ahora?\n"
            f"2. ¿Qué concepto crees que aplica?\n\nContexto de la plataforma:\n{ctx}\n\nPista inicial: "
            f"repasa el objetivo de la lección relacionada y prueba un ejemplo mínimo con datos reales, luego pide otra pista. (Tutor local — configura AI_PROVIDER para respuestas generativas.)")
