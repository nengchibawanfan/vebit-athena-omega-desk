<template>
  <PageState :loading="pageLoading" :error="pageError">
      <div v-if="liveData" class="page-block">
        <div class="card">
          <div class="card-header">
            <span>👤 真实用户挂单</span>
            <span class="header-actions">
              <span class="live-pill" :class="status">
                <span class="live-dot"></span>
                {{ statusLabel }}
              </span>
              <span class="badge">买=你卖出 · 卖=你买入 · {{ visibleOrders.length }}笔 · ≥{{ whaleThreshold }}万高亮</span>
            </span>
          </div>
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
                  :class="[flashClass(row), { 'is-whale': row.isWhale }]"
                >
                  <td :class="row.side === '买' ? 'px-bid' : 'px-ask'">
                    {{ row.price }}
                    <span v-if="row.samePriceCount > 1" class="same-price">同价 {{ row.samePriceCount }}笔</span>
                  </td>
                  <td><span class="tag" :class="row.tag">{{ row.side }}</span></td>
                  <td>
                    {{ row.amount }}
                    <span v-if="row.isWhale" class="whale-flag">大单</span>
                  </td>
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
      </div>

      <div v-if="hasBlocks" class="page-block">
        <div class="card detail-table-card">
          <div class="card-header">
            <span>📋 大单明细</span>
            <span class="badge">{{ (blocks.rows || []).length }} 笔 · 点 UID</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>时间</th>
                  <th>UID</th>
                  <th>标签</th>
                  <th>方向</th>
                  <th>金额(万)</th>
                  <th>约合USDT</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in blocks.rows"
                  :key="row.uid + row.time + row.action"
                  class="row-link"
                  @click="$router.push(userDetailPath(row.uid))"
                >
                  <td>{{ row.time }}</td>
                  <td>{{ row.uid }}</td>
                  <td><span class="tag" :class="row.tagClass">{{ row.tag }}</span></td>
                  <td :class="'amt-' + row.actionClass">{{ row.action }}</td>
                  <td :class="'amt-' + row.actionClass">{{ fmtQty(row.amount) }}</td>
                  <td>{{ fmtQty(row.amountU) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageState>
</template>

<script setup>
import { computed } from 'vue'
import { appState } from '@/stores/app'
import { userDetailPath } from '@/utils/uid'
import { useLiveOrders } from '@/composables/useLiveOrders'
import PageState from '@/components/PageState.vue'

const props = defineProps({
  blocks: { type: Object, default: () => ({ kpis: {}, rows: [], hours: {}, status: [] }) }
})

const {
  data: liveData,
  loading: liveLoading,
  error: liveError,
  status,
  flashes,
  rowId
} = useLiveOrders()

const blocks = computed(() => props.blocks || { kpis: {}, rows: [], hours: {}, status: [] })
const hasBlocks = computed(() => Boolean(blocks.value?.kpis || (blocks.value?.rows || []).length))
const whaleThreshold = computed(() => Number(appState.config.whaleThreshold) || 50)

const pageLoading = computed(() => liveLoading.value && !liveData.value)
const pageError = computed(() => {
  if (liveData.value || hasBlocks.value) return ''
  return liveError.value || ''
})

const statusLabel = computed(() => {
  if (status.value === 'live') return '实时推送'
  if (status.value === 'mock') return '模拟推送'
  if (status.value === 'polling') return '轮询降级'
  if (status.value === 'reconnecting') return '重连中'
  if (status.value === 'connecting') return '连接中'
  return '待连接'
})

function flashClass(row) {
  const kind = flashes.value[rowId(row)]
  return kind ? `flash-${kind}` : ''
}

function fmtQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
}

function fmtBookQty(value) {
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
  const rows = (liveData.value?.rows || []).filter(isRealUserOrder)
  const bidQty = new Map()
  const askQty = new Map()
  const bidCount = new Map()
  const askCount = new Map()
  for (const row of rows) {
    const price = Number(row.price)
    const amount = Number(row.amount) || 0
    const qtyMap = row.side === '买' ? bidQty : askQty
    const countMap = row.side === '买' ? bidCount : askCount
    qtyMap.set(price, (qtyMap.get(price) || 0) + amount)
    countMap.set(price, (countMap.get(price) || 0) + 1)
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
  const threshold = whaleThreshold.value
  return rows
    .map((row) => {
      const price = Number(row.price)
      const amount = Number(row.amount) || 0
      const cum = row.side === '买' ? bidCum.get(price) : askCum.get(price)
      const samePriceCount = row.side === '买' ? bidCount.get(price) : askCount.get(price)
      return {
        ...row,
        cumText: fmtBookQty(cum),
        samePriceCount: samePriceCount || 1,
        isWhale: amount >= threshold
      }
    })
    .sort((a, b) => {
      const dp = Number(b.price) - Number(a.price)
      if (dp) return dp
      if (a.side !== b.side) return a.side === '卖' ? -1 : 1
      return Number(b.amount) - Number(a.amount)
    })
})
</script>

<style scoped>
.page-block + .page-block {
  margin-top: 16px;
}
.amt-buy {
  color: #6a9aff;
}
.amt-sell {
  color: #ffb347;
}
.row-link {
  cursor: pointer;
}
.row-link:hover td {
  color: var(--text-title);
}
.px-bid {
  color: #4cd9a0;
}
.px-ask {
  color: #ff5a7a;
}
.same-price {
  display: inline-block;
  margin-left: 6px;
  padding: 0 5px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 600;
  color: #8aa0c0;
  background: var(--bg-elevated);
  vertical-align: middle;
}
.whale-flag {
  display: inline-block;
  margin-left: 6px;
  padding: 0 6px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2px;
  color: #1b1408;
  background: #ffb347;
  vertical-align: middle;
}
.is-whale td {
  background: rgba(255, 179, 71, 0.12);
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
</style>
