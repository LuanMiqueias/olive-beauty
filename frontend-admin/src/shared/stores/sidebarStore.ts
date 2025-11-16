import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
  isMobileOpen: boolean
  collapsedGroups: Record<string, boolean>
  toggleMobile: () => void
  closeMobile: () => void
  toggleGroup: (groupId: string) => void
  setGroupCollapsed: (groupId: string, collapsed: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isMobileOpen: false,
      collapsedGroups: {},

      toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),

      closeMobile: () => set({ isMobileOpen: false }),

      toggleGroup: (groupId: string) =>
        set((state) => ({
          collapsedGroups: {
            ...state.collapsedGroups,
            [groupId]: !state.collapsedGroups[groupId],
          },
        })),

      setGroupCollapsed: (groupId: string, collapsed: boolean) =>
        set((state) => ({
          collapsedGroups: {
            ...state.collapsedGroups,
            [groupId]: collapsed,
          },
        })),
    }),
    {
      name: 'sidebar-storage',
      partialize: (state) => ({
        collapsedGroups: state.collapsedGroups,
      }),
    }
  )
)

