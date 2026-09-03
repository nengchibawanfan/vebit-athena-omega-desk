<template>
  <div class="page">
    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="card">
          <div class="card-header">
            <span>📜 真实用户历史交易情况</span>
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
            只统计真实 UID 的成交与持仓人数。点日期看当日拆腿、分时和成交用户。
            <router-link class="inline-link" to="/desk/users">看今日</router-link>
            <router-link class="inline-link" to="/ops/absorb/history">历史资产情况</router-link>
          </p>
        </div>

        <div class="kpi-grid">
          <div class="kpi-item" @click="$router.push('/chips/user')">
            <div class="label">期末交易用户</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#4cd9a0;">{{ data.kpis.endUsers }}<span class="unit">人</span></div>
              <div class="qty">{{ signedInt(data.kpis.userChange) }}<span class="unit">人</span></div>
            </div>
            <div class="sub">期初 {{ data.kpis.startUsers }} · 区间均 {{ data.kpis.avgUsers }}</div>
          </div>
          <div class="kpi-item" @click="$router.push('/chips/user')">
            <div class="label">期末持仓用户</div>
            <div class="kpi-metrics">
              <div class="value">{{ data.kpis.endHolders }}<span class="unit">人</span></div>
              <div class="qty">成交占持仓 {{ data.kpis.endTradedPct }}%</div>
            </div>
            <div class="sub">交易所侧当前持仓 UID</div>
          </div>
          <div class="kpi-item">
            <div class="label">区间新增</div>
            <div class="kpi-metrics">
              <div class="value">{{ data.kpis.periodNew }}<span class="unit">人</span></div>
            </div>
            <div class="sub">近 {{ data.range }} 天首次成交合计</div>
          </div>
          <div class="kpi-item">
            <div class="label">区间买入</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ fmtQty(data.kpis.periodBuy) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">用户买入 · 你在卖出 · {{ data.base }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">区间卖出</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ffb347;">{{ fmtQty(data.kpis.periodSell) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">用户卖出 · 你在买入 · {{ data.base }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">区间净买入</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: data.kpis.periodNet >= 0 ? '#6a9aff' : '#ffb347' }">
                {{ signedQty(data.kpis.periodNet) }}<span class="unit">万</span>
              </div>
              <div class="qty">期末人均 {{ fmtQty(data.kpis.endAvgTicket) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">{{ data.kpis.periodNet >= 0 ? '散户在接你的卖出' : '散户在给你买入' }}</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>👤 交易用户 / 持仓 / 新增</span>
            <span class="badge">人 · 近 {{ data.range }} 天</span>
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

        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span>📊 成交占持仓</span>
              <span class="badge">%</span>
            </div>
            <ChartBox :option="tradedPctOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>🎫 人均成交</span>
              <span class="badge">万枚</span>
            </div>
            <ChartBox :option="ticketOption" />
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
                  <th>交易用户</th>
                  <th>新增</th>
                  <th>回流</th>
                  <th>持仓用户</th>
                  <th>占持仓</th>
                  <th>买(万)</th>
                  <th>卖(万)</th>
                  <th>净买入</th>
                  <th>人均(万)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in data.rows" :key="row.dateKey || row.date" class="row-link" @click="$router.push(usersDayTo(row))">
                  <td>
                    <router-link class="date-link" :to="usersDayTo(row)" @click.stop>{{ row.date }}</router-link>
                  </td>
                  <td>{{ row.realUsers }}</td>
                  <td>{{ row.newTraders }}</td>
                  <td>{{ row.returning }}</td>
                  <td>{{ row.holders }}</td>
                  <td>{{ row.tradedPct }}%</td>
                  <td style="color:#6a9aff;">{{ fmtQty(row.realBuy) }}</td>
                  <td style="color:#ffb347;">{{ fmtQty(row.realSell) }}</td>
                  <td :style="{ color: row.realNet >= 0 ? '#6a9aff' : '#ffb347' }">{{ signedQty(row.realNet) }}</td>
                  <td>{{ fmtQty(row.avgTicket) }}</td>
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
  api.getUsersHistory(appState.currentPair, rangeDays.value, appState.config.internalAccounts || [])
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

function usersDayTo(row) {
  if (!row?.dateKey || isDeskToday(row.dateKey)) return '/desk/users'
  return { path: '/desk/users', query: { date: row.dateKey } }
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

const tradedPctOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis: { ...yAxis, name: '%', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
  series: [{
    name: '成交占持仓',
    type: 'line',
    data: data.value?.series?.tradedPct || [],
    smooth: true,
    lineStyle: { color: '#4cd9a0', width: 2 },
    areaStyle: { color: 'rgba(76,217,160,0.12)' },
    symbol: 'none'
  }]
}))

const ticketOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis: { ...yAxis, name: '万', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
  series: [{
    name: '人均成交',
    type: 'line',
    data: data.value?.series?.avgTicket || [],
    smooth: true,
    lineStyle: { color: '#a78bfa', width: 2 },
    areaStyle: { color: 'rgba(167,139,250,0.12)' },
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
