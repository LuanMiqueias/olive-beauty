# PRD: Página de Detalhes do Produto - Estilo Mercado Livre

## 1. Visão Geral

### Objetivo
Criar uma página de detalhes do produto completa e funcional, seguindo o padrão visual do Mercado Livre, com layout otimizado para conversão e experiência do usuário aprimorada.

### Contexto
A página atual de detalhes do produto existe mas não está abrindo corretamente. Este PRD define a implementação de uma página robusta que:
- Mantém toda funcionalidade existente
- Usa dados estáticos no frontend (mockados) para desenvolvimento
- Segue padrão visual do Mercado Livre
- Não requer mudanças no backend

### Escopo
- **Frontend**: Apenas frontend-ecommerce (clientes)
- **Backend**: Nenhuma alteração necessária
- **Dados**: Estáticos/mockados no frontend
- **Referência Visual**: Mercado Livre

## 2. Requisitos Funcionais

### 2.1 Estrutura da Página

#### RF01: Layout Principal
- **RF01.1**: Layout em duas colunas (desktop) / uma coluna (mobile)
- **RF01.2**: Coluna esquerda: Galeria de imagens (60% largura desktop)
- **RF01.3**: Coluna direita: Informações do produto e ações (40% largura desktop)
- **RF01.4**: Seção inferior: Descrição detalhada, especificações, produtos relacionados

#### RF02: Galeria de Imagens
- **RF02.1**: Imagem principal grande (aspect-square ou aspect-[4/3])
- **RF02.2**: Miniaturas abaixo da imagem principal (grid horizontal)
- **RF02.3**: Navegação entre imagens (setas ou clique nas miniaturas)
- **RF02.4**: Zoom na imagem principal ao passar o mouse (hover zoom)
- **RF02.5**: Badge "Frete Grátis" sobreposto na imagem (se aplicável)
- **RF02.6**: Indicador de quantidade de imagens (ex: "1/5")

#### RF03: Informações do Produto
- **RF03.1**: Breadcrumb (Home > Categoria > Produto)
- **RF03.2**: Condição do produto (Novo / Usado) - estático "Novo"
- **RF03.3**: Título do produto (H1, grande e destacado)
- **RF03.4**: Avaliações e estrelas (dados estáticos: 4.5 estrelas, 123 avaliações)
- **RF03.5**: Preço principal (grande, cor primária, bold)
- **RF03.6**: Preço parcelado ("em até 10x de R$ X,XX sem juros")
- **RF03.7**: Badge de desconto (se houver diferença entre basePrice e variant price)
- **RF03.8**: Informação de estoque ("X unidades disponíveis" ou "Últimas unidades")

#### RF04: Seleção de Variantes
- **RF04.1**: Exibir variantes disponíveis como botões/seletores
- **RF04.2**: Mostrar atributos da variante (cor, tamanho, etc.)
- **RF04.3**: Destacar variante selecionada
- **RF04.4**: Desabilitar variantes sem estoque
- **RF04.5**: Atualizar preço ao selecionar variante
- **RF04.6**: Atualizar estoque disponível ao selecionar variante

#### RF05: Quantidade e Ações
- **RF05.1**: Seletor de quantidade (botões - e +)
- **RF05.2**: Limitar quantidade máxima ao estoque disponível
- **RF05.3**: Botão "Comprar agora" (destaque primário)
- **RF05.4**: Botão "Adicionar ao carrinho" (secundário)
- **RF05.5**: Botão de favoritos (coração, toggle)
- **RF05.6**: Compartilhar produto (opcional, pode ser mockado)

#### RF06: Informações Adicionais
- **RF06.1**: Seção "Características do produto" (tabela de especificações)
- **RF06.2**: Descrição completa do produto (formatação rica)
- **RF06.3**: Informações de frete (calculadora estática)
- **RF06.4**: Informações de devolução/garantia (texto estático)
- **RF06.5**: Formas de pagamento aceitas (ícones estáticos)

#### RF07: Produtos Relacionados
- **RF07.1**: Seção "Quem viu este produto também viu"
- **RF07.2**: Grid de produtos relacionados (mesma categoria)
- **RF07.3**: Limitar a 4-6 produtos relacionados
- **RF07.4**: Usar componente ProductCard existente

### 2.2 Funcionalidades Interativas

#### RF08: Estados e Feedback
- **RF08.1**: Loading state durante carregamento
- **RF08.2**: Error state se produto não encontrado
- **RF08.3**: Feedback visual ao adicionar ao carrinho
- **RF08.4**: Feedback visual ao favoritar
- **RF08.5**: Desabilitar ações quando sem estoque

#### RF09: Responsividade
- **RF09.1**: Layout mobile-first
- **RF09.2**: Galeria de imagens em carrossel no mobile
- **RF09.3**: Informações empilhadas verticalmente no mobile
- **RF09.4**: Botões full-width no mobile
- **RF09.5**: Navegação touch-friendly

## 3. Requisitos Não Funcionais

### 3.1 Performance
- **RNF01**: Carregamento inicial < 2s
- **RNF02**: Lazy loading de imagens
- **RNF03**: Otimização de imagens (formato WebP quando possível)
- **RNF04**: Code splitting da página

### 3.2 Acessibilidade
- **RNF05**: Navegação por teclado funcional
- **RNF06**: ARIA labels em elementos interativos
- **RNF07**: Contraste adequado (WCAG AA)
- **RNF08**: Textos alternativos em imagens

### 3.3 SEO
- **RNF09**: Meta tags dinâmicas (title, description)
- **RNF10**: Structured data (JSON-LD) para produto
- **RNF11**: URLs amigáveis (/products/nome-do-produto)

### 3.4 UX/UI
- **RNF12**: Animações suaves em transições
- **RNF13**: Feedback visual imediato em ações
- **RNF14**: Consistência com design system existente
- **RNF15**: Cores seguindo identidade visual (amarelo/dourado)

## 4. Design e Interface

### 4.1 Layout Estruturado

```
┌─────────────────────────────────────────────────────────────┐
│ [Breadcrumb: Home > Categoria > Produto]                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐  ┌─────────────────────────────┐ │
│  │                      │  │ [Novo]                      │ │
│  │                      │  │ Título do Produto           │ │
│  │   GALERIA DE         │  │ ⭐⭐⭐⭐⭐ (123)              │ │
│  │   IMAGENS            │  │                             │ │
│  │                      │  │ R$ 99,90                    │ │
│  │   [Imagem Principal] │  │ em até 10x sem juros        │ │
│  │                      │  │                             │ │
│  │ [Miniaturas]        │  │ [Variantes]                 │ │
│  │                      │  │ [Cor] [Tamanho]            │ │
│  │                      │  │                             │ │
│  │                      │  │ Quantidade: [-] 1 [+]       │ │
│  │                      │  │                             │ │
│  │                      │  │ [Comprar Agora]            │ │
│  │                      │  │ [Adicionar ao Carrinho]    │ │
│  │                      │  │ [❤ Favoritar]              │ │
│  └──────────────────────┘  └─────────────────────────────┘ │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│ CARACTERÍSTICAS DO PRODUTO                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Marca:           | Olive Beauty                         │ │
│ │ Categoria:       | Maquiagem                            │ │
│ │ Tipo:            | Base Líquida                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
│ DESCRIÇÃO                                                     │
│ [Texto formatado da descrição do produto]                    │
│                                                               │
│ PRODUTOS RELACIONADOS                                        │
│ [Grid de 4 produtos]                                          │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Hierarquia Visual

1. **Imagem Principal** - Elemento mais proeminente
2. **Preço** - Destaque secundário (cor primária, fonte grande)
3. **Título** - Legível e destacado
4. **Avaliações** - Elemento de confiança
5. **Variantes** - Fácil seleção
6. **Ações** - Botões claros e acessíveis

### 4.3 Cores e Estilos (Mercado Livre)

- **Preço Principal**: Cor primária (amarelo/dourado), fonte bold, tamanho grande (text-4xl)
- **Preço Parcelado**: Texto secundário, menor (text-sm)
- **Botão Comprar**: Cor primária sólida, grande, bold
- **Botão Carrinho**: Outline, secundário
- **Badge Frete Grátis**: Verde (#00a650) ou cor primária
- **Avaliações**: Estrelas amarelas/douradas
- **Estoque Baixo**: Badge amarelo/laranja
- **Sem Estoque**: Badge vermelho, botões desabilitados

### 4.4 Componentes Necessários

- `ProductImageGallery` - Galeria com zoom
- `ProductInfo` - Informações principais
- `VariantSelector` - Seletor de variantes
- `QuantitySelector` - Seletor de quantidade
- `ProductActions` - Botões de ação
- `ProductSpecifications` - Tabela de especificações
- `RelatedProducts` - Produtos relacionados

## 5. Dados Estáticos (Mock)

### 5.1 Dados do Produto (Mock)

```typescript
const mockProductData = {
  // Dados reais da API quando disponível
  // Dados mockados para desenvolvimento:
  rating: 4.5,
  reviewCount: 123,
  freeShipping: true,
  condition: 'Novo',
  warranty: 'Garantia de 90 dias',
  returnPolicy: 'Devolução grátis em até 7 dias',
  paymentMethods: ['Cartão de Crédito', 'PIX', 'Boleto'],
  shippingInfo: {
    estimatedDays: '5 a 7 dias úteis',
    freeShippingThreshold: 100,
  },
  specifications: {
    marca: 'Olive Beauty',
    categoria: 'Maquiagem',
    tipo: 'Base Líquida',
    volume: '30ml',
    cor: 'Bege Claro',
  },
}
```

### 5.2 Funções Utilitárias Estáticas

```typescript
// Calcular parcelamento
function calculateInstallment(price: number, installments: number = 10): string {
  const installmentValue = price / installments
  return `em até ${installments}x de R$ ${installmentValue.toFixed(2).replace('.', ',')} sem juros`
}

// Status do estoque
function getStockStatus(stock: number): { label: string; color: string } {
  if (stock === 0) return { label: 'Sem estoque', color: 'destructive' }
  if (stock < 5) return { label: 'Últimas unidades', color: 'orange' }
  return { label: `${stock} unidades disponíveis`, color: 'success' }
}

// Verificar frete grátis
function hasFreeShipping(price: number, threshold: number = 100): boolean {
  return price >= threshold
}
```

## 6. Estrutura de Arquivos

### 6.1 Frontend

```
frontend-ecommerce/src/
├── features/
│   └── products/
│       ├── pages/
│       │   └── ProductDetailPage.tsx (atualizar)
│       └── components/
│           ├── ProductImageGallery.tsx (novo)
│           ├── ProductInfo.tsx (novo)
│           ├── VariantSelector.tsx (novo)
│           ├── QuantitySelector.tsx (novo)
│           ├── ProductActions.tsx (novo)
│           ├── ProductSpecifications.tsx (novo)
│           └── RelatedProducts.tsx (novo)
├── shared/
│   └── utils/
│       ├── productUtils.ts (novo - funções estáticas)
│       └── formatters.ts (novo - formatação de preços, etc)
└── routes/
    └── products.$productId.tsx (verificar/corrigir)
```

## 7. Implementação Técnica

### 7.1 Correção da Rota

**Problema Identificado**: A rota pode não estar funcionando corretamente.

**Possíveis Causas e Soluções**:

1. **Rota não está sendo gerada corretamente**
   - Executar: `pnpm exec tsr generate` ou `npm run build` para regenerar routeTree.gen.ts
   - Verificar se o arquivo `products.$productId.tsx` está na pasta correta (`routes/`)

2. **Erro no console do navegador**
   - Verificar erros de importação
   - Verificar se o componente ProductDetailPage está exportado corretamente
   - Verificar se há erros de TypeScript

3. **Navegação incorreta**
   - Usar: `<Link to="/products/$productId" params={{ productId: "123" }}>`
   - Ou: `navigate({ to: '/products/$productId', params: { productId: '123' } })`

4. **Rota pai interferindo**
   - No TanStack Router, `/products` e `/products/$productId` são rotas mutuamente exclusivas
   - Não é necessário `<Outlet />` na rota pai
   - Verificar se não há redirecionamento ou lógica que impeça a rota filha

5. **Verificação manual**
   - Acessar diretamente: `http://localhost:5173/products/[id-do-produto]`
   - Verificar se o routeTree.gen.ts tem a rota registrada
   - Verificar se o componente está sendo importado corretamente

### 7.2 Componentes Principais

#### ProductImageGallery
- Carrossel de imagens
- Zoom ao hover
- Navegação por miniaturas
- Indicador de quantidade

#### ProductInfo
- Breadcrumb
- Título e marca
- Avaliações (estáticas)
- Preço e parcelamento
- Informações de estoque

#### VariantSelector
- Renderizar variantes como botões
- Atualizar estado ao selecionar
- Desabilitar sem estoque
- Mostrar atributos formatados

#### ProductActions
- Seletor de quantidade
- Botões de ação
- Feedback visual
- Estados de loading

### 7.3 Integração com Stores Existentes

- `useCartStore` - Adicionar ao carrinho
- `useFavoritesStore` - Favoritar produto
- `productsApi.getById` - Buscar produto (quando backend disponível)

### 7.4 Fallback para Dados Estáticos

```typescript
// Usar dados mockados se API falhar ou durante desenvolvimento
const useProductData = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Tentar buscar da API
        const data = await productsApi.getById(productId)
        setProduct(data)
      } catch (error) {
        // Fallback para dados mockados
        console.warn('API não disponível, usando dados mockados')
        setProduct(mockProductData)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  return { product, isLoading }
}
```

## 8. Critérios de Aceitação

### 8.1 Funcionalidade
- [ ] Página carrega e exibe produto corretamente
- [ ] Galeria de imagens funciona (navegação, zoom)
- [ ] Variantes podem ser selecionadas
- [ ] Preço atualiza ao selecionar variante
- [ ] Quantidade pode ser ajustada
- [ ] Adicionar ao carrinho funciona
- [ ] Favoritar funciona
- [ ] Produtos relacionados são exibidos

### 8.2 Visual
- [ ] Layout segue padrão Mercado Livre
- [ ] Cores e tipografia consistentes
- [ ] Responsivo em mobile, tablet e desktop
- [ ] Animações suaves
- [ ] Estados visuais claros (loading, error, success)

### 8.3 Dados Estáticos
- [ ] Avaliações exibidas (mockadas)
- [ ] Parcelamento calculado corretamente
- [ ] Frete grátis exibido quando aplicável
- [ ] Especificações exibidas em tabela
- [ ] Informações de garantia/devolução exibidas

### 8.4 Performance
- [ ] Carregamento rápido (< 2s)
- [ ] Imagens otimizadas
- [ ] Sem lag ao interagir
- [ ] Lazy loading funcionando

## 9. Riscos e Dependências

### 9.1 Riscos

**Risco 1**: Rota não está funcionando
- **Mitigação**: Investigar e corrigir configuração do TanStack Router
- **Ação**: Verificar routeTree.gen.ts e configuração de rotas

**Risco 2**: Dados da API podem não estar disponíveis
- **Mitigação**: Usar dados mockados como fallback
- **Ação**: Implementar sistema de fallback robusto

**Risco 3**: Performance com muitas imagens
- **Mitigação**: Lazy loading e otimização de imagens
- **Ação**: Implementar carregamento progressivo

### 9.2 Dependências

- TanStack Router (já instalado)
- Componentes UI existentes (Shadcn/ui)
- Stores existentes (Zustand)
- API client existente

## 10. Cronograma de Implementação

### Fase 1: Correção e Estrutura Base (2-3 horas)
- [ ] Investigar e corrigir problema da rota
- [ ] Criar estrutura básica da página
- [ ] Implementar layout responsivo
- [ ] Integrar com API (com fallback mockado)

### Fase 2: Componentes Principais (3-4 horas)
- [ ] ProductImageGallery com zoom
- [ ] ProductInfo com todas informações
- [ ] VariantSelector funcional
- [ ] QuantitySelector e ProductActions

### Fase 3: Seções Adicionais (2-3 horas)
- [ ] ProductSpecifications (tabela)
- [ ] Descrição formatada
- [ ] Informações de frete/garantia
- [ ] RelatedProducts

### Fase 4: Dados Estáticos e Polimento (2-3 horas)
- [ ] Implementar dados mockados
- [ ] Funções utilitárias estáticas
- [ ] Ajustes visuais (cores, espaçamentos)
- [ ] Animações e transições
- [ ] Testes de responsividade

### Fase 5: Testes e Ajustes Finais (1-2 horas)
- [ ] Testar todas funcionalidades
- [ ] Ajustar detalhes de UX
- [ ] Verificar acessibilidade
- [ ] Otimizar performance

**Total Estimado**: 10-15 horas

## 11. Referências Visuais

### Mercado Livre - Elementos Principais

1. **Galeria de Imagens**
   - Imagem principal grande
   - Miniaturas horizontais abaixo
   - Zoom ao hover
   - Navegação fluida

2. **Informações do Produto**
   - Condição destacada (badge)
   - Título grande e claro
   - Avaliações visíveis
   - Preço em destaque
   - Parcelamento sempre visível

3. **Variantes**
   - Botões visuais (cores, tamanhos)
   - Seleção clara
   - Preço atualizado dinamicamente

4. **Ações**
   - Botão "Comprar" grande e destacado
   - Botão "Adicionar ao carrinho" secundário
   - Favoritos acessível

5. **Especificações**
   - Tabela organizada
   - Informações claras
   - Fácil de escanear

## 12. Notas de Implementação

### 12.1 Dados Estáticos Temporários

Durante o desenvolvimento, usar dados mockados para:
- Avaliações (4.5 estrelas, 123 avaliações)
- Frete grátis (calcular baseado em preço > R$ 100)
- Especificações (extrair do produto ou mockar)
- Informações de garantia (texto estático)

### 12.2 Integração Futura

Quando o backend estiver disponível:
- Substituir dados mockados por chamadas de API
- Manter fallback para casos de erro
- Adicionar cache para melhor performance

### 12.3 Melhorias Futuras (Fora do Escopo)

- Sistema de avaliações real
- Galeria de vídeos
- Comparação de produtos
- Compartilhamento social
- Histórico de visualizações

## 13. Checklist de Implementação

### Setup
- [ ] Verificar/corrigir rota do TanStack Router
- [ ] Criar estrutura de pastas
- [ ] Configurar dados mockados

### Componentes Core
- [ ] ProductImageGallery
- [ ] ProductInfo
- [ ] VariantSelector
- [ ] QuantitySelector
- [ ] ProductActions

### Componentes Secundários
- [ ] ProductSpecifications
- [ ] RelatedProducts
- [ ] Breadcrumb
- [ ] Loading/Error states

### Utilitários
- [ ] Funções de formatação
- [ ] Cálculo de parcelamento
- [ ] Status de estoque
- [ ] Verificação de frete grátis

### Integração
- [ ] Integrar com cartStore
- [ ] Integrar com favoritesStore
- [ ] Integrar com productsApi
- [ ] Fallback para dados mockados

### Polimento
- [ ] Responsividade completa
- [ ] Animações suaves
- [ ] Estados visuais
- [ ] Acessibilidade
- [ ] Performance

---

**Documento criado em**: 2024
**Última atualização**: 2024
**Versão**: 1.0
**Status**: Pronto para implementação

