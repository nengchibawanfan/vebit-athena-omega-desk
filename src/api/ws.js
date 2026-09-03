function withToken(url) {
  const token = localStorage.getItem('accessToken')
  if (!token) return url
  const parsed = new URL(url)
  parsed.searchParams.set('accessToken', token)
  return parsed.toString()
}

export function ordersWsUrl(pair) {
  const configured = import.meta.env.VITE_WS_BASE_URL
  if (configured) {
    const url = new URL(configured)
    url.searchParams.set('channel', 'orders')
    url.searchParams.set('pair', pair)
    return withToken(url.toString())
  }
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
  return withToken(`${proto}//${location.host}/ws/orders?pair=${encodeURIComponent(pair)}`)
}

export function openOrdersSocket(pair, handlers = {}) {
  const url = ordersWsUrl(pair)
  let socket = null
  let closed = false
  let retries = 0
  let retryTimer = null
  let heartbeat = null

  function clearTimers() {
    if (retryTimer) clearTimeout(retryTimer)
    if (heartbeat) clearInterval(heartbeat)
    retryTimer = null
    heartbeat = null
  }

  function applyMessage(raw) {
    let msg = raw
    if (typeof raw === 'string') {
      try {
        msg = JSON.parse(raw)
      } catch {
        return
      }
    }
    if (!msg || typeof msg !== 'object') return
    if (msg.pair && msg.pair !== pair) return
    if (msg.type === 'snapshot' && msg.data) {
      handlers.onSnapshot?.(msg.data)
      return
    }
    if (msg.type === 'delta') {
      handlers.onDelta?.(msg)
      return
    }
    if (msg.type === 'error') {
      handlers.onError?.(new Error(msg.message || '挂单推送失败'))
      return
    }
    if (msg.data && (msg.data.rows || msg.rows)) {
      handlers.onSnapshot?.(msg.data || msg)
    }
  }

  function connect() {
    if (closed) return
    handlers.onStatus?.(retries ? 'reconnecting' : 'connecting')
    socket = new WebSocket(url)
    socket.addEventListener('open', () => {
      retries = 0
      handlers.onStatus?.('live')
      socket.send(JSON.stringify({ type: 'subscribe', channel: 'orders', pair }))
      heartbeat = setInterval(() => {
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'ping', pair }))
        }
      }, 15000)
    })
    socket.addEventListener('message', (event) => applyMessage(event.data))
    socket.addEventListener('error', () => {
      handlers.onError?.(new Error('挂单 WebSocket 连接失败'))
    })
    socket.addEventListener('close', () => {
      clearTimers()
      if (closed) return
      retries += 1
      const wait = Math.min(8000, 600 * 2 ** Math.min(retries, 4))
      handlers.onStatus?.(retries >= 4 ? 'polling' : 'reconnecting')
      retryTimer = setTimeout(connect, wait)
    })
  }

  connect()

  return () => {
    closed = true
    clearTimers()
    if (socket && socket.readyState < 2) socket.close()
    socket = null
  }
}
