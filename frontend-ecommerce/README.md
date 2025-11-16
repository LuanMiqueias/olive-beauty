# Frontend E-commerce - Olive Beauty

Projeto frontend do e-commerce Olive Beauty desenvolvido com React, TypeScript, Vite, TanStack Router, Zustand, Tailwind CSS e Shadcn/ui.

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
frontend-ecommerce/
├── public/
├── src/
│   ├── api/                 # Cliente HTTP e configuração
│   │   ├── client.ts       # Instância do Axios com interceptors
│   │   └── endpoints/       # Endpoints organizados por feature
│   ├── features/           # Features organizadas por domínio
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   └── ...
│   ├── shared/             # Código compartilhado
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilitários
│   │   ├── stores/         # Stores Zustand
│   │   │   ├── authStore.ts
│   │   │   ├── cartStore.ts
│   │   │   ├── favoritesStore.ts
│   │   │   └── index.ts
│   │   └── types/          # Types compartilhados
│   │       └── index.ts
│   ├── routes/             # Rotas do TanStack Router
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── components.json          # Configuração do Shadcn/ui
```

## 🗄️ Stores Zustand

### Auth Store (`useAuthStore`)
Gerencia autenticação do usuário:
- `login(credentials)` - Faz login
- `register(data)` - Registra novo usuário
- `logout()` - Faz logout
- `getCurrentUser()` - Busca usuário atual
- `user` - Usuário atual
- `token` - Token JWT
- `isAuthenticated` - Status de autenticação

### Cart Store (`useCartStore`)
Gerencia carrinho de compras:
- `getCart()` - Busca carrinho
- `addItem(data)` - Adiciona item ao carrinho
- `updateItem(itemId, data)` - Atualiza quantidade
- `removeItem(itemId)` - Remove item
- `clearCart()` - Limpa carrinho
- `cart` - Carrinho atual
- `itemCount` - Total de itens

### Favorites Store (`useFavoritesStore`)
Gerencia favoritos:
- `getFavorites()` - Busca favoritos
- `addFavorite(productId)` - Adiciona favorito
- `removeFavorite(productId)` - Remove favorito
- `isFavorite(productId)` - Verifica se é favorito
- `favorites` - Lista de favoritos

## 🔌 API Client

O cliente HTTP (`apiClient`) está configurado com:
- Interceptor de requisição: adiciona token JWT automaticamente
- Interceptor de resposta: trata erros 401/403 e redireciona para login

## 📝 Tipos TypeScript

Todos os tipos estão definidos em `src/shared/types/index.ts`:
- `User`, `Product`, `Category`, `Cart`, `Order`, `Favorite`
- DTOs para requisições
- Tipos de resposta da API

## 🎨 Shadcn/ui

O projeto está configurado para usar Shadcn/ui. Para adicionar componentes:

```bash
npx shadcn@latest add [component-name]
```

## 🔗 Integração com Backend

O frontend se conecta ao backend através da API REST. Configure a URL do backend no arquivo `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

## 📝 Próximos Passos

Consulte o arquivo `FRONTEND_PLAN.md` na raiz do projeto para ver o plano completo de desenvolvimento.

## ✅ Etapas Concluídas

- ✅ Etapa 1: Setup Inicial
- ✅ Etapa 2: Configuração Base
