# Frontend Admin - Olive Beauty

Projeto frontend do painel administrativo Olive Beauty desenvolvido com React, TypeScript, Vite, TanStack Router, Zustand, Tailwind CSS e Shadcn/ui.

## 🚀 Tecnologias

- **React** 18.3
- **TypeScript** 5.7
- **Vite** 6.0
- **TanStack Router** 1.69
- **Zustand** 5.0
- **Axios** 1.7
- **Tailwind CSS** 3.4
- **Shadcn/ui** (componentes)

## 📦 Instalação

```bash
npm install
```

## 🛠️ Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📁 Estrutura de Pastas

```
frontend-admin/
├── public/
├── src/
│   ├── api/                 # Cliente HTTP e configuração
│   │   ├── client.ts       # Instância do Axios com interceptors
│   │   └── endpoints/       # Endpoints organizados por feature
│   ├── features/           # Features organizadas por domínio
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── categories/
│   │   ├── products/
│   │   └── orders/
│   ├── shared/             # Código compartilhado
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilitários
│   │   ├── stores/         # Stores Zustand
│   │   └── types/          # Types compartilhados
│   ├── routes/             # Rotas do TanStack Router
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── components.json          # Configuração do Shadcn/ui
```

## 📝 Próximos Passos

Consulte o arquivo `FRONTEND_PLAN.md` na raiz do projeto para ver o plano completo de desenvolvimento.

## ✅ Etapas Concluídas

- ✅ Etapa 1: Setup Inicial
- ✅ Etapa 2: Configuração Base
  - ✅ Cliente HTTP (Axios) com interceptors
  - ✅ Variáveis de ambiente configuradas
  - ✅ Store Zustand para autenticação (com validação ADMIN)
  - ✅ Tipos TypeScript baseados no backend
- ✅ Etapa 3: Autenticação
  - ✅ Página de Login (design admin, página completa)
  - ✅ Middleware de rota protegida (apenas ADMIN) - `useRequireAdmin`
  - ✅ Redirecionamento automático quando não autenticado ou não admin
  - ✅ Modal de confirmação de logout
- ✅ Etapa 4: Layout Admin
  - ✅ Layout com sidebar (menu lateral) - Logo, Menu de navegação, Perfil do usuário no rodapé
  - ✅ Header superior - Breadcrumbs, Notificações, Menu do usuário
  - ✅ Área de conteúdo principal
  - ✅ Design seguindo padrão Shadcn/ui
  - ✅ Responsividade (sidebar fixa no desktop, drawer no mobile)
- ✅ Etapa 5: Dashboard
  - ✅ Cards de métricas principais (Receita Total, Total de Pedidos, Total de Produtos, Total de Usuários)
  - ✅ Gráfico de receita ao longo do tempo (Recharts - LineChart)
  - ✅ Gráfico de pedidos ao longo do tempo (Recharts - BarChart)
  - ✅ Gráfico de pedidos por status (Recharts - PieChart)
  - ✅ Gráfico de vendas por categoria (Recharts - BarChart com duplo eixo)
  - ✅ Tabela de top produtos mais vendidos
  - ✅ Filtro global de período (7, 15, 30, 90 dias)
  - ✅ Loading states para todas as seções
  - ✅ Endpoints de API para dashboard integrados
- ✅ Etapa 6: Gerenciamento de Categorias
  - ✅ Listagem de categorias com tabela responsiva (cards no mobile)
  - ✅ Busca e filtros por nome/descrição
  - ✅ Modal de criação de categoria com validação em tempo real
  - ✅ Modal de edição de categoria pré-preenchido
  - ✅ Modal de confirmação para deletar categoria com aviso de cascata
  - ✅ CRUD completo (Create, Read, Update, Delete)
  - ✅ Loading states e tratamento de erros
  - ✅ Endpoints de API para categorias integrados
- ✅ Etapa 7: Gerenciamento de Produtos
  - ✅ Listagem de produtos com tabela responsiva (cards no mobile)
  - ✅ Filtros e busca (nome, categoria, marca, ordenação)
  - ✅ Modal grande para criar produto com formulário completo
  - ✅ Gerenciamento de imagens (adicionar, remover, marcar capa)
  - ✅ Gerenciamento de variantes (adicionar, editar, remover com atributos dinâmicos)
  - ✅ Modal de edição de produto pré-preenchido
  - ✅ Modal de confirmação para deletar produto com aviso de cascata
  - ✅ Modal de visualização de detalhes do produto
  - ✅ CRUD completo (Create, Read, Update, Delete)
  - ✅ Loading states e tratamento de erros
  - ✅ Endpoints de API para produtos integrados
- ✅ Etapa 8: Gerenciamento de Pedidos
  - ✅ Listagem de pedidos com tabela responsiva (cards no mobile)
  - ✅ Filtros (status, busca por ID/cliente)
  - ✅ Ordenação (data, total, status)
  - ✅ Badges coloridos para status (Pendente, Em Processamento, Enviado, Entregue, Cancelado)
  - ✅ Modal grande para visualizar detalhes do pedido
  - ✅ Informações do pedido, cliente e endereço de entrega
  - ✅ Tabela de itens do pedido com imagens e variantes
  - ✅ Resumo financeiro
  - ✅ Modal para atualizar status do pedido com confirmação
  - ✅ Atualização automática da lista após mudança de status
  - ✅ Loading states e tratamento de erros
  - ✅ Endpoints de API para pedidos integrados
- ✅ Etapa 9: Design e UX
  - ✅ Sistema de Toast/Toaster para feedback (sucesso/erro/warning)
  - ✅ Componentes de Skeleton Loader (StatCard, Chart, TableRow, Card)
  - ✅ Componentes de Error State com retry
  - ✅ Skeleton loaders aplicados nas páginas principais (Dashboard, Categorias, Produtos, Pedidos)
  - ✅ Error states aplicados nas páginas principais
  - ✅ Toasts de feedback para ações CRUD (criar, editar, deletar, atualizar status)
  - ✅ Design Shadcn/ui aplicado consistentemente
  - ✅ Responsividade completa (sidebar fixa no desktop, drawer no mobile)
  - ✅ Tabelas responsivas (scroll horizontal no mobile ou cards)
  - ✅ Modais responsivos (100% width no mobile)
  - ✅ Gráficos responsivos (Recharts)
  - ✅ Breakpoints consistentes (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)

