<script setup lang="ts">
import { useUpdatePromptController } from './update-prompt.controller'

// Registra o service worker e exibe, via toasts, os avisos de
// "Nova versão disponível" (Atualizar/Depois) e "pronto para uso offline".
useUpdatePromptController()
</script>

<template>
  <!-- Não renderiza nada: os avisos aparecem no <Toaster /> do AppLayout. -->
</template>
