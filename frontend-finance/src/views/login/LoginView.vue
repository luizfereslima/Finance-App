<template>
  <AuthLayout>
    <Card class="w-full max-w-md gap-2 border-gray-200/35 bg-transparent p-6 text-white">
        <CardTitle class="mb-1 text-xl font-semibold">Entrar</CardTitle>
        <CardDescription>Use seu e-mail e senha para acessar</CardDescription>
        <CardContent class="px-0">
          <Alert v-if="backendError" class="my-4 flex items-center gap-2 border-red-500 bg-transparent"
            variant="destructive" role="alert" aria-live="polite">
            <AlertCircle />
            {{ backendError }}
          </Alert>

          <form class="space-y-4" @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-1.5">
              <Label for="email">Email</Label>
              <Input id="email" v-model="email" class="border-gray-200/35" type="email" placeholder="m@example.com"
                autocomplete="email" required />
            </div>

            <div class="flex flex-col gap-1.5">
              <Label for="password">Senha</Label>
              <Input id="password" v-model="password" class="border-gray-200/35" type="password"
                autocomplete="current-password" required />
            </div>

            <CardFooter class="p-0">
              <Button class="mt-2 w-full cursor-pointer bg-green-600 transition-colors hover:bg-green-600" type="submit"
                :disabled="isSubmitting">
                {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
              </Button>
            </CardFooter>
            <div class="flex justify-center">
              <p class="text-muted-foreground">Não tem conta?</p>
              <RouterLink to="/signin" class="text-green-400">Criar conta</RouterLink>
            </div>
          </form>
        </CardContent>
      </Card>
  </AuthLayout>
</template>

<script lang="ts" setup>
import { Alert } from '@/components/ui/alert';
import Button from '@/components/ui/button/Button.vue';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import { AlertCircle } from '@lucide/vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { useLoginController } from './login.controller';

const { email, password, backendError, isSubmitting, handleSubmit } = useLoginController();
</script>
