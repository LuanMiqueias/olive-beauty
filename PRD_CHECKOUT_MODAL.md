# PRD - Modal de Checkout Animado com Etapas

## 1. Visão Geral

### 1.1 Objetivo
Implementar um modal de checkout que exiba visualmente as etapas do processo de finalização de compra com animações de checkmarks estilo Mercado Livre, proporcionando feedback claro e engajador ao usuário durante o processo de criação do pedido.

### 1.2 Contexto
Atualmente, o checkout utiliza um modal simples de confirmação (`ConfirmOrderModal`) que apenas exibe informações e processa o pedido. Este PRD propõe substituir esse fluxo por uma experiência mais rica e visualmente atrativa.

### 1.3 Escopo
- Substituir o `ConfirmOrderModal` atual por um novo componente `CheckoutProcessModal`
- Implementar animações de checkmarks para cada etapa do processo
- Exibir resumo do pedido na tela de sucesso
- Tratamento de erros dentro do modal

---

## 2. Etapas do Processo

O modal deve exibir **5 etapas sequenciais** durante o processo de checkout:

1. **Validando informações** ✅
   - Validação dos dados de entrega (nome, endereço)
   - Validação do carrinho (itens disponíveis, estoque)

2. **Processando pagamento** ✅
   - Simulação de processamento (não há integração real de pagamento no momento)
   - Pode ser uma etapa rápida ou simulada

3. **Confirmando pedido** ✅
   - Criação do pedido na API (`ordersApi.create`)
   - Persistência dos dados no backend

4. **Preparando envio** ✅
   - Limpeza do carrinho após sucesso
   - Preparação dos dados de confirmação

5. **Sucesso** 🎉
   - Exibição do resumo completo do pedido criado
   - Opções de ação para o usuário

---

## 3. Design e Animações

### 3.1 Estilo Visual - Checkmarks Animados (Estilo Mercado Livre)

**Características:**
- Cada etapa deve ter um **círculo** com ícone
- Quando a etapa está **em progresso**: círculo com spinner/loading
- Quando a etapa é **concluída**: círculo preenchido com checkmark animado
- Quando a etapa está **pendente**: círculo vazio ou com ícone neutro
- **Linha conectora** entre as etapas que se preenche conforme o progresso

**Animação do Checkmark:**
- Transição suave do círculo vazio → preenchido
- Checkmark aparece com animação de "draw" (traçado)
- Efeito de escala leve (scale 1.0 → 1.1 → 1.0)
- Cor de sucesso (verde) ao completar

**Timing das Animações:**
- Cada etapa deve ter uma duração mínima de **800ms - 1500ms** para dar sensação de processamento
- Transição entre etapas: **300ms - 500ms**
- Delay entre conclusão de uma etapa e início da próxima: **200ms**

### 3.2 Layout do Modal

**Estrutura:**
```
┌─────────────────────────────────────┐
│  [X]                                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Etapa 1: Validando...      │   │
│  │  ○─────────────────────────○   │
│  │  Etapa 2: Processando...    │   │
│  │  ○─────────────────────────○   │
│  │  Etapa 3: Confirmando...    │   │
│  │  ○─────────────────────────○   │
│  │  Etapa 4: Preparando...     │   │
│  │  ○─────────────────────────○   │
│  │  Etapa 5: Sucesso!          │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Conteúdo dinâmico da etapa]      │
│                                     │
└─────────────────────────────────────┘
```

**Estados do Modal:**
- **Em Processamento**: Mostra etapas com animações, sem botões de ação
- **Sucesso**: Mostra resumo do pedido + botões de ação
- **Erro**: Mostra mensagem de erro + botão de tentar novamente

---

## 4. Funcionalidades Detalhadas

### 4.1 Fluxo de Processamento

**Sequência de Execução:**

1. **Usuário clica em "Continuar para Confirmação"** no checkout
2. **Modal abre** mostrando todas as 5 etapas (todas pendentes)
3. **Etapa 1 inicia automaticamente** após 300ms
4. **Validação local** dos dados do formulário
5. **Etapa 1 completa** → animação de checkmark
6. **Etapa 2 inicia** → processamento simulado
7. **Etapa 2 completa** → animação de checkmark
8. **Etapa 3 inicia** → chamada real à API `ordersApi.create()`
9. **Etapa 3 completa** → animação de checkmark
10. **Etapa 4 inicia** → limpeza do carrinho (`getCart()`)
11. **Etapa 4 completa** → animação de checkmark
12. **Etapa 5 (Sucesso)** → exibe resumo do pedido criado

### 4.2 Tela de Sucesso

**Conteúdo a exibir:**

- **Título**: "Pedido criado com sucesso!" ou "Compra realizada com sucesso!"
- **Número do pedido**: `Pedido #${order.id}`
- **Resumo do pedido**:
  - Lista de itens (produto, variante, quantidade, preço unitário, subtotal)
  - Subtotal dos produtos
  - Valor do frete
  - **Total do pedido** (destaque)
- **Informações de entrega**:
  - Nome do destinatário
  - Endereço completo
  - Telefone (se fornecido)
- **Botões de ação**:
  - "Ver Detalhes do Pedido" (navega para `/orders/${orderId}`)
  - "Continuar Comprando" (navega para `/products` e fecha modal)
  - "Fechar" (fecha modal e navega para `/orders`)

### 4.3 Tratamento de Erros

**Comportamento em caso de erro:**

- **Modal permanece aberto**
- **Etapa atual exibe estado de erro** (círculo vermelho com X)
- **Mensagem de erro** exibida abaixo das etapas ou em área destacada
- **Botões de ação**:
  - "Tentar Novamente" (reinicia o processo da etapa que falhou)
  - "Cancelar" (fecha modal e retorna ao checkout)

**Tipos de erro a tratar:**

- Erro de validação (Etapa 1)
- Erro de API (Etapa 3) - mais comum
- Erro ao limpar carrinho (Etapa 4)
- Erro de rede/timeout

**Mensagens de erro específicas:**

- "Erro ao validar informações. Verifique os dados e tente novamente."
- "Erro ao processar pedido. Tente novamente em alguns instantes."
- "Erro ao confirmar pedido. Verifique sua conexão e tente novamente."
- "Erro ao finalizar processo. Seu pedido pode ter sido criado. Verifique em 'Meus Pedidos'."

---

## 5. Especificações Técnicas

### 5.1 Componente Principal

**Nome:** `CheckoutProcessModal`

**Props:**
```typescript
interface CheckoutProcessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: Cart | null
  shippingName: string
  shippingAddress: string
  shippingPhone?: string
  onSuccess?: (order: Order) => void // Callback quando pedido é criado com sucesso
}
```

**Estados internos:**
- `currentStep: number` (0-4, onde 4 = sucesso)
- `isProcessing: boolean`
- `error: string | null`
- `createdOrder: Order | null`
- `stepStatus: Record<number, 'pending' | 'processing' | 'completed' | 'error'>`

### 5.2 Estrutura de Arquivos

```
frontend-ecommerce/src/features/orders/
├── components/
│   ├── CheckoutProcessModal.tsx (novo)
│   ├── CheckoutStepIndicator.tsx (novo - componente de etapas)
│   ├── CheckoutSuccessView.tsx (novo - tela de sucesso)
│   └── ConfirmOrderModal.tsx (pode ser removido ou mantido como fallback)
```

### 5.3 Dependências Necessárias

- **Animações**: Usar CSS transitions/animations ou Framer Motion (se já estiver no projeto)
- **Ícones**: Usar biblioteca de ícones existente (provavelmente lucide-react baseado no projeto)
- **Modal**: Usar componente Dialog existente do shadcn/ui

### 5.4 Integração com API

**Chamada à API:**
- Manter uso de `ordersApi.create()` na Etapa 3
- Capturar resposta completa do pedido criado
- Armazenar `Order` retornado para exibição no sucesso

**Atualização do carrinho:**
- Após sucesso na Etapa 3, chamar `getCart()` para limpar carrinho
- Se `getCart()` falhar, não bloquear o fluxo (pedido já foi criado)

---

## 6. Experiência do Usuário (UX)

### 6.1 Feedback Visual

- **Progresso claro**: Usuário sempre sabe em qual etapa está
- **Animações suaves**: Não devem ser muito rápidas (parecer fake) nem muito lentas (frustrantes)
- **Estados visuais distintos**: Pendente, processando, completo, erro

### 6.2 Acessibilidade

- **ARIA labels** em todas as etapas
- **Anúncios de mudança de etapa** para leitores de tela
- **Foco gerenciado** quando modal abre/fecha
- **Suporte a teclado**: ESC para fechar (quando não estiver processando)

### 6.3 Responsividade

- Modal deve funcionar bem em **mobile** e **desktop**
- Etapas podem ser exibidas verticalmente em mobile
- Conteúdo de sucesso deve ser scrollável se necessário

---

## 7. Casos de Uso

### 7.1 Fluxo Feliz (Happy Path)

1. Usuário preenche formulário de checkout
2. Clica em "Continuar para Confirmação"
3. Modal abre e processa todas as etapas automaticamente
4. Exibe tela de sucesso com resumo
5. Usuário clica em "Ver Detalhes do Pedido"
6. Navega para página de pedidos

### 7.2 Fluxo com Erro

1. Usuário preenche formulário
2. Clica em "Continuar para Confirmação"
3. Modal abre e processa etapas
4. **Erro na Etapa 3** (API falha)
5. Modal exibe erro e botão "Tentar Novamente"
6. Usuário clica em "Tentar Novamente"
7. Processo reinicia da Etapa 3
8. Sucesso na segunda tentativa

### 7.3 Cancelamento

1. Usuário inicia processo
2. Durante processamento, usuário pode fechar modal (se permitido)
3. Se pedido já foi criado, avisar usuário antes de fechar
4. Se ainda não foi criado, fechar normalmente

---

## 8. Critérios de Aceitação

- [ ] Modal exibe 5 etapas com checkmarks animados
- [ ] Animações seguem estilo Mercado Livre (círculos preenchidos, checkmarks desenhados)
- [ ] Cada etapa tem duração mínima de 800ms
- [ ] Processamento real acontece na Etapa 3 (chamada à API)
- [ ] Tela de sucesso exibe resumo completo do pedido
- [ ] Erros são exibidos no modal com opção de tentar novamente
- [ ] Modal é responsivo (mobile e desktop)
- [ ] Acessibilidade básica implementada (ARIA, teclado)
- [ ] Integração com navegação funciona corretamente
- [ ] Carrinho é limpo após sucesso

---

## 9. Notas de Implementação

### 9.1 Ordem de Desenvolvimento Sugerida

1. Criar componente `CheckoutStepIndicator` (etapas com checkmarks)
2. Criar componente `CheckoutSuccessView` (tela de sucesso)
3. Criar componente principal `CheckoutProcessModal`
4. Integrar lógica de processamento sequencial
5. Adicionar tratamento de erros
6. Testar fluxos completos
7. Ajustar animações e timing
8. Substituir `ConfirmOrderModal` no `CheckoutPage`

### 9.2 Considerações de Performance

- Animações devem usar `transform` e `opacity` (GPU-accelerated)
- Evitar re-renders desnecessários durante animações
- Lazy load de componentes pesados se necessário

### 9.3 Testes Recomendados

- Teste de fluxo completo (happy path)
- Teste de erro de API
- Teste de timeout de rede
- Teste de cancelamento durante processamento
- Teste de responsividade
- Teste de acessibilidade

---

## 10. Referências Visuais

**Inspiração:** Modal de checkout do Mercado Livre
- Etapas verticais com círculos conectados
- Checkmarks animados ao completar cada etapa
- Feedback visual claro do progresso
- Tela de confirmação com resumo do pedido

---

**Versão:** 1.0  
**Data:** 2025-01-27  
**Autor:** Equipe de Desenvolvimento Olive Beauty

