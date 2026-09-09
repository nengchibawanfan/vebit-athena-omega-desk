<template>
  <PageState :loading="loading" :error="error">
    <div v-if="data" class="page">
      <div class="card">
        <div class="card-header">
          <span>👥 {{ pageTitle }}</span>
          <div class="header-tools">
            <router-link v-if="!isToday" class="inline-link" to="/desk/users">看今日</router-link>
            <router-link class="inline-link" to="/desk/users/history">历史</router-link>
            <router-link class="inline-link" to="/desk/users/chips">筹码分布</router-link>
            <span class="badge">{{ isToday ? '交易 + 资产 · 不含做市 / 金库等' : `${data.dateLabel} · 交易 + 资产` }}</span>
          </div>
        </div>
        <StatusStrip :items="data.status" />
      </div>

      <div class="kpi-grid">
        <div class="kpi-item">
          <div class="label">平台用户代币</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#ffb347;">{{ fmtQty(data.absorb?.userToken) }}<span class="unit">万</span></div>
            <div class="qty">{{ fmtQty(data.absorb?.userTokenU) }}<span class="unit">万USDT</span></div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">平台用户USDT</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#4cd9a0;">{{ fmtQty(data.absorb?.userCashU) }}<span class="unit">万USDT</span></div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">用户净买入</div>
          <div class="kpi-metrics">
            <div class="value" :style="{ color: data.kpis.realNet >= 0 ? '#6a9aff' : '#ffb347' }">
              {{ signedQty(data.kpis.realNet) }}<span class="unit">万</span>
            </div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">真实买入</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#6a9aff;">{{ fmtQty(data.kpis.realBuy) }}<span class="unit">万</span></div>
            <div class="qty">{{ fmtQty(data.kpis.realBuyU) }}<span class="unit">万USDT</span></div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">买入用户</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#6a9aff;">{{ data.kpis.buyUsers }}<span class="unit">人</span></div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">买入均价</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#6a9aff;">{{ fmtPrice(data.kpis.avgBuy) }}</div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">{{ dayWord }}真实交易用户</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#4cd9a0;">{{ data.kpis.realUsers }}<span class="unit">人</span></div>
            <div class="qty">占持仓 {{ data.kpis.tradedPct }}<span class="unit">%</span></div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">新增交易用户</div>
          <div class="kpi-metrics">
            <div class="value">{{ data.kpis.newTraders }}<span class="unit">人</span></div>
          </div>
          <div class="sub">{{ dayWord }}首次成交</div>
        </div>
        <div class="kpi-item is-link" @click="$router.push('/desk/users/chips')">
          <div class="label">持仓用户</div>
          <div class="kpi-metrics">
            <div class="value">{{ data.kpis.holders }}<span class="unit">人</span></div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">真实卖出</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#ffb347;">{{ fmtQty(data.kpis.realSell) }}<span class="unit">万</span></div>
            <div class="qty">{{ fmtQty(data.kpis.realSellU) }}<span class="unit">万USDT</span></div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">卖出用户</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#ffb347;">{{ data.kpis.sellUsers }}<span class="unit">人</span></div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">卖出均价</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#ffb347;">{{ fmtPrice(data.kpis.avgSell) }}</div>
          </div>
        </div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-header"><span>💹 用户买 / 卖</span><span class="badge">按成交价 · 万枚</span></div>
          <ChartBox :option="priceFlowOption" />
        </div>
        <div class="card">
          <div class="card-header"><span>👤 活跃人数</span><span class="badge">分时</span></div>
          <ChartBox :option="userOption" />
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <span>🏷️ {{ dayWord }}交易用户构成</span>
            <span class="badge">点标签进散户 / 聪明钱</span>
          </div>
          <ChartBox :option="tagOption" />
        </div>
        <div class="card">
          <div class="card-header"><span>📊 标签成交</span><span class="badge">万枚</span></div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>标签</th><th>人数</th><th>占比</th><th>买入</th><th>卖出</th><th>净买入</th></tr>
              </thead>
              <tbody>
                <tr v-for="row in data.tags" :key="row.name" class="row-link" @click="$router.push(personaPath(row.name))">
                  <td><span class="tag" :class="row.className">{{ row.name }}</span></td>
                  <td>{{ row.users }}</td>
                  <td>{{ row.ratio }}%</td>
                  <td>{{ fmtQty(row.buy) }}</td>
                  <td>{{ fmtQty(row.sell) }}</td>
                  <td :style="{ color: row.net >= 0 ? '#6a9aff' : '#ffb347' }">{{ signedQty(row.net) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span>📋 {{ dayWord }}成交用户</span>
          <span class="badge">抽样 · 点 UID 进单 UID</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>UID</th>
                <th>标签</th>
                <th>买入(万)</th>
                <th>卖出(万)</th>
                <th>净买入</th>
                <th>笔数</th>
                <th>均价</th>
                <th>首笔</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in traderPager.pagedRows" :key="row.uid" class="row-link" @click="$router.push(userDetailPath(row.uid))">
                <td>{{ row.uid }}</td>
                <td><span class="tag" :class="row.tagClass">{{ row.tag }}</span></td>
                <td>{{ fmtQty(row.buy) }}</td>
                <td>{{ fmtQty(row.sell) }}</td>
                <td :style="{ color: row.net >= 0 ? '#6a9aff' : '#ffb347' }">{{ signedQty(row.net) }}</td>
                <td>{{ row.trades }}</td>
                <td>{{ fmtPrice(row.avgPrice) }}</td>
                <td>{{ row.firstTime }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <TablePager
          v-model:page="traderPager.page"
          v-model:page-size="traderPager.pageSize"
          :page-count="traderPager.pageCount"
          :total="traderPager.total"
          :range-text="traderPager.rangeText"
        />
      </div>
    </div>
  </PageState>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'
import { appState } from '@/stores/app'
import { userDetailPath } from '@/utils/uid'
import { usePageData } from '@/composables/usePageData'
import { usePager } from '@/composables/usePager'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import StatusStrip from '@/components/StatusStrip.vue'
import TablePager from '@/components/TablePager.vue'
import { namedHex } from '@/utils/palette'

const route = useRoute()
const dayDate = computed(() => (typeof route.query.date === 'string' ? route.query.date : ''))
const { loading, error, data, bindPair, load } = usePageData(async () => {
  const pair = appState.currentPair
  const accounts = appState.config.internalAccounts || []
  const [users, ops] = await Promise.all([
    api.getUsersToday(pair, accounts, dayDate.value),
    api.getOpsDesk(pair, appState.config.sleepIdleDays, accounts, dayDate.value)
  ])
  return { ...users, absorb: ops.absorb }
})
bindPair()
watch(dayDate, () => load())

const isToday = computed(() => data.value?.isToday !== false)
const dayWord = computed(() => (isToday.value ? '今日' : '当日'))
const pageTitle = computed(() => (
  isToday.value
    ? '真实用户今日'
    : `真实用户${data.value?.dateTitle || '当日'}`
))
const traderPager = usePager(computed(() => data.value?.traders || []))

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

function personaPath(name) {
  const map = { 散户: '/user-profile/retail', 聪明钱: '/user-profile/smart', 羊毛党: '/user-profile/wool', 程序化: '/user-profile/prog', 吃客损KOL: '/user-profile/kol' }
  return map[name] || '/desk/users'
}

const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }
const legend = { textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 }
const xAxis = computed(() => ({
  data: data.value?.history?.hours || [],
  axisLabel: { color: '#4a6080', fontSize: 8, interval: 3 }
}))

function nearestPriceLabel(flow, price) {
  const prices = flow?.prices || []
  const labels = flow?.labels || []
  const target = Number(price)
  if (!prices.length || Number.isNaN(target)) return ''
  let best = 0
  let dist = Infinity
  prices.forEach((value, index) => {
    const gap = Math.abs(Number(value) - target)
    if (gap < dist) {
      dist = gap
      best = index
    }
  })
  return labels[best] || ''
}

const priceFlowOption = computed(() => {
  const flow = data.value?.priceFlow || {}
  const lastLabel = nearestPriceLabel(flow, flow.lastPrice)
  const buyLabel = nearestPriceLabel(flow, flow.avgBuy)
  const sellLabel = nearestPriceLabel(flow, flow.avgSell)
  const markLines = [
    lastLabel && { xAxis: lastLabel, lineStyle: { color: '#4cd9a0', type: 'solid', width: 1 }, label: { formatter: `现价 ${fmtPrice(flow.lastPrice)}`, color: '#4cd9a0', fontSize: 9 } },
    buyLabel && { xAxis: buyLabel, lineStyle: { color: '#6a9aff', type: 'dashed', width: 1 }, label: { formatter: `买均 ${fmtPrice(flow.avgBuy)}`, color: '#6a9aff', fontSize: 9 } },
    sellLabel && { xAxis: sellLabel, lineStyle: { color: '#ffb347', type: 'dashed', width: 1 }, label: { formatter: `卖均 ${fmtPrice(flow.avgSell)}`, color: '#ffb347', fontSize: 9 } }
  ].filter(Boolean)
  return {
    tooltip: {
      trigger: 'axis',
      formatter(params) {
        const title = params?.[0]?.axisValue || ''
        const lines = (params || []).map((item) => `${item.marker}${item.seriesName} ${item.value}万`)
        return `${title}<br/>${lines.join('<br/>')}`
      }
    },
    legend: { ...legend, data: ['买入', '卖出'] },
    grid: { left: '8%', right: '4%', top: '18%', bottom: '16%' },
    xAxis: {
      data: flow.labels || [],
      axisLabel: { color: '#4a6080', fontSize: 8, rotate: 40 }
    },
    yAxis,
    series: [
      {
        name: '买入',
        type: 'bar',
        data: flow.buy || [],
        itemStyle: { color: '#6a9aff' },
        barWidth: '28%',
        markLine: { silent: true, symbol: 'none', data: markLines }
      },
      { name: '卖出', type: 'bar', data: flow.sell || [], itemStyle: { color: '#ffb347' }, barWidth: '28%' }
    ]
  }
})

const userOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { ...legend, data: ['活跃用户', '新增'] },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [
    { name: '活跃用户', type: 'line', data: data.value?.history?.userHour || [], smooth: true, lineStyle: { color: '#4cd9a0', width: 2 }, areaStyle: { color: 'rgba(76,217,160,0.12)' }, symbol: 'none' },
    { name: '新增', type: 'bar', data: data.value?.history?.newHour || [], itemStyle: { color: '#6a9aff' }, barWidth: '40%' }
  ]
}))

const tagOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['42%', '68%'],
    data: (data.value?.tags || []).map((item) => ({
      value: item.users,
      name: item.name,
      itemStyle: { color: namedHex(item.name) }
    })),
    label: { color: '#b0c8e8', fontSize: 10, formatter: '{b}\n{c}人' }
  }]
}))
</script>

<style scoped>
.kpi-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.kpi-item.is-link {
  cursor: pointer;
}
.kpi-item.is-link:hover {
  border-color: var(--accent, #6a9aff);
  background: var(--bg-kpi-hover);
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
.row-link {
  cursor: pointer;
}
.row-link:hover td {
  color: #f0f6ff;
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
