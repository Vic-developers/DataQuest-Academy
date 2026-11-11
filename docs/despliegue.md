# Despliegue — DataQuest Academy

## Requisitos previos
- Docker 20+
- Docker Compose 2+

## Levantar servicios

```bash
# Desde la raíz del proyecto
docker compose up --build -d
```

Servicios:
| Servicio | Puerto | Descripción |
|---|---|---|
| api | 8000 | Backend FastAPI |
| web | 3000 | Frontend Next.js |
| db | 5432 | PostgreSQL 16 |

## Variables de entorno

Archivo `.env` en la raíz:

```
SECRET_KEY=cambia-esto-por-algo-secreto-32-caracteres
AI_PROVIDER=            # opcional, URL de proveedor de IA (local/externo)
AI_API_KEY=             # opcional
AI_MODEL=               # opcional
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Parar servicios

```bash
docker compose down
```

## Verificar salud

```bash
curl http://localhost:8000/health
# {"status":"ok","service":"dataquest-api"}

curl http://localhost:3000
# HTML de la landing
```

## Backups

```bash
docker compose exec db pg_dump -U postgres dataquest > backup_$(date +%F).sql
```

## Reiniciar

```bash
docker compose restart
```
