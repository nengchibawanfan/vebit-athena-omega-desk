<template>
  <div class="page">
    <CollapsibleConfig class="config-bar" title="⚙️ 厚度与偏离配置" storage-key="ops-stance">
      <template #extra>近端档位 / OBI / 偏离预警</template>
      <div class="group">
        <label>近端档位</label>
        <select :value="appState.config.depthLevels" @change="onDepthChange">
          <option :value="10">10档</option>
          <option :value="15">15档</option>
          <option :value="20">20档</option>
        </select>
      </div>
      <div class="group">
        <label>预警 |OBI|</label>
        <input type="number" min="0.05" step="0.05" :value="appState.config.obiWarn" @change="onObiWarnChange" />
        <span class="hint">越过 ±该值视为厚度失衡</span>
      </div>
      <div class="group">
        <label>偏离预警</label>
        <input type="number" min="1" step="1" :value="appState.config.costDevWarn" @change="onDevWarnChange" />
        <span class="hint">% · |偏离| 超过该值视为压力区</span>
      </div>
      <div class="group">
        <label>快捷</label>
        <button class="btn-sm" :class="{ primary: Number(appState.config.costDevWarn) === 12 }" @click="setDevWarn(12)">12%</button>
        <button class="btn-sm" :class="{ primary: Number(appState.config.costDevWarn) === 20 }" @click="setDevWarn(20)">20%</button>
        <button class="btn-sm" :class="{ primary: Number(appState.config.costDevWarn) === 30 }" @click="setDevWarn(30)">30%</button>
      </div>
    </CollapsibleConfig>

    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="card">
          <div class="card-header">
            <span>📐 厚度与偏离</span>
            <span class="badge">{{ currentCombo ? currentCombo.action : '对照表，当前没有落到组合上' }}</span>
          </div>
          <p class="blurb">
            近端厚度：现价上下真实用户买量 − 卖量（剔除做市）。价格偏离：(现价 − 持仓均价) ÷ 均价。
            厚度告诉你推价会撞到谁，偏离告诉你这批人想追还是想跑。
          </p>
          <div class="monitor-status">
            <div class="status-item">
              <span class="status-dot" :class="obi.kpis.alert ? 'red' : 'green'"></span>
              厚度 {{ obi.kpis.realObiLabel }} · {{ obi.kpis.bias }}{{ obi.kpis.alert ? ' · 已触及预警' : ` · 距预警还差 ${obi.kpis.distToWarn}` }}
            </div>
            <div class="status-item">
              <span class="status-dot" :class="cost.kpis.alert ? 'red' : cost.kpis.dev >= 0 ? 'yellow' : 'green'"></span>
              偏离 {{ cost.kpis.devLabel }}% · 现价 {{ cost.kpis.lastPrice }} / 均价 {{ cost.kpis.avgCost }}{{ cost.kpis.alert ? ` · 已进压力区 ±${cost.kpis.warn}%` : '' }}
            </div>
            <div class="status-item">
              <span class="status-dot yellow"></span>
              买盘厚=砸价打到用户买单（你在卖出）；卖盘厚=拉价吃到用户卖单（高位买货）。正偏离=他们在赚；负偏离=他们在亏
            </div>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-item">
            <div class="label">真实 OBI</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: obi.kpis.realObi >= 0 ? '#4cd9a0' : '#ff5a7a' }">{{ obi.kpis.realObiLabel }}</div>
              <div class="qty">含做市 {{ obi.kpis.grossObiLabel }}</div>
            </div>
            <div class="sub">{{ obi.kpis.bias }}</div>
          </div>
          <div class="kpi-item" @click="$router.push('/detail-orders')">
            <div class="label">近端买盘</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#4cd9a0;">{{ fmtQty(obi.kpis.realBid) }}<span class="unit">万</span></div>
              <div class="qty">含做市 {{ fmtQty(obi.kpis.bidQty) }}</div>
            </div>
            <div class="sub">前 {{ obi.kpis.levels }} 档 · 点进挂单明细</div>
          </div>
          <div class="kpi-item" @click="$router.push('/detail-orders')">
            <div class="label">近端卖盘</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ff5a7a;">{{ fmtQty(obi.kpis.realAsk) }}<span class="unit">万</span></div>
              <div class="qty">含做市 {{ fmtQty(obi.kpis.askQty) }}</div>
            </div>
            <div class="sub">买/卖 {{ obi.kpis.bidAskRatio }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">现价</div>
            <div class="kpi-metrics">
              <div class="value">{{ cost.kpis.lastPrice }}</div>
            </div>
            <div class="sub">盘口现价</div>
          </div>
          <div class="kpi-item" @click="$router.push('/chips/user')">
            <div class="label">持仓均价</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ cost.kpis.avgCost }}</div>
            </div>
            <div class="sub">真实用户加权 · 点进持仓均价</div>
          </div>
          <div class="kpi-item">
            <div class="label">价格偏离</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: cost.kpis.dev >= 0 ? '#ffb347' : '#4cd9a0' }">
                {{ cost.kpis.devLabel }}<span class="unit">%</span>
              </div>
              <div class="qty">浮盈 {{ cost.kpis.profitRatio }}% · 浮亏 {{ cost.kpis.underwater }}%</div>
            </div>
            <div class="sub">{{ cost.kpis.stance }}</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>🧩 现在这一组</span>
            <span class="badge">{{ currentCombo ? '已落到组合' : '未落到组合 · 对照下面四行' }}</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>组合</th><th>盘面含义</th><th>动作</th></tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in combos"
                  :key="row.id"
                  :class="{ 'is-now': currentCombo?.id === row.id }"
                >
                  <td>{{ row.scene }}</td>
                  <td>{{ row.meaning }}</td>
                  <td>{{ row.action }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span>📈 今日真实 OBI</span>
              <span class="badge">虚线 ±{{ obi.kpis.warn }} · 点线为含做市</span>
            </div>
            <ChartBox :option="intradayOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>📈 近30日现价 vs 持仓均价</span>
              <span class="badge">折线为偏离%</span>
            </div>
            <ChartBox :option="trendOption" />
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header"><span>🟢🔴 近端买 / 卖量</span><span class="badge">万枚 · 真实用户 · 分时</span></div>
            <ChartBox :option="volumeOption" />
          </div>
          <div class="card">
            <div class="card-header"><span>😰 浮盈 / 浮亏分层</span><span class="badge">真实用户持仓</span></div>
            <ChartBox :option="bucketOption" />
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header"><span>🏔️ 成本带分布</span><span class="badge">柱为持仓量 · 虚线为均价附近</span></div>
            <ChartBox :option="bandOption" />
          </div>
          <div class="card">
            <div class="card-header"><span>📅 近14日真实 OBI</span><span class="badge">收盘口径</span></div>
            <ChartBox :option="dayOption" />
          </div>
        </div>

        <div class="grid-2">
          <div class="card detail-table-card">
            <div class="card-header">
              <span>📋 近端档位厚度</span>
              <span class="badge">前 {{ obi.depthRows.length }} 档 · 点进挂单明细</span>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr><th>档</th><th>买价</th><th>买量(万)</th><th>卖价</th><th>卖量(万)</th><th>净买</th></tr>
                </thead>
                <tbody>
                  <tr v-for="row in obi.depthRows" :key="row.level" class="row-link" @click="$router.push('/detail-orders')">
                    <td>{{ row.level }}</td>
                    <td>{{ row.bidPrice }}</td>
                    <td>{{ row.bid }}</td>
                    <td>{{ row.askPrice }}</td>
                    <td>{{ row.ask }}</td>
                    <td :style="{ color: row.net >= 0 ? '#4cd9a0' : '#ff5a7a' }">{{ row.net >= 0 ? '+' : '' }}{{ row.net }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="card detail-table-card">
            <div class="card-header">
              <span>👥 样本持仓相对现价</span>
              <span class="badge">点 UID 看持仓</span>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr><th>用户ID</th><th>持仓(万)</th><th>成本</th><th>相对现价</th><th>分层</th></tr>
                </thead>
                <tbody>
                  <tr v-for="row in cost.holders" :key="row.id" class="row-link" @click="$router.push(userDetailPath(row.id))">
                    <td>{{ row.id }}</td>
                    <td>{{ row.amount }}</td>
                    <td>{{ row.cost }}</td>
                    <td :style="{ color: row.pnlPct >= 0 ? '#4cd9a0' : '#ff5a7a' }">{{ row.pnlPct >= 0 ? '+' : '' }}{{ row.pnlPct }}%</td>
                    <td><span class="tag" :class="row.bandTag">{{ row.band }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </PageState>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { api } from '@/api'
import { appState, updateConfig } from '@/stores/app'
import { userDetailPath } from '@/utils/uid'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import CollapsibleConfig from '@/components/CollapsibleConfig.vue'

const COMBOS = [
  { id: 'bid-low', scene: '买盘厚 + 偏离不高', meaning: '散户还愿意追，下方也有买单', action: '可拉，卖出：把货卖给追涨的人' },
  { id: 'bid-high', scene: '买盘厚 + 偏离已经很高', meaning: '人人有利润，但买单还在', action: '停拉，先卖出兑现；下一步再砸盘买入' },
  { id: 'ask-high', scene: '卖盘厚 + 偏离很高', meaning: '获利盘挂着等你来接', action: '别拉。拉等于高位买入，等他们砍' },
  { id: 'ask-neg', scene: '卖盘厚 + 偏离为负', meaning: '套牢盘在出，你有货可买', action: '可砸，买入：用做市账户余额买回刚才卖掉的货' }
]

const { loading, error, data, bindPair, load } = usePageData(async () => {
  const [obi, cost] = await Promise.all([
    api.getObiDetail(appState.currentPair, appState.config.depthLevels, appState.config.obiWarn),
    api.getCostDev(appState.currentPair, appState.config.costDevWarn)
  ])
  return { obi, cost }
})
bindPair()

const obi = computed(() => data.value?.obi || { kpis: {}, history: {}, depthRows: [] })
const cost = computed(() => data.value?.cost || { kpis: {}, history: {}, holders: [], buckets: [] })
const combos = COMBOS

const currentCombo = computed(() => {
  const realObi = Number(obi.value.kpis?.realObi)
  const dev = Number(cost.value.kpis?.dev)
  const warn = Number(cost.value.kpis?.warn) || 20
  if (!Number.isFinite(realObi) || !Number.isFinite(dev)) return null
  const bidThick = realObi >= 0.15
  const askThick = realObi <= -0.15
  const devHigh = dev >= warn
  const devNeg = dev < 0
  if (askThick && devNeg) return COMBOS.find((row) => row.id === 'ask-neg')
  if (askThick && devHigh) return COMBOS.find((row) => row.id === 'ask-high')
  if (bidThick && devHigh) return COMBOS.find((row) => row.id === 'bid-high')
  if (bidThick && !devHigh) return COMBOS.find((row) => row.id === 'bid-low')
  return null
})

function fmtQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
}

function onDepthChange(event) {
  updateConfig({ depthLevels: Number(event.target.value) })
  load()
}

function onObiWarnChange(event) {
  const value = Number(event.target.value)
  if (!value || value <= 0) return
  updateConfig({ obiWarn: value })
  load()
}

function onDevWarnChange(event) {
  setDevWarn(Number(event.target.value))
}

function setDevWarn(value) {
  const n = Number(value)
  if (!n || n < 1) return
  updateConfig({ costDevWarn: n })
  load()
}

const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }
const obiWarn = computed(() => Number(obi.value.kpis?.warn) || 0.4)

const intradayOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['真实 OBI', '含做市 OBI'], textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '14%' },
  xAxis: { data: obi.value.history?.hours || [], axisLabel: { color: '#4a6080', fontSize: 8, interval: 1 } },
  yAxis: { min: -0.7, max: 0.7, ...yAxis },
  series: [
    {
      name: '真实 OBI',
      type: 'line',
      data: obi.value.history?.realSeries || [],
      smooth: true,
      lineStyle: { color: '#4cd9a0', width: 2 },
      symbol: 'circle',
      symbolSize: 4,
      markLine: {
        silent: true,
        data: [{ yAxis: obiWarn.value }, { yAxis: -obiWarn.value }, { yAxis: 0 }],
        lineStyle: { color: '#ffb347', type: 'dashed' },
        label: { color: '#ffb347', fontSize: 8 }
      }
    },
    {
      name: '含做市 OBI',
      type: 'line',
      data: obi.value.history?.grossSeries || [],
      smooth: true,
      lineStyle: { color: '#6a9aff', width: 1.5, type: 'dotted' },
      symbol: 'none'
    }
  ]
}))

const volumeOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['买盘', '卖盘'], textStyle: { color: '#4a6080', fontSize: 9 }, top: 0 },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '14%' },
  xAxis: { data: obi.value.history?.hours || [], axisLabel: { color: '#4a6080', fontSize: 8, interval: 3 } },
  yAxis,
  series: [
    { name: '买盘', type: 'bar', data: obi.value.history?.bidSeries || [], itemStyle: { color: 'rgba(76,217,160,0.8)' }, barWidth: '32%' },
    { name: '卖盘', type: 'bar', data: obi.value.history?.askSeries || [], itemStyle: { color: 'rgba(255,90,122,0.8)' }, barWidth: '32%' }
  ]
}))

const dayOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '10%', bottom: '16%' },
  xAxis: { data: obi.value.history?.dayLabels || [], axisLabel: { color: '#4a6080', fontSize: 8, rotate: 40 } },
  yAxis: { min: -0.6, max: 0.65, ...yAxis },
  series: [{
    type: 'line',
    data: obi.value.history?.dayObi || [],
    smooth: true,
    lineStyle: { color: '#4a8aff', width: 2 },
    areaStyle: { color: 'rgba(74,138,255,0.15)' },
    symbol: 'circle',
    symbolSize: 5,
    markLine: {
      silent: true,
      data: [{ yAxis: 0 }],
      lineStyle: { color: '#4a6080', type: 'dashed' }
    }
  }]
}))

const trendOption = computed(() => {
  const history = cost.value.history
  const devs = history?.devSeries || []
  const minPct = devs.length ? Math.floor(Math.min(...devs, 0) - 4) : -10
  const maxPct = devs.length ? Math.ceil(Math.max(...devs, 0) + 4) : 30
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['现价', '持仓均价', '偏离%'], textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 },
    grid: { left: '8%', right: '8%', top: '16%', bottom: '16%' },
    xAxis: { data: history?.dates || [], axisLabel: { color: '#4a6080', fontSize: 8, rotate: 40 } },
    yAxis: [
      { ...yAxis, name: '价格', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
      { splitLine: { show: false }, axisLabel: { color: '#4a6080', fontSize: 8 }, min: minPct, max: maxPct, name: '%', nameTextStyle: { color: '#4a6080', fontSize: 9 } }
    ],
    series: [
      { name: '现价', type: 'line', data: history?.priceSeries || [], smooth: true, lineStyle: { color: '#ffb347', width: 2 }, symbol: 'none' },
      { name: '持仓均价', type: 'line', data: history?.costSeries || [], smooth: false, lineStyle: { color: '#6a9aff', width: 1.5, type: 'dashed' }, symbol: 'none' },
      { name: '偏离%', type: 'line', yAxisIndex: 1, data: devs, smooth: true, lineStyle: { color: '#a78bfa', width: 2 }, symbol: 'circle', symbolSize: 4 }
    ]
  }
})

const bandOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '10%', bottom: '16%' },
  xAxis: {
    data: (cost.value.history?.bandLabels || []).map(String),
    axisLabel: { color: '#4a6080', fontSize: 8 }
  },
  yAxis,
  series: [{
    type: 'bar',
    data: cost.value.history?.bandAmounts || [],
    itemStyle: { color: 'rgba(167,139,250,0.82)' },
    barWidth: '48%',
    markLine: {
      silent: true,
      data: [{ xAxis: String(cost.value.history?.bandLabels?.[2] || '') }],
      lineStyle: { color: '#ffb347', type: 'dashed' },
      label: { color: '#ffb347', fontSize: 8, formatter: '均价附近' }
    }
  }]
}))

const bucketOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}<br/>{c}万  {d}%' },
  series: [{
    type: 'pie',
    radius: ['42%', '68%'],
    data: (cost.value.buckets || []).map((item) => ({
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
  color: #9ab0cc;
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
  font-size: 11px;
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
.config-bar .btn-sm {
  margin-right: 6px;
}
tr.is-now td {
  background: rgba(76, 217, 160, 0.1);
  color: #f0f6ff;
  font-weight: 600;
}
</style>
