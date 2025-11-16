# PRD: Visualização de Detalhes do Pedido com Histórico de Status

## 📋 Visão Geral

**Título:** Implementação de Tela de Detalhes do Pedido com Histórico de Status e Timeline Visual  
**Data:** 2024  
**Status:** Em Planejamento  
**Prioridade:** Alta  

---

## 🎯 Objetivo

Implementar uma tela completa de detalhes do pedido que permita ao usuário visualizar todas as informações do pedido, incluindo um histórico visual de status seguindo o modelo do Mercado Livre, com checkmarks indicando quais etapas já foram concluídas.

---

## 📊 Contexto e Problema

### Situação Atual
- Existe uma página `OrderDetailPage.tsx` que já possui a estrutura básica
- A rota `/orders/$orderId` está configurada no TanStack Router
- O botão "Ver Detalhes" na página de pedidos (`OrdersPage.tsx`) usa `<Link to={`/orders/${order.id}`}>`
- **Problema identificado**: Quando o usuário clica em "Ver Detalhes", a URL muda mas a tela não renderiza o conteúdo

### Problemas Identificados
1. **Navegação quebrada**: URL muda mas componente não renderiza
2. **Falta de histórico visual**: Não há timeline mostrando o progresso do pedido
3. **Experiência do usuário**: Usuário não consegue acompanhar o status do pedido de forma visual e intuitiva
4. **Falta de feedback visual**: Não há indicação clara de quais etapas já foram concluídas

---

## ✅ Objetivos e Requisitos

### Objetivos de Negócio
- Melhorar a experiência do usuário ao visualizar detalhes do pedido
- Aumentar a transparência sobre o status do pedido
- Reduzir suporte ao cliente com informações claras sobre o pedido
- Seguir padrões de UX conhecidos (Mercado Livre) para facilitar adoção

### Requisitos Funcionais

#### RF1: Correção de Navegação
- **Descrição**: Corrigir o problema de navegação onde a URL muda mas a tela não renderiza
- **Prioridade**: Crítica
- **Critérios de Aceitação**:
  - Ao clicar em "Ver Detalhes" na página de pedidos, a navegação deve funcionar corretamente
  - A página de detalhes deve renderizar completamente
  - A URL deve corresponder ao pedido selecionado (`/orders/{orderId}`)
  - Deve funcionar tanto com `<Link>` quanto com `navigate()`

#### RF2: Timeline de Status do Pedido
- **Descrição**: Implementar timeline visual mostrando o progresso do pedido com checkmarks
- **Prioridade**: Alta
- **Critérios de Aceitação**:
  - Timeline deve mostrar 5 etapas principais:
    1. **Pedido Realizado** (PENDING) - Sempre concluído
    2. **Pagamento Confirmado** (PENDING → PROCESSING) - Concluído quando status muda para PROCESSING
    3. **Pedido em Preparação** (PROCESSING) - Concluído quando status é PROCESSING
    4. **Pedido Enviado** (SENT) - Concluído quando status é SENT
    5. **Pedido Entregue** (DELIVERED) - Concluído quando status é DELIVERED
  - Cada etapa deve ter:
    - Checkmark verde (✓) quando concluída
    - Círculo vazio quando pendente
    - Data/hora de conclusão quando disponível
    - Descrição da etapa
  - Etapas concluídas devem ter linha verde conectando-as
  - Etapa atual deve estar destacada
  - Timeline deve ser responsiva (vertical em mobile, horizontal em desktop)

#### RF3: Informações do Pedido
- **Descrição**: Exibir todas as informações relevantes do pedido
- **Prioridade**: Alta
- **Critérios de Aceitação**:
  - Número do pedido (primeiros 8 caracteres do ID em maiúsculas)
  - Data de criação e última atualização
  - Status atual com badge colorido
  - Lista completa de itens com:
    - Imagem do produto
    - Nome do produto
    - Variantes (se houver)
    - Quantidade
    - Preço unitário
    - Preço total do item
    - Link para página do produto
  - Endereço de entrega completo
  - Resumo financeiro:
    - Subtotal dos itens
    - Frete
    - Total do pedido

#### RF4: Histórico de Atualizações
- **Descrição**: Exibir histórico de mudanças de status do pedido
- **Prioridade**: Média
- **Critérios de Aceitação**:
  - Lista cronológica de mudanças de status
  - Cada entrada deve mostrar:
    - Status anterior e novo status
    - Data e hora da mudança
    - Ordenação: mais recente primeiro
  - Se não houver histórico disponível na API, usar `createdAt` e `updatedAt` para inferir mudanças

#### RF5: Responsividade
- **Descrição**: Garantir que a tela funcione perfeitamente em mobile e desktop
- **Prioridade**: Alta
- **Critérios de Aceitação**:
  - Layout deve ser otimizado para mobile (< 640px)
  - Timeline deve ser vertical em mobile
  - Timeline deve ser horizontal em desktop
  - Cards devem empilhar verticalmente em mobile
  - Imagens de produtos devem ter tamanho adequado em todas as telas
  - Texto deve ser legível em todas as resoluções

#### RF6: Estados de Carregamento e Erro
- **Descrição**: Tratar estados de loading e erro adequadamente
- **Prioridade**: Alta
- **Critérios de Aceitação**:
  - Mostrar skeleton/loading enquanto carrega dados
  - Mostrar mensagem de erro se pedido não for encontrado
  - Mostrar mensagem de erro se houver falha na API
  - Botão para tentar novamente em caso de erro
  - Botão para voltar à lista de pedidos

---

## 🎨 Especificações de Design

### Layout Geral

```
┌─────────────────────────────────────────────────────────┐
│  ← Voltar para Pedidos                                  │
│                                                         │
│  Detalhes do Pedido                                     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Timeline de Status (Horizontal no Desktop)     │   │
│  │  [✓] [✓] [✓] [ ] [ ]                           │   │
│  │  Realizado → Preparação → Enviado → Entregue    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────┬──────────────────────────┐   │
│  │                      │                          │   │
│  │  Informações do      │  Resumo do Pedido        │   │
│  │  Pedido              │                          │   │
│  │                      │  Subtotal: R$ XXX        │   │
│  │  - Número            │  Frete: R$ XX            │   │
│  │  - Status            │  ─────────────────      │   │
│  │  - Data              │  Total: R$ XXX          │   │
│  │                      │                          │   │
│  │  - Endereço          │                          │   │
│  │                      │                          │   │
│  │  - Itens             │                          │   │
│  │                      │                          │   │
│  │  - Histórico         │                          │   │
│  │                      │                          │   │
│  └──────────────────────┴──────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Timeline de Status (Modelo Mercado Livre)

#### Desktop (Horizontal)
```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│   ✓         │   ✓         │   ✓         │   ○         │   ○         │
│ Realizado   │ Pagamento   │ Preparação  │ Enviado     │ Entregue    │
│ 15/11/2024  │ Confirmado  │ 16/11/2024  │             │             │
│ 10:30       │ 16/11/2024  │ 14:00       │             │             │
│             │ 11:00       │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
     ────────────────✓───────────────✓───────────────○───────────────○
```

#### Mobile (Vertical)
```
┌─────────────┐
│   ✓         │
│ Realizado   │
│ 15/11/2024  │
│ 10:30       │
└─────│───────┘
      │ ✓
┌─────▼───────┐
│   ✓         │
│ Pagamento   │
│ Confirmado  │
│ 16/11/2024  │
│ 11:00       │
└─────│───────┘
      │ ✓
┌─────▼───────┐
│   ✓         │
│ Preparação  │
│ 16/11/2024  │
│ 14:00       │
└─────│───────┘
      │ ○
┌─────▼───────┐
│   ○         │
│ Enviado     │
│             │
└─────│───────┘
      │ ○
┌─────▼───────┐
│   ○         │
│ Entregue    │
│             │
└─────────────┘
```

### Especificações de Cores e Status

#### Status Colors
- **PENDING**: Amarelo (`bg-yellow-100 text-yellow-800 border-yellow-200`)
- **PROCESSING**: Azul (`bg-blue-100 text-blue-800 border-blue-200`)
- **SENT**: Roxo (`bg-purple-100 text-purple-800 border-purple-200`)
- **DELIVERED**: Verde (`bg-green-100 text-green-800 border-green-200`)
- **CANCELLED**: Vermelho (`bg-red-100 text-red-800 border-red-200`)

#### Timeline Colors
- **Etapa Concluída**: 
  - Checkmark: Verde (`text-green-600`)
  - Linha: Verde (`border-green-500`)
  - Background: Verde claro (`bg-green-50`)
- **Etapa Atual**:
  - Círculo: Azul com borda (`border-blue-500 bg-blue-50`)
  - Texto: Azul escuro (`text-blue-900`)
- **Etapa Pendente**:
  - Círculo: Cinza (`border-gray-300 bg-gray-50`)
  - Texto: Cinza (`text-gray-500`)

---

## 🔧 Implementação Técnica

### Arquivos a Modificar/Criar

1. **frontend-ecommerce/src/features/orders/pages/OrderDetailPage.tsx**
   - Adicionar componente de Timeline
   - Melhorar layout responsivo
   - Adicionar seção de histórico

2. **frontend-ecommerce/src/features/orders/components/OrderStatusTimeline.tsx** (NOVO)
   - Componente de timeline visual
   - Lógica para determinar etapas concluídas
   - Responsivo (vertical/horizontal)

3. **frontend-ecommerce/src/features/orders/components/OrderHistory.tsx** (NOVO)
   - Componente para exibir histórico de mudanças
   - Lista cronológica de eventos

4. **frontend-ecommerce/src/features/orders/pages/OrdersPage.tsx**
   - Corrigir navegação do Link (usar `params` do TanStack Router)

5. **frontend-ecommerce/src/routes/orders.$orderId.tsx**
   - Verificar se está configurado corretamente

### Estrutura de Componentes

```typescript
OrderDetailPage
├── OrderStatusTimeline (novo)
│   ├── TimelineStep (5 instâncias)
│   └── TimelineConnector (linhas entre steps)
├── OrderInfoCard
│   ├── OrderHeader (número, status, datas)
│   ├── ShippingAddress
│   ├── OrderItemsList
│   └── OrderHistory (novo)
└── OrderSummaryCard
    ├── ItemsSubtotal
    ├── ShippingCost
    └── Total
```

### Lógica de Timeline

```typescript
interface TimelineStep {
  id: string
  label: string
  status: 'completed' | 'current' | 'pending'
  date?: string
  description?: string
}

function getTimelineSteps(order: Order): TimelineStep[] {
  const steps: TimelineStep[] = [
    {
      id: 'created',
      label: 'Pedido Realizado',
      status: 'completed',
      date: order.createdAt,
      description: 'Seu pedido foi recebido'
    },
    {
      id: 'payment',
      label: 'Pagamento Confirmado',
      status: order.status !== 'PENDING' ? 'completed' : 'pending',
      date: order.status !== 'PENDING' ? order.updatedAt : undefined,
      description: 'Pagamento aprovado'
    },
    {
      id: 'processing',
      label: 'Pedido em Preparação',
      status: ['PROCESSING', 'SENT', 'DELIVERED'].includes(order.status) 
        ? 'completed' 
        : order.status === 'PENDING' 
        ? 'pending' 
        : 'current',
      date: ['PROCESSING', 'SENT', 'DELIVERED'].includes(order.status) 
        ? order.updatedAt 
        : undefined,
      description: 'Seu pedido está sendo preparado'
    },
    {
      id: 'sent',
      label: 'Pedido Enviado',
      status: order.status === 'DELIVERED' 
        ? 'completed' 
        : order.status === 'SENT' 
        ? 'current' 
        : 'pending',
      date: ['SENT', 'DELIVERED'].includes(order.status) 
        ? order.updatedAt 
        : undefined,
      description: 'Seu pedido foi enviado'
    },
    {
      id: 'delivered',
      label: 'Pedido Entregue',
      status: order.status === 'DELIVERED' 
        ? 'completed' 
        : 'pending',
      date: order.status === 'DELIVERED' 
        ? order.updatedAt 
        : undefined,
      description: 'Pedido entregue com sucesso'
    }
  ]
  
  return steps
}
```

### Correção de Navegação

**Problema identificado**: O `Link` está usando template string, mas o TanStack Router pode precisar de sintaxe diferente.

**Solução**:
```tsx
// ❌ Atual (pode não funcionar)
<Link to={`/orders/${order.id}`}>Ver Detalhes</Link>

// ✅ Correto
<Link to="/orders/$orderId" params={{ orderId: order.id }}>Ver Detalhes</Link>
```

---

## ✅ Critérios de Aceitação

### Funcionalidade
- [ ] Navegação funciona corretamente ao clicar em "Ver Detalhes"
- [ ] Página de detalhes renderiza completamente
- [ ] Timeline mostra todas as 5 etapas
- [ ] Checkmarks aparecem corretamente nas etapas concluídas
- [ ] Etapa atual está destacada
- [ ] Datas aparecem nas etapas concluídas
- [ ] Histórico de mudanças é exibido (se disponível)
- [ ] Todas as informações do pedido são exibidas
- [ ] Links para produtos funcionam corretamente

### Design
- [ ] Timeline é horizontal em desktop
- [ ] Timeline é vertical em mobile
- [ ] Cores de status estão corretas
- [ ] Layout é responsivo e funciona em todas as resoluções
- [ ] Cards estão bem organizados
- [ ] Espaçamento está adequado

### Performance
- [ ] Página carrega em menos de 2 segundos
- [ ] Estados de loading são exibidos adequadamente
- [ ] Erros são tratados e exibidos ao usuário

### Acessibilidade
- [ ] Contraste de cores está adequado
- [ ] Textos são legíveis
- [ ] Navegação por teclado funciona
- [ ] Screen readers podem interpretar a timeline

---

## 🧪 Testes

### Testes Manuais

1. **Teste de Navegação**
   - Acessar página de pedidos
   - Clicar em "Ver Detalhes" de um pedido
   - Verificar que a URL muda para `/orders/{orderId}`
   - Verificar que a página de detalhes renderiza completamente
   - Verificar que todas as informações estão visíveis

2. **Teste de Timeline**
   - Verificar timeline para pedido PENDING
   - Verificar timeline para pedido PROCESSING
   - Verificar timeline para pedido SENT
   - Verificar timeline para pedido DELIVERED
   - Verificar timeline para pedido CANCELLED (deve mostrar até a etapa atual)

3. **Teste de Responsividade**
   - Testar em mobile (< 640px)
   - Testar em tablet (640px - 1024px)
   - Testar em desktop (> 1024px)
   - Verificar que timeline muda de horizontal para vertical

4. **Teste de Estados**
   - Testar com pedido que não existe (404)
   - Testar com erro de API
   - Testar estado de loading
   - Verificar mensagens de erro

5. **Teste de Histórico**
   - Verificar se histórico é exibido quando disponível
   - Verificar ordenação (mais recente primeiro)
   - Verificar formatação de datas

### Testes de Regressão
- Verificar que outras funcionalidades não foram quebradas
- Verificar que navegação de outras páginas ainda funciona
- Verificar que autenticação ainda funciona corretamente

---

## 📝 Notas de Implementação

### Considerações Técnicas

1. **API de Histórico**: 
   - Se a API não retornar histórico de mudanças, usar `createdAt` e `updatedAt` para inferir
   - Se necessário, criar endpoint no backend para retornar histórico completo

2. **Performance**:
   - Usar React.memo para componentes de timeline se necessário
   - Lazy loading de imagens de produtos

3. **Acessibilidade**:
   - Adicionar `aria-label` nos checkmarks
   - Usar `role="progressbar"` na timeline
   - Adicionar `aria-live` para atualizações de status

4. **Internacionalização**:
   - Todas as strings devem estar preparadas para i18n (se aplicável)

### Decisões de Design

- **Modelo Mercado Livre**: Escolhido por ser familiar para usuários brasileiros
- **5 Etapas**: Cobre todo o ciclo de vida do pedido
- **Cores**: Seguem padrão já estabelecido no sistema
- **Responsividade**: Prioridade para mobile-first

---

## 🚀 Fase de Implementação

### Fase 1: Correção de Navegação (Crítica)
- [ ] Corrigir Link na OrdersPage.tsx
- [ ] Verificar configuração de rota
- [ ] Testar navegação básica

### Fase 2: Componente de Timeline
- [ ] Criar OrderStatusTimeline.tsx
- [ ] Implementar lógica de steps
- [ ] Implementar layout horizontal (desktop)
- [ ] Implementar layout vertical (mobile)
- [ ] Adicionar estilos e cores

### Fase 3: Componente de Histórico
- [ ] Criar OrderHistory.tsx
- [ ] Implementar lógica de histórico
- [ ] Adicionar formatação de datas
- [ ] Integrar com OrderDetailPage

### Fase 4: Melhorias na Página de Detalhes
- [ ] Reorganizar layout
- [ ] Melhorar responsividade
- [ ] Adicionar estados de loading/erro
- [ ] Integrar timeline e histórico

### Fase 5: Testes e Ajustes
- [ ] Testar em diferentes resoluções
- [ ] Testar com diferentes status de pedido
- [ ] Ajustar estilos se necessário
- [ ] Verificar acessibilidade

---

## 📚 Referências

- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [Mercado Livre - Acompanhar Pedido](https://www.mercadolivre.com.br/orders)
- [Material Design - Progress Indicators](https://material.io/components/progress-indicators)
- [Accessible Progress Indicators](https://www.w3.org/WAI/ARIA/apg/patterns/progressbar/)

---

## 📅 Timeline

- **Início**: Imediato
- **Fase 1 (Correção)**: 2 horas
- **Fase 2 (Timeline)**: 4 horas
- **Fase 3 (Histórico)**: 2 horas
- **Fase 4 (Melhorias)**: 3 horas
- **Fase 5 (Testes)**: 2 horas
- **Conclusão Estimada**: 1-2 dias
- **Status**: ⏳ Aguardando Implementação

---

## 👥 Stakeholders

- **Desenvolvedor Frontend**: Implementação
- **Designer**: Validação visual e UX
- **Product Owner**: Aprovação de requisitos
- **QA**: Testes e validação

---

## 🔄 Histórico de Versões

- **v1.0** (2024): Criação inicial do PRD

---

## 📋 Checklist de Implementação

### Preparação
- [ ] Ler e entender o PRD completamente
- [ ] Verificar estrutura atual do código
- [ ] Identificar dependências necessárias

### Implementação
- [ ] Fase 1: Correção de Navegação
- [ ] Fase 2: Componente de Timeline
- [ ] Fase 3: Componente de Histórico
- [ ] Fase 4: Melhorias na Página
- [ ] Fase 5: Testes e Ajustes

### Validação
- [ ] Todos os critérios de aceitação atendidos
- [ ] Testes manuais realizados
- [ ] Responsividade verificada
- [ ] Acessibilidade verificada
- [ ] Code review realizado

### Finalização
- [ ] Documentação atualizada
- [ ] PR criado e revisado
- [ ] Merge realizado
- [ ] Deploy realizado

