import { Link } from '@tanstack/react-router'

export function SidebarHeader() {
  return (
    <div className="flex items-center h-16 px-6 border-b border-[hsl(var(--sidebar-border))]">
      <Link to="/dashboard" className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded bg-[hsl(var(--sidebar-active))] flex items-center justify-center">
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
            className="text-white"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <span className="text-lg font-semibold text-[hsl(var(--sidebar-text))]">Olive Beauty</span>
      </Link>
    </div>
  )
}

