import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Header } from '@/shared/components/Header'
import { Footer } from '@/shared/components/Footer'
import { CategoryNavigation } from '@/shared/components/CategoryNavigation'
import { ToastProvider } from '@/shared/components/ToastProvider'

function RootComponent() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <CategoryNavigation />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})

