import { useState, useEffect } from 'react'
import { categoriesApi } from '@/api/endpoints'
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '@/shared/types'
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
import { CategoryFormModal } from '../components/CategoryFormModal'
import { DeleteCategoryModal } from '../components/DeleteCategoryModal'
import { TableRowSkeleton } from '@/shared/components/Skeleton'
import { ErrorState } from '@/shared/components/ErrorState'
import { useToastContext } from '@/shared/components/ToastProvider'

export function CategoriesPage() {
  const { success, error: showError } = useToastContext()
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load categories
  useEffect(() => {
    loadCategories()
  }, [])

  // Filter categories based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredCategories(
        categories.filter(
          (cat) =>
            cat.name.toLowerCase().includes(query) ||
            cat.description?.toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery, categories])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await categoriesApi.list()
      setCategories(data)
      setFilteredCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data: CreateCategoryDTO | UpdateCategoryDTO) => {
    try {
      setIsSubmitting(true)
      setError(null)
      const newCategory = await categoriesApi.create(data as CreateCategoryDTO)
      setCategories((prev) => [...prev, newCategory])
      setIsCreateModalOpen(false)
      success('Categoria criada com sucesso!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar categoria'
      setError(errorMessage)
      showError('Erro ao criar categoria', errorMessage)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (data: CreateCategoryDTO | UpdateCategoryDTO) => {
    if (!selectedCategory) return

    try {
      setIsSubmitting(true)
      setError(null)
      const updatedCategory = await categoriesApi.update(selectedCategory.id, data as UpdateCategoryDTO)
      setCategories((prev) =>
        prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
      )
      setIsEditModalOpen(false)
      setSelectedCategory(null)
      success('Categoria atualizada com sucesso!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar categoria'
      setError(errorMessage)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCategory) return

    try {
      setIsSubmitting(true)
      setError(null)
      await categoriesApi.delete(selectedCategory.id)
      setCategories((prev) => prev.filter((cat) => cat.id !== selectedCategory.id))
      setIsDeleteModalOpen(false)
      setSelectedCategory(null)
      success('Categoria deletada com sucesso!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar categoria'
      setError(errorMessage)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditModal = (category: Category) => {
    setSelectedCategory(category)
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }

  if (isLoading && categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Categorias</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie as categorias de produtos
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={3} />
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
          <h1 className="text-3xl font-bold">Categorias</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as categorias de produtos
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
          Nova Categoria
        </Button>
      </div>

      {/* Error Message */}
      {error && !isLoading && (
        <ErrorState
          message={error}
          onRetry={() => {
            setError(null)
            loadCategories()
          }}
        />
      )}

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar categorias por nome ou descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Categorias ({filteredCategories.length})</CardTitle>
          <CardDescription>Lista de todas as categorias cadastradas</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.description || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(category)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteModal(category)}
                        >
                          Deletar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {searchQuery ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada'}
            </CardContent>
          </Card>
        ) : (
          filteredCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                {category.description && (
                  <CardDescription>{category.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(category)}
                    className="flex-1"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteModal(category)}
                    className="flex-1"
                  >
                    Deletar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modals */}
      <CategoryFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
      />

      <CategoryFormModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open)
          if (!open) setSelectedCategory(null)
        }}
        onSubmit={handleEdit}
        category={selectedCategory}
        isLoading={isSubmitting}
      />

      <DeleteCategoryModal
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open)
          if (!open) setSelectedCategory(null)
        }}
        onConfirm={handleDelete}
        category={selectedCategory}
        isLoading={isSubmitting}
      />
    </div>
  )
}

