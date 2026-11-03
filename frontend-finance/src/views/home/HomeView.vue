<script setup lang="ts">
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Plus,
} from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import NewTransactionDialog from '@/components/transactions/NewTransactionDialog.vue'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useHomeController } from './home.controller'

const {
  summary,
  selectedMonth,
  selectedMonthLabel,
  monthOptions,
  setMonth,
  isNewTransactionOpen,
  openNewTransaction,
  addTransaction,
  formatCurrency,
  formatSignedAmount,
  formatPercentage,
} = useHomeController()
</script>

<template>
  <DashboardLayout section="Meu Bolso" page="Resumo">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div class="flex flex-1 flex-col gap-1">
        <h1 class="text-[26px] font-bold tracking-tight">Resumo</h1>
        <p class="text-sm text-muted-foreground">
          Acompanhe suas entradas, despesas e o saldo do período.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <Select :model-value="selectedMonth" @update:model-value="setMonth">
          <SelectTrigger class="w-[190px] dark:bg-background">
            <CalendarDays />
            <span class="truncate">{{ selectedMonthLabel }}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="month in monthOptions" :key="month.value" :value="month.value">
              {{ month.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Button type="button" @click="openNewTransaction">
          <Plus />
          Nova transação
        </Button>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card
        class="gap-2 border-transparent px-5 py-5 text-white"
        :class="summary.balance < 0 ? 'bg-red-500' : 'bg-green-500'"
      >
        <CardHeader class="items-center p-0">
          <CardDescription class="text-sm font-medium text-white">
            Saldo do período
          </CardDescription>
          <CardAction class="self-center">
            <Check class="size-4" />
          </CardAction>
        </CardHeader>
        <CardContent class="flex flex-col gap-2 p-0">
          <p class="text-[28px] font-bold leading-none">{{ formatCurrency(summary.balance) }}</p>
          <p class="text-[13px]">Entradas menos despesas</p>
        </CardContent>
      </Card>

      <Card class="gap-2 px-5 py-5">
        <CardHeader class="items-center p-0">
          <CardDescription class="text-sm font-medium">Entradas</CardDescription>
          <CardAction class="self-center">
            <ArrowUpRight class="size-4 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardContent class="flex flex-col gap-2 p-0">
          <p class="text-[28px] font-bold leading-none">{{ formatCurrency(summary.income) }}</p>
          <p class="text-[13px] text-muted-foreground">Total recebido no período</p>
        </CardContent>
      </Card>

      <Card class="gap-2 px-5 py-5">
        <CardHeader class="items-center p-0">
          <CardDescription class="text-sm font-medium">Despesas</CardDescription>
          <CardAction class="self-center">
            <ArrowDownRight class="size-4 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardContent class="flex flex-col gap-2 p-0">
          <p class="text-[28px] font-bold leading-none">{{ formatCurrency(summary.expenses) }}</p>
          <p class="text-[13px] text-muted-foreground">Total gasto no período</p>
        </CardContent>
      </Card>
    </div>

    <div class="flex flex-col gap-4 xl:flex-row">
      <Card class="min-w-0 flex-1 gap-0 overflow-hidden py-0">
        <CardHeader class="grid-cols-[1fr_auto] items-center gap-2 p-5 pb-3">
          <CardTitle class="text-base">Últimas transações</CardTitle>
          <CardDescription class="text-[13px]">
            {{ summary.transactionsCount }} transações no período
          </CardDescription>
          <CardAction class="self-center">
            <Button variant="outline" size="sm" as-child class="dark:bg-background">
              <RouterLink to="/transactions">Ver todas</RouterLink>
            </Button>
          </CardAction>
        </CardHeader>

        <Table class="min-w-[560px]">
          <TableHeader>
            <TableRow class="hover:bg-transparent">
              <TableHead class="pl-4 text-[13px] font-medium text-muted-foreground">
                Descrição
              </TableHead>
              <TableHead class="w-[150px] text-[13px] font-medium text-muted-foreground">
                Categoria
              </TableHead>
              <TableHead class="w-20 text-[13px] font-medium text-muted-foreground">Data</TableHead>
              <TableHead class="w-[140px] pr-4 text-right text-[13px] font-medium text-muted-foreground">
                Valor
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow
              v-for="transaction in summary.transactions"
              :key="transaction.id"
              class="h-[52px]"
            >
              <TableCell class="pl-4 text-sm">{{ transaction.description }}</TableCell>
              <TableCell class="w-[150px]">
                <Badge variant="secondary" class="rounded-md px-2 py-0.5 text-xs font-semibold">
                  {{ transaction.category }}
                </Badge>
              </TableCell>
              <TableCell class="w-20 text-sm">{{ transaction.date }}</TableCell>
              <TableCell class="w-[140px] pr-4 text-right">
                <span
                  class="text-[15px] font-semibold"
                  :class="transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'"
                >
                  {{ formatSignedAmount(transaction.amount) }}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      <Card class="w-full shrink-0 gap-4 px-5 py-5 xl:w-[400px]">
        <CardHeader class="gap-1 p-0">
          <CardTitle class="text-base">Despesas por categoria</CardTitle>
          <CardDescription class="text-[13px]">
            Distribuição das despesas no período
          </CardDescription>
        </CardHeader>

        <CardContent class="flex flex-col gap-4 p-0">
          <div
            v-for="category in summary.categories"
            :key="category.name"
            class="flex flex-col gap-1.5"
          >
            <div class="flex items-center gap-2">
              <span class="min-w-0 flex-1 truncate text-sm font-medium">{{ category.name }}</span>
              <span class="text-sm font-semibold">{{ formatCurrency(category.amount) }}</span>
              <span class="w-12 text-right text-xs text-muted-foreground">
                {{ formatPercentage(category.percentage) }}
              </span>
            </div>
            <Progress
              :model-value="category.percentage"
              class="h-2 bg-muted"
              :class="
                category.tone === 'muted'
                  ? '[&_[data-slot=progress-indicator]]:bg-muted-foreground'
                  : ''
              "
            />
          </div>
        </CardContent>
      </Card>
    </div>

    <NewTransactionDialog v-model:open="isNewTransactionOpen" @created="addTransaction" />
  </DashboardLayout>
</template>
