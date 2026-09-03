import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { api } from '@/api'
import { currentPair } from '@/stores/app'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

function rowId(row) {
  return row.id || `${row.side}-${row.price}-${row.account}`
}

function applyDelta(current, delta) {
  const map = new Map((current?.rows || []).map((row) => [rowId(row), { ...row }]))
  for (const id of delta.removes || []) map.delete(id)
  for (const row of delta.upserts || []) map.set(rowId(row), { ...row })
  const rows = [...map.values()].sort((a, b) => Number(b.price) - Number(a.price))
  return {
    ...current,
    rows,
    badge: delta.badge || current?.badge || `共${rows.length}笔挂单 · 实时`,
    volumeByPrice: delta.volumeByPrice || current?.volumeByPrice,
    cancelTop: delta.cancelTop || current?.cancelTop,
    ts: Date.now()
  }
}

function diffFlashes(prev, next) {
  const flashes = {}
  const prevMap = new Map((prev?.rows || []).map((row) => [rowId(row), row]))
  const nextIds = new Set()
  for (const row of next?.rows || []) {
    const id = rowId(row)
    nextIds.add(id)
    const old = prevMap.get(id)
    if (!old) flashes[id] = 'new'
    else if (Number(row.amount) > Number(old.amount)) flashes[id] = 'up'
    else if (Number(row.amount) < Number(old.amount)) flashes[id] = 'down'
  }
  for (const id of prevMap.keys()) {
    if (!nextIds.has(id)) flashes[id] = 'gone'
  }
  return flashes
}

export function useLiveOrders() {
  const data = ref(null)
  const loading = ref(true)
  const error = ref('')
  const status = ref('connecting')
  const lastTs = ref(0)
  const flashes = ref({})
  let stopStream = null
  let flashTimer = null
  let pollTimer = null
  let runId = 0

  function setFlashes(next) {
    flashes.value = next
    if (flashTimer) clearTimeout(flashTimer)
    flashTimer = setTimeout(() => {
      flashes.value = {}
    }, 700)
  }

  function pushSnapshot(next) {
    if (!next) return
    if (data.value) setFlashes(diffFlashes(data.value, next))
    data.value = next
    lastTs.value = next.ts || Date.now()
    loading.value = false
    error.value = ''
  }

  function stopPoll() {
    if (pollTimer) clearInterval(pollTimer)
    pollTimer = null
  }

  function startPoll(pair, myRun) {
    if (useMock || pollTimer) return
    pollTimer = setInterval(async () => {
      if (myRun !== runId) return
      try {
        pushSnapshot(await api.getOrders(pair))
      } catch {
        /* keep last snapshot while reconnecting */
      }
    }, 2500)
  }

  async function start(pair) {
    const myRun = ++runId
    stopStream?.()
    stopPoll()
    loading.value = !data.value
    error.value = ''
    status.value = 'connecting'
    try {
      const snapshot = await api.getOrders(pair)
      if (myRun !== runId) return
      pushSnapshot(snapshot)
    } catch (err) {
      if (myRun !== runId) return
      if (!data.value) error.value = err.message || '挂单数据加载失败'
    }
    if (myRun !== runId) return
    stopStream = api.subscribeOrders(pair, {
      onSnapshot: (next) => {
        if (myRun !== runId) return
        pushSnapshot(next)
      },
      onDelta: (delta) => {
        if (myRun !== runId) return
        pushSnapshot(applyDelta(data.value, delta))
      },
      onStatus: (value) => {
        if (myRun !== runId) return
        status.value = value
        if (value === 'live' || value === 'mock') stopPoll()
        if (value === 'reconnecting' || value === 'polling') startPoll(pair, myRun)
      },
      onError: (err) => {
        if (myRun !== runId) return
        if (!data.value) error.value = err.message || '挂单推送失败'
      }
    })
  }

  onMounted(() => start(currentPair.value))
  watch(currentPair, (pair) => {
    flashes.value = {}
    start(pair)
  })
  onBeforeUnmount(() => {
    runId += 1
    stopStream?.()
    stopPoll()
    if (flashTimer) clearTimeout(flashTimer)
  })

  return { data, loading, error, status, lastTs, flashes, rowId }
}
