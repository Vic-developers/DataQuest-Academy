#!/bin/bash
# Backup diario de PostgreSQL para DataQuest Academy
# Uso: ./scripts/backup-db.sh

set -e

BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

FILE="backup_$(date +%Y%m%d_%H%M%S).sql"

echo "Creando backup: $FILE"
docker compose exec db pg_dump -U postgres dataquest > "$BACKUP_DIR/$FILE"

echo "Backup creado: $BACKUP_DIR/$FILE"
echo "Mantén solo los últimos 7 días:"
find "$BACKUP_DIR" -name "backup_*.sql" -mtime +7 -delete
echo "Listo."