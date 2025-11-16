import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { cn } from '@/shared/lib/utils'
import { useSidebarStore } from '@/shared/stores'

interface NavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
  isPlaceholder?: boolean
}

// Lista de rotas existentes
const existingRoutes = ['/dashboard', '/categories', '/products', '/orders']

export function NavItem({ href, icon, children, onClick, isPlaceholder }: NavItemProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { closeMobile } = useSidebarStore()
  const isActive = location.pathname === href || location.pathname.startsWith(href + '/')
  const isExistingRoute = existingRoutes.includes(href)

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick()
    }
    
    // Close mobile sidebar when navigating
    closeMobile()
    
    // Se for placeholder, não faz nada (ou pode mostrar toast)
    if (isPlaceholder) {
      e.preventDefault()
      return
    }
    
    // Se não for rota existente e não for placeholder, redireciona para dashboard
    if (!isExistingRoute) {
      e.preventDefault()
      navigate({ to: '/dashboard' })
    }
  }

  if (isExistingRoute) {
    return (
      <Link
        to={href}
        onClick={handleClick}
        className={cn(
          'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
          'text-[hsl(var(--sidebar-text))] hover:text-white',
          isActive
            ? 'bg-[hsl(var(--sidebar-active))] text-white shadow-sm'
            : 'hover:bg-[hsl(var(--sidebar-hover))]'
        )}
      >
        <span className="flex-shrink-0">{icon}</span>
        <span>{children}</span>
      </Link>
    )
  }

  // Placeholder - não é link clicável ou redireciona
  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer',
        'text-[hsl(var(--sidebar-text-muted))] hover:text-[hsl(var(--sidebar-text))] hover:bg-[hsl(var(--sidebar-hover))]'
      )}
      title="Em breve"
    >
      <span className="flex-shrink-0 opacity-60">{icon}</span>
      <span>{children}</span>
    </div>
  )
}

