# Troubleshooting Docker

## Erro 500 ao executar docker compose

Este erro geralmente ocorre quando:

1. **Docker Desktop não está rodando**
   - Verifique se o Docker Desktop está iniciado
   - Procure pelo ícone do Docker na bandeja do sistema
   - Se não estiver rodando, inicie o Docker Desktop

2. **Docker Desktop precisa ser reiniciado**
   - Feche completamente o Docker Desktop
   - Abra novamente e aguarde ele inicializar completamente
   - Tente novamente: `docker compose up -d`

3. **Problema com a API do Docker**
   - Reinicie o Docker Desktop
   - Verifique se há atualizações pendentes do Docker Desktop

## Alternativa: PostgreSQL Local

Se o Docker não funcionar, você pode instalar PostgreSQL localmente:

1. **Windows**: Baixe e instale do site oficial do PostgreSQL
   - https://www.postgresql.org/download/windows/
   - Durante a instalação, defina:
     - Usuário: `olive_beauty_user`
     - Senha: `olive_beauty_password`
     - Porta: `5432`
     - Database: `olive_beauty`

2. **Atualize o .env**:
   ```
   DATABASE_URL="postgresql://olive_beauty_user:olive_beauty_password@localhost:5432/olive_beauty?schema=public"
   ```

3. **Crie o banco manualmente** (se necessário):
   ```sql
   CREATE DATABASE olive_beauty;
   ```

## Verificar se Docker está funcionando

Execute no PowerShell:
```powershell
docker --version
docker ps
```

Se ambos funcionarem, o Docker está OK. Se não, reinicie o Docker Desktop.

