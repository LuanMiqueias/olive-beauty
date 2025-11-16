import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop fixed, Mobile drawer */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="w-full">
          <div className="container mx-auto p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

