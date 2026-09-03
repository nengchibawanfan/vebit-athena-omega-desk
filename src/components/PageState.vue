<template>
  <div v-if="loading" class="page-loading">数据加载中...</div>
  <div v-else-if="error" class="page-error">{{ error }}</div>
  <slot v-else />
</template>

<script setup>
defineProps({
  loading: Boolean,
  error: String
})
</script>
