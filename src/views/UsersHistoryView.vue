<template>
  <div class="page">
    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="card">
          <div class="card-header">
            <span>📜 真实用户历史</span>
            <div class="header-tools">
              <router-link class="inline-link" to="/desk/users">今日</router-link>
              <router-link class="inline-link" to="/desk/users/chips">筹码分布</router-link>
              <span class="badge">全部历史 · 点日期看当日</span>
            </div>
          </div>
          <StatusStrip :items="data.status" />
        </div>

        <div class="kpi-grid">
          <div class="kpi-item" @click="$router.push('/desk/users')">
            <div class="label">交易用户</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#4cd9a0;">{{ data.kpis.endUsers }}<span class="unit">人</span></div>
            </div>
          </div>
          <div class="kpi-item" @click="$router.push('/desk/users/chips')">
            <div class="label">持仓用户</div>
            <div class="kpi-metrics">
              <div class="value">{{ data.kpis.endHolders }}<span class="unit">人</span></div>
            </div>
          </div>
          <div class="kpi-item">
            <div class="label">买入数量</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ fmtQty(data.kpis.periodBuy) }}<span class="unit">万</span></div>
            </div>
          </div>
          <div class="kpi-item">
            <div class="label">卖出数量</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ffb347;">{{ fmtQty(data.kpis.periodSell) }}<span class="unit">万</span></div>
            </div>
          </div>
          <div class="kpi-item">
            <div class="label">买入金额</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ fmtQty(data.kpis.periodBuyU) }}<span class="unit">万USDT</span></div>
            </div>
          </div>
          <div class="kpi-item">
            <div class="label">卖出金额</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ffb347;">{{ fmtQty(data.kpis.periodSellU) }}<span class="unit">万USDT</span></div>
            </div>
          </div>
          <div class="kpi-item">
            <div class="label">净买入</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: data.kpis.periodNet >= 0 ? '#6a9aff' : '#ffb347' }">
                {{ signedQty(data.kpis.periodNet) }}<span class="unit">万</span>
              </div>
              <div class="qty">期末人均 {{ fmtQty(data.kpis.endAvgTicket) }}<span class="unit">万</span></div>
            </div>
          </div>
          <div class="kpi-item">
            <div class="label">用户均买价</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ fmtPrice(data.kpis.avgBuy) }}</div>
            </div>
          </div>
          <div class="kpi-item">
            <div class="label">用户均卖价</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ffb347;">{{ fmtPrice(data.kpis.avgSell) }}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>👤 交易用户 / 持仓 / 新增</span>
            <span class="badge">人 · 全部历史</span>
          </div>
          <ChartBox :option="usersOption" size="tall" />
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span>💹 日买 / 卖成交</span>
              <span class="badge">万枚</span>
            </div>
            <ChartBox :option="flowOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>📉 用户净买入</span>
              <span class="badge">万枚</span>
            </div>
            <ChartBox :option="netOption" />
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>💰 用户资产 / USDT / 代币市值</span>
            <span class="badge">万USDT · 全部历史</span>
          </div>
          <ChartBox :option="assetOption" size="tall" />
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span>📦 {{ data.base }} 持仓</span>
              <span class="badge">万枚</span>
            </div>
            <ChartBox :option="tokenOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>💵 USDT 占比</span>
              <span class="badge">%</span>
            </div>
            <ChartBox :option="cashPctOption" />
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📋 每日交易 / 资产</span>
            <span class="badge">点日期看当日 · 新 → 旧</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>日期</th>
                  <th>交易用户</th>
                  <th>新增</th>
                  <th>持仓用户</th>
                  <th>占持仓</th>
                  <th>买(万)</th>
                  <th>卖(万)</th>
                  <th>净买入</th>
                  <th>持仓数量(万)</th>
                  <th>平均持仓成本</th>
                  <th>USDT(万)</th>
                  <th>代币市值</th>
                  <th>资产(万USDT)</th>
                  <th>USDT占比</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in dayRows" :key="row.dateKey || row.date" class="row-link" @click="$router.push(usersDayTo(row))">
                  <td>
                    <router-link class="date-link" :to="usersDayTo(row)" @click.stop>{{ row.date }}</router-link>
                  </td>
                  <td>{{ row.realUsers }}</td>
                  <td>{{ row.newTraders }}</td>
                  <td>{{ row.holders }}</td>
                  <td>{{ fmtPct(row.tradedPct) }}</td>
                  <td style="color:#6a9aff;">{{ fmtQty(row.realBuy) }}</td>
                  <td style="color:#ffb347;">{{ fmtQty(row.realSell) }}</td>
                  <td :style="{ color: row.realNet >= 0 ? '#6a9aff' : '#ffb347' }">{{ signedQty(row.realNet) }}</td>
                  <td>{{ fmtQty(row.holdQty) }}</td>
                  <td>{{ fmtPrice(row.avgCost) }}</td>
                  <td style="color:#4cd9a0;">{{ fmtQty(row.cashU) }}</td>
                  <td>{{ fmtQty(row.tokenU) }}</td>
                  <td>{{ fmtQty(row.assetsU) }}</td>
                  <td>{{ fmtPct(row.cashPct) }}</td>
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
import { computed } from 'vue'
import { api } from '@/api'
import { appState } from '@/stores/app'
import { isDeskToday } from '@/config/constants'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import StatusStrip from '@/components/StatusStrip.vue'

const { loading, error, data, bindPair } = usePageData(async () => {
  const pair = appState.currentPair
  const accounts = appState.config.internalAccounts || []
  const [trade, assets] = await Promise.all([
    api.getUsersHistory(pair, 'all', accounts),
    api.getUsersAssetsHistory(pair, 'all', accounts, appState.config.sleepIdleDays)
  ])
  return { ...trade, assets }
})
bindPair()

const dayRows = computed(() => {
  const trades = data.value?.rows || []
  const assets = data.value?.assets?.rows || []
  const assetMap = new Map(assets.map((row) => [row.dateKey || row.date, row]))
  const seen = new Set()
  const rows = trades.map((row) => {
    const key = row.dateKey || row.date
    seen.add(key)
    const asset = assetMap.get(key) || {}
    return {
      ...asset,
      ...row,
      holders: row.holders ?? asset.holders,
      holdQty: row.holdQty ?? asset.tokenQty
    }
  })
  for (const asset of assets) {
    const key = asset.dateKey || asset.date
    if (seen.has(key)) continue
    rows.push({
      ...asset,
      holdQty: asset.tokenQty
    })
  }
  return rows
})

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

function fmtPct(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return `${n}%`
}

function fmtPrice(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  if (n >= 1000) return n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
  if (n >= 1) return n.toLocaleString('zh-CN', { maximumFractionDigits: 4 })
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 6 })
}

function usersDayTo(row) {
  if (!row?.dateKey || isDeskToday(row.dateKey)) return '/desk/users'
  return { path: '/desk/users', query: { date: row.dateKey } }
}

function axisInterval(range) {
  const n = Number(range) || 30
  if (n <= 7) return 0
  if (n <= 15) return 1
  if (n <= 30) return 4
  return Math.max(4, Math.ceil(n / 8) - 1)
}

const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }
const legend = { textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 }
const xAxis = computed(() => ({
  data: data.value?.series?.dates || [],
  axisLabel: {
    color: '#4a6080',
    fontSize: 8,
    interval: axisInterval(data.value?.range)
  }
}))
const assetAxis = computed(() => ({
  data: data.value?.assets?.series?.dates || [],
  axisLabel: {
    color: '#4a6080',
    fontSize: 8,
    interval: axisInterval(data.value?.assets?.range)
  }
}))

const usersOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { ...legend, data: ['交易用户', '持仓用户', '新增'] },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [
    {
      name: '交易用户',
      type: 'line',
      data: data.value?.series?.realUsers || [],
      smooth: true,
      lineStyle: { color: '#4cd9a0', width: 2 },
      areaStyle: { color: 'rgba(76,217,160,0.12)' },
      symbol: 'none'
    },
    {
      name: '持仓用户',
      type: 'line',
      data: data.value?.series?.holders || [],
      smooth: true,
      lineStyle: { color: '#e8f0ff', width: 2 },
      symbol: 'none'
    },
    {
      name: '新增',
      type: 'bar',
      data: data.value?.series?.newTraders || [],
      itemStyle: { color: '#6a9aff' },
      barWidth: '36%'
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
    { name: '买入', type: 'bar', data: data.value?.series?.realBuy || [], itemStyle: { color: '#6a9aff' }, barWidth: '28%' },
    { name: '卖出', type: 'bar', data: data.value?.series?.realSell || [], itemStyle: { color: '#ffb347' }, barWidth: '28%' }
  ]
}))

const netOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [{
    name: '净买入',
    type: 'bar',
    data: data.value?.series?.realNet || [],
    itemStyle: {
      color: (params) => (Number(params.value) >= 0 ? '#6a9aff' : '#ffb347')
    },
    barWidth: '42%'
  }]
}))

const assetOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { ...legend, data: ['用户资产', '用户USDT', '代币市值'] },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: assetAxis.value,
  yAxis: { ...yAxis, name: '万USDT', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
  series: [
    {
      name: '用户资产',
      type: 'line',
      data: data.value?.assets?.series?.assetsU || [],
      smooth: true,
      lineStyle: { color: '#e8f0ff', width: 2 },
      symbol: 'none'
    },
    {
      name: '用户USDT',
      type: 'line',
      data: data.value?.assets?.series?.cashU || [],
      smooth: true,
      lineStyle: { color: '#4cd9a0', width: 2 },
      areaStyle: { color: 'rgba(76,217,160,0.08)' },
      symbol: 'none'
    },
    {
      name: '代币市值',
      type: 'line',
      data: data.value?.assets?.series?.tokenU || [],
      smooth: true,
      lineStyle: { color: '#ffb347', width: 2 },
      areaStyle: { color: 'rgba(255,179,71,0.08)' },
      symbol: 'none'
    }
  ]
}))

const tokenOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: assetAxis.value,
  yAxis: { ...yAxis, name: '万', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
  series: [{
    name: '代币',
    type: 'bar',
    data: data.value?.assets?.series?.tokenQty || [],
    itemStyle: { color: 'rgba(255,179,71,0.82)' },
    barWidth: '42%'
  }]
}))

const cashPctOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: assetAxis.value,
  yAxis: { ...yAxis, name: '%', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
  series: [{
    name: 'USDT占比',
    type: 'line',
    data: data.value?.assets?.series?.cashPct || [],
    smooth: true,
    lineStyle: { color: '#6a9aff', width: 2 },
    areaStyle: { color: 'rgba(106,154,255,0.12)' },
    symbol: 'none'
  }]
}))
</script>

<style scoped>
.date-link {
  color: #6a9aff;
  text-decoration: none;
  font-weight: 600;
}
.date-link:hover {
  text-decoration: underline;
}
.row-link {
  cursor: pointer;
}
.row-link:hover td {
  color: var(--text-title);
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
</style>
