<template>
  <div v-if="items?.length" class="monitor-status">
    <div
      v-for="item in items"
      :key="item.text"
      class="status-item"
      :class="{ 'status-break': item.break }"
    >
      <span class="status-dot" :class="statusDot(item)"></span> {{ item.text }}
    </div>
  </div>
</template>

<script setup>
import { statusDot } from '@/utils/palette'

defineProps({
  items: { type: Array, default: () => [] }
})
</script>

<style scoped>
.status-item.status-break {
  flex-basis: 100%;
}
</style>
