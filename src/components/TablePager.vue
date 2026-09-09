<template>
  <div v-if="total > 0" class="table-pager">
    <div class="pager-sizes">
      <button
        v-for="size in sizes"
        :key="size"
        type="button"
        class="btn-sm"
        :class="{ primary: pageSize === size }"
        @click="$emit('update:pageSize', size)"
      >{{ size }}条</button>
    </div>
    <span class="pager-range">{{ rangeText }}</span>
    <div class="pager-nav">
      <button type="button" class="btn-sm" :disabled="page <= 1" @click="$emit('update:page', page - 1)">上一页</button>
      <span class="pager-page">{{ page }} / {{ pageCount }}</span>
      <button type="button" class="btn-sm" :disabled="page >= pageCount" @click="$emit('update:page', page + 1)">下一页</button>
    </div>
  </div>
</template>

<script setup>
import { PAGE_SIZES } from '@/composables/usePager'

defineProps({
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 20 },
  pageCount: { type: Number, default: 1 },
  total: { type: Number, default: 0 },
  rangeText: { type: String, default: '' }
})

defineEmits(['update:page', 'update:pageSize'])

const sizes = PAGE_SIZES
</script>

<style scoped>
.table-pager {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 14px;
  padding: 10px 2px 2px;
}
.pager-sizes,
.pager-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}
.pager-range,
.pager-page {
  font-size: 11px;
  color: var(--text-muted, #9ab0cc);
  font-variant-numeric: tabular-nums;
}
.pager-nav {
  margin-left: auto;
}
.btn-sm:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
