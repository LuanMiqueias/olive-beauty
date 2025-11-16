import { useState, FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Input } from './ui/input'
import { Button } from './ui/button'

export function SearchBar() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate({
        to: '/products',
        search: { search: searchQuery.trim() },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="default" size="icon">
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </Button>
      </div>
    </form>
  )
}

