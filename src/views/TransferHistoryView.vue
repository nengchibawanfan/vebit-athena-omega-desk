<template>
  <div class="page">
    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="card">
          <div class="card-header">
            <span>📜 历史充提</span>
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
              <span class="badge">所内可卖供给 · 不含做市 / 金库等</span>
            </div>
          </div>
          <StatusStrip :items="data.status" />
          <p class="blurb">
            日充值 / 提现。点日期看当日明细。
            <router-link class="inline-link" to="/whales/exchange">看今日</router-link>
            <router-link class="inline-link" to="/ops/ladder">盘口大单</router-link>
          </p>
        </div>

        <div class="kpi-grid">
          <div class="kpi-item" @click="$router.push('/whales/exchange')">
            <div class="label">区间充值</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ff5a7a;">{{ fmtQty(data.kpis.periodDeposit) }}<span class="unit">万</span></div>
              <div class="qty">{{ fmtQty(data.kpis.periodDepositU) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">日均 {{ fmtQty(data.kpis.avgDeposit) }}万 · 最高 {{ fmtQty(data.kpis.maxDeposit) }}</div>
          </div>
          <div class="kpi-item" @click="$router.push('/whales/exchange')">
            <div class="label">区间提现</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#4cd9a0;">{{ fmtQty(data.kpis.periodWithdraw) }}<span class="unit">万</span></div>
              <div class="qty">{{ fmtQty(data.kpis.periodWithdrawU) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">日均 {{ fmtQty(data.kpis.avgWithdraw) }}万 · 最高 {{ fmtQty(data.kpis.maxWithdraw) }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">区间净充提</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: data.kpis.periodNet >= 0 ? '#ff5a7a' : '#4cd9a0' }">
                {{ signedQty(data.kpis.periodNet) }}<span class="unit">万</span>
              </div>
              <div class="qty">{{ signedQty(data.kpis.periodNetU) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">{{ data.kpis.periodNet >= 0 ? '区间所内供给增加' : '区间货离开唯一市场' }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">净流入天数</div>
            <div class="kpi-metrics">
              <div class="value">{{ data.kpis.netInDays }}<span class="unit">天</span></div>
              <div class="qty">净流出 {{ data.kpis.netOutDays }}<span class="unit">天</span></div>
            </div>
            <div class="sub">期末净 {{ signedQty(data.kpis.endNet) }}万 · vs 期初 {{ signedQty(data.kpis.netChange) }}</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📥 充值 / 提现</span>
            <span class="badge">万枚 · 近 {{ data.range }} 天</span>
          </div>
          <ChartBox :option="flowOption" size="tall" />
        </div>

        <div class="card">
          <div class="card-header">
            <span>📉 净充提</span>
            <span class="badge">充 − 提</span>
          </div>
          <ChartBox :option="netOption" />
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
                  <th>充值(万)</th>
                  <th>提现(万)</th>
                  <th>净充提</th>
                  <th>充值笔数</th>
                  <th>提现笔数</th>
                  <th>充值UID</th>
                  <th>提现UID</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in data.rows" :key="row.dateKey || row.date" class="row-link" @click="$router.push(dayTo(row))">
                  <td>
                    <router-link class="date-link" :to="dayTo(row)" @click.stop>{{ row.date }}</router-link>
                  </td>
                  <td style="color:#ff5a7a;">{{ fmtQty(row.depositAmt) }}</td>
                  <td style="color:#4cd9a0;">{{ fmtQty(row.withdrawAmt) }}</td>
                  <td :style="{ color: row.netAmt >= 0 ? '#ff5a7a' : '#4cd9a0' }">{{ signedQty(row.netAmt) }}</td>
                  <td>{{ row.depositCount }}</td>
                  <td>{{ row.withdrawCount }}</td>
                  <td>{{ row.depositUsers }}</td>
                  <td>{{ row.withdrawUsers }}</td>
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
import StatusStrip from '@/components/StatusStrip.vue'

const ranges = [
  { days: 7, label: '7天' },
  { days: 15, label: '15天' },
  { days: 30, label: '30天' }
]
const rangeDays = ref(15)

const { loading, error, data, load, bindPair } = usePageData(() =>
  api.getTransferHistory(
    appState.currentPair,
    rangeDays.value,
    appState.config.whaleThreshold,
    appState.config.internalAccounts || []
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

function dayTo(row) {
  if (!row?.dateKey || isDeskToday(row.dateKey)) return '/whales/exchange'
  return { path: '/whales/exchange', query: { date: row.dateKey } }
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

const flowOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { ...legend, data: ['充值', '提现'] },
  grid: { left: '6%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [
    { name: '充值', type: 'bar', data: data.value?.series?.depositAmt || [], itemStyle: { color: '#ff5a7a' }, barWidth: '28%' },
    { name: '提现', type: 'bar', data: data.value?.series?.withdrawAmt || [], itemStyle: { color: '#4cd9a0' }, barWidth: '28%' }
  ]
}))

const netOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [{
    name: '净充提',
    type: 'line',
    data: data.value?.series?.netAmt || [],
    smooth: true,
    lineStyle: { color: '#ffb347', width: 2 },
    areaStyle: { color: 'rgba(255,179,71,0.12)' },
    symbol: 'none'
  }]
}))
</script>

<style scoped>
.header-tools {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
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
  margin-left: 1px;
}
</style>
