<template>
  <PageState :loading="loading" :error="error">
    <div v-if="data" class="page">
      <div class="card">
        <div class="card-header">
          <span>👥 {{ pageTitle }}</span>
          <div class="header-tools">
            <router-link v-if="!isToday" class="inline-link" to="/desk/users">看今日</router-link>
            <router-link class="inline-link" to="/desk/users/history">历史交易情况</router-link>
            <router-link class="inline-link" to="/ops/absorb">今日资产情况</router-link>
            <span class="badge">{{ isToday ? '不含做市 / 金库等' : `${data.dateLabel} · 不含做市 / 金库等` }}</span>
          </div>
        </div>
        <div class="monitor-status">
          <div v-for="item in data.status" :key="item.text" class="status-item">
            <span class="status-dot" :class="item.color"></span> {{ item.text }}
          </div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-item" @click="$router.push('/chips/user')">
          <div class="label">{{ dayWord }}真实交易用户</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#4cd9a0;">{{ data.kpis.realUsers }}<span class="unit">人</span></div>
            <div class="qty">占持仓 {{ data.kpis.tradedPct }}<span class="unit">%</span></div>
          </div>
          <div class="sub">当日有成交的真实 UID</div>
        </div>
        <div class="kpi-item">
          <div class="label">真实买入</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#6a9aff;">{{ fmtQty(data.kpis.realBuy) }}<span class="unit">万</span></div>
            <div class="qty">{{ fmtQty(data.kpis.realBuyU) }}<span class="unit">万USDT</span></div>
          </div>
          <div class="sub">用户买入 · 你在卖出</div>
        </div>
        <div class="kpi-item">
          <div class="label">真实卖出</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#ffb347;">{{ fmtQty(data.kpis.realSell) }}<span class="unit">万</span></div>
            <div class="qty">{{ fmtQty(data.kpis.realSellU) }}<span class="unit">万USDT</span></div>
          </div>
          <div class="sub">用户卖出 · 你这边是买入</div>
        </div>
        <div class="kpi-item">
          <div class="label">用户净买入</div>
          <div class="kpi-metrics">
            <div class="value" :style="{ color: data.kpis.realNet >= 0 ? '#6a9aff' : '#ffb347' }">
              {{ signedQty(data.kpis.realNet) }}<span class="unit">万</span>
            </div>
          </div>
          <div class="sub">{{ data.kpis.realNet >= 0 ? '散户在接你的卖出' : '散户在给你买入' }}</div>
        </div>
        <div class="kpi-item">
          <div class="label">新增交易用户</div>
          <div class="kpi-metrics">
            <div class="value">{{ data.kpis.newTraders }}<span class="unit">人</span></div>
          </div>
          <div class="sub">{{ dayWord }}首次成交</div>
        </div>
        <div class="kpi-item" @click="$router.push('/chips/user')">
          <div class="label">持仓用户</div>
          <div class="kpi-metrics">
            <div class="value">{{ data.kpis.holders }}<span class="unit">人</span></div>
          </div>
          <div class="sub">交易所侧当前持仓 UID</div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-item">
          <div class="label">买入用户</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#6a9aff;">{{ data.kpis.buyUsers }}<span class="unit">人</span></div>
          </div>
          <div class="sub">{{ dayWord }}有买单的真实 UID</div>
        </div>
        <div class="kpi-item">
          <div class="label">卖出用户</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#ffb347;">{{ data.kpis.sellUsers }}<span class="unit">人</span></div>
          </div>
          <div class="sub">{{ dayWord }}有卖单的真实 UID</div>
        </div>
        <div class="kpi-item">
          <div class="label">回流用户</div>
          <div class="kpi-metrics">
            <div class="value">{{ data.kpis.returning }}<span class="unit">人</span></div>
          </div>
          <div class="sub">非{{ dayWord }}首次成交</div>
        </div>
        <div class="kpi-item">
          <div class="label">人均成交</div>
          <div class="kpi-metrics">
            <div class="value">{{ fmtQty(data.kpis.avgTicket) }}<span class="unit">万</span></div>
          </div>
          <div class="sub">(买+卖) / 交易用户</div>
        </div>
        <div class="kpi-item">
          <div class="label">用户均买价</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#6a9aff;">{{ fmtPrice(data.kpis.avgBuy) }}</div>
            <div class="qty">现价 {{ fmtPrice(data.kpis.lastPrice) }}</div>
          </div>
          <div class="sub">接近做市均卖价</div>
        </div>
        <div class="kpi-item">
          <div class="label">用户均卖价</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#ffb347;">{{ fmtPrice(data.kpis.avgSell) }}</div>
          </div>
          <div class="sub">接近做市均买价</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><span>💹 用户买 / 卖</span><span class="badge">万枚</span></div>
          <ChartBox :option="flowOption" />
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
          <span class="badge">抽样 · 点 UID 进持仓分布</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>UID</th>
                <th>标签</th>
                <th>类型</th>
                <th>买入(万)</th>
                <th>卖出(万)</th>
                <th>净买入</th>
                <th>笔数</th>
                <th>均价</th>
                <th>首笔</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in data.traders" :key="row.uid" class="row-link" @click="$router.push(userDetailPath(row.uid))">
                <td>{{ row.uid }}</td>
                <td><span class="tag" :class="row.tagClass">{{ row.tag }}</span></td>
                <td>{{ row.kind }}</td>
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
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'

const route = useRoute()
const dayDate = computed(() => (typeof route.query.date === 'string' ? route.query.date : ''))
const { loading, error, data, bindPair, load } = usePageData(() =>
  api.getUsersToday(appState.currentPair, appState.config.internalAccounts || [], dayDate.value)
)
bindPair()
watch(dayDate, () => load())

const isToday = computed(() => data.value?.isToday !== false)
const dayWord = computed(() => (isToday.value ? '今日' : '当日'))
const pageTitle = computed(() => (
  isToday.value
    ? '真实用户今日交易情况'
    : `真实用户${data.value?.dateTitle || '当日'}交易情况`
))

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

const flowOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { ...legend, data: ['买入', '卖出'] },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [
    { name: '买入', type: 'bar', data: data.value?.history?.buyHour || [], itemStyle: { color: '#6a9aff' }, barWidth: '28%' },
    { name: '卖出', type: 'bar', data: data.value?.history?.sellHour || [], itemStyle: { color: '#ffb347' }, barWidth: '28%' }
  ]
}))

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
      itemStyle: { color: item.color }
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
