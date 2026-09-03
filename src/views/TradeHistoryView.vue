<template>
  <div class="page">
    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="card">
          <div class="card-header">
            <span>📜 历史交易情况</span>
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
              <span class="badge">单日统计 · 期末对齐今日</span>
            </div>
          </div>
          <div class="monitor-status">
            <div v-for="item in data.status" :key="item.text" class="status-item">
              <span class="status-dot" :class="item.color"></span> {{ item.text }}
            </div>
          </div>
          <p class="blurb">
            每日做市卖出 / 买入。点日期看当日拆腿、分时和成交明细。
            均卖比均买高 = (均卖价 − 均买价) ÷ 均买价。
            <router-link class="inline-link" to="/ops/dump">看今日</router-link>
            <router-link class="inline-link" to="/desk/mm/history">历史资产情况</router-link>
          </p>
        </div>

        <div class="kpi-grid">
          <div class="kpi-item">
            <div class="label">区间卖出</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ff5a7a;">{{ fmtQty(data.kpis.periodSell) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">做市卖出 · {{ data.base }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">区间买入</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ fmtQty(data.kpis.periodBuy) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">做市买入 · {{ data.base }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">代币净变动</div>
            <div class="kpi-metrics">
              <div class="value">{{ signedQty(data.kpis.periodToken) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">买入 − 卖出</div>
          </div>
          <div class="kpi-item">
            <div class="label">USDT 净增加</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: Number(data.kpis.periodUsdt) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                {{ signedQty(data.kpis.periodUsdt) }}<span class="unit">万USDT</span>
              </div>
            </div>
            <div class="sub">区间收回 − 花出</div>
          </div>
          <div class="kpi-item">
            <div class="label">期末日均卖比均买高</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ffb347;">{{ data.kpis.endSpread }}<span class="unit">%</span></div>
            </div>
            <div class="sub">区间日均 {{ data.kpis.avgSpread }}% · 卖 {{ data.kpis.endAvgSell }} · 买 {{ data.kpis.endAvgBuy }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">期末日买卖</div>
            <div class="kpi-metrics">
              <div class="value">
                <span style="color:#ff5a7a;">{{ fmtQty(data.kpis.endSell) }}</span>
                <span class="unit"> / </span>
                <span style="color:#6a9aff;">{{ fmtQty(data.kpis.endBuy) }}</span>
              </div>
            </div>
            <div class="sub">卖出 / 买入 · 对齐今日</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📈 现价 / 库存成本 / 净买入</span>
            <span class="badge">现价 {{ fmtPrice(data.kpis.endLast) }} · 库存成本 {{ fmtPrice(data.kpis.endCost) }} · 柱在零上=买入</span>
          </div>
          <ChartBox size="combo" :option="flowCostOption" />
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span>💹 日卖出 / 买入</span>
              <span class="badge">万枚</span>
            </div>
            <ChartBox :option="flowOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>💵 日 USDT 净增加</span>
              <span class="badge">万USDT</span>
            </div>
            <ChartBox :option="usdtOption" />
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
                  <th>卖出(万)</th>
                  <th>买入(万)</th>
                  <th>均卖</th>
                  <th>均买</th>
                  <th>均卖比均买高</th>
                  <th>USDT净增加</th>
                  <th>代币净变动</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in data.rows" :key="row.dateKey || row.date" class="row-link" @click="$router.push(dumpDayTo(row))">
                  <td>
                    <router-link class="date-link" :to="dumpDayTo(row)" @click.stop>{{ row.date }}</router-link>
                  </td>
                  <td style="color:#ff5a7a;">{{ fmtQty(row.sellQty) }}</td>
                  <td style="color:#6a9aff;">{{ fmtQty(row.buyQty) }}</td>
                  <td>{{ fmtPrice(row.avgSell) }}</td>
                  <td>{{ fmtPrice(row.avgBuy) }}</td>
                  <td>{{ row.spreadPct }}%</td>
                  <td :style="{ color: Number(row.usdtNet) >= 0 ? '#4cd9a0' : '#ff5a7a' }">{{ signedQty(row.usdtNet) }}</td>
                  <td>{{ signedQty(row.tokenDelta) }}</td>
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
import { mmFlowChartOption } from '@/utils/mmFlowChart'

const ranges = [
  { days: 7, label: '7天' },
  { days: 15, label: '15天' },
  { days: 30, label: '30天' }
]
const rangeDays = ref(15)

const { loading, error, data, load, bindPair } = usePageData(() =>
  api.getTradeHistory(appState.currentPair, rangeDays.value, appState.config.internalAccounts || [])
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

function fmtPrice(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  if (n >= 1000) return n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
  if (n >= 1) return n.toLocaleString('zh-CN', { maximumFractionDigits: 4 })
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 6 })
}

function dumpDayTo(row) {
  if (!row?.dateKey || isDeskToday(row.dateKey)) return '/ops/dump'
  return { path: '/ops/dump', query: { date: row.dateKey } }
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

const flowCostOption = computed(() => mmFlowChartOption({
  labels: data.value?.series?.dates || [],
  lastHour: data.value?.series?.lastPrice || [],
  costHour: data.value?.series?.invCost || [],
  netHour: data.value?.series?.netQty || [],
  interval: (data.value?.range || 15) <= 7 ? 0 : (data.value?.range || 15) <= 15 ? 1 : 4
}))

const flowOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { ...legend, data: ['卖出', '买入'] },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [
    { name: '卖出', type: 'bar', data: data.value?.series?.sellQty || [], itemStyle: { color: '#ff5a7a' }, barWidth: '28%' },
    { name: '买入', type: 'bar', data: data.value?.series?.buyQty || [], itemStyle: { color: '#6a9aff' }, barWidth: '28%' }
  ]
}))

const usdtOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis: { ...yAxis, name: '万USDT', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
  series: [{
    name: 'USDT净增加',
    type: 'bar',
    data: data.value?.series?.usdtNet || [],
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
</style>
