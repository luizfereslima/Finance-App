import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getInitialSummary,
  type HomeSummary,
  type HomeTransaction,
} from '@/views/home/home.service'
import {
  transactionsService,
  type NewTransactionInput,
  type Transaction,
} from '@/views/transactions/transactions.service'

const MONTHS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
] as const

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function roundPercentage(value: number): number {
  return Math.round(value * 10) / 10
}

function formatShortDate(value: string): string {
  const [, month, day] = value.split('-')

  return `${Number(day)} ${MONTHS[Number(month) - 1]}`
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function formatLocalDateTime(): string {
  const now = new Date()

  return [
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
  ].join('T')
}

function toHomeTransaction(transaction: Transaction): HomeTransaction {
  return {
    id: transaction.id,
    description: transaction.description,
    category: transaction.category,
    date: formatShortDate(transaction.date),
    amount: transaction.type === 'income' ? transaction.amount : -transaction.amount,
  }
}

export const useFinanceStore = defineStore('finance', () => {
  const transactions = ref<Transaction[]>(transactionsService.getInitialTransactions())
  const summary = ref<HomeSummary>(getInitialSummary())

  let nextTransactionId =
    Math.max(
      ...transactions.value
        .map((transaction) => transaction.id)
        .filter((id): id is number => typeof id === 'number'),
      0,
    ) + 1

  function refreshRecentTransactions(): void {
    const recent = [...transactions.value]
      .sort((first, second) => {
        const dateComparison = second.date.localeCompare(first.date)

        return dateComparison !== 0
          ? dateComparison
          : second.createdAt.localeCompare(first.createdAt)
      })
      .slice(0, 5)
      .map(toHomeTransaction)

    summary.value.transactions = recent
  }

  function refreshCategoryPercentages(): void {
    summary.value.categories = summary.value.categories
      .filter((category) => category.amount > 0)
      .map((category) => ({
        ...category,
        percentage:
          summary.value.expenses > 0
            ? Math.min(100, roundPercentage((category.amount / summary.value.expenses) * 100))
            : 0,
      }))
  }

  function updateExpenseCategory(categoryName: string, amount: number): void {
    const category = summary.value.categories.find((item) => item.name === categoryName)

    if (category) {
      category.amount = roundCurrency(category.amount + amount)
    } else if (amount > 0) {
      summary.value.categories.push({
        name: categoryName,
        amount: roundCurrency(amount),
        percentage: 0,
      })
    }

    refreshCategoryPercentages()
  }

  refreshRecentTransactions()

  function addTransaction(input: NewTransactionInput): Transaction {
    const transaction: Transaction = {
      id: nextTransactionId,
      date: input.date,
      createdAt: formatLocalDateTime(),
      description: input.description,
      category: input.category,
      type: input.type,
      amount: input.amount,
    }

    nextTransactionId += 1
    transactions.value = [transaction, ...transactions.value]
    summary.value.transactionsCount += 1

    if (input.type === 'income') {
      summary.value.income = roundCurrency(summary.value.income + input.amount)
      summary.value.balance = roundCurrency(summary.value.balance + input.amount)
    } else {
      summary.value.expenses = roundCurrency(summary.value.expenses + input.amount)
      summary.value.balance = roundCurrency(summary.value.balance - input.amount)
      updateExpenseCategory(input.category, input.amount)
    }

    refreshRecentTransactions()

    return transaction
  }

  function removeTransaction(id: string | number): void {
    const transaction = transactions.value.find((item) => item.id === id)

    if (!transaction) {
      return
    }

    transactions.value = transactions.value.filter((item) => item.id !== id)
    summary.value.transactionsCount = Math.max(0, summary.value.transactionsCount - 1)

    if (transaction.type === 'income') {
      summary.value.income = roundCurrency(summary.value.income - transaction.amount)
      summary.value.balance = roundCurrency(summary.value.balance - transaction.amount)
    } else {
      summary.value.expenses = roundCurrency(summary.value.expenses - transaction.amount)
      summary.value.balance = roundCurrency(summary.value.balance + transaction.amount)
      updateExpenseCategory(transaction.category, -transaction.amount)
    }

    refreshRecentTransactions()
  }

  function updateTransaction(id: string | number, input: NewTransactionInput): Transaction | null {
    const previous = transactions.value.find((transaction) => transaction.id === id)

    if (!previous) {
      return null
    }

    if (previous.type === 'income') {
      summary.value.income = roundCurrency(summary.value.income - previous.amount)
      summary.value.balance = roundCurrency(summary.value.balance - previous.amount)
    } else {
      summary.value.expenses = roundCurrency(summary.value.expenses - previous.amount)
      summary.value.balance = roundCurrency(summary.value.balance + previous.amount)
      updateExpenseCategory(previous.category, -previous.amount)
    }

    const updated: Transaction = { ...previous, ...input }
    transactions.value = transactions.value.map((transaction) =>
      transaction.id === id ? updated : transaction,
    )

    if (updated.type === 'income') {
      summary.value.income = roundCurrency(summary.value.income + updated.amount)
      summary.value.balance = roundCurrency(summary.value.balance + updated.amount)
    } else {
      summary.value.expenses = roundCurrency(summary.value.expenses + updated.amount)
      summary.value.balance = roundCurrency(summary.value.balance - updated.amount)
      updateExpenseCategory(updated.category, updated.amount)
    }

    refreshRecentTransactions()

    return updated
  }

  return {
    transactions,
    summary,
    addTransaction,
    removeTransaction,
    updateTransaction,
  }
})
