<template>
  <PageState :loading="loading" :error="error">
    <div v-if="data" class="page">
        <div class="card stance-card">
          <div class="card-header">
            <span>🎯 今日总览</span>
            <span class="badge">{{ ops.stance.action }}</span>
          </div>
          <div class="monitor-status">
            <div class="status-item">
              <span class="status-dot" :class="actionDot(ops.stance.action)"></span>
              现价 {{ ops.stance.lastPrice }}
            </div>
            <div class="status-item">
              <span class="status-dot" :class="Number(ops.stance.mmDevPct) >= 0 ? 'green' : 'yellow'"></span>
              做市账户库存成本 {{ fmtPrice(ops.stance.mmCost) }} · 偏离 {{ signed(ops.stance.mmDevPct) }}%
            </div>
            <div class="status-item">
              <span class="status-dot" :class="Number(ops.stance.devPct) >= 0 ? 'yellow' : 'green'"></span>
              真实用户持仓均价 {{ ops.stance.avgCost }} · 偏离 {{ signed(ops.stance.devPct) }}%
            </div>
          </div>
        </div>

      <div class="kpi-grid cockpit">
        <div class="kpi-item" @click="$router.push('/ops/dump')">
          <div class="label">做市账户余额</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#4cd9a0;">
              {{ fmtQty(ops.dump.ownUsdt) }}<span class="unit">万USDT</span>
            </div>
          </div>
          <div class="sub">自有 {{ fmtQty(ops.dump.cashTrueU) }} · 借入虚增 {{ fmtQty(ops.dump.cashBorrowedU) }}</div>
        </div>
        <div class="kpi-item" @click="$router.push('/ops/dump')">
          <div class="label">可周转库存</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#a78bfa;">{{ fmtQty(ops.dump.dumpable) }}<span class="unit">万</span></div>
          </div>
          <div class="sub">自有 {{ fmtQty(ops.dump.tokenOwn) }} · 借入虚增 {{ fmtQty(ops.dump.tokenBorrowed) }}</div>
        </div>
        <div class="kpi-item" @click="$router.push('/desk/users')">
          <div class="label">平台用户USDT</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#4cd9a0;">{{ fmtQty(ops.absorb.userCashU) }}<span class="unit">万USDT</span></div>
          </div>
        </div>
        <div class="kpi-item" @click="$router.push('/desk/users/chips')">
          <div class="label">平台用户代币</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#ffb347;">{{ fmtQty(data.kpis.exchUser) }}<span class="unit">万</span></div>
            <div class="qty">活跃 {{ fmtQty(data.kpis.activeExchange) }} · 沉睡 {{ fmtQty(data.kpis.sleepExchange) }}</div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <span>📤 今日交易情况</span>
            <div class="header-tools">
              <router-link class="inline-link" to="/ops/dump/history">历史</router-link>
              <router-link class="inline-link" to="/ops/dump">详情</router-link>
            </div>
          </div>
          <div class="trade-board">
            <div class="trade-legs">
              <div class="trade-leg is-sell">
                <div class="mini-label">卖出</div>
                <div class="leg-metrics">
                  <div class="leg-row">
                    <span>数量</span>
                    <strong>{{ fmtQty(data.mm.sellQty) }}<em>万</em></strong>
                  </div>
                  <div class="leg-row">
                    <span>金额</span>
                    <strong>{{ fmtQty(data.mm.sellU) }}<em>万USDT</em></strong>
                  </div>
                  <div class="leg-row">
                    <span>均价</span>
                    <strong>{{ fmtPrice(data.mm.avgSell) }}</strong>
                  </div>
                </div>
              </div>
              <div class="trade-leg is-buy">
                <div class="mini-label">买入</div>
                <div class="leg-metrics">
                  <div class="leg-row">
                    <span>数量</span>
                    <strong>{{ fmtQty(data.mm.buyQty) }}<em>万</em></strong>
                  </div>
                  <div class="leg-row">
                    <span>金额</span>
                    <strong>{{ fmtQty(data.mm.buyU) }}<em>万USDT</em></strong>
                  </div>
                  <div class="leg-row">
                    <span>均价</span>
                    <strong>{{ fmtPrice(data.mm.avgBuy) }}</strong>
                  </div>
                </div>
              </div>
            </div>
            <div class="trade-meta">
              <div>
                <div class="mini-label">USDT 净增加</div>
                <div class="mini-value" :style="{ color: Number(data.mm.usdtNet) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                  {{ signedQty(data.mm.usdtNet) }}<span>万USDT</span>
                </div>
              </div>
              <div>
                <div class="mini-label">代币净变动</div>
                <div class="mini-value">{{ signedQty(data.mm.netQty) }}<span>万</span></div>
              </div>
              <div>
                <div class="mini-label">平均价格</div>
                <div class="mini-value">{{ data.mm.avgNetPrice == null ? '--' : data.mm.avgNetPrice }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <span>🪜 价格台阶</span>
            <router-link class="inline-link" to="/ops/ladder">现价到该档真实挂单 · 上卖墙 / 下买墙</router-link>
          </div>
          <div class="table-wrap mini-table">
            <table>
              <thead>
                <tr>
                  <th>台阶</th>
                  <th>价格</th>
                  <th>挂单</th>
                  <th>金额</th>
                  <th>累积</th>
                  <th>金额</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in ladderPreview"
                  :key="row.pct"
                  class="row-link"
                  :class="{ 'is-spot': row.side === 'spot' }"
                  @click="$router.push('/ops/ladder')"
                >
                  <td>{{ row.label }}</td>
                  <td class="mini-price">{{ row.price }}</td>
                  <td :style="{ color: bookColor(row) }">{{ fmtQty(row.bandQty) }}</td>
                  <td :style="{ color: bookColor(row) }">{{ fmtQty(row.bandU) }}</td>
                  <td :style="{ color: bookColor(row) }">{{ fmtQty(row.cumQty) }}</td>
                  <td :style="{ color: bookColor(row) }">{{ fmtQty(row.cumU) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card supply-box">
        <div class="card-header">
          <span>🪙 供给位置</span>
          <span class="badge">所内可成交 · 链上只是仓库</span>
        </div>
        <div class="supply-row">
          <div class="kpi-item metric-half">
            <div class="label">所内流通</div>
            <div class="value" style="color:#6a9aff;">{{ fmtQty(data.kpis.circExchange) }}<span class="unit">万</span></div>
            <div class="comp-bar">
              <i class="seg-active" :style="barFlex(data.kpis.activeExchange)"></i>
              <i class="seg-sleep" :style="barFlex(data.kpis.sleepExchange)"></i>
              <i class="seg-mm" :style="barFlex(data.kpis.mmQty)"></i>
            </div>
            <div class="comp-line">
              <span><em style="color:#4cd9a0;">活跃</em> {{ fmtQty(data.kpis.activeExchange) }}</span>
              <span><em style="color:#ffb347;">沉睡</em> {{ fmtQty(data.kpis.sleepExchange) }}</span>
              <span class="comp-link" @click.stop="$router.push('/ops/dump')">
                <em style="color:#6a9aff;">做市</em> {{ fmtQty(data.kpis.mmQty) }}
              </span>
            </div>
          </div>
          <div class="kpi-item metric-half">
            <div class="label">链上仓库</div>
            <div class="value" style="color:#ff6b7a;">{{ fmtQty(data.kpis.circOnchain) }}<span class="unit">万</span></div>
            <div class="comp-bar">
              <i class="seg-active" :style="barFlex(data.kpis.activeOnchain)"></i>
              <i class="seg-onchain-sleep" :style="barFlex(data.kpis.sleepOnchain)"></i>
            </div>
            <div class="comp-line">
              <span><em style="color:#4cd9a0;">可充回</em> {{ fmtQty(data.kpis.activeOnchain) }}</span>
              <span><em style="color:#a78bfa;">沉睡</em> {{ fmtQty(data.kpis.sleepOnchain) }}</span>
            </div>
            <div class="sub">不能成交 · 充回所内才可卖</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span>🚨 报警</span>
          <div class="header-tools">
            <router-link class="inline-link" to="/alerts">查看全部</router-link>
            <span class="badge">{{ data.alertSummary }}</span>
          </div>
        </div>
        <div v-if="!data.alertItems?.length" class="empty-alerts">暂无待处理警报</div>
        <div v-else class="alert-list">
          <table>
            <thead>
              <tr>
                <th>时间</th>
                <th>级别</th>
                <th>内容</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in data.alertItems"
                :key="(item.time || '') + item.text"
                class="row-link"
                @click="$router.push(item.to || '/whales/exchange')"
              >
                <td>{{ item.time || '--' }}</td>
                <td>
                  <span class="alert-level">
                    <span class="status-dot" :class="alertLevelDot(item.level)"></span>
                    {{ item.level || '关注' }}
                  </span>
                </td>
                <td>{{ item.text }}</td>
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
import { api } from '@/api'
import { appState } from '@/stores/app'
import { usePageData } from '@/composables/usePageData'
import PageState from '@/components/PageState.vue'
import { actionDot, alertLevelDot } from '@/utils/palette'

const { loading, error, data, bindPair } = usePageData(() =>
  api.getDashboard(
    appState.currentPair,
    appState.config.internalAccounts || [],
    appState.config.sleepIdleDays
  )
)
bindPair()

const emptyOps = {
  formula: '',
  stance: { action: '--', actionWhy: '', lastPrice: '--', avgCost: '--', devPct: 0, mmCost: '--', mmDevPct: 0, nextStop: '--', nextFloor: '--' },
  dump: {},
  absorb: {},
  users: {},
  ladder: []
}

const ops = computed(() => data.value?.ops || emptyOps)
const ladderPreview = computed(() =>
  (ops.value.ladder || []).filter((row) => [-10, -5, 0, 5, 10].includes(row.pct))
)

function fmtQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
}

function signedQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  const text = n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
  return n > 0 ? `+${text}` : text
}

function signed(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n > 0 ? `+${n}` : String(n)
}

function bookColor(row) {
  if (row?.bookSide === 'ask' || row?.side === 'up') return '#ff5a7a'
  if (row?.bookSide === 'bid' || row?.side === 'down') return '#6a9aff'
  return ''
}

function fmtPrice(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  if (n >= 1000) return n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
  if (n >= 1) return n.toLocaleString('zh-CN', { maximumFractionDigits: 4 })
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 6 })
}

function barFlex(value) {
  const n = Number(value)
  return { flex: Number.isNaN(n) || n <= 0 ? 0 : n }
}
</script>

<style scoped>
.kpi-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.kpi-metrics {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 2px;
  padding: 8px 0 6px;
}
.qty {
  font-size: 12px;
  color: var(--text-qty);
  font-weight: 600;
}
.qty .unit {
  font-size: 10px;
  color: var(--text-soft);
  font-weight: 400;
  margin-left: 1px;
}
.kpi-grid.cockpit {
  grid-template-columns: repeat(4, 1fr);
}
.mini-kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 4px 2px 8px;
}
.trade-board {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 2px 2px 8px;
}
.trade-legs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.trade-leg {
  padding: 10px 12px;
  border-radius: 8px;
  text-align: left;
}
.trade-leg.is-sell {
  background: rgba(255, 90, 122, 0.08);
}
.trade-leg.is-buy {
  background: rgba(106, 154, 255, 0.08);
}
.trade-leg.is-sell .leg-row strong {
  color: #ff5a7a;
}
.trade-leg.is-buy .leg-row strong {
  color: #6a9aff;
}
.leg-metrics {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
}
.leg-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}
.leg-row span {
  font-size: 10px;
  color: var(--text-muted);
}
.leg-row strong {
  font-size: 14px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.leg-row em {
  margin-left: 2px;
  font-style: normal;
  font-size: 10px;
  font-weight: 400;
  color: var(--text-soft);
}
.trade-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 2px 4px 0;
}
.trade-meta .mini-value {
  font-size: 16px;
}
.mini-label {
  font-size: 10px;
  color: var(--text-muted);
}
.mini-value {
  margin-top: 4px;
  font-size: 18px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.mini-value span {
  margin-left: 2px;
  font-size: 11px;
  font-weight: 400;
  color: var(--text-soft);
}
.mini-sub {
  margin-top: 2px;
  font-size: 11px;
  color: var(--text-muted);
}
.mini-table {
  max-height: 260px;
}
.mini-price {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}
.is-spot td {
  font-weight: 600;
}
.supply-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.metric-half {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  width: 100%;
  min-height: 0;
  padding: 12px 10px;
  font-family: inherit;
  color: inherit;
}
.comp-bar {
  display: flex;
  width: 100%;
  height: 4px;
  margin: 6px 0 5px;
  border-radius: 99px;
  overflow: hidden;
  background: var(--border);
}
.comp-bar i {
  display: block;
  min-width: 0;
  height: 100%;
}
.seg-active {
  background: #4cd9a0;
}
.seg-sleep {
  background: #ffb347;
}
.seg-mm {
  background: #6a9aff;
}
.seg-onchain-sleep {
  background: #a78bfa;
}
.comp-line {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px 8px;
  font-size: 8px;
  color: var(--text-muted);
  line-height: 1.3;
  font-variant-numeric: tabular-nums;
}
.comp-line em {
  font-style: normal;
  font-weight: 600;
  margin-right: 2px;
}
.comp-link {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.comp-link:hover {
  color: var(--text-title);
}
.supply-box {
  margin-bottom: 16px;
}
.empty-alerts {
  padding: 18px 8px;
  font-size: 12px;
  color: var(--text-soft);
  text-align: center;
}
.alert-level {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.header-tools {
  display: flex;
  align-items: center;
  gap: 10px;
}
.inline-link {
  color: #6a9aff;
  text-decoration: none;
  font-size: 10px;
  text-transform: none;
  letter-spacing: 0;
}
.inline-link:hover {
  text-decoration: underline;
}
.row-link {
  cursor: pointer;
}
.row-link:hover td {
  color: var(--text-title);
}
@media (max-width: 900px) {
  .kpi-grid.cockpit {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 720px) {
  .kpi-grid.cockpit,
  .supply-row,
  .mini-kpis,
  .trade-legs,
  .trade-meta {
    grid-template-columns: 1fr;
  }
}
</style>
