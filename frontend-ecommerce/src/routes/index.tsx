import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/features/products/pages/HomePage'

export const Route = createFileRoute('/')({
  component: HomePage,
})

