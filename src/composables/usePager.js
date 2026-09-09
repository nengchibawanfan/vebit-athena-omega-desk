import { computed, reactive, ref, unref, watch } from 'vue'

export const PAGE_SIZES = [20, 50]

export function usePager(source, { size = 20 } = {}) {
  const page = ref(1)
  const pageSize = ref(PAGE_SIZES.includes(size) ? size : 20)

  const rows = computed(() => unref(source) || [])
  const total = computed(() => rows.value.length)
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value) || 1))
  const pagedRows = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return rows.value.slice(start, start + pageSize.value)
  })
  const rangeText = computed(() => {
    if (!total.value) return '0 条'
    const start = (page.value - 1) * pageSize.value + 1
    const end = Math.min(page.value * pageSize.value, total.value)
    return `${start}–${end} / ${total.value}`
  })

  watch(pageSize, () => {
    page.value = 1
  })

  watch([page, pageCount], () => {
    if (page.value > pageCount.value) page.value = pageCount.value
    if (page.value < 1) page.value = 1
  })

  return reactive({
    page,
    pageSize,
    pageCount,
    total,
    pagedRows,
    rangeText
  })
}
