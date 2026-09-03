<template>
  <div class="page">
    <CollapsibleConfig class="filter-panel" title="⚙️ 用户筹码配置" storage-key="user-chips-sleep">
      <template #extra>沉睡判定 / 体量分档</template>
      <div class="exclude-form">
        <div class="field">
          <label>沉睡判定</label>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:12px; color:#b0c8e8; white-space:nowrap;">超过</span>
            <input
              type="number"
              min="1"
              step="1"
              style="width:70px;"
              :value="appState.config.sleepIdleDays"
              @change="onSleepDaysChange"
            />
            <span style="font-size:12px; color:#b0c8e8; white-space:nowrap;">天无成交</span>
          </div>
        </div>
        <div class="field">
          <label>快捷</label>
          <div style="display:flex; gap:6px;">
            <button class="btn-sm" :class="{ primary: appState.config.sleepIdleDays === 5 }" @click="setSleepDays(5)">5天</button>
            <button class="btn-sm" :class="{ primary: appState.config.sleepIdleDays === 14 }" @click="setSleepDays(14)">14天</button>
            <button class="btn-sm" :class="{ primary: appState.config.sleepIdleDays === 30 }" @click="setSleepDays(30)">30天</button>
          </div>
        </div>
      </div>
      <div class="exclude-form">
        <div class="field">
          <label>体量分档</label>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:12px; color:#b0c8e8; white-space:nowrap;">持仓 ≥</span>
            <input
              type="number"
              min="1"
              step="1"
              style="width:70px;"
              :value="appState.config.sleepSizeThreshold"
              @change="onSizeThresholdChange"
            />
            <span style="font-size:12px; color:#b0c8e8; white-space:nowrap;">万算大户一类</span>
          </div>
        </div>
        <div class="field">
          <label>快捷</label>
          <div style="display:flex; gap:6px;">
            <button class="btn-sm" :class="{ primary: Number(appState.config.sleepSizeThreshold) === 10 }" @click="setSizeThreshold(10)">10万</button>
            <button class="btn-sm" :class="{ primary: Number(appState.config.sleepSizeThreshold) === 50 }" @click="setSizeThreshold(50)">50万</button>
            <button class="btn-sm" :class="{ primary: Number(appState.config.sleepSizeThreshold) === 100 }" @click="setSizeThreshold(100)">100万</button>
          </div>
        </div>
      </div>
    </CollapsibleConfig>

    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="card">
          <div class="card-header">
            <span>👥 真实用户持仓均价</span>
            <span class="badge">不含做市 / 金库等</span>
          </div>
          <p class="blurb">{{ data.formula }}</p>
          <div class="monitor-status">
            <div class="status-item">
              <span class="status-dot green"></span>
              所内真实用户 · 不含做市账户、金库、项目方、员工、LP
            </div>
            <div class="status-item">
              <span class="status-dot yellow"></span>
              买入按成交价入库，充值按到账现价入库。卖出只减数量，用来看对手会不会砍、会不会兑现
            </div>
          </div>
        </div>

        <div class="kpi-grid holder-kpis">
          <div class="kpi-item">
            <div class="label">持仓均价</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ data.kpis.avgCostLabel }}</div>
              <div class="qty">中位 {{ data.kpis.medianCostLabel }}</div>
            </div>
            <div class="sub">按所内持仓加权 · 单位 USDT</div>
          </div>
          <div class="kpi-item">
            <div class="label">现价</div>
            <div class="kpi-metrics">
              <div class="value">{{ data.kpis.lastPriceLabel }}</div>
              <div class="qty" :style="{ color: data.kpis.devPct >= 0 ? '#ffb347' : '#4cd9a0' }">
                {{ data.kpis.devPct >= 0 ? '+' : '' }}{{ data.kpis.devPct }}<span class="unit">%</span>
              </div>
            </div>
            <div class="sub">相对持仓均价</div>
          </div>
          <div class="kpi-item is-link" :class="{ picked: bandFilter === data.kpis.denseName }" @click="toggleBand(data.kpis.denseName)">
            <div class="label">密集成本区</div>
            <div class="kpi-metrics">
              <div class="value range">{{ data.kpis.denseName }}</div>
              <div class="qty">{{ data.kpis.densePct }}<span class="unit">%</span> · {{ data.kpis.denseUsers }}人</div>
            </div>
            <div class="sub">该区间筹码最多 · 点击筛选</div>
          </div>
          <div class="kpi-item">
            <div class="label">浮盈筹码</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#4cd9a0;">{{ data.kpis.profitPct }}<span class="unit">%</span></div>
              <div class="qty">{{ fmtQty(data.kpis.profitAmount) }}<span class="unit">万</span> · {{ data.kpis.profitUsers }}人</div>
            </div>
            <div class="sub">均价低于现价</div>
          </div>
          <div class="kpi-item">
            <div class="label">浮亏筹码</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ff5a7a;">{{ data.kpis.lossPct }}<span class="unit">%</span></div>
              <div class="qty">{{ fmtQty(data.kpis.lossAmount) }}<span class="unit">万</span> · {{ data.kpis.lossUsers }}人</div>
            </div>
            <div class="sub">均价高于现价</div>
          </div>
          <div class="kpi-item is-link" :class="{ picked: bandFilter === data.kpis.mostUsersName }" @click="toggleBand(data.kpis.mostUsersName)">
            <div class="label">人数最多区间</div>
            <div class="kpi-metrics">
              <div class="value range">{{ data.kpis.mostUsersName }}</div>
              <div class="qty">{{ data.kpis.mostUsers }}<span class="unit">人</span> · {{ data.kpis.mostUsersPct }}%</div>
            </div>
            <div class="sub">按 UID 计 · 点击筛选</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📈 用户持仓均价分布</span>
            <span class="header-actions">
              <button class="btn-sm" :class="{ primary: costMetric === 'amount' }" @click="costMetric = 'amount'">按持仓</button>
              <button class="btn-sm" :class="{ primary: costMetric === 'users' }" @click="costMetric = 'users'">按人数</button>
              <span class="badge">柱为区间 · 虚线现价 · 点线持仓均价</span>
            </span>
          </div>
          <ChartBox size="xlarge" :option="costOption" @chart-click="onCostChartClick" />
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span>📋 持仓均价分档</span>
              <span class="badge">{{ filledCostBands.length }} 档 · 现价左侧浮盈</span>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>持仓均价</th>
                    <th>人数</th>
                    <th>持仓(万)</th>
                    <th>占所内</th>
                    <th>vs现价</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in filledCostBands"
                    :key="row.name"
                    class="row-link"
                    :class="{ picked: bandFilter === row.name, 'is-sleep': row.stance === '浮亏' }"
                    @click="toggleBand(row.name)"
                  >
                    <td>{{ row.name }}</td>
                    <td>{{ row.users }}</td>
                    <td>{{ fmtQty(row.amount) }}</td>
                    <td>{{ row.ofTotal }}%</td>
                    <td :style="{ color: row.vsPct >= 0 ? '#4cd9a0' : '#ff5a7a' }">{{ row.vsLabel }}</td>
                    <td><span class="tag" :class="row.stanceTag">{{ row.stance }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><span>😰 相对现价分层</span><span class="badge">按持仓均价离现价远近</span></div>
            <ChartBox :option="pnlBucketOption" />
          </div>
        </div>

        <div class="kpi-grid holder-kpis">
          <div class="kpi-item">
            <div class="label">所内可卖</div>
            <div class="kpi-metrics">
              <div class="value">{{ fmtQty(data.kpis.totalAmount) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">交易所用户持仓合计</div>
          </div>
          <div class="kpi-item">
            <div class="label">活跃筹码</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#4cd9a0;">{{ fmtQty(data.kpis.activeAmount) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">名单中 {{ data.kpis.activeUsers }} 人近期有成交</div>
          </div>
          <div class="kpi-item">
            <div class="label">沉睡筹码</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ffb347;">{{ fmtQty(data.kpis.sleepAmount) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">≥{{ data.kpis.sleepIdleDays }}天无成交</div>
          </div>
          <div class="kpi-item">
            <div class="label">沉睡占比</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ffb347;">{{ data.kpis.sleepRatio }}<span class="unit">%</span></div>
              <div class="qty">大户 ≥{{ sizeThreshold }}万 占沉睡 {{ largeSleepShare }}<span class="unit">%</span></div>
            </div>
            <div class="sub">占所内可卖</div>
          </div>
          <div class="kpi-item">
            <div class="label">沉睡用户</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#a78bfa;">{{ data.kpis.sleepUsers }}<span class="unit">人</span></div>
            </div>
            <div class="sub">前 {{ data.kpis.shownCount }} 名中</div>
          </div>
          <div class="kpi-item">
            <div class="label">近30日变化</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: data.kpis.change30 >= 0 ? '#ffb347' : '#4cd9a0' }">
                {{ data.kpis.change30 >= 0 ? '+' : '' }}{{ data.kpis.change30 }}<span class="unit">%</span>
              </div>
              <div class="qty" :style="{ color: data.kpis.change30Amount >= 0 ? '#ffb347' : '#4cd9a0' }">
                {{ data.kpis.change30Amount >= 0 ? '+' : '' }}{{ fmtQty(data.kpis.change30Amount) }}<span class="unit">万</span>
              </div>
            </div>
            <div class="sub">沉睡筹码较30日前</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📊 近30日交易所沉睡筹码</span>
            <span class="badge">柱状为活跃 / 沉睡量 · 折线为沉睡占比</span>
          </div>
          <ChartBox size="xlarge" :option="sleepTrendOption" />
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span>📦 沉睡筹码体量占比</span>
              <span class="badge">≥{{ sizeThreshold }}万为大户一类 · 占沉睡筹码</span>
            </div>
            <ChartBox :option="sleepSizeOption" />
          </div>
          <div class="card">
            <div class="card-header"><span>📋 沉睡分档明细</span><span class="badge">{{ sleepSizeTiers.length }} 档</span></div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr><th>档位</th><th>人数</th><th>持仓(万)</th><th>占沉睡</th><th>占所内</th></tr>
                </thead>
                <tbody>
                  <tr v-for="row in sleepSizeTiers" :key="row.name" :class="{ 'is-sleep': row.isLarge }">
                    <td><span class="tag" :class="row.isLarge ? 'warning' : row.label === '中额' ? 'robot' : 'user'">{{ row.label }}</span> {{ row.name }}</td>
                    <td>{{ row.users }}</td>
                    <td>{{ fmtQty(row.amount) }}</td>
                    <td>{{ row.ofSleep }}%</td>
                    <td>{{ row.ofTotal }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header"><span>💤 未成交天数分布</span><span class="badge">按持仓量 · 橙色为已沉睡</span></div>
            <ChartBox :option="idleDistOption" />
          </div>
          <div class="card">
            <div class="card-header"><span>📊 持仓集中度</span><span class="badge">前5名占比</span></div>
            <ChartBox :option="pieOption" />
          </div>
        </div>

        <div class="card detail-table-card">
          <div class="card-header">
            <span>👥 用户筹码明细</span>
            <span class="header-actions">
              <button class="btn-sm" :class="{ primary: tableFilter === 'all' }" @click="tableFilter = 'all'">全部</button>
              <button class="btn-sm" :class="{ primary: tableFilter === 'sleep' }" @click="tableFilter = 'sleep'">仅沉睡</button>
              <button v-if="bandFilter" class="btn-sm primary" @click="bandFilter = null">均价 {{ bandFilter }} ✕</button>
              <span class="badge">{{ tableBadge }}</span>
            </span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>用户ID</th>
                  <th>持仓(万)</th>
                  <th>持仓均价</th>
                  <th>均价区间</th>
                  <th>浮盈亏</th>
                  <th>偏离现价</th>
                  <th>最后活跃</th>
                  <th>未成交(天)</th>
                  <th>持仓天数</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in visibleRows" :key="row.id" class="row-link" :class="{ 'is-sleep': row.status === '沉睡' }" @click="$router.push(userDetailPath(row.id))">
                  <td>{{ row.id }}</td>
                  <td>{{ row.amount }}</td>
                  <td>{{ row.costLabel || row.cost }}</td>
                  <td>{{ row.costBand }}</td>
                  <td :style="{ color: row.pnlColor }">{{ row.pnl }}</td>
                  <td :style="{ color: row.pnlColor }">{{ row.ratio }}</td>
                  <td>{{ row.lastActive }}</td>
                  <td>{{ row.sleepDays }}</td>
                  <td>{{ row.days }}</td>
                  <td><span class="tag" :class="row.statusTag">{{ row.status }}</span></td>
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
import { appState, updateConfig } from '@/stores/app'
import { userDetailPath } from '@/utils/uid'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import CollapsibleConfig from '@/components/CollapsibleConfig.vue'

const tableFilter = ref('all')
const costMetric = ref('amount')
const bandFilter = ref(null)
const { loading, error, data, bindPair, load } = usePageData(() =>
  api.getHolders(appState.currentPair, appState.config.sleepIdleDays, appState.config.internalAccounts || [])
)
bindPair()

watch(() => data.value, () => {
  bandFilter.value = null
})

function toggleBand(name) {
  if (!name) return
  bandFilter.value = bandFilter.value === name ? null : name
}

function onCostChartClick(params) {
  const name = (data.value?.costBands || [])[params?.dataIndex]?.name
  if (name) toggleBand(name)
}

function fmtQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
}

function onSleepDaysChange(event) {
  setSleepDays(Number(event.target.value))
}

function setSleepDays(days) {
  const value = Number(days)
  if (!value || value < 1) return
  updateConfig({ sleepIdleDays: value })
  load()
}

function onSizeThresholdChange(event) {
  setSizeThreshold(Number(event.target.value))
}

function setSizeThreshold(value) {
  const n = Number(value)
  if (!n || n < 1) return
  updateConfig({ sleepSizeThreshold: n })
}

const sizeThreshold = computed(() => {
  const n = Number(appState.config.sleepSizeThreshold)
  return n > 0 ? n : 50
})

const sleepSizeTiers = computed(() => {
  const rows = (data.value?.rows || []).filter((row) => row.status === '沉睡')
  const sleepAmount = Number(data.value?.kpis?.sleepAmount) || rows.reduce((sum, row) => sum + Number(row.amount || 0), 0)
  const totalAmount = Number(data.value?.kpis?.totalAmount) || 0
  const T = sizeThreshold.value
  const smallMax = Math.max(1, Math.round(T / 5))
  const defs = smallMax < T
    ? [
        { name: `<${smallMax}万`, min: 0, max: smallMax, color: '#6a9aff', label: '小额' },
        { name: `${smallMax}–${T}万`, min: smallMax, max: T, color: '#a78bfa', label: '中额' },
        { name: `≥${T}万`, min: T, max: Infinity, color: '#ffb347', label: '大户' }
      ]
    : [
        { name: `<${T}万`, min: 0, max: T, color: '#6a9aff', label: '其他' },
        { name: `≥${T}万`, min: T, max: Infinity, color: '#ffb347', label: '大户' }
      ]
  return defs.map((def, index) => {
    const hit = rows.filter((row) => Number(row.amount) >= def.min && Number(row.amount) < def.max)
    const amount = Number(hit.reduce((sum, row) => sum + Number(row.amount || 0), 0).toFixed(1))
    return {
      ...def,
      users: hit.length,
      amount,
      ofSleep: sleepAmount ? Number(((amount / sleepAmount) * 100).toFixed(1)) : 0,
      ofTotal: totalAmount ? Number(((amount / totalAmount) * 100).toFixed(1)) : 0,
      isLarge: index === defs.length - 1
    }
  })
})

const largeSleepShare = computed(() => {
  const large = sleepSizeTiers.value.find((row) => row.isLarge)
  return large ? large.ofSleep : 0
})

const filledCostBands = computed(() =>
  (data.value?.costBands || []).filter((row) => row.users > 0 || row.containsPrice)
)

const visibleRows = computed(() => {
  let rows = data.value?.rows || []
  if (tableFilter.value === 'sleep') rows = rows.filter((row) => row.status === '沉睡')
  if (bandFilter.value) rows = rows.filter((row) => row.costBand === bandFilter.value)
  return rows
})

const tableBadge = computed(() => {
  const n = visibleRows.value.length
  if (bandFilter.value && tableFilter.value === 'sleep') return `沉睡 · ${bandFilter.value} · ${n} 人`
  if (bandFilter.value) return `${bandFilter.value} · ${n} 人`
  if (tableFilter.value === 'sleep') return `沉睡 ${n} 人`
  return data.value?.badge || ''
})

const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }

const sleepTrendOption = computed(() => {
  const history = data.value?.history
  const ratios = history?.sleepRatios || []
  const minPct = ratios.length ? Math.max(0, Math.floor(Math.min(...ratios) - 4)) : 0
  const maxPct = ratios.length ? Math.ceil(Math.max(...ratios) + 4) : 50
  return {
    tooltip: {
      trigger: 'axis',
      formatter(params) {
        const title = params?.[0]?.axisValue || ''
        const lines = (params || []).map((item) => {
          const unit = item.seriesName === '沉睡占比' ? '%' : '万'
          return `${item.marker}${item.seriesName} ${item.value}${unit}`
        })
        return `${title}<br/>${lines.join('<br/>')}`
      }
    },
    legend: { data: ['活跃筹码', '沉睡筹码', '沉睡占比'], textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 },
    grid: { left: '6%', right: '6%', top: '16%', bottom: '16%' },
    xAxis: {
      data: history?.dates || [],
      axisLabel: { color: '#4a6080', fontSize: 8, rotate: 40 }
    },
    yAxis: [
      { ...yAxis, name: '万枚', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
      { splitLine: { show: false }, axisLabel: { color: '#4a6080', fontSize: 8 }, min: minPct, max: maxPct, name: '%', nameTextStyle: { color: '#4a6080', fontSize: 9 } }
    ],
    series: [
      {
        name: '活跃筹码',
        type: 'bar',
        stack: 'chips',
        data: history?.activeAmounts || [],
        itemStyle: { color: 'rgba(76,217,160,0.78)' },
        barWidth: '45%'
      },
      {
        name: '沉睡筹码',
        type: 'bar',
        stack: 'chips',
        data: history?.sleepAmounts || [],
        itemStyle: { color: 'rgba(255,179,71,0.82)' }
      },
      {
        name: '沉睡占比',
        type: 'line',
        yAxisIndex: 1,
        data: ratios,
        smooth: true,
        lineStyle: { color: '#a78bfa', width: 2 },
        symbol: 'circle',
        symbolSize: 5
      }
    ]
  }
})

const sleepSizeOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (item) => {
      const row = sleepSizeTiers.value[item.dataIndex] || {}
      return `${row.label || ''} ${item.name}<br/>持仓 ${fmtQty(item.value)} 万<br/>占沉睡 ${row.ofSleep || 0}% · 占所内 ${row.ofTotal || 0}%<br/>${row.users || 0} 人`
    }
  },
  series: [{
    type: 'pie',
    radius: ['42%', '68%'],
    data: sleepSizeTiers.value.map((item) => ({
      name: `${item.label} ${item.name}`,
      value: item.amount,
      itemStyle: { color: item.color }
    })),
    label: { color: '#b0c8e8', fontSize: 9, formatter: '{b}\n{d}%' },
    labelLine: { lineStyle: { color: '#2a3a5a' } }
  }]
}))

const idleDistOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (item) => {
      const row = (data.value?.idleDist || [])[item.dataIndex] || {}
      return `${item.name}<br/>持仓 ${fmtQty(item.value)} 万<br/>样本 ${row.users || 0} 人`
    }
  },
  grid: { left: '8%', right: '6%', top: '10%', bottom: '16%' },
  xAxis: {
    type: 'category',
    data: (data.value?.idleDist || []).map((item) => item.name),
    axisLabel: { color: '#4a6080', fontSize: 9 }
  },
  yAxis,
  series: [{
    type: 'bar',
    data: (data.value?.idleDist || []).map((item) => ({
      value: item.value,
      itemStyle: { color: item.sleeping ? 'rgba(255,179,71,0.88)' : 'rgba(106,154,255,0.78)' }
    })),
    barWidth: '48%'
  }]
}))

const pieOption = computed(() => ({
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    data: data.value?.concentration || [],
    label: { color: '#b0c8e8', fontSize: 9, formatter: '{b}\n{d}%' },
    labelLine: { lineStyle: { color: '#2a3a5a' } }
  }]
}))

const costOption = computed(() => {
  const bands = data.value?.costBands || []
  const byUsers = costMetric.value === 'users'
  const lastName = data.value?.kpis?.lastBandName
  const avgName = data.value?.kpis?.avgBandName
  const lastLabel = data.value?.kpis?.lastPriceLabel
  const avgLabel = data.value?.kpis?.avgCostLabel
  const markData = []
  if (lastName) {
    markData.push({
      xAxis: lastName,
      lineStyle: { color: '#ffb347', type: 'dashed', width: 1.6 },
      label: { formatter: `现价 ${lastLabel}`, color: '#ffb347', fontSize: 10 }
    })
  }
  if (avgName && avgName !== lastName) {
    markData.push({
      xAxis: avgName,
      lineStyle: { color: '#6a9aff', type: 'dotted', width: 1.4 },
      label: {
        formatter: `持仓均价 ${avgLabel}`,
        color: '#6a9aff',
        fontSize: 10,
        position: 'insideEndTop'
      }
    })
  }
  const selected = bandFilter.value
  const barOf = (item, value) => ({
    value,
    itemStyle: selected && item.name !== selected ? { opacity: 0.28 } : undefined
  })
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter(params) {
        const idx = params?.[0]?.dataIndex
        const row = bands[idx]
        if (!row) return ''
        return [
          `${row.name}`,
          `持仓 ${fmtQty(row.amount)} 万 · 占所内 ${row.ofTotal}%`,
          `${row.users} 人 · 活跃 ${row.activeUsers} · 沉睡 ${row.sleepUsers}`,
          `区间中点 vs 现价 ${row.vsLabel} · ${row.stance}`
        ].join('<br/>')
      }
    },
    legend: { data: ['活跃', '沉睡'], textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 },
    grid: { left: '6%', right: '4%', top: '16%', bottom: '18%' },
    xAxis: {
      data: bands.map((item) => item.name),
      axisLabel: { color: '#4a6080', fontSize: 8, rotate: 40 }
    },
    yAxis: {
      ...yAxis,
      name: byUsers ? '人' : '万枚',
      nameTextStyle: { color: '#4a6080', fontSize: 9 }
    },
    series: [
      {
        name: '活跃',
        type: 'bar',
        stack: 'cost',
        data: bands.map((item) => barOf(item, byUsers ? item.activeUsers : item.activeAmount)),
        itemStyle: { color: 'rgba(76,217,160,0.82)' },
        barWidth: '52%',
        markLine: {
          silent: true,
          symbol: 'none',
          data: markData
        }
      },
      {
        name: '沉睡',
        type: 'bar',
        stack: 'cost',
        data: bands.map((item) => barOf(item, byUsers ? item.sleepUsers : item.sleepAmount)),
        itemStyle: { color: 'rgba(255,179,71,0.82)' }
      }
    ]
  }
})

const pnlBucketOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (item) => {
      const row = (data.value?.pnlBuckets || [])[item.dataIndex] || {}
      return `${item.name}<br/>持仓 ${fmtQty(item.value)} 万 · ${row.pct || 0}%<br/>${row.users || 0} 人`
    }
  },
  series: [{
    type: 'pie',
    radius: ['42%', '68%'],
    data: (data.value?.pnlBuckets || []).map((item) => ({
      name: item.name,
      value: item.amount,
      itemStyle: { color: item.color }
    })),
    label: { color: '#b0c8e8', fontSize: 9, formatter: '{b}\n{d}%' },
    labelLine: { lineStyle: { color: '#2a3a5a' } }
  }]
}))
</script>

<style scoped>
.blurb {
  margin: 4px 0 10px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-muted, #9ab0cc);
}
.kpi-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: default;
}
.kpi-item:hover {
  border-color: var(--border);
  background: var(--bg-kpi);
}
.kpi-item.is-link {
  cursor: pointer;
}
.kpi-item.is-link:hover,
.kpi-item.picked {
  border-color: var(--accent, #6a9aff);
  background: var(--bg-kpi-hover);
}
.kpi-item.picked,
tr.picked td {
  box-shadow: inset 0 0 0 1px var(--accent, #6a9aff);
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
.value.range {
  font-size: 15px;
  letter-spacing: -0.02em;
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
.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.is-sleep td {
  color: #d8c8a8;
}
.row-link {
  cursor: pointer;
}
.row-link:hover td {
  color: var(--text-title);
}
</style>
