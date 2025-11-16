import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Category } from '@/shared/types'
import { categoriesApi } from '@/api/endpoints/categories'

export function CategoryNavigation() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll()
        setCategories(data)
      } catch (error) {
        console.error('Erro ao buscar categorias:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <nav className="border-b bg-background">
        <div className="container">
          <div className="flex items-center space-x-6 h-12">
            <p className="text-sm text-muted-foreground">Carregando categorias...</p>
          </div>
        </div>
      </nav>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <nav className="border-b bg-background sticky top-16 z-40">
      <div className="container">
        <div className="flex items-center space-x-6 h-12 overflow-x-auto">
          <Link
            to="/products"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
          >
            Todos os Produtos
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/products"
              search={{ categoryId: category.id }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

