<template>
  <AuthLayout>
    <Card class="w-full max-w-md gap-2 border-gray-200/35 bg-transparent p-6 text-white">
      <CardTitle class="mb-1 text-xl font-semibold">Criar conta</CardTitle>
      <CardDescription>Crie sua conta em poucos minutos.</CardDescription>
      <CardContent class="px-0">
        <Alert v-if="backendError" class="my-4 flex items-center gap-2 border-red-500 bg-transparent"
          variant="destructive" role="alert" aria-live="polite">
          <AlertCircle />
          {{ backendError }}
        </Alert>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-1.5">
            <Label for="name">Nome</Label>
            <Input id="name" v-model="name" class="border-gray-200/35" autocomplete="name" required />
          </div>
          <div class="flex flex-col gap-1.5">
            <Label for="email">E-mail</Label>
            <Input id="email" v-model="email" class="border-gray-200/35" type="email"
              autocomplete="email" required />
          </div>
          <div class="flex flex-col gap-1.5">
            <Label for="password">Senha</Label>
            <Input id="password" v-model="password" class="border-gray-200/35" type="password"
              minlength="8" autocomplete="new-password" required />
            <span class="text-xs text-muted-foreground">Mínimo de 8 caracteres.</span>
          </div>
          <CardFooter class="p-0">
            <Button class="mt-2 w-full cursor-pointer bg-green-600 transition-colors hover:bg-green-600"
              type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Criando conta...' : 'Criar conta' }}
            </Button>
          </CardFooter>
          <div class="flex justify-center gap-1 text-sm">
            <p class="text-muted-foreground">Já tem conta?</p>
            <RouterLink to="/login" class="text-green-400">Entrar</RouterLink>
          </div>
        </form>
      </CardContent>
    </Card>
  </AuthLayout>
</template>

<script setup lang="ts">
import { Alert } from '@/components/ui/alert';
import { AlertCircle } from '@lucide/vue';
import Button from '@/components/ui/button/Button.vue';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { useSigninController } from './signin.controller';

const { name, email, password, backendError, isSubmitting, handleSubmit } = useSigninController();
</script>
