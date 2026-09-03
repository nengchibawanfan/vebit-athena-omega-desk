import { ref, watch, onMounted } from 'vue'
import { currentPair } from '@/stores/app'

export function usePageData(fetcher) {
  const loading = ref(false)
  const error = ref('')
  const data = ref(null)

  async function load(...args) {
    loading.value = true
    error.value = ''
    try {
      data.value = await fetcher(...args)
    } catch (err) {
      error.value = err.message || '数据加载失败'
    } finally {
      loading.value = false
    }
  }

  function bindPair(getArgs = () => [currentPair.value]) {
    onMounted(() => load(...getArgs()))
    watch(currentPair, () => load(...getArgs()))
  }

  return { loading, error, data, load, bindPair }
}
