import { useEffect, useState } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { Product, Category } from '@/shared/types'
import { productsApi, ListProductsParams } from '@/api/endpoints/products'
import { categoriesApi } from '@/api/endpoints/categories'
import { ProductCard } from '@/shared/components/ProductCard'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

export function ProductsPage() {
  const search = useSearch({ from: '/products' })
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Cria os filtros diretamente da URL - sempre sincronizado
  const filters: ListProductsParams = {
    categoryId: search.categoryId as string | undefined,
    search: search.search as string | undefined,
    brand: search.brand as string | undefined,
    minPrice: search.minPrice ? Number(search.minPrice) : undefined,
    maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
    sortBy: (search.sortBy as ListProductsParams['sortBy']) || 'createdAt',
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [productsData, categoriesData] = await Promise.all([
          productsApi.getAll(filters),
          categoriesApi.getAll(),
        ])
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [filters.categoryId, filters.search, filters.brand, filters.minPrice, filters.maxPrice, filters.sortBy])

  const handleFilterChange = (key: keyof ListProductsParams, value: string | number | undefined) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    }
    
    // Atualiza a URL quando o usuário muda os filtros
    navigate({
      to: '/products',
      search: {
        categoryId: newFilters.categoryId,
        search: newFilters.search,
        brand: newFilters.brand,
        minPrice: newFilters.minPrice,
        maxPrice: newFilters.maxPrice,
        sortBy: newFilters.sortBy || 'createdAt',
      },
      replace: true,
    })
  }

  const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)))

  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={filters.categoryId || 'all'}
                  onValueChange={(value) =>
                    handleFilterChange('categoryId', value === 'all' ? undefined : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Filter */}
              {brands.length > 0 && (
                <div className="space-y-2">
                  <Label>Marca</Label>
                  <Select
                    value={filters.brand || 'all'}
                    onValueChange={(value) =>
                      handleFilterChange('brand', value === 'all' ? undefined : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as marcas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as marcas</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Preço</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) =>
                      handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) =>
                      handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                </div>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <Label>Buscar</Label>
                <Input
                  type="text"
                  placeholder="Nome ou descrição..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
                />
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  navigate({
                    to: '/products',
                    search: {
                      categoryId: undefined,
                      search: undefined,
                      brand: undefined,
                      minPrice: undefined,
                      maxPrice: undefined,
                      sortBy: 'createdAt',
                    },
                    replace: true,
                  })
                }}
              >
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="flex-1 space-y-6">
          {/* Sort */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              {filters.categoryId
                ? categories.find((c) => c.id === filters.categoryId)?.name || 'Produtos'
                : 'Todos os Produtos'}
            </h1>
            <Select
              value={filters.sortBy || 'createdAt'}
              onValueChange={(value) =>
                handleFilterChange('sortBy', value as ListProductsParams['sortBy'])
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Mais recentes</SelectItem>
                <SelectItem value="price_asc">Preço: menor para maior</SelectItem>
                <SelectItem value="price_desc">Preço: maior para menor</SelectItem>
                <SelectItem value="name">Nome (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-6 bg-muted rounded w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">
                Nenhum produto encontrado com os filtros selecionados.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  navigate({
                    to: '/products',
                    search: {
                      categoryId: undefined,
                      search: undefined,
                      brand: undefined,
                      minPrice: undefined,
                      maxPrice: undefined,
                      sortBy: 'createdAt',
                    },
                    replace: true,
                  })
                }}
              >
                Limpar Filtros
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

