<template>
  <div class="page">
    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="card">
          <div class="card-header">
            <span>📒 真实用户历史资产情况</span>
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
              <span class="badge">不含做市 / 金库等</span>
            </div>
          </div>
          <div class="monitor-status">
            <div v-for="item in data.status" :key="item.text" class="status-item">
              <span class="status-dot" :class="item.color"></span> {{ item.text }}
            </div>
          </div>
          <p class="blurb">
            真实用户所内 USDT + 代币市值。点日期看当日资产、买墙和充值。
            <router-link class="inline-link" to="/ops/absorb">看今日</router-link>
          </p>
        </div>

        <div class="kpi-grid">
          <div class="kpi-item" @click="$router.push('/ops/absorb')">
            <div class="label">期末用户资产</div>
            <div class="kpi-metrics">
              <div class="value">{{ fmtQty(data.kpis.endAssets) }}<span class="unit">万USDT</span></div>
              <div class="qty">{{ signedQty(data.kpis.assetsChange) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">期初 {{ fmtQty(data.kpis.startAssets) }} · {{ signedQty(data.kpis.assetsChangePct) }}%</div>
          </div>
          <div class="kpi-item" @click="$router.push('/ops/absorb')">
            <div class="label">期末用户USDT</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#4cd9a0;">{{ fmtQty(data.kpis.endCash) }}<span class="unit">万USDT</span></div>
              <div class="qty">{{ signedQty(data.kpis.cashChange) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">占资产 {{ data.kpis.endCashPct }}%</div>
          </div>
          <div class="kpi-item" @click="$router.push('/chips/user')">
            <div class="label">期末用户代币</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ffb347;">{{ fmtQty(data.kpis.endToken) }}<span class="unit">万</span></div>
              <div class="qty">{{ fmtQty(data.kpis.endTokenU) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">{{ signedQty(data.kpis.tokenChange) }}万 · {{ data.base }}</div>
          </div>
          <div class="kpi-item" @click="$router.push('/chips/user')">
            <div class="label">期末持仓用户</div>
            <div class="kpi-metrics">
              <div class="value">{{ data.kpis.endHolders }}<span class="unit">人</span></div>
              <div class="qty">{{ signedInt(data.kpis.holderChange) }}<span class="unit">人</span></div>
            </div>
            <div class="sub">期初 {{ data.kpis.startHolders }}</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>💰 用户资产 / USDT / 代币市值</span>
            <span class="badge">万USDT · 近 {{ data.range }} 天</span>
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
              <span>👤 持仓用户</span>
              <span class="badge">人</span>
            </div>
            <ChartBox :option="holdersOption" />
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📋 每日明细</span>
            <span class="badge">点日期看当日 · 新 → 旧</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>日期</th>
                  <th>资产(万USDT)</th>
                  <th>USDT(万)</th>
                  <th>代币(万)</th>
                  <th>代币市值</th>
                  <th>USDT占比</th>
                  <th>持仓用户</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in data.rows" :key="row.dateKey || row.date" class="row-link" @click="$router.push(assetsDayTo(row))">
                  <td>
                    <router-link class="date-link" :to="assetsDayTo(row)" @click.stop>{{ row.date }}</router-link>
                  </td>
                  <td>{{ fmtQty(row.assetsU) }}</td>
                  <td style="color:#4cd9a0;">{{ fmtQty(row.cashU) }}</td>
                  <td style="color:#ffb347;">{{ fmtQty(row.tokenQty) }}</td>
                  <td>{{ fmtQty(row.tokenU) }}</td>
                  <td>{{ row.cashPct }}%</td>
                  <td>{{ row.holders }}</td>
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
import { isDeskToday } from '@/config/constants'
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
  api.getUsersAssetsHistory(
    appState.currentPair,
    rangeDays.value,
    appState.config.internalAccounts || [],
    appState.config.sleepIdleDays
  )
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

function signedInt(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n > 0 ? `+${n}` : String(n)
}

function assetsDayTo(row) {
  if (!row?.dateKey || isDeskToday(row.dateKey)) return '/ops/absorb'
  return { path: '/ops/absorb', query: { date: row.dateKey } }
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
  legend: { ...legend, data: ['用户资产', '用户USDT', '代币市值'] },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis: { ...yAxis, name: '万USDT', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
  series: [
    {
      name: '用户资产',
      type: 'line',
      data: data.value?.series?.assetsU || [],
      smooth: true,
      lineStyle: { color: '#e8f0ff', width: 2 },
      symbol: 'none'
    },
    {
      name: '用户USDT',
      type: 'line',
      data: data.value?.series?.cashU || [],
      smooth: true,
      lineStyle: { color: '#4cd9a0', width: 2 },
      areaStyle: { color: 'rgba(76,217,160,0.08)' },
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

const tokenOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis: { ...yAxis, name: '万', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
  series: [{
    name: '代币',
    type: 'bar',
    data: data.value?.series?.tokenQty || [],
    itemStyle: { color: 'rgba(255,179,71,0.82)' },
    barWidth: '42%'
  }]
}))

const holdersOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [{
    name: '持仓用户',
    type: 'line',
    data: data.value?.series?.holders || [],
    smooth: true,
    lineStyle: { color: '#6a9aff', width: 2 },
    areaStyle: { color: 'rgba(106,154,255,0.12)' },
    symbol: 'none'
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
</style>
