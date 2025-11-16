import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata moeda brasileira
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Calcula opções de parcelamento para um produto
 * @param price Preço do produto
 * @param maxInstallments Número máximo de parcelas (padrão: 10)
 * @param minInstallmentValue Valor mínimo por parcela (padrão: R$ 10,00)
 * @returns String formatada com opção de parcelamento ou null
 */
export function calculateInstallment(
  price: number,
  maxInstallments: number = 10,
  minInstallmentValue: number = 10
): string | null {
  if (price < minInstallmentValue) {
    return null
  }

  const maxPossibleInstallments = Math.floor(price / minInstallmentValue)
  const installments = Math.min(maxInstallments, maxPossibleInstallments)

  if (installments < 2) {
    return null
  }

  const installmentValue = price / installments

  // Formato estilo Mercado Livre: "em até 10x sem juros" ou "em até 10x de R$ 25,90"
  if (installments === 10 && installmentValue % 1 === 0) {
    return `em até ${installments}x sem juros`
  }

  return `em até ${installments}x de ${formatCurrency(installmentValue)}`
}

/**
 * Determina o status do estoque baseado na quantidade disponível
 * @param stock Quantidade em estoque
 * @returns Objeto com label e cor do status
 */
export function getStockStatus(stock: number): {
  label: string
  color: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
} {
  if (stock === 0) {
    return {
      label: 'Sem estoque',
      color: 'text-destructive',
      variant: 'destructive',
    }
  }

  if (stock <= 5) {
    return {
      label: 'Poucas unidades',
      color: 'text-yellow-600',
      variant: 'secondary',
    }
  }

  return {
    label: 'Em estoque',
    color: 'text-green-600',
    variant: 'default',
  }
}

/**
 * Verifica se o produto tem frete grátis baseado no preço
 * @param price Preço do produto
 * @param threshold Valor mínimo para frete grátis (padrão: R$ 100)
 * @returns true se tem frete grátis
 */
export function hasFreeShipping(price: number, threshold: number = 100): boolean {
  return price >= threshold
}

/**
 * Gera dados mockados de avaliação baseado no ID do produto
 * @param productId ID do produto
 * @returns Objeto com rating e reviewCount
 */
export function getMockRating(productId: string): { rating: number; reviewCount: number } {
  const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const rating = 3.5 + (hash % 15) / 10 // Entre 3.5 e 5.0
  const reviewCount = (hash % 200) + 10 // Entre 10 e 210
  
  return {
    rating: Math.round(rating * 10) / 10,
    reviewCount,
  }
}

/**
 * Formata atributos de variante para exibição
 * @param attributes String JSON com atributos
 * @returns Objeto com atributos parseados ou objeto vazio
 */
export function parseVariantAttributes(attributes: string): Record<string, string> {
  try {
    return JSON.parse(attributes)
  } catch {
    return {}
  }
}

/**
 * Formata atributos de variante como texto legível
 * @param attributes String JSON com atributos
 * @returns String formatada (ex: "Cor: Vermelho, Tamanho: 50ml")
 */
export function formatVariantAttributes(attributes: string): string {
  const attrs = parseVariantAttributes(attributes)
  return Object.entries(attrs)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ') || 'Padrão'
}

