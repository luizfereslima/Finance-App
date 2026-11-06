<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import UpdatePrompt from '@/components/pwa/UpdatePrompt.vue'
</script>

<template>
  <div class="min-h-screen" style="background-color: #09090b">
    <RouterView />
    <Toaster position="bottom-right" theme="dark" />
    <UpdatePrompt />
  </div>
</template>
