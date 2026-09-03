<template>
  <div class="page">
    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="card">
          <div class="card-header">
            <span>📜 做市账户历史资产情况</span>
            <div class="header-tools">
              <div class="range-switch">
                <button
                  v-for="item in ranges"
                  :key="item.days"
                  type="button"
                  class="btn-sm"
                  :class="{ primary: rangeDays === item.days }"
                  @click="setRange(item.days)"
                >{{ item.label }}</button>
              </div>
              <span class="badge">做市账户 · 部分可能是从用户借入的虚增</span>
            </div>
          </div>
          <div class="monitor-status">
            <div v-for="item in data.status" :key="item.text" class="status-item">
              <span class="status-dot" :class="item.color"></span> {{ item.text }}
            </div>
          </div>
          <p class="blurb">
            做市资金 = 做市账户余额 + 代币市值。做市账户余额 = 真实余额（买入卖出可正、买高卖低可负）+ 借入金额。期末点与「做市账户今日资产情况」对齐。
            <router-link class="inline-link" to="/desk/mm">看今日</router-link>
            <router-link class="inline-link" to="/ops/dump/history">历史交易情况</router-link>
          </p>
        </div>

        <div class="kpi-grid">
          <div class="kpi-item">
            <div class="label">期末做市资金</div>
            <div class="kpi-metrics">
              <div class="value">{{ fmtQty(data.kpis.endEquity) }}<span class="unit">万USDT</span></div>
              <div class="qty">余额 {{ signedQty(data.kpis.endCash) }} · 代币 {{ fmtQty(data.kpis.endTokenU) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">做市账户余额 + 代币市值 · 近 {{ data.range }} 天末</div>
          </div>
          <div class="kpi-item">
            <div class="label">区间资金变化</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: data.kpis.equityChange >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                {{ signedQty(data.kpis.equityChangePct) }}<span class="unit">%</span>
              </div>
              <div class="qty">{{ signedQty(data.kpis.equityChange) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">期初 {{ fmtQty(data.kpis.startEquity) }}万USDT</div>
          </div>
          <div class="kpi-item">
            <div class="label">期末 {{ data.base }} 库存</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#a78bfa;">{{ fmtQty(data.kpis.endInv) }}<span class="unit">万</span></div>
              <div class="qty">{{ signedQty(data.kpis.invChange) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">自有 {{ fmtQty(data.kpis.endTokenOwn) }} · 借入虚增 {{ fmtQty(data.kpis.endTokenBorrowed) }} · {{ data.kpis.bandStatus }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">期末做市账户余额</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: Number(data.kpis.endCash) >= 0 ? '#6a9aff' : '#ff5a7a' }">{{ signedQty(data.kpis.endCash) }}<span class="unit">万USDT</span></div>
              <div class="qty">真实 {{ signedQty(data.kpis.endCashTrue) }} · 借入 {{ fmtQty(data.kpis.endCashBorrowed) }}</div>
            </div>
            <div class="sub">真实余额 + 借入金额 · {{ data.quote }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">区间买入</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ fmtQty(data.kpis.periodBuy) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">做市买入 · {{ data.range }} 天</div>
          </div>
          <div class="kpi-item">
            <div class="label">区间卖出</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ffb347;">{{ fmtQty(data.kpis.periodSell) }}<span class="unit">万</span></div>
              <div class="qty">净 {{ signedQty(data.kpis.periodNet) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">交易盈亏 {{ signedQty(data.kpis.periodRealized) }}万USDT</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>💰 做市资金 / 做市账户余额 / 代币市值</span>
            <span class="badge">万USDT · 近 {{ data.range }} 天</span>
          </div>
          <ChartBox :option="assetOption" size="tall" />
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span>📦 {{ data.base }} 做市库存</span>
              <span class="badge">自有 vs 借入虚增</span>
            </div>
            <ChartBox :option="invOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>💹 日买 / 卖成交</span>
              <span class="badge">万枚</span>
            </div>
            <ChartBox :option="flowOption" />
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span>💵 余额占比</span>
              <span class="badge">%</span>
            </div>
            <ChartBox :option="cashPctOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>📈 当日交易盈亏</span>
              <span class="badge">万USDT</span>
            </div>
            <ChartBox :option="realizedOption" />
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📋 每日明细</span>
            <span class="badge">新 → 旧</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>日期</th>
                  <th>做市资金(万USDT)</th>
                  <th>做市账户余额</th>
                  <th>真实余额</th>
                  <th>借入金额</th>
                  <th>代币自有</th>
                  <th>代币借入</th>
                  <th>买(万)</th>
                  <th>卖(万)</th>
                  <th>净买入</th>
                  <th>交易盈亏(万USDT)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in data.rows" :key="row.date">
                  <td>{{ row.date }}</td>
                  <td>{{ fmtQty(row.equityU) }}</td>
                  <td :style="{ color: Number(row.cashU) >= 0 ? '#6a9aff' : '#ff5a7a' }">{{ signedQty(row.cashU) }}</td>
                  <td :style="{ color: Number(row.cashTrueU) >= 0 ? '#4cd9a0' : '#ff5a7a' }">{{ signedQty(row.cashTrueU) }}</td>
                  <td>{{ fmtQty(row.cashBorrowedU) }}</td>
                  <td>{{ fmtQty(row.tokenOwn) }}</td>
                  <td>{{ fmtQty(row.tokenBorrowed) }}</td>
                  <td style="color:#6a9aff;">{{ fmtQty(row.buyQty) }}</td>
                  <td style="color:#ffb347;">{{ fmtQty(row.sellQty) }}</td>
                  <td :style="{ color: row.netQty >= 0 ? '#6a9aff' : '#ffb347' }">{{ signedQty(row.netQty) }}</td>
                  <td :style="{ color: row.realizedU >= 0 ? '#4cd9a0' : '#ff5a7a' }">{{ signedQty(row.realizedU) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </PageState>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { api } from '@/api'
import { appState } from '@/stores/app'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'

const ranges = [
  { days: 7, label: '7天' },
  { days: 15, label: '15天' },
  { days: 30, label: '30天' }
]
const rangeDays = ref(15)

const { loading, error, data, load, bindPair } = usePageData(() =>
  api.getMmHistory(appState.currentPair, rangeDays.value, appState.config.internalAccounts || [])
)
bindPair()
watch(rangeDays, () => load())

function setRange(days) {
  if (rangeDays.value === days) return
  rangeDays.value = days
}

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

const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }
const legend = { textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 }
const xAxis = computed(() => ({
  data: data.value?.series?.dates || [],
  axisLabel: {
    color: '#4a6080',
    fontSize: 8,
    interval: (data.value?.range || 15) <= 7 ? 0 : (data.value?.range || 15) <= 15 ? 1 : 4
  }
}))

const assetOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { ...legend, data: ['做市资金', '做市账户余额', '代币市值'] },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis: { ...yAxis, name: '万USDT', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
  series: [
    {
      name: '做市资金',
      type: 'line',
      data: data.value?.series?.equity || [],
      smooth: true,
      lineStyle: { color: '#e8f0ff', width: 2 },
      symbol: 'none'
    },
    {
      name: '做市账户余额',
      type: 'line',
      data: data.value?.series?.cash || [],
      smooth: true,
      lineStyle: { color: '#6a9aff', width: 2 },
      areaStyle: { color: 'rgba(106,154,255,0.08)' },
      symbol: 'none'
    },
    {
      name: '代币市值',
      type: 'line',
      data: data.value?.series?.tokenU || [],
      smooth: true,
      lineStyle: { color: '#ffb347', width: 2 },
      areaStyle: { color: 'rgba(255,179,71,0.08)' },
      symbol: 'none'
    }
  ]
}))

const invOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { ...legend, data: ['自有代币', '借入虚增'] },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis: { ...yAxis, name: '万枚', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
  series: [
    {
      name: '自有代币',
      type: 'bar',
      stack: 'inv',
      data: data.value?.series?.tokenOwn || [],
      itemStyle: { color: 'rgba(76,217,160,0.82)' },
      barWidth: '45%'
    },
    {
      name: '借入虚增',
      type: 'bar',
      stack: 'inv',
      data: data.value?.series?.tokenBorrowed || [],
      itemStyle: { color: 'rgba(255,179,71,0.82)' }
    }
  ]
}))

const flowOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { ...legend, data: ['买入', '卖出'] },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [
    { name: '买入', type: 'bar', data: data.value?.series?.buyQty || [], itemStyle: { color: '#6a9aff' }, barWidth: '28%' },
    { name: '卖出', type: 'bar', data: data.value?.series?.sellQty || [], itemStyle: { color: '#ffb347' }, barWidth: '28%' }
  ]
}))

const cashPctOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis: { ...yAxis, name: '%', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
  series: [{
    name: '余额占比',
    type: 'line',
    data: data.value?.series?.cashPct || [],
    smooth: true,
    lineStyle: { color: '#6a9aff', width: 2 },
    areaStyle: { color: 'rgba(106,154,255,0.12)' },
    symbol: 'none'
  }]
}))

const realizedOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [{
    name: '交易盈亏',
    type: 'bar',
    data: data.value?.series?.realizedU || [],
    itemStyle: {
      color: (params) => (Number(params.value) >= 0 ? '#4cd9a0' : '#ff5a7a')
    },
    barWidth: '42%'
  }]
}))
</script>

<style scoped>
.header-tools {
  display: flex;
  align-items: center;
  gap: 10px;
}
.range-switch {
  display: flex;
  gap: 6px;
}
.blurb {
  margin-top: 10px;
  font-size: 11px;
  color: var(--text-soft);
  line-height: 1.5;
}
.inline-link {
  color: #6a9aff;
  text-decoration: none;
  margin-left: 6px;
}
.inline-link:hover {
  text-decoration: underline;
}
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
}
</style>
