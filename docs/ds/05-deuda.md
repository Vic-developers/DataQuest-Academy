# Deuda técnica y pedagógica (DS8)

- **Revisión académica formal:** contenido autoral sin validación externa; ciclo editorial con revisores pendiente.
- **Tutor IA:** RAG local socrático; proveedor externo configamble (`AI_PROVIDER`) sin validar en producción.
- **Accesibilidad:** chequeo estático básico (`scripts/a11y_check.py`); falta auditoría WCAG 2.2 AA formal con teclado/lector.
- **Carga:** scripts locales; falta carga en CI con k6/Locust y pruebas de estrés con datos realistas.
- **Despliegue:** sin producción, monitoreo, backups ni alta disponibilidad; rate limit en memoria (no distribuido).
- **ML real:** labs stdlib (sin sklearn/torch/MLflow ejecutables); kernels científicos y trackers externos en fase posterior opt-in.
- **Certificación:** interna por evidencias, no es acreditación oficial (debe comunicarse como tal).
