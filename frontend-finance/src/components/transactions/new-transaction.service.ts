import { categoriesService } from '@/views/categories/categories.service'
import type { TransactionType } from '@/views/transactions/transactions.service'

export const DEFAULT_TRANSACTION_DATE = '2026-10-27'

const MONTHS_LONG = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const

const amountFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function getCategoryOptions(type: TransactionType): string[] {
  return categoriesService
    .getCategories()
    .filter((category) => category.type === type)
    .map((category) => category.name)
}

export function parseAmount(value: string): number | null {
  const cleaned = value.replace(/[^\d,.-]/g, '').trim()

  if (!cleaned) {
    return null
  }

  let normalized: string

  if (cleaned.includes(',')) {
    normalized = cleaned.replace(/\./g, '').replace(',', '.')
  } else {
    const parts = cleaned.split('.')

    if (parts.length > 2) {
      normalized = parts.join('')
    } else if (parts.length === 2 && parts[1].length === 3) {
      normalized = parts.join('')
    } else {
      normalized = cleaned
    }
  }

  const amount = Number(normalized)

  if (!Number.isFinite(amount) || amount <= 0) {
    return null
  }

  return Math.round((amount + Number.EPSILON) * 100) / 100
}

export function normalizeAmountInput(value: string): string {
  const amount = parseAmount(value)

  return amount === null ? value.trim() : amountFormatter.format(amount)
}

export function formatLongDate(value: string): string {
  if (!value) {
    return 'Selecione uma data'
  }

  const [year, month, day] = value.split('-')
  const monthName = MONTHS_LONG[Number(month) - 1]

  if (!monthName) {
    return value
  }

  return `${Number(day)} de ${monthName} de ${year}`
}
