#!/bin/bash

# Script para iniciar todos os serviços do Olive Beauty

echo "🚀 Iniciando Olive Beauty..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verifica se as dependências estão instaladas
echo -e "${BLUE}📦 Verificando dependências...${NC}"

if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Instalando dependências do backend...${NC}"
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend-ecommerce/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Instalando dependências do frontend-ecommerce...${NC}"
    cd frontend-ecommerce && npm install && cd ..
fi

if [ ! -d "frontend-admin/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Instalando dependências do frontend-admin...${NC}"
    cd frontend-admin && npm install && cd ..
fi

echo ""
echo -e "${GREEN}✅ Dependências verificadas!${NC}"
echo ""

# Verifica se Docker está instalado e rodando
echo -e "${BLUE}🐳 Verificando Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker não encontrado. Por favor, instale o Docker primeiro.${NC}"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker não está rodando. Por favor, inicie o Docker primeiro.${NC}"
    exit 1
fi

# Inicia o container do banco de dados
echo -e "${BLUE}🐳 Iniciando container do banco de dados...${NC}"
cd backend
if docker-compose ps | grep -q "olive_beauty_db.*Up"; then
    echo -e "${GREEN}✅ Container do banco já está rodando${NC}"
else
    docker-compose up -d
    echo -e "${GREEN}✅ Container do banco iniciado${NC}"
    echo -e "${YELLOW}⏳ Aguardando banco de dados ficar pronto...${NC}"
    sleep 5
fi
cd ..

echo ""
echo -e "${GREEN}✅ Banco de dados pronto!${NC}"
echo ""

# Inicia os serviços em paralelo
echo -e "${BLUE}🔥 Iniciando serviços...${NC}"
echo ""
echo -e "${GREEN}Backend:${NC} http://localhost:3000"
echo -e "${GREEN}E-commerce:${NC} http://localhost:5173"
echo -e "${GREEN}Admin:${NC} http://localhost:5174"
echo -e "${GREEN}Banco de Dados:${NC} localhost:5432"
echo ""
echo -e "${YELLOW}Pressione Ctrl+C para parar todos os serviços${NC}"
echo ""

# Usa concurrently se disponível, senão usa processos em background
if command -v npx &> /dev/null && npx concurrently --version &> /dev/null 2>&1; then
    npx concurrently \
        -n "backend,ecommerce,admin" \
        -c "blue,green,yellow" \
        "cd backend && npm run dev" \
        "cd frontend-ecommerce && npm run dev" \
        "cd frontend-admin && npm run dev"
else
    echo -e "${YELLOW}⚠️  concurrently não encontrado. Instalando...${NC}"
    npm install concurrently --save-dev
    npx concurrently \
        -n "backend,ecommerce,admin" \
        -c "blue,green,yellow" \
        "cd backend && npm run dev" \
        "cd frontend-ecommerce && npm run dev" \
        "cd frontend-admin && npm run dev"
fi

