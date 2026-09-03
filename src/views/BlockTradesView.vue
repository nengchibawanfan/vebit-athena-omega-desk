<template>
  <div class="page">
    <CollapsibleConfig class="config-bar" title="⚙️ 大单阈值" storage-key="orderbook-blocks">
      <template #extra>真实用户大额成交 · 已排除做市与金库等</template>
      <div class="group">
        <label>🐋 警报阈值</label>
        <input type="number" :value="appState.config.whaleThreshold" min="1" step="1" @change="onWhaleChange" />
        <span class="hint">万枚 · 用户买是你卖出，用户卖是你买入</span>
      </div>
    </CollapsibleConfig>

    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="card">
          <div class="card-header">
            <span>🐋 盘口大单</span>
            <div class="header-tools">
              <router-link class="inline-link" to="/orderbook">买卖墙</router-link>
              <router-link class="inline-link" to="/detail-orders">挂单明细</router-link>
              <router-link class="inline-link" to="/desk/users">真实用户交易</router-link>
              <span class="badge">真实 UID · 不含做市 / 金库等</span>
            </div>
          </div>
          <div class="monitor-status">
            <div v-for="item in data.status" :key="item.text" class="status-item">
              <span class="status-dot" :class="item.color"></span> {{ item.text }}
            </div>
          </div>
          <p class="blurb">
            超阈值的真实用户成交。充提进出所不在这里。
            <router-link class="inline-link" to="/whales/exchange">看今日充提</router-link>
          </p>
        </div>

        <div class="kpi-grid">
          <div class="kpi-item" @click="$router.push('/desk/users')">
            <div class="label">大额买入</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ fmtQty(data.kpis.buyAmt) }}<span class="unit">万</span></div>
              <div class="qty">{{ fmtQty(data.kpis.buyU) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">{{ data.kpis.buyCount }} 笔 · 用户买 = 你卖出</div>
          </div>
          <div class="kpi-item" @click="$router.push('/desk/users')">
            <div class="label">大额卖出</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ffb347;">{{ fmtQty(data.kpis.sellAmt) }}<span class="unit">万</span></div>
              <div class="qty">{{ fmtQty(data.kpis.sellU) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">{{ data.kpis.sellCount }} 笔 · 用户卖 = 你买入</div>
          </div>
          <div class="kpi-item">
            <div class="label">净买入</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: data.kpis.tradeNet >= 0 ? '#6a9aff' : '#ffb347' }">
                {{ signedQty(data.kpis.tradeNet) }}<span class="unit">万</span>
              </div>
              <div class="qty">成交额 {{ fmtQty(data.kpis.tradeVolume) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">{{ data.kpis.tradeNet >= 0 ? '用户买更多 · 你在卖出' : '用户卖更多 · 你在买入' }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">最大冲击</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ff5a7a;">{{ data.kpis.maxImpact }}<span class="unit">%</span></div>
            </div>
            <div class="sub">UID {{ data.kpis.maxImpactUid }}</div>
          </div>
          <div class="kpi-item" @click="$router.push('/alerts')">
            <div class="label">待处理</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: data.kpis.alertCount ? '#ff5a7a' : '#4cd9a0' }">
                {{ data.kpis.pending }}<span class="unit">条</span>
              </div>
            </div>
            <div class="sub">红色 {{ data.kpis.alertCount }}</div>
          </div>
          <div class="kpi-item" @click="$router.push('/orderbook')">
            <div class="label">大单笔数</div>
            <div class="kpi-metrics">
              <div class="value">{{ data.rows.length }}<span class="unit">笔</span></div>
            </div>
            <div class="sub">买 {{ data.kpis.buyCount }} · 卖 {{ data.kpis.sellCount }}</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📈 24h 大额买入 / 卖出</span>
            <span class="badge">万枚 · 按小时</span>
          </div>
          <ChartBox :option="flowOption" size="combo" />
        </div>

        <div class="card">
          <div class="card-header">
            <span>📉 大单净买入</span>
            <span class="badge">买 − 卖</span>
          </div>
          <ChartBox :option="netOption" />
        </div>

        <div class="card detail-table-card">
          <div class="card-header">
            <span>📋 大单明细</span>
            <span class="badge">{{ data.rows.length }} 笔 · 点 UID</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>时间</th>
                  <th>UID</th>
                  <th>标签</th>
                  <th>方向</th>
                  <th>金额(万)</th>
                  <th>约合USDT</th>
                  <th>盘口冲击%</th>
                  <th>状态</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in data.rows" :key="row.uid + row.time + row.action" class="row-link" @click="$router.push(userDetailPath(row.uid))">
                  <td>{{ row.time }}</td>
                  <td>{{ row.uid }}</td>
                  <td><span class="tag" :class="row.tagClass">{{ row.tag }}</span></td>
                  <td :class="'amt-' + row.actionClass">{{ row.action }}</td>
                  <td :class="'amt-' + row.actionClass">{{ fmtQty(row.amount) }}</td>
                  <td>{{ fmtQty(row.amountU) }}</td>
                  <td>{{ row.impact }}</td>
                  <td><span class="tag" :class="row.statusTag">{{ row.status }}</span></td>
                  <td>{{ row.note }}</td>
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
import { appState, updateConfig } from '@/stores/app'
import { userDetailPath } from '@/utils/uid'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import CollapsibleConfig from '@/components/CollapsibleConfig.vue'

const { loading, error, data, bindPair, load } = usePageData(() =>
  api.getBlockTrades(
    appState.currentPair,
    appState.config.whaleThreshold,
    appState.config.internalAccounts
  )
)
bindPair()

function onWhaleChange(event) {
  updateConfig({ whaleThreshold: Number(event.target.value) })
  load()
}

function fmtQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
}

function signedQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  const text = fmtQty(Math.abs(n))
  if (n > 0) return `+${text}`
  if (n < 0) return `-${text}`
  return text
}

const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }
const legend = { textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 }
const xAxis = computed(() => ({
  data: data.value?.hours?.labels || [],
  axisLabel: { color: '#4a6080', fontSize: 8, interval: 3 }
}))

const flowOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { ...legend, data: ['买入', '卖出'] },
  grid: { left: '6%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [
    { name: '买入', type: 'bar', data: data.value?.hours?.buy || [], itemStyle: { color: '#6a9aff' }, barWidth: '28%' },
    { name: '卖出', type: 'bar', data: data.value?.hours?.sell || [], itemStyle: { color: '#ffb347' }, barWidth: '28%' }
  ]
}))

const netOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [{
    name: '净买入',
    type: 'line',
    data: data.value?.hours?.net || [],
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
  flex-wrap: wrap;
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
.amt-buy {
  color: #6a9aff;
}
.amt-sell {
  color: #ffb347;
}
.row-link {
  cursor: pointer;
}
.row-link:hover td {
  color: var(--text-title);
}
</style>
