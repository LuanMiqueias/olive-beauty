import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '@/shared/types'

interface CategoryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateCategoryDTO | UpdateCategoryDTO) => Promise<void>
  category?: Category | null
  isLoading?: boolean
}

type CategoryFormData = {
  name: string
  description?: string
}

export function CategoryFormModal({
  open,
  onOpenChange,
  onSubmit,
  category,
  isLoading = false,
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({})

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
      })
    } else {
      setFormData({
        name: '',
        description: '',
      })
    }
    setErrors({})
  }, [category, open])

  const validate = (): boolean => {
    const newErrors: { name?: string; description?: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      const formDataToSubmit: CategoryFormData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      }
      await onSubmit(formDataToSubmit as CreateCategoryDTO | UpdateCategoryDTO)
      onOpenChange(false)
    } catch (error) {
      // Error handling is done in parent component
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-full mx-4">
        <DialogHeader>
          <DialogTitle>{category ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          <DialogDescription>
            {category
              ? 'Atualize as informações da categoria'
              : 'Preencha os dados para criar uma nova categoria'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex: Maquiagem"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descrição da categoria (opcional)"
                value={formData.description}
                onChange={handleChange}
                disabled={isLoading}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

