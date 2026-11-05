<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

defineProps<{
  section: string
  page: string
}>()
</script>

<template>
  <SidebarProvider>
    <AppSidebar />

    <SidebarInset class="min-w-0">
      <header class="flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <SidebarTrigger class="text-muted-foreground" />
        <Separator orientation="vertical" class="h-4" />
        <Breadcrumb>
          <BreadcrumbList class="gap-2">
            <BreadcrumbItem>
              <BreadcrumbLink as-child>
                <RouterLink to="/home">{{ section }}</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage class="font-medium">{{ page }}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div class="flex flex-1 flex-col gap-5 p-4 sm:gap-6 sm:p-6">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
