@echo off
REM Script para iniciar todos os serviços do Olive Beauty (Windows)

echo 🚀 Iniciando Olive Beauty...
echo.

REM Verifica se as dependências estão instaladas
echo 📦 Verificando dependências...

if not exist "backend\node_modules" (
    echo ⚠️  Instalando dependências do backend...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend-ecommerce\node_modules" (
    echo ⚠️  Instalando dependências do frontend-ecommerce...
    cd frontend-ecommerce
    call npm install
    cd ..
)

if not exist "frontend-admin\node_modules" (
    echo ⚠️  Instalando dependências do frontend-admin...
    cd frontend-admin
    call npm install
    cd ..
)

echo.
echo ✅ Dependências verificadas!
echo.

REM Verifica se Docker está instalado e rodando
echo 🐳 Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Docker não encontrado. Por favor, instale o Docker primeiro.
    exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Docker não está rodando. Por favor, inicie o Docker primeiro.
    exit /b 1
)

REM Inicia o container do banco de dados
echo 🐳 Iniciando container do banco de dados...
cd backend
docker-compose ps | findstr "olive_beauty_db.*Up" >nul 2>&1
if errorlevel 1 (
    docker-compose up -d
    echo ✅ Container do banco iniciado
    echo ⏳ Aguardando banco de dados ficar pronto...
    timeout /t 5 /nobreak >nul
) else (
    echo ✅ Container do banco já está rodando
)
cd ..

echo.
echo ✅ Banco de dados pronto!
echo.
echo 🔥 Iniciando serviços...
echo.
echo Backend: http://localhost:3000
echo E-commerce: http://localhost:5173
echo Admin: http://localhost:5174
echo Banco de Dados: localhost:5432
echo.
echo Pressione Ctrl+C para parar todos os serviços
echo.

REM Instala concurrently se necessário
if not exist "node_modules\concurrently" (
    echo ⚠️  Instalando concurrently...
    call npm install concurrently --save-dev
)

REM Inicia os serviços
call npx concurrently -n "backend,ecommerce,admin" -c "blue,green,yellow" "cd backend && npm run dev" "cd frontend-ecommerce && npm run dev" "cd frontend-admin && npm run dev"

