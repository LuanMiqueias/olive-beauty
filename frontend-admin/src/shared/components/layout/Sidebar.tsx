import { useState, useEffect } from 'react'
import { useAuthStore, useSidebarStore } from '@/shared/stores'
import { LogoutModal } from '@/features/auth/components/LogoutModal'
import { NavItem } from './NavItem'
import { CollapsibleGroup } from './CollapsibleGroup'
import { SidebarHeader } from './SidebarHeader'
import { SidebarFooter } from './SidebarFooter'
import { cn } from '@/shared/lib/utils'

export function Sidebar() {
  const { isMobileOpen, closeMobile } = useSidebarStore()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = () => {
    useAuthStore.getState().logout()
    window.location.href = '/login'
  }

  // Close mobile sidebar when clicking outside or on route change
  useEffect(() => {
    if (isMobileOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (!target.closest('.sidebar-container') && !target.closest('.mobile-menu-button')) {
          closeMobile()
        }
      }
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden'
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.body.style.overflow = ''
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen, closeMobile])

  const sidebarContent = (
    <div className="flex flex-col flex-grow bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))]">
      {/* Header */}
      <SidebarHeader />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          <NavItem
            href="/dashboard"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
            }
          >
            Dashboard
          </NavItem>
          <NavItem
            href="/categories"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 9h16" />
                <path d="M4 15h16" />
                <path d="M10 3v6" />
                <path d="M14 3v6" />
                <path d="M10 18v-6" />
                <path d="M14 18v-6" />
              </svg>
            }
          >
            Categorias
          </NavItem>
          <NavItem
            href="/products"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            }
          >
            Produtos
          </NavItem>
          <NavItem
            href="/orders"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            }
          >
            Pedidos
          </NavItem>
        </div>

        {/* UI Components - Collapsible Group */}
        <CollapsibleGroup
          title="UI Components"
          groupId="ui-components"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <line x1="9" x2="15" y1="3" y2="3" />
              <line x1="9" x2="15" y1="21" y2="21" />
              <line x1="3" x2="3" y1="9" y2="15" />
              <line x1="21" x2="21" y1="9" y2="15" />
            </svg>
          }
        >
          <NavItem
            href="/ui/overview"
            isPlaceholder
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            }
          >
            Overview
          </NavItem>
          <NavItem
            href="/ui/forms"
            isPlaceholder
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 9h6" />
                <path d="M9 15h6" />
              </svg>
            }
          >
            Forms & Inputs
          </NavItem>
          <NavItem
            href="/ui/data-display"
            isPlaceholder
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="M7 16l4-4 4 4 6-6" />
              </svg>
            }
          >
            Data Display
          </NavItem>
        </CollapsibleGroup>

        {/* Analytics */}
        <NavItem
          href="/analytics"
          isPlaceholder
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          }
        >
          Analytics
        </NavItem>

        {/* Account Section */}
        <div className="space-y-1">
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-[hsl(var(--sidebar-text-muted))] uppercase tracking-wider">
              Account
            </p>
          </div>
          <NavItem
            href="/profile"
            isPlaceholder
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          >
            Profile
          </NavItem>
          <NavItem
            href="/settings"
            isPlaceholder
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
          >
            Settings
          </NavItem>
        </div>

        {/* Authentication Section */}
        <div className="space-y-1">
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-[hsl(var(--sidebar-text-muted))] uppercase tracking-wider">
              Authentication
            </p>
          </div>
          <NavItem
            href="/auth/signin"
            isPlaceholder
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" x2="3" y1="12" y2="12" />
              </svg>
            }
          >
            Signin
          </NavItem>
          <NavItem
            href="/auth/signup"
            isPlaceholder
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" x2="19" y1="8" y2="14" />
                <line x1="22" x2="16" y1="11" y2="11" />
              </svg>
            }
          >
            Signup
          </NavItem>
          <NavItem
            href="/auth/reset"
            isPlaceholder
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
            }
          >
            Reset Password
          </NavItem>
        </div>
      </nav>

      {/* Footer */}
      <SidebarFooter />
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50 sidebar-container">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-50 transition-opacity duration-300',
          isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={closeMobile}
          aria-hidden="true"
        />
        
        {/* Drawer */}
        <aside
          className={cn(
            'sidebar-container absolute left-0 top-0 h-full w-64 flex flex-col transform transition-transform duration-300 ease-in-out',
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {sidebarContent}
        </aside>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogout}
      />
    </>
  )
}

