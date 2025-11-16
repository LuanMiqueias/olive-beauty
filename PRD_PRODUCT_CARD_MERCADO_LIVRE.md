# PRD: Redesign do ProductCard - Estilo Mercado Livre

## 1. Visão Geral

### Objetivo
Redesenhar o componente `ProductCard` da página inicial para seguir o padrão visual do Mercado Livre, tornando-o mais compacto, informativo e visualmente atraente, melhorando a experiência do usuário e aumentando as conversões.

### Contexto
O card atual possui um design mais espaçado e menos informativo. O redesign visa:
- Melhorar a densidade de informações
- Adicionar elementos visuais que aumentam a confiança do usuário
- Facilitar a tomada de decisão de compra
- Manter consistência com padrões de mercado (Mercado Livre)

## 2. Requisitos Funcionais

### 2.1 Layout Compacto
- **RF01**: O card deve ter um layout mais compacto, reduzindo espaçamentos internos
- **RF02**: A imagem do produto deve ocupar proporção adequada (aspect-square mantido)
- **RF03**: Informações devem ser organizadas verticalmente de forma hierárquica

### 2.2 Informações de Parcelamento
- **RF04**: Exibir opções de parcelamento abaixo do preço principal
- **RF05**: Formato: "em até Xx sem juros" ou "em até Xx de R$ Y,YY"
- **RF06**: Calcular automaticamente baseado no preço do produto
- **RF07**: Mostrar apenas se o valor permitir parcelamento (ex: mínimo R$ 30,00)

### 2.3 Badge de Frete Grátis
- **RF08**: Exibir badge "Frete Grátis" quando aplicável
- **RF09**: Badge deve ser visível e destacado (cor verde ou primária)
- **RF10**: Posicionar no canto superior direito da imagem ou próximo ao preço
- **RF11**: Mostrar apenas para produtos que tenham frete grátis configurado

### 2.4 Sistema de Avaliações/Estrelas
- **RF12**: Exibir estrelas de avaliação (0-5 estrelas)
- **RF13**: Mostrar número de avaliações ao lado das estrelas
- **RF14**: Formato: "⭐⭐⭐⭐⭐ (123)" ou similar
- **RF15**: Se não houver avaliações, mostrar "Sem avaliações" ou ocultar
- **RF16**: Estrelas devem ser clicáveis para filtrar por avaliação (opcional)

### 2.5 Informações de Estoque/Disponibilidade
- **RF17**: Exibir badge de disponibilidade (Em estoque / Poucas unidades / Sem estoque)
- **RF18**: Cores diferenciadas: verde (em estoque), amarelo (poucas unidades), vermelho (sem estoque)
- **RF19**: Mostrar quantidade disponível quando relevante

### 2.6 Funcionalidades Existentes (Manter)
- **RF20**: Manter funcionalidade de favoritos (coração)
- **RF21**: Manter botão "Adicionar ao Carrinho"
- **RF22**: Manter navegação para página de detalhes do produto
- **RF23**: Manter hover effects e transições

## 3. Requisitos Não Funcionais

### 3.1 Performance
- **RNF01**: O card deve carregar rapidamente (< 100ms de renderização)
- **RNF02**: Imagens devem usar lazy loading
- **RNF03**: Cálculos de parcelamento devem ser otimizados

### 3.2 Responsividade
- **RNF04**: Layout deve funcionar em mobile, tablet e desktop
- **RNF05**: Grid responsivo mantido (1 col mobile, 2 tablet, 3-4 desktop)
- **RNF06**: Textos devem ser legíveis em todas as resoluções

### 3.3 Acessibilidade
- **RNF07**: Elementos interativos devem ter estados de foco visíveis
- **RNF08**: Textos alternativos para imagens
- **RNF09**: Contraste adequado para leitura

### 3.4 Consistência Visual
- **RNF10**: Manter identidade visual da marca (cores primárias)
- **RNF11**: Espaçamentos consistentes com o resto da aplicação
- **RNF12**: Tipografia alinhada ao design system

## 4. Design e Interface

### 4.1 Estrutura do Card

```
┌─────────────────────────────┐
│  [Imagem do Produto]        │ ← Aspect square, com badge frete grátis
│  [Badge Frete Grátis]       │
│                             │
├─────────────────────────────┤
│  [Marca/Brand]              │ ← Badge pequeno, opcional
│  [Título do Produto]        │ ← 2 linhas máximo, truncado
│  [Estrelas] (123 avaliações)│ ← Sistema de avaliação
│  R$ 99,90                   │ ← Preço principal, destacado
│  em até 10x sem juros       │ ← Parcelamento
│  [Badge Estoque]            │ ← Disponibilidade
│  [Botão Favorito]           │ ← Canto superior direito
│  [Adicionar ao Carrinho]    │ ← Botão principal
└─────────────────────────────┘
```

### 4.2 Hierarquia Visual
1. **Imagem** - Elemento mais proeminente
2. **Preço** - Destaque secundário (cor primária, fonte grande)
3. **Título** - Legível mas não dominante
4. **Avaliações** - Informação de confiança
5. **Parcelamento** - Informação de valor
6. **Estoque** - Informação de disponibilidade

### 4.3 Cores e Estilos
- **Preço**: Cor primária (amarelo/dourado), fonte bold, tamanho grande
- **Parcelamento**: Texto secundário, menor
- **Frete Grátis**: Badge verde ou cor primária
- **Estoque**: Verde (disponível), Amarelo (poucas unidades), Vermelho (sem estoque)
- **Avaliações**: Estrelas amarelas/douradas

### 4.4 Espaçamentos
- Padding interno reduzido: `p-3` ou `p-4` (ao invés de `p-6`)
- Espaçamento entre elementos: `space-y-2` ou `space-y-3`
- Margem entre cards: `gap-4` ou `gap-6` (mantido)

## 5. Espaçamento na HomePage

### 5.1 Espaçamento entre Seção e Footer
- **RF24**: Adicionar espaçamento adequado entre a seção "Produtos em Destaque" e o Footer
- **RF25**: Usar padrão consistente com outras seções da aplicação
- **RF26**: Espaçamento sugerido: `py-12` ou `mb-12` na seção de produtos

## 6. Dados Necessários

### 6.1 Campos do Produto
- Preço (já existe)
- Variantes com estoque (já existe)
- Imagens (já existe)
- Marca/Brand (já existe)

### 6.2 Novos Campos (se necessário)
- **Avaliações**: 
  - `rating`: number (0-5)
  - `reviewCount`: number
- **Frete Grátis**:
  - `freeShipping`: boolean
  - Ou calcular baseado em valor mínimo
- **Estoque**:
  - Já existe em `variants.stock`
  - Pode calcular disponibilidade baseado no estoque total

## 7. Implementação Técnica

### 7.1 Componentes
- Atualizar `ProductCard.tsx`
- Criar componente `RatingStars.tsx` (opcional, pode ser inline)
- Criar função utilitária `calculateInstallment.ts`
- Criar função utilitária `getStockStatus.ts`

### 7.2 Utilitários
```typescript
// Calcular parcelamento
function calculateInstallment(price: number, maxInstallments: number = 10): string {
  // Lógica de cálculo
}

// Status do estoque
function getStockStatus(stock: number): { label: string, color: string } {
  // Lógica de status
}
```

### 7.3 Estrutura de Dados
- Avaliações podem ser mockadas inicialmente ou adicionadas ao backend depois
- Frete grátis pode ser calculado baseado em valor mínimo (ex: > R$ 100)

## 8. Critérios de Aceitação

### 8.1 Layout
- [ ] Card tem layout compacto similar ao Mercado Livre
- [ ] Todas as informações são visíveis e legíveis
- [ ] Layout responsivo funciona em todos os breakpoints

### 8.2 Funcionalidades
- [ ] Parcelamento é exibido corretamente
- [ ] Badge de frete grátis aparece quando aplicável
- [ ] Avaliações são exibidas (mesmo que mockadas)
- [ ] Status de estoque é exibido corretamente
- [ ] Favoritos e adicionar ao carrinho funcionam

### 8.3 Espaçamento
- [ ] Espaçamento adequado entre seção e footer na HomePage
- [ ] Espaçamentos consistentes com o resto da aplicação

### 8.4 Performance
- [ ] Cards carregam rapidamente
- [ ] Não há lag ao scrollar
- [ ] Imagens usam lazy loading

## 9. Riscos e Dependências

### 9.1 Riscos
- **Risco 1**: Dados de avaliação podem não estar disponíveis no backend
  - **Mitigação**: Usar dados mockados inicialmente, adicionar ao backend depois
- **Risco 2**: Cálculo de frete grátis pode precisar de lógica complexa
  - **Mitigação**: Começar com regra simples (valor mínimo), evoluir depois

### 9.2 Dependências
- Nenhuma dependência externa adicional necessária
- Componentes UI existentes são suficientes

## 10. Cronograma

### Fase 1: Estrutura Base (1-2 horas)
- Atualizar layout do card
- Ajustar espaçamentos
- Implementar estrutura básica

### Fase 2: Informações Adicionais (1-2 horas)
- Adicionar parcelamento
- Adicionar badge de frete grátis
- Adicionar status de estoque

### Fase 3: Avaliações (1 hora)
- Implementar sistema de estrelas
- Adicionar contador de avaliações
- Integrar com dados (mockados ou reais)

### Fase 4: Ajustes Finais (30 min - 1 hora)
- Ajustar espaçamento na HomePage
- Testes de responsividade
- Ajustes de UI/UX

**Total estimado**: 3-6 horas

## 11. Notas de Design

### Inspiração Mercado Livre
- Cards mais compactos
- Informações hierárquicas claras
- Badges informativos
- Preço em destaque
- Parcelamento sempre visível
- Avaliações como elemento de confiança

### Adaptações para Olive Beauty
- Manter identidade visual da marca
- Cores primárias (amarelo/dourado)
- Estilo mais premium que Mercado Livre
- Foco em produtos de beleza

## 12. Próximos Passos

1. Revisar e aprovar PRD
2. Implementar Fase 1
3. Testar layout em diferentes dispositivos
4. Implementar Fases 2 e 3
5. Ajustar espaçamento na HomePage
6. Testes finais
7. Deploy

---

**Documento criado em**: 2024
**Última atualização**: 2024
**Versão**: 1.0

