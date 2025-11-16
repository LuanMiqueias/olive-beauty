# PRD: Menu Lateral (Sidebar) para Admin - Design Moderno

## 1. Visão Geral

### 1.1 Objetivo
Redesenhar o menu lateral (sidebar) do painel administrativo seguindo um design moderno inspirado em dashboards profissionais, com grupos colapsáveis, seções organizadas e tema escuro com cores primárias verdes (#518E2C).

### 1.2 Contexto
O sidebar atual é funcional mas precisa de melhorias visuais e organizacionais. O novo design deve seguir o padrão de dashboards modernos com:
- Tema escuro com fundo roxo/escuro
- Grupos de navegação colapsáveis
- Seções organizadas (Main Navigation, Account, Authentication)
- Indicadores visuais claros de página ativa
- Largura fixa no desktop

## 2. Requisitos Funcionais

### 2.1 Estrutura de Navegação
- **RF-001**: Sidebar deve conter as seguintes seções:
  - **Logo/Branding** no topo
  - **Main Navigation** (grupo principal):
    - Dashboard (link ativo destacado)
    - Categorias
    - Produtos
    - Pedidos
  - **UI Components** (grupo colapsável - placeholder):
    - Overview
    - Forms & Inputs
    - Data Display
  - **Analytics** (link simples - placeholder)
  - **Account** (seção):
    - Profile (placeholder)
    - Settings (placeholder)
  - **Authentication** (seção):
    - Signin (placeholder)
    - Signup (placeholder)
    - Reset Password (placeholder)
  - **Footer** com versão do template

### 2.2 Grupos Colapsáveis
- **RF-002**: Grupos como "UI Components" devem ser colapsáveis
- **RF-003**: Estado de expansão/colapso deve ser persistido durante a sessão
- **RF-004**: Ícone de seta deve indicar estado (expandido/colapsado)
- **RF-005**: Transição suave ao expandir/colapsar

### 2.3 Indicadores Visuais
- **RF-006**: Página ativa deve ter destaque visual (cor primária verde #518E2C)
- **RF-007**: Hover deve ter feedback visual claro
- **RF-008**: Ícones devem estar presentes em todos os itens de navegação

### 2.4 Responsividade
- **RF-009**: No desktop (≥1024px): sidebar fixo com largura fixa de 256px (w-64)
- **RF-010**: No mobile (<1024px): sidebar deve ser um drawer que abre/fecha
- **RF-011**: Botão hamburger no header para abrir/fechar drawer no mobile

## 3. Requisitos Não Funcionais

### 3.1 Design e UX
- **RNF-001**: Tema escuro com fundo escuro (roxo/escuro) para contraste
- **RNF-002**: Cores primárias baseadas em #518E2C (verde) e variações relacionadas
- **RNF-003**: Tipografia clara e legível
- **RNF-004**: Espaçamento consistente entre elementos
- **RNF-005**: Animações suaves para transições

### 3.2 Performance
- **RNF-006**: Sidebar não deve impactar performance da aplicação
- **RNF-007**: Transições devem ser performáticas (usar CSS transforms)

### 3.3 Acessibilidade
- **RNF-008**: Navegação por teclado deve funcionar
- **RNF-009**: Contraste adequado para leitura
- **RNF-010**: Labels descritivos para leitores de tela

## 4. Especificações Técnicas

### 4.1 Cores e Tema
```css
/* Cores primárias baseadas em #518E2C */
--primary: 95 60% 35%; /* #518E2C */
--primary-foreground: 0 0% 100%;
--sidebar-bg: 240 20% 10%; /* Fundo escuro roxo */
--sidebar-hover: 240 20% 15%;
--sidebar-active: 95 60% 35%; /* Verde primário */
--sidebar-text: 240 10% 85%;
--sidebar-text-muted: 240 10% 60%;
```

### 4.2 Estrutura HTML
```tsx
<aside className="sidebar">
  {/* Logo */}
  <div className="sidebar-header">
    <Logo />
  </div>
  
  {/* Navigation */}
  <nav className="sidebar-nav">
    {/* Main Navigation Group */}
    <div className="nav-group">
      <NavItem href="/dashboard" active />
      <NavItem href="/categories" />
      <NavItem href="/products" />
      <NavItem href="/orders" />
    </div>
    
    {/* Collapsible Group */}
    <CollapsibleGroup title="UI Components">
      <NavItem href="/ui/overview" />
      <NavItem href="/ui/forms" />
      <NavItem href="/ui/data-display" />
    </CollapsibleGroup>
    
    {/* Simple Link */}
    <NavItem href="/analytics" />
    
    {/* Account Section */}
    <div className="nav-section">
      <NavItem href="/profile" />
      <NavItem href="/settings" />
    </div>
    
    {/* Authentication Section */}
    <div className="nav-section">
      <NavItem href="/auth/signin" />
      <NavItem href="/auth/signup" />
      <NavItem href="/auth/reset" />
    </div>
  </nav>
  
  {/* Footer */}
  <div className="sidebar-footer">
    <p>Dashboard Template v1.0.0 2025</p>
  </div>
</aside>
```

### 4.3 Largura e Posicionamento
- **Desktop**: `w-64` (256px) fixo, posição `fixed`, `left-0`, `top-0`, `h-screen`
- **Mobile**: Drawer com largura `w-64`, posição `fixed`, `left-0`, `top-0`, `h-screen`, `z-50`
- **Overlay**: No mobile, overlay escuro quando drawer está aberto

### 4.4 Componentes Necessários
- `Sidebar.tsx` - Componente principal
- `NavItem.tsx` - Item de navegação individual
- `CollapsibleGroup.tsx` - Grupo colapsável
- `SidebarHeader.tsx` - Cabeçalho com logo
- `SidebarFooter.tsx` - Rodapé com versão

## 5. Design e Layout

### 5.1 Estrutura Visual
```
┌─────────────────────┐
│   Logo/Branding     │ ← Header (h-16)
├─────────────────────┤
│                     │
│  Main Navigation    │
│  • Dashboard (✓)    │ ← Ativo destacado
│  • Categorias       │
│  • Produtos         │
│  • Pedidos          │
│                     │
│  ▼ UI Components    │ ← Colapsável
│    • Overview       │
│    • Forms & Inputs │
│    • Data Display   │
│                     │
│  • Analytics        │
│                     │
│  Account            │ ← Seção
│  • Profile          │
│  • Settings          │
│                     │
│  Authentication     │ ← Seção
│  • Signin           │
│  • Signup           │
│  • Reset Password   │
│                     │
├─────────────────────┤
│  v1.0.0 2025        │ ← Footer
└─────────────────────┘
```

### 5.2 Estados Visuais
- **Normal**: Texto cinza claro, fundo transparente
- **Hover**: Fundo ligeiramente mais claro, texto branco
- **Active**: Fundo verde (#518E2C), texto branco, possível indicador lateral
- **Collapsed**: Ícone de seta para direita
- **Expanded**: Ícone de seta para baixo

## 6. Critérios de Aceitação

### 6.1 Funcionalidade
- [ ] Sidebar exibe todas as seções especificadas
- [ ] Grupos colapsáveis funcionam corretamente
- [ ] Página ativa é destacada visualmente
- [ ] Links de navegação funcionam corretamente
- [ ] Footer exibe versão do template

### 6.2 Design
- [ ] Tema escuro aplicado corretamente
- [ ] Cores primárias verdes (#518E2C) aplicadas
- [ ] Espaçamento e tipografia consistentes
- [ ] Ícones presentes em todos os itens
- [ ] Transições suaves

### 6.3 Responsividade
- [ ] Desktop: sidebar fixo com 256px de largura
- [ ] Mobile: drawer funcional com overlay
- [ ] Botão hamburger no header funciona
- [ ] Drawer fecha ao clicar no overlay

### 6.4 Placeholders
- [ ] Links placeholder não quebram a aplicação
- [ ] Podem exibir mensagem "Em breve" ou redirecionar para dashboard

## 7. Implementação

### 7.1 Arquivos a Criar/Modificar
- `frontend-admin/src/shared/components/layout/Sidebar.tsx` (modificar)
- `frontend-admin/src/shared/components/layout/NavItem.tsx` (criar)
- `frontend-admin/src/shared/components/layout/CollapsibleGroup.tsx` (criar)
- `frontend-admin/src/shared/components/layout/SidebarHeader.tsx` (criar)
- `frontend-admin/src/shared/components/layout/SidebarFooter.tsx` (criar)
- `frontend-admin/src/index.css` (adicionar variáveis CSS)
- `frontend-admin/tailwind.config.js` (adicionar cores)

### 7.2 Estratégia de Implementação
1. Atualizar variáveis CSS com cores primárias verdes
2. Criar componentes auxiliares (NavItem, CollapsibleGroup)
3. Refatorar Sidebar.tsx com nova estrutura
4. Implementar grupos colapsáveis com estado
5. Adicionar footer com versão
6. Testar responsividade
7. Ajustar estilos finais

## 8. Riscos e Mitigações

### 8.1 Riscos
- **Risco 1**: Conflito com estilos existentes
  - **Mitigação**: Usar classes específicas e namespaces CSS

- **Risco 2**: Performance com muitos itens de navegação
  - **Mitigação**: Usar virtualização se necessário, otimizar re-renders

- **Risco 3**: Acessibilidade em grupos colapsáveis
  - **Mitigação**: Usar elementos semânticos corretos (button, aria-expanded)

## 9. Métricas de Sucesso

- Design moderno e profissional implementado
- Navegação intuitiva e clara
- Performance mantida ou melhorada
- Feedback positivo dos usuários
- Código limpo e manutenível

## 10. Próximos Passos

1. Implementar novo sidebar conforme PRD
2. Testar em diferentes dispositivos
3. Coletar feedback
4. Ajustar conforme necessário
5. Documentar componentes criados

