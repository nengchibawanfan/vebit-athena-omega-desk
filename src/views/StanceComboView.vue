<template>
  <div class="page">
    <CollapsibleConfig class="config-bar" title="⚙️ 价格台阶配置" storage-key="ops-stance">
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
            <span>🪜 价格台阶</span>
            <span class="badge">真实挂单 · 厚度 · 成本偏离</span>
          </div>
          <p class="blurb">
            {{ ops.ladderBlurb || '现价到该档的真实挂单：往上是卖墙，往下是买墙。' }}
            近端厚度看真实用户买量 − 卖量。偏离看现价相对持仓均价。
          </p>
          <div class="monitor-status">
            <div class="status-row">
              <div class="status-item">
                <span class="status-dot" :class="actionDot(ops.stance?.action)"></span>
                现价 {{ ops.stance?.lastPrice || cost.kpis.lastPrice }}
              </div>
            </div>
            <div class="status-row">
              <div class="status-item">
                <span class="status-dot" :class="cost.kpis.alert ? 'red' : cost.kpis.dev >= 0 ? 'yellow' : 'green'"></span>
                用户均价 {{ cost.kpis.avgCost }} · 偏离 {{ cost.kpis.devLabel }}%{{ cost.kpis.alert ? ` · 已进压力区 ±${cost.kpis.warn}%` : '' }}
              </div>
            </div>
            <div class="status-row">
              <div class="status-item">
                <span class="status-dot" :class="Number(ops.stance?.mmDevPct) >= 0 ? 'green' : 'yellow'"></span>
                做市库存成本 {{ fmtPrice(ops.stance?.mmCost) }} · 偏离 {{ signed(ops.stance?.mmDevPct) }}%
              </div>
            </div>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-item" @click="$router.push('/desk/users')">
            <div class="label">用户持有流通代币</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ffb347;">{{ fmtQty(ops.surfaceToken) }}<span class="unit">万</span></div>
            </div>
          </div>
          <div class="kpi-item">
            <div class="label">+10% · {{ step10?.price }}</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ff5a7a;">{{ fmtQty(step10?.cumQty) }}<span class="unit">万</span></div>
              <div class="qty">{{ fmtQty(step10?.cumU) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">现价到该档卖墙 · 真实挂单</div>
          </div>
          <div class="kpi-item">
            <div class="label">-10% · {{ stepDown10?.price }}</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ fmtQty(stepDown10?.cumQty) }}<span class="unit">万</span></div>
              <div class="qty">{{ fmtQty(stepDown10?.cumU) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">现价到该档买墙 · 真实挂单</div>
          </div>
          <div class="kpi-item">
            <div class="label">真实OBI</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: obi.kpis.realObi >= 0 ? '#4cd9a0' : '#ff5a7a' }">{{ obi.kpis.realObiLabel }}</div>
              <div class="qty">含做市 {{ obi.kpis.grossObiLabel }}</div>
            </div>
          </div>
          <div class="kpi-item" @click="$router.push('/desk/users/chips')">
            <div class="label">持仓均价</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ cost.kpis.avgCost }}</div>
            </div>
            <div class="sub">真实用户加权 · 点进筹码分布</div>
          </div>
          <div class="kpi-item" @click="$router.push('/orderbook')">
            <div class="label">近端买盘</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#4cd9a0;">{{ fmtQty(obi.kpis.realBid) }}<span class="unit">万</span></div>
              <div class="qty">含做市 {{ fmtQty(obi.kpis.bidQty) }}</div>
            </div>
            <div class="sub">前 {{ obi.kpis.levels }} 档 · 点进盘面情况</div>
          </div>
          <div class="kpi-item" @click="$router.push('/orderbook')">
            <div class="label">近端卖盘</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ff5a7a;">{{ fmtQty(obi.kpis.realAsk) }}<span class="unit">万</span></div>
              <div class="qty">含做市 {{ fmtQty(obi.kpis.askQty) }}</div>
            </div>
            <div class="sub">前 {{ obi.kpis.levels }} 档 · 点进盘面情况</div>
          </div>
          <div class="kpi-item">
            <div class="label">价格偏离</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: cost.kpis.dev >= 0 ? '#ffb347' : '#4cd9a0' }">
                {{ cost.kpis.devLabel }}<span class="unit">%</span>
              </div>
              <div class="qty">浮盈 {{ cost.kpis.profitRatio }}% · 浮亏 {{ cost.kpis.underwater }}%</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📋 台阶明细</span>
            <span class="badge">现价到该档真实挂单 · 上卖墙 / 下买墙</span>
          </div>
          <div class="table-wrap ladder-wrap">
            <table class="ladder-table">
              <thead>
                <tr>
                  <th>台阶</th>
                  <th>价格</th>
                  <th class="num">真实挂单</th>
                  <th class="num">金额</th>
                  <th class="num">预估卖出</th>
                  <th class="num">金额</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in ladder"
                  :key="row.pct"
                  :class="{ 'is-blocked': row.playKind === 'no', 'is-spot': row.side === 'spot', 'is-up': row.side === 'up', 'is-down': row.side === 'down' }"
                >
                  <td><div class="step-name">{{ row.label }}</div></td>
                  <td class="step-price">{{ row.price }}</td>
                  <td class="num" :style="{ color: row.side === 'up' ? '#ff5a7a' : row.side === 'down' ? '#6a9aff' : '' }">{{ fmtQty(row.cumQty) }}<span class="unit">万</span></td>
                  <td class="num" :style="{ color: row.side === 'up' ? '#ff5a7a' : row.side === 'down' ? '#6a9aff' : '' }">{{ fmtQty(row.cumU) }}<span class="unit">万USDT</span></td>
                  <td class="num flow-cell">
                    <div class="cell-main" style="color:#ff5a7a;">{{ fmtQty(row.expectedSell) }}<span class="unit">万</span></div>
                    <div v-if="sellBar(row).length" class="flow-bar is-sell">
                      <div
                        v-for="band in sellBar(row)"
                        :key="band.key"
                        class="flow-seg"
                        :class="[band.kind, band.key]"
                        :style="{ flex: Math.max(Number(band.sellPct) || 0, 1) }"
                      >
                        <span v-if="Number(band.sellPct) >= 10" class="flow-seg-pct">{{ band.sellPct }}%</span>
                        <div class="flow-tip">
                          <div class="tip-row"><span>盈亏范围</span>{{ band.label }}</div>
                          <div class="tip-row"><span>占比</span>{{ band.sellPct }}%</div>
                          <div class="tip-row"><span>数量</span>{{ fmtQty(band.sellAmt) }}万</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="num" style="color:#ff5a7a;">{{ fmtQty(row.expectedSellU) }}<span class="unit">万USDT</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📈 近30日现价 vs 持仓均价</span>
            <span class="badge">折线为偏离%</span>
          </div>
          <ChartBox :option="trendOption" />
        </div>

        <div class="card">
          <div class="card-header"><span>😰 浮盈 / 浮亏分层</span><span class="badge">真实用户持仓</span></div>
          <ChartBox :option="bucketOption" />
        </div>

        <div class="card">
          <div class="card-header"><span>🏔️ 成本带分布</span><span class="badge">柱为持仓量 · 虚线为均价附近</span></div>
          <ChartBox :option="bandOption" />
        </div>
      </template>
    </PageState>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { api } from '@/api'
import { appState, updateConfig } from '@/stores/app'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import CollapsibleConfig from '@/components/CollapsibleConfig.vue'
import { namedHex, actionDot } from '@/utils/palette'

const { loading, error, data, bindPair, load } = usePageData(async () => {
  const [obi, cost, ops] = await Promise.all([
    api.getObiDetail(appState.currentPair, appState.config.depthLevels, appState.config.obiWarn),
    api.getCostDev(appState.currentPair, appState.config.costDevWarn),
    api.getOpsDesk(appState.currentPair, appState.config.sleepIdleDays, appState.config.internalAccounts || [])
  ])
  return { obi, cost, ops }
})
bindPair()

const obi = computed(() => data.value?.obi || { kpis: {}, history: {}, depthRows: [] })
const cost = computed(() => data.value?.cost || { kpis: {}, history: {}, holders: [], buckets: [] })
const ops = computed(() => data.value?.ops || { stance: {}, ladder: [], ladderBlurb: '' })
const ladder = computed(() => ops.value.ladder || [])
const step10 = computed(() => ladder.value.find((row) => row.pct === 10))
const stepDown10 = computed(() => ladder.value.find((row) => row.pct === -10))

function fmtQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
}

function sellBar(row) {
  return (row?.sellBands || []).filter((band) => Number(band.sellAmt) > 0)
}

function signed(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n > 0 ? `+${n}` : String(n)
}

function fmtPrice(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  if (n >= 1000) return n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
  if (n >= 1) return n.toLocaleString('zh-CN', { maximumFractionDigits: 4 })
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 6 })
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
      itemStyle: { color: namedHex(item.name) }
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
.monitor-status {
  flex-direction: column;
  gap: 4px;
}
.status-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.kpi-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.kpi-grid {
  grid-template-columns: repeat(4, 1fr);
}
@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
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
.config-bar .btn-sm {
  margin-right: 6px;
}
.is-blocked td {
  color: #d8c8a8;
}
.is-spot td {
  font-weight: 600;
}
.step-name {
  font-weight: 700;
}
.is-up .step-name {
  color: #ffb347;
}
.is-down .step-name {
  color: #6a9aff;
}
.step-price {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-variant-numeric: tabular-nums;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-title, #e8f0ff);
}
.is-spot .step-price {
  color: #4cd9a0;
}
.ladder-table th.num,
.ladder-table td.num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ladder-table td .unit {
  margin-left: 2px;
  font-size: 10px;
  color: var(--text-soft);
  font-weight: 400;
}
.ladder-table tbody tr.is-spot {
  background: rgba(76, 217, 160, 0.06);
}
.ladder-wrap {
  overflow: visible;
}
.flow-cell {
  min-width: 220px;
  padding-bottom: 8px;
}
.flow-cell .cell-main {
  font-weight: 700;
}
.flow-bar {
  display: flex;
  width: 100%;
  height: 20px;
  margin-top: 6px;
  overflow: visible;
  border-radius: 5px;
}
.flow-bar.is-sell {
  background: rgba(255, 90, 122, 0.1);
}
.flow-seg {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 4px;
  height: 100%;
  cursor: default;
}
.flow-seg + .flow-seg {
  box-shadow: inset 1px 0 0 rgba(8, 14, 24, 0.35);
}
.flow-seg:first-child {
  border-radius: 5px 0 0 5px;
}
.flow-seg:last-child {
  border-radius: 0 5px 5px 0;
}
.flow-seg:only-child {
  border-radius: 5px;
}
.flow-seg.profit.p20 { background: #ff5a7a; }
.flow-seg.profit.p10 { background: #ff7a94; }
.flow-seg.profit.p5 { background: #d96a80; }
.flow-seg.profit.p0 { background: #c45d72; }
.flow-seg.loss.l0 { background: #8eb0ff; }
.flow-seg.loss.l5 { background: #6a9aff; }
.flow-seg.loss.l10 { background: #547fe0; }
.flow-seg.loss.l20 { background: #3d63b8; }
.flow-seg:hover {
  filter: brightness(1.12);
  z-index: 3;
}
.flow-seg-pct {
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.35);
  pointer-events: none;
}
.flow-tip {
  display: none;
  position: absolute;
  left: 50%;
  top: calc(100% + 8px);
  z-index: 8;
  min-width: 148px;
  padding: 8px 10px;
  border: 1px solid #c5d3e8;
  border-radius: 8px;
  background: #f4f7fc;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
  transform: translateX(-50%);
  text-align: left;
  white-space: nowrap;
  font-size: 11px;
  line-height: 1.55;
  font-weight: 400;
  color: #121a2c;
}
.flow-tip .tip-row {
  display: flex;
  gap: 10px;
}
.flow-tip .tip-row span {
  width: 56px;
  color: #5a6e8a;
  font-weight: 400;
}
[data-theme="light"] .flow-tip {
  background: #1b2740;
  border-color: #3a5a8a;
  box-shadow: 0 10px 24px rgba(24, 36, 56, 0.28);
  color: #f0f6ff;
}
[data-theme="light"] .flow-tip .tip-row span {
  color: #9ab0cc;
}
.flow-seg:hover .flow-tip {
  display: block;
}
</style>
