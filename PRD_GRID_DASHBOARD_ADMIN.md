# PRD: Grid Layout para Dashboard Admin

## 1. Visão Geral

### 1.1 Objetivo
Implementar um sistema de grid responsivo com largura máxima de 1200px na página de Dashboard do painel administrativo, garantindo melhor organização visual e consistência do layout.

### 1.2 Contexto
O Dashboard do admin atualmente não possui uma estrutura de grid definida, resultando em conteúdo que se estende por toda a largura disponível em telas grandes. A implementação de um grid com largura máxima de 1200px melhorará a legibilidade e a experiência do usuário.

## 2. Requisitos Funcionais

### 2.1 Grid Container
- **RF-001**: O Dashboard deve ter um container principal com largura máxima de 1200px
- **RF-002**: O container deve estar centralizado horizontalmente na página
- **RF-003**: O container deve ter padding responsivo:
  - Mobile (< 640px): 1rem (16px)
  - Tablet (≥ 640px): 1.5rem (24px)
  - Desktop (≥ 1024px): 2rem (32px)

### 2.2 Sistema de Grid
- **RF-004**: Implementar um sistema de grid CSS Grid com 12 colunas
- **RF-005**: O grid deve ser responsivo e adaptar-se a diferentes tamanhos de tela
- **RF-006**: Os cards de estatísticas devem ocupar 1 coluna em mobile, 2 colunas em tablet, e 3-4 colunas em desktop
- **RF-007**: Os gráficos devem ocupar 12 colunas em mobile/tablet e 6 colunas em desktop (2 por linha)

### 2.3 Componentes Afetados
- **RF-008**: StatCards devem ser organizados em grid responsivo
- **RF-009**: Gráficos (RevenueChart, OrdersChart, OrdersByStatusChart, SalesByCategoryChart) devem seguir o grid
- **RF-010**: TopProductsTable deve ocupar 12 colunas em todas as resoluções

## 3. Requisitos Não Funcionais

### 3.1 Performance
- **RNF-001**: O grid não deve impactar negativamente o desempenho da página
- **RNF-002**: As transições entre breakpoints devem ser suaves

### 3.3 Responsividade
- **RNF-003**: O layout deve funcionar corretamente em:
  - Mobile: 320px - 639px
  - Tablet: 640px - 1023px
  - Desktop: 1024px+
- **RNF-004**: O grid deve manter espaçamento consistente entre elementos

### 3.4 Acessibilidade
- **RNF-005**: O grid deve manter a ordem lógica de leitura para leitores de tela
- **RNF-006**: Os espaçamentos devem seguir as diretrizes de contraste e espaçamento mínimo

## 4. Especificações Técnicas

### 4.1 Estrutura do Grid
```css
.dashboard-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .dashboard-grid {
    padding: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    padding: 2rem;
  }
}
```

### 4.2 Breakpoints
- **Mobile**: < 640px (1 coluna)
- **Tablet**: 640px - 1023px (2 colunas)
- **Desktop**: ≥ 1024px (3-4 colunas)

### 4.3 Classes de Grid
- `.col-span-12`: Ocupa todas as 12 colunas
- `.col-span-6`: Ocupa 6 colunas (metade)
- `.col-span-4`: Ocupa 4 colunas (1/3)
- `.col-span-3`: Ocupa 3 colunas (1/4)

## 5. Design e Layout

### 5.1 Estrutura Visual
```
┌─────────────────────────────────────────┐
│         Header (full width)             │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │   Dashboard Grid (max 1200px)    │  │
│  │                                   │  │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │  │
│  │  │Stat │ │Stat │ │Stat │ │Stat │ │  │
│  │  └─────┘ └─────┘ └─────┘ └─────┘ │  │
│  │                                   │  │
│  │  ┌─────────────┐ ┌─────────────┐ │  │
│  │  │   Chart 1    │ │   Chart 2   │ │  │
│  │  └─────────────┘ └─────────────┘ │  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐ │  │
│  │  │        Table (full)          │ │  │
│  │  └─────────────────────────────┘ │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 5.2 Distribuição de Espaço
- **StatCards**: 3 colunas em desktop (4 cards = 12 colunas)
- **Charts**: 6 colunas cada em desktop (2 por linha)
- **Table**: 12 colunas (largura total)

## 6. Critérios de Aceitação

### 6.1 Funcionalidade
- [ ] O Dashboard possui um container com max-width de 1200px
- [ ] O container está centralizado na página
- [ ] O padding é responsivo conforme especificado
- [ ] Os StatCards são organizados em grid responsivo
- [ ] Os gráficos seguem o sistema de grid
- [ ] A tabela ocupa a largura total do grid

### 6.2 Responsividade
- [ ] Em mobile, os cards ocupam 1 coluna
- [ ] Em tablet, os cards ocupam 2 colunas
- [ ] Em desktop, os cards ocupam 3-4 colunas
- [ ] Os gráficos se adaptam corretamente aos breakpoints

### 6.3 Visual
- [ ] O espaçamento entre elementos é consistente
- [ ] O layout está alinhado e organizado
- [ ] Não há sobreposição de elementos

## 7. Implementação

### 7.1 Arquivos a Modificar
- `frontend-admin/src/features/dashboard/pages/DashboardPage.tsx`
- `frontend-admin/src/index.css` (se necessário para classes globais)

### 7.2 Estratégia de Implementação
1. Criar classe CSS para o grid container
2. Aplicar classes de grid aos componentes filhos
3. Testar em diferentes tamanhos de tela
4. Ajustar espaçamentos e alinhamentos

## 8. Riscos e Mitigações

### 8.1 Riscos
- **Risco 1**: Conflito com estilos existentes do Tailwind
  - **Mitigação**: Usar classes específicas e verificar especificidade CSS

- **Risco 2**: Quebra de layout em telas muito pequenas
  - **Mitigação**: Testar em dispositivos móveis reais e ajustar breakpoints

- **Risco 3**: Impacto na performance
  - **Mitigação**: Usar CSS Grid nativo (performático) e evitar JavaScript desnecessário

## 9. Métricas de Sucesso

- Layout consistente e organizado em todas as resoluções
- Melhoria na legibilidade do conteúdo
- Feedback positivo dos usuários sobre a organização visual
- Sem regressões visuais em outras páginas

## 10. Próximos Passos

1. Implementar o grid na DashboardPage
2. Testar em diferentes dispositivos e navegadores
3. Coletar feedback
4. Aplicar o mesmo padrão em outras páginas do admin (se necessário)

