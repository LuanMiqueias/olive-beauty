# Plano de Desenvolvimento Frontend - Olive Beauty

## 📋 Visão Geral

Dois projetos frontend separados com tecnologias idênticas:
- **E-commerce** (Loja para clientes) - Design inspirado no Mercado Livre
- **Backoffice** (Painel administrativo) - Design Shadcn/ui com menu lateral

## 🛠️ Stack Tecnológica (Ambos os Projetos)

- **React** + **Vite**
- **TypeScript**
- **TanStack Router** (roteamento)
- **Zustand** (gerenciamento de estado)
- **Tailwind CSS** (estilização)
- **Shadcn/ui** (componentes)
- **Axios** (requisições HTTP)

---

## 📁 Estrutura de Pastas (Ambos os Projetos)

```
frontend-ecommerce/          # ou frontend-admin/
├── public/
├── src/
│   ├── api/                 # Cliente HTTP e configuração
│   │   ├── client.ts        # Instância do Axios
│   │   └── endpoints/       # Endpoints organizados por feature
│   ├── features/            # Features organizadas por domínio
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   └── ...
│   ├── shared/              # Código compartilhado
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilitários
│   │   ├── stores/          # Stores Zustand
│   │   └── types/           # Types compartilhados
│   ├── routes/              # Rotas do TanStack Router
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🛒 PROJETO 1: E-COMMERCE (Loja)

### Etapa 1: Setup Inicial
- [ ] Criar projeto Vite + React + TypeScript
- [ ] Instalar dependências:
  - `@tanstack/react-router`
  - `zustand`
  - `axios`
  - `tailwindcss` + `autoprefixer` + `postcss`
  - `shadcn/ui` (init)
- [ ] Configurar Tailwind CSS
- [ ] Configurar TanStack Router
- [ ] Configurar estrutura de pastas

### Etapa 2: Configuração Base
- [ ] Criar cliente HTTP (Axios) com interceptors
- [ ] Configurar variáveis de ambiente (.env)
- [ ] Criar store Zustand para autenticação
- [ ] Criar store Zustand para carrinho
- [ ] Criar store Zustand para favoritos
- [ ] Criar tipos TypeScript baseados no backend

### Etapa 3: Autenticação
- [ ] Página de Login
- [ ] Página de Registro
- [ ] Middleware de rota protegida
- [ ] Redirecionamento automático quando não autenticado
- [ ] Header com menu do usuário (logout, perfil)

### Etapa 4: Layout e Navegação
- [ ] Layout principal (Header + Footer)
- [ ] Header com:
  - Logo
  - Busca de produtos
  - Ícone de favoritos
  - Ícone de carrinho (com badge de quantidade)
  - Menu do usuário
- [ ] Footer com informações da loja
- [ ] Navegação por categorias

### Etapa 5: Catálogo de Produtos
- [ ] Página inicial (Home)
  - Banner/carrossel
  - Produtos em destaque
  - Categorias principais
- [ ] Página de listagem de produtos
  - **Filtros avançados:**
    - Por categoria (dropdown com todas as categorias)
    - Por faixa de preço (slider min/max)
    - Por marca (dropdown com marcas disponíveis)
    - Busca por texto (nome/descrição)
  - **Ordenação:**
    - Preço: menor para maior
    - Preço: maior para menor
    - Nome (A-Z)
    - Mais recentes
  - Grid de produtos (card de produto)
    - Imagem de capa do produto
    - Nome do produto
    - Preço base (ou preço da variante mais barata)
    - Badge de marca (se houver)
    - Indicador de estoque (se disponível)
    - Botão rápido "Adicionar ao carrinho"
    - Ícone de favorito
  - Estados vazios (sem resultados)
  - Loading skeleton
- [ ] Página de detalhe do produto
  - **Galeria de imagens:**
    - Imagem principal grande
    - Miniaturas clicáveis
    - Zoom na imagem principal (opcional)
  - **Informações do produto:**
    - Nome
    - Marca
    - Categoria (com link)
    - Preço base
    - Descrição (formatação markdown ou HTML)
  - **Seleção de variantes:**
    - Exibir todas as variantes disponíveis
    - Atributos (cor, tamanho, etc.) como botões/seletores
    - Preço específico da variante selecionada
    - Estoque disponível da variante
    - Validação: não permitir adicionar se estoque = 0
  - **Ações:**
    - Seletor de quantidade (1 até estoque disponível)
    - Botão "Adicionar ao carrinho" (desabilitado se sem estoque)
    - Botão "Adicionar aos favoritos" (toggle)
    - Compartilhar produto (opcional)
  - **Produtos relacionados** (mesma categoria)
  - Breadcrumbs (Home > Categoria > Produto)

### Etapa 6: Carrinho de Compras
- [ ] **Página do carrinho completa:**
  - Lista de itens do carrinho (grid responsivo: coluna no mobile, lado a lado no desktop)
    - Imagem do produto (thumbnail responsivo)
    - Nome do produto
    - Variante selecionada (se houver) com atributos
    - Preço unitário
    - Seletor de quantidade (com validação de estoque)
    - Preço total do item (quantidade × preço)
    - Botão remover item (abre modal médio de confirmação)
    - Link para página do produto
  - **Resumo do pedido:**
    - Subtotal (soma de todos os itens)
    - Cálculo de frete (simulado ou fixo)
    - Total geral
    - Botão "Finalizar compra" (redireciona para checkout)
    - Botão "Continuar comprando" (volta para produtos)
    - Botão "Limpar carrinho" (abre modal médio de confirmação)
  - Estado vazio (carrinho vazio)
  - Validação de estoque (aviso se estoque insuficiente)
  - Responsivo: layout adaptativo mobile/desktop
- [ ] **Modal de confirmação - Remover item (Modal Médio):**
  - Mensagem: "Deseja remover este item do carrinho?"
  - Informações do item (nome, quantidade)
  - Botões: "Confirmar" e "Cancelar"
  - Responsivo
- [ ] **Modal de confirmação - Limpar carrinho (Modal Médio):**
  - Mensagem: "Deseja limpar todo o carrinho?"
  - Aviso sobre perda de todos os itens
  - Botões: "Confirmar" e "Cancelar"
  - Responsivo
- [ ] **Persistência:**
  - Carrinho salvo automaticamente no backend
  - Sincronização ao fazer login
  - Badge no header com quantidade de itens
  - Atualização em tempo real ao adicionar/remover

### Etapa 7: Favoritos
- [ ] **Página de favoritos (página completa):**
  - Lista de produtos favoritados (grid responsivo: 1 coluna mobile, 2-3 desktop)
  - Card de produto com:
    - Imagem
    - Nome
    - Preço
    - Botão "Adicionar ao carrinho"
    - Botão "Remover dos favoritos" (abre modal médio de confirmação)
  - Estado vazio (sem favoritos)
  - Responsivo: layout adaptativo
- [ ] **Modal de confirmação - Remover favorito (Modal Médio):**
  - Mensagem: "Deseja remover este produto dos favoritos?"
  - Nome do produto
  - Botões: "Confirmar" e "Cancelar"
  - Responsivo

### Etapa 8: Checkout e Pedidos
- [ ] **Página de checkout (página completa):**
  - **Formulário de entrega (responsivo: coluna no mobile, lado a lado quando apropriado):**
    - Nome completo (obrigatório)
    - Endereço completo (obrigatório)
    - Telefone (opcional)
    - Validação de campos em tempo real
  - **Resumo do pedido (card responsivo):**
    - Lista de itens (read-only, scroll se necessário)
    - Subtotal
    - Frete
    - Total
  - **Confirmação:**
    - Botão "Confirmar pedido" (abre modal médio de confirmação)
    - Modal de confirmação:
      - Resumo do pedido
      - Endereço de entrega
      - Total
      - Botões: "Confirmar" e "Cancelar"
    - Loading durante criação
    - Mensagem de sucesso (toast)
    - Redirecionamento para página de pedidos
    - Nota: Backend limpa carrinho automaticamente após criar pedido
  - Responsivo: layout adaptativo mobile/desktop
- [ ] **Página de pedidos do usuário:**
  - Lista de pedidos ordenados por data (mais recente primeiro)
  - **Card de pedido:**
    - Número/ID do pedido
    - Data do pedido
    - Status (badge colorido)
    - Total do pedido
    - Quantidade de itens
    - Botão "Ver detalhes"
  - **Página de detalhes do pedido:**
    - Informações do pedido (ID, data, status)
    - Endereço de entrega
    - Lista completa de itens (produto, variante, quantidade, preço)
    - Resumo financeiro
    - Timeline de status (se houver histórico)
  - Estado vazio (sem pedidos)

### Etapa 9: Design e UX
- [ ] Aplicar design inspirado no Mercado Livre
  - Cores: amarelo/dourado (Olive Beauty) + branco
  - Cards de produtos com hover
  - Animações suaves
  - **Responsividade mobile-first:**
    - Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
    - Grid responsivo: 1 col (mobile) → 2-3 cols (tablet) → 3-4 cols (desktop)
    - Menu hambúrguer no mobile
    - Formulários em coluna no mobile
    - Imagens responsivas (object-fit, lazy loading)
- [ ] Loading states (skeleton loaders)
- [ ] Error states (mensagens claras, botão retry)
- [ ] Empty states (ilustrações, mensagens amigáveis)
- [ ] Toasts para feedback de ações (sucesso/erro)

---

## 🎛️ PROJETO 2: BACKOFFICE (Admin)

### Etapa 1: Setup Inicial
- [ ] Criar projeto Vite + React + TypeScript
- [ ] Instalar dependências (mesmas do e-commerce)
- [ ] Configurar Tailwind CSS
- [ ] Configurar TanStack Router
- [ ] Configurar estrutura de pastas

### Etapa 2: Configuração Base
- [ ] Criar cliente HTTP (Axios) com interceptors
- [ ] Configurar variáveis de ambiente (.env)
- [ ] Criar store Zustand para autenticação
- [ ] Criar tipos TypeScript baseados no backend

### Etapa 3: Autenticação
- [ ] Página de Login (design admin, página completa)
- [ ] Middleware de rota protegida (apenas ADMIN)
- [ ] Redirecionamento automático quando não autenticado ou não admin
- [ ] Modal de confirmação - Logout (Modal Médio):
  - Mensagem: "Deseja realmente sair?"
  - Botões: "Confirmar" e "Cancelar"
  - Responsivo

### Etapa 4: Layout Admin
- [ ] Layout com sidebar (menu lateral)
  - Logo
  - Menu de navegação
  - Perfil do usuário no rodapé
- [ ] Header superior
  - Breadcrumbs
  - Notificações
  - Menu do usuário
- [ ] Área de conteúdo principal
- [ ] Design seguindo padrão Shadcn/ui

### Etapa 5: Dashboard
- [ ] **Página principal com estatísticas:**
  - **Cards de métricas principais:**
    - Receita total (com ícone e variação)
    - Total de pedidos (com ícone e variação)
    - Total de produtos cadastrados
    - Total de usuários cadastrados
  - **Gráficos e visualizações:**
    - **Receita ao longo do tempo:**
      - Gráfico de linha ou área
      - Filtro de período (7, 15, 30, 90 dias)
      - Query param: `days` (default: 7)
    - **Pedidos ao longo do tempo:**
      - Gráfico de linha ou barras
      - Filtro de período
      - Query param: `days` (default: 7)
    - **Pedidos por status:**
      - Gráfico de pizza ou barras
      - Cores diferentes para cada status
      - Filtro de período
      - Query param: `days` (default: 7)
    - **Vendas por categoria:**
      - Gráfico de barras ou pizza
      - Mostrar receita e quantidade por categoria
      - Filtro de período
      - Query param: `days` (default: 7)
  - **Top produtos mais vendidos:**
    - Tabela ou cards
    - Colunas: Produto, Quantidade vendida, Receita
    - Filtro de quantidade (limit, default: 10)
    - Link para página do produto
  - **Filtros globais:**
    - Seletor de período (7, 15, 30, 90 dias)
    - Aplicar filtro a todos os gráficos simultaneamente
  - Loading states para cada seção
  - Usar biblioteca de gráficos (Recharts recomendado)

### Etapa 6: Gerenciamento de Categorias
- [ ] **Listagem de categorias:**
  - Tabela com ações (responsiva: cards no mobile)
  - Busca e filtros
  - Botão "Nova categoria" (abre modal)
- [ ] **Criar categoria (Modal Médio):**
  - Formulário com campos: nome, descrição
  - Validação em tempo real
  - Botões: "Salvar" e "Cancelar"
  - Responsivo: 100% width no mobile
- [ ] **Editar categoria (Modal Médio):**
  - Mesmo formulário de criação
  - Pré-preenchido com dados atuais
  - Responsivo
- [ ] **Deletar categoria (Modal Médio - Confirmação):**
  - Mensagem de confirmação
  - Aviso sobre cascata (produtos serão deletados)
  - Botões: "Confirmar" e "Cancelar"
  - Responsivo

### Etapa 7: Gerenciamento de Produtos
- [ ] **Listagem de produtos:**
  - Tabela com colunas:
    - Imagem (thumbnail)
    - Nome
    - Categoria
    - Marca
    - Preço base
    - Estoque total (soma de todas as variantes)
    - Quantidade de variantes
    - Data de criação
    - Ações (editar, deletar, ver detalhes)
  - **Filtros e busca:**
    - Busca por nome
    - Filtro por categoria
    - Filtro por marca
    - Ordenação (nome, preço, data)
  - Paginação (se necessário)
  - Botão "Novo produto"
- [ ] **Criar produto (Modal Grande):**
  - Formulário completo em modal grande (max-w-5xl)
  - **Campos básicos:**
    - Nome (obrigatório)
    - Descrição (textarea, opcional)
    - Preço base (obrigatório, positivo)
    - Marca (opcional)
    - Categoria (select/dropdown, obrigatório)
  - **Gerenciamento de imagens:**
    - Campo para adicionar URLs de imagens
    - Lista de imagens adicionadas (grid responsivo)
    - Marcar imagem de capa (isCover) - toggle
    - Remover imagem (com confirmação em modal médio)
    - Preview das imagens (thumbnail)
  - **Gerenciamento de variantes:**
    - Botão "Adicionar variante" (abre modal médio sobre o grande)
    - Formulário de variante em modal médio:
      - Atributos (campos dinâmicos: cor, tamanho, etc.)
      - Preço da variante (obrigatório)
      - Estoque (obrigatório, mínimo 0)
      - Botões: "Salvar" e "Cancelar"
    - Lista de variantes adicionadas (tabela responsiva)
    - Editar variante (abre modal médio)
    - Remover variante (modal médio de confirmação)
  - Scroll interno quando necessário
  - Validação de formulário
  - Botões footer: "Salvar" e "Cancelar"
  - Responsivo: 100% width no mobile, scroll vertical
- [ ] **Editar produto (Modal Grande):**
  - Mesmo formulário de criação
  - Pré-preenchido com dados atuais
  - Atualizar variantes existentes (modal médio)
  - Adicionar novas variantes (modal médio)
  - Remover variantes (modal médio de confirmação)
  - Responsivo
- [ ] **Deletar produto (Modal Médio - Confirmação):**
  - Mensagem de confirmação
  - Aviso sobre cascata (variantes, imagens, cartItems, etc.)
  - Botões: "Confirmar" e "Cancelar"
  - Atualizar lista após deletar
  - Responsivo
- [ ] **Visualizar detalhes do produto (Modal Grande):**
  - Todas as informações do produto
  - Lista completa de variantes (tabela responsiva)
  - Galeria de imagens (grid responsivo)
  - Estatísticas (se houver)
  - Botão "Editar" (abre modal de edição)
  - Responsivo: scroll interno, 100% width no mobile

### Etapa 8: Gerenciamento de Pedidos
- [ ] **Listagem de pedidos:**
  - Tabela com colunas:
    - ID do pedido
    - Cliente (nome ou email)
    - Data do pedido
    - Status (badge colorido)
    - Total
    - Quantidade de itens
    - Ações (ver detalhes, editar status)
  - **Filtros:**
    - Por status (dropdown: Todos, Pending, Processing, Sent, Delivered, Cancelled)
    - Por data (date picker: período)
    - Busca por ID do pedido ou cliente
  - Ordenação (data, total, status)
  - Paginação (se necessário)
- [ ] **Detalhes do pedido (Modal Grande):**
  - **Informações do pedido:**
    - ID do pedido
    - Data de criação
    - Última atualização
    - Status atual (badge colorido)
  - **Informações do cliente:**
    - Nome
    - Email
    - ID do usuário
  - **Endereço de entrega:**
    - Nome completo
    - Endereço completo
    - Telefone (se houver)
  - **Itens do pedido:**
    - Tabela responsiva (cards no mobile) com: Imagem, Produto, Variante, Quantidade, Preço unitário, Subtotal
    - Total de itens
  - **Resumo financeiro:**
    - Subtotal
    - Total do pedido
  - **Atualizar status:**
    - Botão "Atualizar status" (abre modal médio)
    - Modal médio com:
      - Select/Dropdown com todos os status disponíveis
      - Status disponíveis: PENDING, PROCESSING, SENT, DELIVERED, CANCELLED
      - Botão "Confirmar" (abre modal médio de confirmação)
      - Botão "Cancelar"
    - Modal de confirmação (médio):
      - Mensagem: "Deseja realmente atualizar o status do pedido?"
      - Status atual → Status novo
      - Botões: "Confirmar" e "Cancelar"
    - Feedback de sucesso/erro (toast)
    - Atualização automática da lista após mudança
  - Scroll interno quando necessário
  - Responsivo: 100% width no mobile, scroll vertical

### Etapa 9: Design e UX
- [ ] Aplicar design Shadcn/ui
  - Menu lateral fixo (desktop) / colapsável (mobile)
  - Tabelas responsivas (scroll horizontal no mobile ou cards)
  - Modais para formulários (especificações acima)
  - Toasts para feedback (sucesso/erro)
  - Loading states (skeleton loaders)
  - Error states (mensagens claras)
- [ ] **Responsividade completa:**
  - Sidebar: fixa no desktop (> 1024px), drawer no mobile
  - Tabelas: scroll horizontal no mobile ou conversão para cards
  - Modais: 100% width no mobile, tamanhos definidos no desktop
  - Dashboard: gráficos responsivos (Recharts)
  - Formulários: campos em coluna no mobile, grid no desktop quando apropriado
  - Breakpoints consistentes: sm (640px), md (768px), lg (1024px), xl (1280px)

---

## 🔧 Componentes Compartilhados (Shadcn/ui)

Ambos os projetos usarão componentes do Shadcn/ui:
- Button
- Input
- Card
- Dialog/Modal
- Table
- Select
- Badge
- Toast/Toaster
- Dropdown Menu
- Form
- Label
- Tabs
- Sidebar (para admin)

---

## 🪟 Sistema de Modais

### 📐 Estratégia de Uso

#### E-commerce (Loja)
- **Páginas completas** para todas as funcionalidades:
  - Login (página completa)
  - Registro (página completa)
  - Detalhes do produto (página completa)
  - Carrinho (página completa)
  - Favoritos (página completa)
  - Checkout (página completa)
  - Pedidos (página completa)
  - Detalhes do pedido (página completa)

#### Backoffice (Admin)
- **Modais** para todas as operações CRUD e visualizações:
  - Criar categoria (modal)
  - Editar categoria (modal)
  - Criar produto (modal)
  - Editar produto (modal)
  - Detalhes do produto (modal)
  - Detalhes do pedido (modal)
  - Atualizar status do pedido (modal)

#### Confirmações (Ambos os Projetos)
- **Modais de confirmação** para todas as ações importantes:
  - Deletar categoria (modal de confirmação)
  - Deletar produto (modal de confirmação)
  - Limpar carrinho (modal de confirmação)
  - Remover item do carrinho (modal de confirmação)
  - Remover dos favoritos (modal de confirmação)
  - Criar pedido (modal de confirmação)
  - Atualizar status do pedido (modal de confirmação)
  - Logout (modal de confirmação)

### 📏 Tamanhos de Modal

#### Tamanho Médio
- **Uso**: Formulários simples, confirmações, ações rápidas
- **Largura**: `max-w-md` (28rem / 448px)
- **Exemplos**:
  - Criar/Editar categoria
  - Confirmações de ação
  - Atualizar status do pedido
  - Deletar (confirmação)

#### Tamanho Grande
- **Uso**: Formulários complexos, visualizações detalhadas
- **Largura**: `max-w-4xl` (56rem / 896px) ou `max-w-5xl` (64rem / 1024px)
- **Exemplos**:
  - Criar/Editar produto (com variantes e imagens)
  - Detalhes do produto (admin)
  - Detalhes do pedido (admin)

### 🎨 Especificações de Design

#### Componente Base
- Usar `Dialog` do Shadcn/ui
- Backdrop escuro com opacidade
- Animação de entrada/saída suave
- Header com título e botão de fechar (X)
- Footer com ações (quando necessário)

#### Comportamento
- **Fechar ao clicar fora**: Sim (exceto em confirmações críticas)
- **Fechar com ESC**: Sim
- **Scroll interno**: Sim (quando conteúdo exceder altura)
- **Múltiplos modais**: Cada ação abre um novo modal (não fecha o anterior)
  - Stack de modais com z-index crescente
  - Backdrop acumulativo (mais escuro com mais modais)

#### Responsividade
- **Mobile (< 640px)**:
  - Modal ocupa 100% da largura da tela
  - Altura máxima: 90vh
  - Padding reduzido
  - Botões em coluna (stack)
- **Tablet (640px - 1024px)**:
  - Modal com margens laterais (16px)
  - Altura máxima: 85vh
- **Desktop (> 1024px)**:
  - Tamanhos definidos (médio/grande)
  - Centralizado na tela
  - Altura máxima: 90vh

### 🔄 Fluxo de Modais

#### Stack de Modais
- Cada modal aberto adiciona ao stack
- Z-index incremental: base (50) + (índice × 10)
- Backdrop acumulativo (opacidade crescente)
- Fechar modal fecha apenas o último aberto
- Botão "Voltar" fecha modal atual e volta ao anterior

#### Exemplo de Fluxo
1. Admin clica "Criar Produto" → Modal grande abre
2. Admin clica "Adicionar Variante" → Modal médio abre (sobre o grande)
3. Admin preenche e salva variante → Modal médio fecha, volta ao grande
4. Admin salva produto → Modal grande fecha

### 📱 Responsividade Geral

#### Breakpoints (Tailwind)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

#### E-commerce
- **Mobile-first**: Design otimizado para mobile
- **Grid responsivo**: 1 coluna (mobile) → 2 colunas (tablet) → 3-4 colunas (desktop)
- **Menu hambúrguer** no mobile
- **Cards de produto**: Stack vertical no mobile, grid no desktop
- **Formulários**: Campos em coluna no mobile, lado a lado no desktop quando apropriado

#### Backoffice
- **Sidebar**: Colapsável no mobile, fixa no desktop
- **Tabelas**: Scroll horizontal no mobile, ou cards no mobile
- **Formulários em modais**: Scroll vertical, campos em coluna no mobile
- **Dashboard**: Gráficos responsivos (Recharts tem suporte nativo)

---

## 📡 Integração com Backend - Mapeamento Completo

### 🔓 Endpoints Públicos (Sem Autenticação)

#### Autenticação
- **POST** `/api/auth/register`
  - Body: `{ email: string, password: string, name?: string }`
  - Retorna: `{ status: 'success', data: { user, token } }`
  
- **POST** `/api/auth/login`
  - Body: `{ email: string, password: string }`
  - Retorna: `{ status: 'success', data: { user, token } }`

#### Produtos
- **GET** `/api/products`
  - Query params:
    - `categoryId?: string` (UUID)
    - `minPrice?: number`
    - `maxPrice?: number`
    - `brand?: string`
    - `search?: string`
    - `sortBy?: 'price_asc' | 'price_desc' | 'name' | 'createdAt'`
  - Retorna: `{ status: 'success', data: Product[] }`
  
- **GET** `/api/products/:id`
  - Retorna: `{ status: 'success', data: Product }` (com variants, images, category)

#### Categorias
- **GET** `/api/categories`
  - Retorna: `{ status: 'success', data: Category[] }`
  
- **GET** `/api/categories/:id`
  - Retorna: `{ status: 'success', data: Category }` (com products)

---

### 🔐 Endpoints Autenticados (USER)

#### Autenticação
- **GET** `/api/auth/me`
  - Headers: `Authorization: Bearer <token>`
  - Retorna: `{ status: 'success', data: User }`

#### Carrinho
- **GET** `/api/cart`
  - Retorna: `{ status: 'success', data: Cart }` (com items, products, variants)
  
- **POST** `/api/cart/items`
  - Body: `{ productId: string (UUID), productVariantId?: string (UUID), quantity: number (min: 1) }`
  - Retorna: `{ status: 'success', data: Cart }`
  
- **PUT** `/api/cart/items/:itemId`
  - Body: `{ quantity: number (min: 1) }`
  - Retorna: `{ status: 'success', data: Cart }`
  
- **DELETE** `/api/cart/items/:itemId`
  - Retorna: `{ status: 'success', data: Cart }`
  
- **DELETE** `/api/cart`
  - Retorna: `{ status: 'success', message: 'Carrinho limpo com sucesso' }`

#### Favoritos
- **GET** `/api/favorites`
  - Retorna: `{ status: 'success', data: Favorite[] }` (com products)
  
- **POST** `/api/favorites`
  - Body: `{ productId: string }`
  - Retorna: `{ status: 'success', message: 'Produto adicionado aos favoritos' }`
  
- **DELETE** `/api/favorites/:productId`
  - Retorna: `{ status: 'success', message: 'Produto removido dos favoritos' }`

#### Pedidos (Cliente)
- **POST** `/api/orders`
  - Body: `{ shippingAddress: string, shippingName: string, shippingPhone?: string }`
  - Retorna: `{ status: 'success', data: Order }` (com items, products, variants)
  - Nota: Cria pedido a partir do carrinho e limpa o carrinho automaticamente
  
- **GET** `/api/orders/my-orders`
  - Retorna: `{ status: 'success', data: Order[] }` (pedidos do usuário logado)
  
- **GET** `/api/orders/:id`
  - Retorna: `{ status: 'success', data: Order }` (apenas se for dono do pedido)

---

### 👑 Endpoints Admin (ADMIN apenas)

#### Dashboard
- **GET** `/api/dashboard/stats`
  - Retorna: `{ status: 'success', data: { totalRevenue, totalOrders, totalProducts, totalUsers } }`
  
- **GET** `/api/dashboard/top-products`
  - Query: `limit?: number` (default: 10)
  - Retorna: `{ status: 'success', data: Array<{ product, totalSold, revenue }> }`
  
- **GET** `/api/dashboard/revenue-over-time`
  - Query: `days?: number` (default: 7)
  - Retorna: `{ status: 'success', data: Array<{ date, revenue }> }`
  
- **GET** `/api/dashboard/orders-over-time`
  - Query: `days?: number` (default: 7)
  - Retorna: `{ status: 'success', data: Array<{ date, count }> }`
  
- **GET** `/api/dashboard/orders-by-status`
  - Query: `days?: number` (default: 7)
  - Retorna: `{ status: 'success', data: Array<{ status, count }> }`
  
- **GET** `/api/dashboard/sales-by-category`
  - Query: `days?: number` (default: 7)
  - Retorna: `{ status: 'success', data: Array<{ category, revenue, count }> }`

#### Categorias (Admin)
- **POST** `/api/categories`
  - Body: `{ name: string (unique), description?: string }`
  - Retorna: `{ status: 'success', data: Category }`
  
- **PUT** `/api/categories/:id`
  - Body: `{ name?: string, description?: string }`
  - Retorna: `{ status: 'success', data: Category }`
  
- **DELETE** `/api/categories/:id`
  - Retorna: `{ status: 'success', message: 'Categoria deletada com sucesso' }`
  - Nota: Deleta em cascata os produtos da categoria

#### Produtos (Admin)
- **POST** `/api/products`
  - Body: `{
    name: string,
    description?: string,
    basePrice: number (positive),
    brand?: string,
    categoryId: string (UUID),
    variants?: Array<{
      attributes: Record<string, string>,
      price: number (positive),
      stock: number (int, min: 0)
    }>,
    images?: string[] (URLs)
  }`
  - Retorna: `{ status: 'success', data: Product }`
  
- **PUT** `/api/products/:id`
  - Body: `{
    name?: string,
    description?: string,
    basePrice?: number,
    brand?: string,
    categoryId?: string
  }`
  - Retorna: `{ status: 'success', data: Product }`
  
- **DELETE** `/api/products/:id`
  - Retorna: `{ status: 'success', message: 'Produto deletado com sucesso' }`
  - Nota: Deleta em cascata variants, images, cartItems, orderItems, favorites

#### Pedidos (Admin)
- **GET** `/api/orders`
  - Retorna: `{ status: 'success', data: Order[] }` (todos os pedidos)
  
- **PUT** `/api/orders/:id/status`
  - Body: `{ status: 'PENDING' | 'PROCESSING' | 'SENT' | 'DELIVERED' | 'CANCELLED' }`
  - Retorna: `{ status: 'success', data: Order }`

---

### 📊 Modelos de Dados (TypeScript)

```typescript
// User
interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

// Category
interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}

// Product
interface Product {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  brand?: string;
  categoryId: string;
  category?: Category;
  variants?: ProductVariant[];
  images?: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

// ProductVariant
interface ProductVariant {
  id: string;
  productId: string;
  attributes: string; // JSON string: {"color": "red", "size": "50ml"}
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

// ProductImage
interface ProductImage {
  id: string;
  productId: string;
  url: string;
  isCover: boolean;
  createdAt: string;
}

// Cart
interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// CartItem
interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  productVariantId?: string;
  quantity: number;
  product?: Product;
  productVariant?: ProductVariant;
  createdAt: string;
  updatedAt: string;
}

// Order
interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PROCESSING' | 'SENT' | 'DELIVERED' | 'CANCELLED';
  total: number;
  shippingAddress: string;
  shippingName: string;
  shippingPhone?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// OrderItem
interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productVariantId?: string;
  quantity: number;
  price: number;
  product?: Product;
  productVariant?: ProductVariant;
  createdAt: string;
}

// Favorite
interface Favorite {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
  createdAt: string;
}

// Dashboard Stats
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

// Top Product
interface TopProduct {
  product: Product;
  totalSold: number;
  revenue: number;
}

// Revenue/Orders Over Time
interface TimeSeriesData {
  date: string;
  revenue?: number;
  count?: number;
}

// Orders By Status
interface OrdersByStatus {
  status: Order['status'];
  count: number;
}

// Sales By Category
interface SalesByCategory {
  category: Category;
  revenue: number;
  count: number;
}
```

---

### 🔄 Fluxos de Negócio Importantes

#### Fluxo de Compra (E-commerce)
1. Usuário navega produtos (público)
2. Usuário adiciona ao carrinho (requer auth)
3. Usuário visualiza carrinho
4. Usuário atualiza quantidades ou remove itens
5. Usuário finaliza compra (POST /api/orders)
   - Backend cria pedido a partir do carrinho
   - Backend decrementa estoque das variantes
   - Backend limpa o carrinho automaticamente
6. Usuário visualiza pedidos em "Meus Pedidos"

#### Fluxo de Gerenciamento de Produto (Admin)
1. Admin cria categoria
2. Admin cria produto com variantes e imagens
3. Admin pode editar produto
4. Admin pode deletar produto (cascata automática)

#### Fluxo de Gerenciamento de Pedido (Admin)
1. Admin visualiza todos os pedidos
2. Admin filtra por status
3. Admin visualiza detalhes do pedido
4. Admin atualiza status do pedido
5. Status disponíveis: PENDING → PROCESSING → SENT → DELIVERED (ou CANCELLED)

---

## 🔐 Autenticação e Segurança

- Token JWT armazenado no localStorage (ou cookie httpOnly)
- Interceptor Axios para adicionar token automaticamente
- Interceptor para redirecionar em 401
- Validação de role (ADMIN) no frontend admin
- Rotas protegidas com middleware do TanStack Router

---

---

## 📋 Resumo de Funcionalidades Mapeadas

### E-commerce (Cliente)
✅ **Autenticação**
- Login
- Registro
- Perfil do usuário

✅ **Navegação e Catálogo**
- Homepage com produtos em destaque
- Listagem de produtos com filtros avançados (categoria, preço, marca, busca)
- Ordenação de produtos (preço, nome, data)
- Detalhe do produto com variantes
- Galeria de imagens
- Produtos relacionados

✅ **Carrinho**
- Adicionar produtos ao carrinho
- Atualizar quantidades
- Remover itens
- Limpar carrinho
- Quick view (sidebar/modal)
- Persistência no backend

✅ **Favoritos**
- Adicionar/remover favoritos
- Lista de favoritos
- Adicionar ao carrinho direto dos favoritos

✅ **Pedidos**
- Checkout com formulário de entrega
- Criar pedido (limpa carrinho automaticamente)
- Listar pedidos do usuário
- Detalhes do pedido
- Acompanhamento de status

### Backoffice (Admin)
✅ **Dashboard**
- Estatísticas gerais (receita, pedidos, produtos, usuários)
- Gráfico de receita ao longo do tempo
- Gráfico de pedidos ao longo do tempo
- Pedidos por status
- Vendas por categoria
- Top produtos mais vendidos
- Filtros de período

✅ **Gerenciamento de Categorias**
- Listar categorias
- Criar categoria
- Editar categoria
- Deletar categoria (cascata)

✅ **Gerenciamento de Produtos**
- Listar produtos (com filtros e busca)
- Criar produto (com variantes e imagens)
- Editar produto
- Deletar produto (cascata)
- Visualizar detalhes

✅ **Gerenciamento de Pedidos**
- Listar todos os pedidos
- Filtrar por status e data
- Ver detalhes do pedido
- Atualizar status do pedido
- Visualizar informações do cliente

---

## ⚠️ Observações Importantes

### Validações e Regras de Negócio
1. **Carrinho requer autenticação**: Não é possível adicionar ao carrinho sem estar logado
2. **Estoque**: Backend valida estoque ao adicionar ao carrinho e ao criar pedido
3. **Criação de pedido**: Automaticamente limpa o carrinho e decrementa estoque
4. **Variantes**: Produtos podem ter múltiplas variantes com preços e estoques diferentes
5. **Imagens**: Por enquanto apenas URLs são aceitas (preparado para cloud storage futuro)
6. **Deleção em cascata**: Deletar categoria deleta produtos; deletar produto deleta variantes, imagens, etc.

### Estados e Status
- **OrderStatus**: PENDING → PROCESSING → SENT → DELIVERED (ou CANCELLED)
- **UserRole**: ADMIN ou USER
- **ProductVariant.attributes**: JSON string (ex: `{"color": "red", "size": "50ml"}`)

### Tratamento de Erros
- Backend retorna `{ status: 'error', message: string }` em caso de erro
- Status codes: 400 (validação), 401 (não autenticado), 403 (sem permissão), 404 (não encontrado), 500 (erro servidor)
- Frontend deve tratar todos os casos de erro com feedback visual

### Performance
- Considerar paginação para listagens grandes
- Implementar loading states
- Cache de dados quando apropriado (categorias, por exemplo)
- Lazy loading de imagens

---

## 📝 Próximos Passos

Aguardando decisão sobre qual projeto começar primeiro e quais funcionalidades são prioritárias.

---

## 📦 Dependências Adicionais (se necessário)

- `recharts` - Para gráficos no dashboard (recomendado, responsivo nativo)
- `react-hook-form` - Para formulários complexos
- `zod` - Validação de formulários (já no backend)
- `date-fns` - Formatação de datas
- `lucide-react` - Ícones (já incluído no Shadcn/ui)
- `@radix-ui/react-dialog` - Base do Dialog/Modal do Shadcn/ui (já incluído)

---

## 🎯 Checklist de Responsividade

### E-commerce
- [ ] Header responsivo (menu hambúrguer no mobile)
- [ ] Grid de produtos adaptativo (1/2/3/4 colunas)
- [ ] Cards de produto responsivos
- [ ] Formulários em coluna no mobile
- [ ] Imagens com lazy loading e object-fit
- [ ] Navegação mobile-friendly
- [ ] Footer responsivo

### Backoffice
- [ ] Sidebar colapsável no mobile
- [ ] Tabelas com scroll horizontal ou cards no mobile
- [ ] Modais 100% width no mobile
- [ ] Formulários em modais responsivos
- [ ] Dashboard com gráficos responsivos
- [ ] Filtros e controles adaptativos

### Modais
- [ ] Tamanhos responsivos (médio/grande)
- [ ] 100% width no mobile
- [ ] Scroll interno quando necessário
- [ ] Stack de modais funcionando
- [ ] Backdrop acumulativo
- [ ] Fechar com ESC e clique fora

