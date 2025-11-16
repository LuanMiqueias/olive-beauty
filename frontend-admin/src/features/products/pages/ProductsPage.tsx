import { useState, useEffect } from 'react'
import { productsApi, ListProductsQuery } from '@/api/endpoints'
import { categoriesApi } from '@/api/endpoints'
import { Product, Category } from '@/shared/types'
import { Button } from '@/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Badge } from '@/shared/components/ui/badge'
import { ProductFormModal } from '../components/ProductFormModal'
import { DeleteProductModal } from '../components/DeleteProductModal'
import { ProductDetailModal } from '../components/ProductDetailModal'
import { formatCurrency } from '@/shared/lib/utils'
import { TableRowSkeleton } from '@/shared/components/Skeleton'
import { ErrorState } from '@/shared/components/ErrorState'
import { useToastContext } from '@/shared/components/ToastProvider'

export function ProductsPage() {
  const { success } = useToastContext()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [brandFilter, setBrandFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<ListProductsQuery['sortBy']>('createdAt')

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load products and categories
  useEffect(() => {
    loadData()
  }, [])

  // Reload products when filters change
  useEffect(() => {
    loadProducts()
  }, [categoryFilter, brandFilter, sortBy, searchQuery])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [productsData, categoriesData] = await Promise.all([
        productsApi.list(),
        categoriesApi.list(),
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const query: ListProductsQuery = {}
      
      if (searchQuery.trim()) {
        query.search = searchQuery.trim()
      }
      if (categoryFilter !== 'all') {
        query.categoryId = categoryFilter
      }
      if (brandFilter !== 'all') {
        query.brand = brandFilter
      }
      if (sortBy) {
        query.sortBy = sortBy
      }

      const data = await productsApi.list(query)
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data: any) => {
    try {
      setIsSubmitting(true)
      setError(null)
      const newProduct = await productsApi.create(data)
      setProducts((prev) => [...prev, newProduct])
      setIsCreateModalOpen(false)
      success('Produto criado com sucesso!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar produto'
      setError(errorMessage)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (data: any) => {
    if (!selectedProduct) return

    try {
      setIsSubmitting(true)
      setError(null)
      const updatedProduct = await productsApi.update(selectedProduct.id, data)
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      )
      setIsEditModalOpen(false)
      setSelectedProduct(null)
      success('Produto atualizado com sucesso!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar produto'
      setError(errorMessage)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedProduct) return

    try {
      setIsSubmitting(true)
      setError(null)
      await productsApi.delete(selectedProduct.id)
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id))
      setIsDeleteModalOpen(false)
      setSelectedProduct(null)
      success('Produto deletado com sucesso!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar produto'
      setError(errorMessage)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditModal = (product: Product) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteModalOpen(true)
  }

  const openDetailModal = (product: Product) => {
    setSelectedProduct(product)
    setIsDetailModalOpen(true)
  }

  // Get unique brands from products
  const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[]

  // Calculate totals
  const getTotalStock = (product: Product) => {
    if (!product.variants || !Array.isArray(product.variants)) return 0
    return product.variants.reduce((sum, v) => sum + v.stock, 0)
  }

  const getVariantsCount = (product: Product) => {
    if (!product.variants || !Array.isArray(product.variants)) return 0
    return product.variants.length
  }

  if (isLoading && products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Produtos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os produtos da loja
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Preço Base</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Variantes</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={9} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os produtos da loja
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
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
            className="mr-2"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Novo Produto
        </Button>
      </div>

      {/* Error Message */}
      {error && !isLoading && (
        <ErrorState
          message={error}
          onRetry={() => {
            setError(null)
            loadProducts()
          }}
        />
      )}

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Buscar produtos por nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={brandFilter} onValueChange={setBrandFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Marca" />
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

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Ordenar por:</span>
        <Select
          value={sortBy || 'createdAt'}
          onValueChange={(value) => setSortBy(value as ListProductsQuery['sortBy'])}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Data de criação</SelectItem>
            <SelectItem value="name">Nome</SelectItem>
            <SelectItem value="price_asc">Preço: Menor para Maior</SelectItem>
            <SelectItem value="price_desc">Preço: Maior para Menor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Produtos ({products.length})</CardTitle>
          <CardDescription>Lista de todos os produtos cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum produto encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagem</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Preço Base</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Variantes</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const coverImage = Array.isArray(product.images) 
                      ? (product.images.find((img) => img.isCover) || product.images[0])
                      : undefined
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          {coverImage ? (
                            <img
                              src={coverImage.url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect width="48" height="48" fill="%23ddd"/%3E%3C/svg%3E'
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-muted-foreground"
                              >
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                <circle cx="9" cy="9" r="2" />
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                              </svg>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{product.category?.name || '-'}</Badge>
                        </TableCell>
                        <TableCell>{product.brand || '-'}</TableCell>
                        <TableCell>{formatCurrency(product.basePrice)}</TableCell>
                        <TableCell>{getTotalStock(product)}</TableCell>
                        <TableCell>{getVariantsCount(product)}</TableCell>
                        <TableCell>
                          {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDetailModal(product)}
                            >
                              Ver
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(product)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openDeleteModal(product)}
                            >
                              Deletar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {products.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum produto encontrado
            </CardContent>
          </Card>
        ) : (
          products.map((product) => {
            const coverImage = Array.isArray(product.images) 
              ? (product.images.find((img) => img.isCover) || product.images[0])
              : undefined
            return (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex gap-4">
                    {coverImage ? (
                      <img
                        src={coverImage.url}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23ddd"/%3E%3C/svg%3E'
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-muted-foreground"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="mt-1">
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary">{product.category?.name || '-'}</Badge>
                          {product.brand && <Badge variant="outline">{product.brand}</Badge>}
                        </div>
                        <div className="mt-2 space-y-1 text-xs">
                          <div>Preço: {formatCurrency(product.basePrice)}</div>
                          <div>Estoque: {getTotalStock(product)} unidades</div>
                          <div>Variantes: {getVariantsCount(product)}</div>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetailModal(product)}
                      className="flex-1"
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(product)}
                      className="flex-1"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteModal(product)}
                      className="flex-1"
                    >
                      Deletar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Modals */}
      <ProductFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreate}
        categories={categories}
        isLoading={isSubmitting}
      />

      <ProductFormModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open)
          if (!open) setSelectedProduct(null)
        }}
        onSubmit={handleEdit}
        product={selectedProduct}
        categories={categories}
        isLoading={isSubmitting}
      />

      <DeleteProductModal
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open)
          if (!open) setSelectedProduct(null)
        }}
        onConfirm={handleDelete}
        product={selectedProduct}
        isLoading={isSubmitting}
      />

      <ProductDetailModal
        open={isDetailModalOpen}
        onOpenChange={(open) => {
          setIsDetailModalOpen(open)
          if (!open) setSelectedProduct(null)
        }}
        product={selectedProduct}
        onEdit={() => {
          setIsDetailModalOpen(false)
          setIsEditModalOpen(true)
        }}
      />
    </div>
  )
}

