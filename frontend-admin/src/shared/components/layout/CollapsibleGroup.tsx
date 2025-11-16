import { useEffect } from 'react'
import { cn } from '@/shared/lib/utils'
import { useSidebarStore } from '@/shared/stores'

interface CollapsibleGroupProps {
  title: string
  icon?: React.ReactNode
  defaultOpen?: boolean
  groupId?: string
  children: React.ReactNode
}

export function CollapsibleGroup({ title, icon, defaultOpen = false, groupId, children }: CollapsibleGroupProps) {
  const groupKey = groupId || title.toLowerCase().replace(/\s+/g, '-')
  const { collapsedGroups, toggleGroup } = useSidebarStore()
  
  // If state is not set, use defaultOpen; otherwise use stored state (inverted because collapsedGroups stores collapsed state)
  const isCollapsed = collapsedGroups[groupKey] ?? !defaultOpen
  const isOpen = !isCollapsed

  useEffect(() => {
    // Initialize group state if not set
    if (collapsedGroups[groupKey] === undefined) {
      useSidebarStore.getState().setGroupCollapsed(groupKey, !defaultOpen)
    }
  }, [groupKey, defaultOpen])

  const handleToggle = () => {
    toggleGroup(groupKey)
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleToggle}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors',
          'text-[hsl(var(--sidebar-text-muted))] hover:text-[hsl(var(--sidebar-text))] hover:bg-[hsl(var(--sidebar-hover))]'
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{title}</span>
        </div>
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
          className={cn(
            'transition-transform duration-200',
            isOpen ? 'rotate-180' : ''
          )}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200 ease-in-out',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        {isOpen && (
          <div className="ml-6 space-y-1 pl-3 border-l border-[hsl(var(--sidebar-border))] pt-1">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

