<template>
  <AppSidebar />
  <div class="main">
    <AppTopBar />
    <div class="page-container">
      <router-view />
    </div>
  </div>
  <CopyToast />
</template>

<script setup>
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopBar from '@/components/AppTopBar.vue'
import CopyToast from '@/components/CopyToast.vue'
</script>
