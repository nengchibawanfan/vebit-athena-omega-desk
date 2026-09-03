<template>
  <PageState :loading="loading && !data" :error="error && !data ? error : ''">
    <div v-if="data" class="page">
      <div class="card detail-table-card">
        <div class="card-header">
          <span>👤 真实用户挂单</span>
          <span class="header-actions">
            <span class="live-pill" :class="status">
              <span class="live-dot"></span>
              {{ statusLabel }}
            </span>
            <span class="badge">买=你卖出 · 卖=你买入 · {{ visibleOrders.length }}笔</span>
          </span>
        </div>
        <p class="ob-blurb">下方买盘砸价会成交（你卖出）；上方卖盘拉价会成交（高位买货）。已剔除做市。</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>价格</th>
                <th>方向</th>
                <th>数量(万)</th>
                <th>至该价累计(万)</th>
                <th>账户</th>
                <th>挂单时间</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in visibleOrders"
                :key="rowId(row)"
                :class="flashClass(row)"
              >
                <td :class="row.side === '买' ? 'px-bid' : 'px-ask'">{{ row.price }}</td>
                <td><span class="tag" :class="row.tag">{{ row.side }}</span></td>
                <td>{{ row.amount }}</td>
                <td>{{ row.cumText }}</td>
                <td>{{ row.account }}</td>
                <td>{{ row.time }}</td>
              </tr>
              <tr v-if="!visibleOrders.length">
                <td colspan="6" class="empty-cell">暂无真实用户挂单</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid-2 lower-row">
        <div class="card">
          <div class="card-header">
            <span>📊 盘口</span>
            <span class="badge">{{ book.badge }}</span>
          </div>
          <div class="ob">
            <div class="ob-spread">
              <div class="ob-side bid">
                <span class="ob-k">买盘</span>
                <span class="ob-v">{{ book.bidQty }}<small>万</small></span>
              </div>
              <div class="ob-mid">
                <div class="ob-last">{{ book.mid }}</div>
                <div class="ob-gap" :class="book.crossed ? 'warn' : ''">{{ book.spreadLabel }}</div>
              </div>
              <div class="ob-side ask">
                <span class="ob-k">卖盘</span>
                <span class="ob-v">{{ book.askQty }}<small>万</small></span>
              </div>
            </div>
            <div class="ob-cols">
              <div class="ob-col bid">
                <div class="ob-th">
                  <span>累计</span><span>数量</span><span>价格</span>
                </div>
                <div class="ob-body">
                  <div v-for="row in book.bids" :key="'b-' + row.priceText" class="ob-row">
                    <div class="ob-bar" :style="{ width: row.pct + '%' }"></div>
                    <span class="total">{{ row.totalText }}</span>
                    <span class="amt">{{ row.amountText }}</span>
                    <span class="price" :title="row.count + '笔'">{{ row.priceText }}</span>
                  </div>
                  <div v-if="!book.bids.length" class="ob-empty">暂无买盘</div>
                </div>
              </div>
              <div class="ob-col ask">
                <div class="ob-th">
                  <span>价格</span><span>数量</span><span>累计</span>
                </div>
                <div class="ob-body">
                  <div v-for="row in book.asks" :key="'a-' + row.priceText" class="ob-row">
                    <div class="ob-bar" :style="{ width: row.pct + '%' }"></div>
                    <span class="price" :title="row.count + '笔'">{{ row.priceText }}</span>
                    <span class="amt">{{ row.amountText }}</span>
                    <span class="total">{{ row.totalText }}</span>
                  </div>
                  <div v-if="!book.asks.length" class="ob-empty">暂无卖盘</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><span>📈 撤单频率 Top 5</span><span class="badge">高频撤单</span></div>
          <ChartBox size="tall" :option="cancelOption" />
        </div>
      </div>
    </div>
  </PageState>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLiveOrders } from '@/composables/useLiveOrders'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'

const { data, loading, error, status, lastTs, flashes, rowId } = useLiveOrders()
const now = ref(Date.now())
let clock = null

onMounted(() => {
  clock = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})
onBeforeUnmount(() => {
  if (clock) clearInterval(clock)
})

const statusLabel = computed(() => {
  if (status.value === 'live') return '实时推送'
  if (status.value === 'mock') return '模拟推送'
  if (status.value === 'polling') return '轮询降级'
  if (status.value === 'reconnecting') return '重连中'
  if (status.value === 'connecting') return '连接中'
  return '待连接'
})

const lastLabel = computed(() => {
  now.value
  if (!lastTs.value) return '等待更新'
  const diff = Math.max(0, Math.round((Date.now() - lastTs.value) / 1000))
  if (diff <= 1) return '刚刚更新'
  return `${diff}秒前更新`
})

function flashClass(row) {
  const kind = flashes.value[rowId(row)]
  return kind ? `flash-${kind}` : ''
}

function fmtQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

function isRealUserOrder(row) {
  if (row.tag && row.tag !== 'user') return false
  const account = String(row.account || '')
  if (/机器人|量化|做市|MM[-_]/i.test(account)) return false
  return true
}

const visibleOrders = computed(() => {
  const rows = (data.value?.rows || []).filter(isRealUserOrder)
  const bidQty = new Map()
  const askQty = new Map()
  for (const row of rows) {
    const price = Number(row.price)
    const amount = Number(row.amount) || 0
    const map = row.side === '买' ? bidQty : askQty
    map.set(price, (map.get(price) || 0) + amount)
  }
  const bidPrices = [...bidQty.keys()].sort((a, b) => b - a)
  const askPrices = [...askQty.keys()].sort((a, b) => a - b)
  const bidCum = new Map()
  const askCum = new Map()
  let total = 0
  for (const price of bidPrices) {
    total += bidQty.get(price)
    bidCum.set(price, Number(total.toFixed(1)))
  }
  total = 0
  for (const price of askPrices) {
    total += askQty.get(price)
    askCum.set(price, Number(total.toFixed(1)))
  }
  return rows.map((row) => {
    const price = Number(row.price)
    const cum = row.side === '买' ? bidCum.get(price) : askCum.get(price)
    return { ...row, cumText: fmtQty(cum) }
  })
})

const book = computed(() => {
  const buckets = new Map()
  for (const row of data.value?.rows || []) {
    const side = row.side === '买' ? 'bid' : 'ask'
    const priceText = String(row.price)
    const key = `${side}:${priceText}`
    if (!buckets.has(key)) {
      buckets.set(key, { side, price: Number(row.price), priceText, amount: 0, count: 0 })
    }
    const slot = buckets.get(key)
    slot.amount += Number(row.amount) || 0
    slot.count += 1
  }

  function accumulate(list, desc) {
    const sorted = [...list].sort((a, b) => (desc ? b.price - a.price : a.price - b.price))
    let total = 0
    return sorted.map((row) => {
      total += row.amount
      return {
        ...row,
        amount: Number(row.amount.toFixed(1)),
        total: Number(total.toFixed(1)),
        amountText: fmtQty(row.amount),
        totalText: fmtQty(total)
      }
    })
  }

  const bids = accumulate([...buckets.values()].filter((row) => row.side === 'bid'), true)
  const asks = accumulate([...buckets.values()].filter((row) => row.side === 'ask'), false)
  const maxDepth = Math.max(0.1, ...bids.map((row) => row.total), ...asks.map((row) => row.total))
  const withPct = (rows) => rows.map((row) => ({
    ...row,
    pct: Number(((row.total / maxDepth) * 100).toFixed(1))
  }))

  const bidQty = Number(bids.reduce((sum, row) => sum + row.amount, 0).toFixed(1))
  const askQty = Number(asks.reduce((sum, row) => sum + row.amount, 0).toFixed(1))
  const bestBid = bids[0]?.price
  const bestAsk = asks[0]?.price
  const crossed = Number.isFinite(bestBid) && Number.isFinite(bestAsk) && bestBid >= bestAsk
  const spread = Number.isFinite(bestBid) && Number.isFinite(bestAsk) ? bestAsk - bestBid : null
  const mid = Number.isFinite(bestBid) && Number.isFinite(bestAsk)
    ? ((bestBid + bestAsk) / 2).toFixed(4).replace(/0+$/, '').replace(/\.$/, '')
    : (bestBid ?? bestAsk ?? '--')
  const spreadPct = spread != null && Number(mid) > 0 ? Math.abs(spread) / Number(mid) * 100 : null
  const bias = bidQty > askQty * 1.15 ? '买盘偏厚' : askQty > bidQty * 1.15 ? '卖盘偏厚' : '买卖均衡'
  const spreadLabel = crossed
    ? '交叉盘口'
    : spread == null
      ? '等待盘口'
      : `价差 ${spread.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}${spreadPct != null ? ` · ${spreadPct.toFixed(2)}%` : ''}`

  return {
    bids: withPct(bids),
    asks: withPct(asks),
    bidQty: fmtQty(bidQty),
    askQty: fmtQty(askQty),
    mid,
    crossed,
    spreadLabel,
    badge: `${bias} · ${bids.length + asks.length}档`
  }
})

const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }

const cancelOption = computed(() => ({
  grid: { left: '6%', right: '4%', top: '10%', bottom: '12%' },
  xAxis: { data: data.value?.cancelTop?.labels || [], axisLabel: { color: '#4a6080', fontSize: 9 } },
  yAxis,
  series: [{ type: 'bar', data: data.value?.cancelTop?.values || [], itemStyle: { color: '#ffb347' }, barWidth: '50%' }]
}))
</script>

<style scoped>
.px-bid {
  color: #4cd9a0;
}
.px-ask {
  color: #ff5a7a;
}
.lower-row > .card {
  margin-bottom: 0;
}
.empty-cell {
  text-align: center;
  color: var(--text-muted);
  padding: 24px 8px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.live-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 30px;
  font-size: 9px;
  letter-spacing: 0.3px;
  background: var(--bg-elevated);
  color: #8aa0c0;
}
.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--text-muted);
}
.live-pill.live,
.live-pill.mock {
  color: #4cd9a0;
  background: rgba(76, 217, 160, 0.12);
}
.live-pill.live .live-dot,
.live-pill.mock .live-dot {
  background: #4cd9a0;
  box-shadow: 0 0 8px #4cd9a088;
  animation: live-pulse 1.4s ease-in-out infinite;
}
.live-pill.connecting .live-dot,
.live-pill.reconnecting .live-dot,
.live-pill.polling .live-dot {
  background: #ffb347;
  animation: live-pulse 1s ease-in-out infinite;
}
.live-pill.reconnecting,
.live-pill.polling {
  color: #ffb347;
}
.flash-up td {
  background: rgba(76, 217, 160, 0.16);
  transition: background 0.7s ease;
}
.flash-down td {
  background: rgba(255, 90, 122, 0.16);
  transition: background 0.7s ease;
}
.flash-new td {
  background: rgba(106, 154, 255, 0.16);
  transition: background 0.7s ease;
}
@keyframes live-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
.ob {
  margin-top: 4px;
}
.ob-spread {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 10px;
  border-bottom: 1px solid var(--border);
}
.ob-side {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.ob-side.ask {
  align-items: flex-end;
  text-align: right;
}
.ob-k {
  font-size: 9px;
  color: var(--text-muted);
  letter-spacing: 0.3px;
}
.ob-side.bid .ob-v {
  color: #4cd9a0;
}
.ob-side.ask .ob-v {
  color: #ff5a7a;
}
.ob-v {
  font-size: 16px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.ob-v small {
  margin-left: 3px;
  font-size: 10px;
  font-weight: 400;
  color: var(--text-soft);
}
.ob-mid {
  text-align: center;
}
.ob-last {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-title);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.3px;
}
.ob-gap {
  margin-top: 2px;
  font-size: 9px;
  color: #6a9aff;
}
.ob-gap.warn {
  color: #ffb347;
}
.ob-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}
.ob-col + .ob-col {
  border-left: 1px solid var(--border);
}
.ob-th,
.ob-row {
  display: grid;
  align-items: center;
  position: relative;
  font-variant-numeric: tabular-nums;
}
.ob-col.bid .ob-th,
.ob-col.bid .ob-row {
  grid-template-columns: 1fr 1fr 68px;
}
.ob-col.ask .ob-th,
.ob-col.ask .ob-row {
  grid-template-columns: 68px 1fr 1fr;
}
.ob-th {
  padding: 6px 8px 4px;
  font-size: 9px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.ob-th span,
.ob-row span {
  position: relative;
  z-index: 1;
}
.ob-col.bid .ob-th span,
.ob-col.bid .ob-row span {
  text-align: right;
}
.ob-col.ask .ob-th span:not(:first-child),
.ob-col.ask .amt,
.ob-col.ask .total {
  text-align: right;
}
.ob-body {
  height: 220px;
  overflow-y: auto;
}
.ob-body::-webkit-scrollbar {
  width: 6px;
}
.ob-body::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 6px;
}
.ob-row {
  padding: 3px 8px;
  min-height: 22px;
  font-size: 11px;
  color: var(--text-body);
}
.ob-row:hover {
  background: var(--row-hover);
}
.ob-bar {
  position: absolute;
  top: 1px;
  bottom: 1px;
  opacity: 0.9;
  transition: width 0.35s ease;
  pointer-events: none;
}
.ob-col.bid .ob-bar {
  right: 0;
  background: linear-gradient(90deg, rgba(76, 217, 160, 0.06), rgba(76, 217, 160, 0.28));
}
.ob-col.ask .ob-bar {
  left: 0;
  background: linear-gradient(90deg, rgba(255, 90, 122, 0.28), rgba(255, 90, 122, 0.06));
}
.ob-col.bid .price {
  color: #4cd9a0;
  font-weight: 600;
}
.ob-col.ask .price {
  color: #ff5a7a;
  font-weight: 600;
}
.ob-row .total {
  color: #6a82a8;
  font-size: 10px;
}
.ob-empty {
  padding: 24px 8px;
  text-align: center;
  color: var(--text-muted);
  font-size: 11px;
}
.lower-row {
  margin-bottom: 0;
}
.ob-blurb {
  margin: 4px 12px 12px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-muted, #9ab0cc);
}
</style>
