<script setup lang="ts">
import { LogOut } from '@lucide/vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useUserController } from './user.controller'

const { profile, details, logout } = useUserController()
</script>

<template>
  <DashboardLayout section="Meu Bolso" page="Perfil">
    <div class="flex flex-col gap-1">
      <h1 class="text-[26px] font-bold tracking-tight">Perfil</h1>
      <p class="text-sm text-muted-foreground">Dados da sua conta.</p>
    </div>

    <Card class="w-full max-w-[560px] gap-0 overflow-hidden rounded-[12px] py-0 shadow-none">
      <CardHeader class="flex flex-row items-center gap-4 p-6">
        <Avatar class="size-16">
          <AvatarFallback class="text-[23px] font-medium">
            {{ profile.initials }}
          </AvatarFallback>
        </Avatar>

        <div class="flex min-w-0 flex-col gap-1">
          <CardTitle class="truncate text-xl leading-tight font-bold">{{ profile.name }}</CardTitle>
          <CardDescription class="truncate">{{ profile.email }}</CardDescription>
        </div>
      </CardHeader>

      <div
        v-for="detail in details"
        :key="detail.label"
        class="flex items-center gap-3 border-t border-border px-6 py-3.5"
      >
        <span class="flex-1 text-sm text-muted-foreground">{{ detail.label }}</span>
        <span class="text-right text-sm font-medium">{{ detail.value }}</span>
      </div>

      <CardFooter class="border-t px-6 py-4 [.border-t]:pt-4">
        <Button
          variant="outline"
          type="button"
          class="h-9 border-input text-red-400 hover:bg-muted hover:text-red-400 dark:bg-background dark:hover:bg-muted"
          @click="logout"
        >
          <LogOut />
          Sair da conta
        </Button>
      </CardFooter>
    </Card>
  </DashboardLayout>
</template>
