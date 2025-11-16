# Olive Beauty - E-commerce Full Stack

Projeto completo de e-commerce para produtos de beleza e cuidados pessoais.

## 🏗️ Estrutura do Projeto

```
OliveBeautyFinal/
├── backend/              # API REST (Node.js + Express + Prisma)
├── frontend-ecommerce/   # Frontend do E-commerce (React + Vite)
└── frontend-admin/      # Painel Administrativo (React + Vite)
```

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ instalado
- Docker e Docker Compose instalados e rodando
- npm ou yarn

### Opção 1: Script Automático (Recomendado)

Os scripts automaticamente:
- ✅ Verificam e instalam dependências
- ✅ Iniciam o container do banco de dados (PostgreSQL)
- ✅ Iniciam backend, e-commerce e admin em paralelo

**Linux/Mac:**
```bash
./start.sh
```

**Windows:**
```bash
start.bat
```

### Opção 2: Usando npm (na raiz do projeto)

```bash
# Instalar dependências de todos os projetos
npm run install:all

# Iniciar todos os serviços (inclui Docker)
npm run dev
```

**Scripts Docker disponíveis:**
- `npm run docker:up` - Inicia o container do banco
- `npm run docker:down` - Para o container do banco
- `npm run docker:logs` - Ver logs do container

### Opção 3: Manual

1. **Backend:**
```bash
cd backend
npm install
npm run dev
```

2. **Frontend E-commerce:**
```bash
cd frontend-ecommerce
npm install
npm run dev
```

3. **Frontend Admin:**
```bash
cd frontend-admin
npm install
npm run dev
```

## 📍 URLs dos Serviços

- **Backend API:** http://localhost:3000
- **E-commerce:** http://localhost:5173
- **Admin Panel:** http://localhost:5174

## 🔧 Configuração

### Backend

1. Crie um arquivo `.env` na pasta `backend/`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/olivebeauty"
JWT_SECRET="seu-jwt-secret-aqui"
PORT=3000
```

2. Execute as migrações e seed:
```bash
cd backend
npm run prisma:migrate
npm run prisma:seed
```

### Frontend E-commerce

Crie um arquivo `.env` na pasta `frontend-ecommerce/`:
```env
VITE_API_URL=http://localhost:3000/api
```

### Frontend Admin

Crie um arquivo `.env` na pasta `frontend-admin/`:
```env
VITE_API_URL=http://localhost:3000/api
```

## 📦 Scripts Disponíveis

### Na raiz do projeto:

- `npm run dev` - Inicia todos os serviços em paralelo
- `npm run install:all` - Instala dependências de todos os projetos
- `npm run build` - Build de produção de todos os projetos

### Backend:

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Compila TypeScript
- `npm run start` - Inicia servidor de produção
- `npm run prisma:generate` - Gera Prisma Client
- `npm run prisma:migrate` - Executa migrações
- `npm run prisma:seed` - Popula banco de dados
- `npm run prisma:studio` - Abre Prisma Studio

### Frontend (E-commerce e Admin):

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa linter

## 🗄️ Banco de Dados

O projeto usa PostgreSQL com Prisma ORM. O banco de dados roda em um container Docker que é iniciado automaticamente pelos scripts.

**Configuração do Docker:**
- Container: `olive_beauty_db`
- Porta: `5432`
- Usuário: `olive_beauty_user`
- Senha: `olive_beauty_password`
- Database: `olive_beauty`

**Para configurar manualmente**, edite o arquivo `backend/.env`:
```env
DATABASE_URL="postgresql://olive_beauty_user:olive_beauty_password@localhost:5432/olive_beauty"
```

## 👤 Credenciais Padrão

**Admin:**
- Email: `admin@olivebeauty.com`
- Senha: `admin123`

## 📝 Próximos Passos

1. Configure o banco de dados PostgreSQL
2. Execute as migrações: `cd backend && npm run prisma:migrate`
3. Popule o banco: `cd backend && npm run prisma:seed`
4. Inicie todos os serviços: `npm run dev`

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Frontend
- React 18
- TypeScript
- Vite
- TanStack Router
- Tailwind CSS
- Shadcn/ui
- Zustand
