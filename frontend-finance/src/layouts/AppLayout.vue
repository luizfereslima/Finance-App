<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <div class="min-h-screen" style="background-color: #09090b">
    <RouterView />
    <Toaster position="bottom-right" theme="dark" />
  </div>
</template>
