<template>
  <div class="page">
    <CollapsibleConfig class="filter-panel" title="⚙️ 活跃 / 沉睡窗口" storage-key="circ-supply-sleep">
      <template #extra>{{ isExchange ? '近 N 天有成交视为活跃' : '近 N 天有转账视为可充回所内' }}</template>
      <div class="exclude-form">
        <div class="field">
          <label>活跃窗口</label>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:12px; color:#b0c8e8; white-space:nowrap;">近</span>
            <input
              type="number"
              min="1"
              step="1"
              style="width:70px;"
              :value="appState.config.sleepIdleDays"
              @change="onSleepDaysChange"
            />
            <span style="font-size:12px; color:#b0c8e8; white-space:nowrap;">天</span>
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
    </CollapsibleConfig>

    <PageState :loading="loading && (!data || data.kind !== expectedKind)" :error="error">
      <template v-if="data && data.kind === expectedKind">
        <div class="card">
          <div class="card-header">
            <span>{{ isExchange ? '🏦 交易所内流通总量' : '⛓️ 链上仓库' }}</span>
            <span class="badge">{{ isExchange ? '活跃会追会砍 · 沉睡暂时不动' : '不能成交 · 充回才可卖' }}</span>
          </div>
          <p class="blurb">{{ data.formula }}</p>
          <div class="monitor-status">
            <div v-for="item in data.status" :key="item.text" class="status-item">
              <span class="status-dot" :class="item.color"></span> {{ item.text }}
            </div>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-item">
            <div class="label">{{ isExchange ? '交易所内流通' : '链上仓库' }}</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: isExchange ? '#6a9aff' : '#ff6b7a' }">
                {{ fmtQty(data.kpis.total) }}<span class="unit">万</span>
              </div>
              <div class="qty">占流通 {{ data.kpis.totalPct }}<span class="unit">%</span></div>
            </div>
            <div class="sub">{{ isExchange ? '所内活跃 + 沉睡 + 做市账户' : '可充回 + 沉睡仓库 · 链上不能成交' }}</div>
          </div>
          <div class="kpi-item" @click="$router.push(isExchange ? '/chips/user' : '/chips/external')">
            <div class="label">{{ isExchange ? '所内活跃' : '可充回' }}</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#4cd9a0;">{{ fmtQty(data.kpis.active) }}<span class="unit">万</span></div>
              <div class="qty">占本页 {{ data.kpis.activePct }}<span class="unit">%</span></div>
            </div>
            <div class="sub">近{{ data.kpis.sleepIdleDays }}天有{{ isExchange ? '成交' : '转账' }}{{ isExchange ? '' : ' · 随时可能进所' }}</div>
          </div>
          <div class="kpi-item" @click="$router.push(isExchange ? '/chips/user' : '/chips/external')">
            <div class="label">{{ isExchange ? '所内沉睡' : '沉睡仓库' }}</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: isExchange ? '#ffb347' : '#a78bfa' }">
                {{ fmtQty(data.kpis.sleep) }}<span class="unit">万</span>
              </div>
              <div class="qty">占本页 {{ data.kpis.sleepPct }}<span class="unit">%</span></div>
            </div>
            <div class="sub">≥{{ data.kpis.sleepIdleDays }}天无{{ isExchange ? '成交' : '转账' }}</div>
          </div>
          <div v-if="isExchange" class="kpi-item" @click="$router.push('/desk/mm')">
            <div class="label">做市账户</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ fmtQty(data.kpis.mmQty) }}<span class="unit">万</span></div>
              <div class="qty">占所内 {{ data.kpis.mmOfExch }}<span class="unit">%</span></div>
            </div>
            <div class="sub">做市账上的代币 · 点进做市账户资产</div>
          </div>
          <div v-else class="kpi-item" @click="$router.push('/chips/external')">
            <div class="label">近30日变化</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: data.kpis.change30 >= 0 ? '#ffb347' : '#4cd9a0' }">
                {{ signed(data.kpis.change30) }}<span class="unit">%</span>
              </div>
              <div class="qty">{{ signed(data.kpis.change30Amount) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">相对30日前存量</div>
          </div>
          <div class="kpi-item">
            <div class="label">前10集中度</div>
            <div class="kpi-metrics">
              <div class="value">{{ data.kpis.top10Pct }}<span class="unit">%</span></div>
            </div>
            <div class="sub">{{ data.kpis.entityCount }} 个{{ data.kpis.entityLabel }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">近30日净变动</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: data.kpis.change30Amount >= 0 ? '#6a9aff' : '#ffb347' }">
                {{ signed(data.kpis.change30Amount) }}<span class="unit">万</span>
              </div>
              <div class="qty">{{ isExchange ? '充值' : '入仓' }} {{ fmtQty(data.kpis.netIn30) }} · {{ isExchange ? '提现' : '出仓' }} {{ fmtQty(data.kpis.netOut30) }}</div>
            </div>
            <div class="sub">{{ isExchange ? '充值 − 提现' : '转入仓库 − 转出仓库' }}</div>
          </div>
        </div>

        <div class="card detail-table-card">
          <div class="card-header">
            <span>📋 分项明细</span>
            <span class="badge">点击跳转</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>分项</th><th>数量(万)</th><th>占本页</th><th>口径</th><th>说明</th></tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in data.buckets"
                  :key="row.name"
                  class="row-link"
                  @click="$router.push(row.to)"
                >
                  <td>{{ row.name }}</td>
                  <td>{{ fmtQty(row.amount) }}</td>
                  <td>{{ row.pct }}%</td>
                  <td><span class="tag" :class="row.tag">{{ row.tagLabel }}</span></td>
                  <td>{{ row.note }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>{{ isExchange ? '📊 近30日所内流通构成' : '📊 近30日仓库构成' }}</span>
            <span class="badge">堆叠柱</span>
          </div>
          <ChartBox size="xlarge" :option="trendOption" />
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span>🧩 当前构成</span>
              <span class="badge">本页 = 100%</span>
            </div>
            <ChartBox :option="pieOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>📝 近期变动</span>
              <span class="badge">今日</span>
            </div>
            <div class="event-list">
              <button
                v-for="item in data.events"
                :key="item.time + item.text"
                type="button"
                class="event-row"
                @click="$router.push(item.to)"
              >
                <span class="event-time">{{ item.time }}</span>
                <span class="tag" :class="item.tag">{{ tagLabel(item.tag) }}</span>
                <span class="event-text">{{ item.text }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="card detail-table-card">
          <div class="card-header">
            <span>{{ isExchange ? '👥 所内持仓明细' : '📦 仓库地址明细' }}</span>
            <span class="badge">按数量</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{{ isExchange ? 'UID' : '地址' }}</th>
                  <th>类型</th>
                  <th>数量(万)</th>
                  <th>占本页</th>
                  <th>最近活动</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in data.rows"
                  :key="row.id"
                  class="row-link"
                  @click="$router.push(row.to)"
                >
                  <td>{{ row.id }}</td>
                  <td><span class="tag" :class="row.tag">{{ row.kind }}</span></td>
                  <td>{{ fmtQty(row.amount) }}</td>
                  <td>{{ row.pct }}%</td>
                  <td>{{ row.last }}</td>
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
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'
import { appState, updateConfig } from '@/stores/app'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import CollapsibleConfig from '@/components/CollapsibleConfig.vue'

const route = useRoute()
const isExchange = computed(() => route.meta.circKind !== 'onchain')
const expectedKind = computed(() => (isExchange.value ? 'exchange' : 'onchain'))

const { loading, error, data, bindPair, load } = usePageData(() =>
  api.getCircSupply(
    appState.currentPair,
    expectedKind.value,
    appState.config.sleepIdleDays,
    appState.config.internalAccounts || []
  )
)
bindPair()

watch(
  () => route.meta.circKind,
  () => load()
)

function fmtQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
}

function signed(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  const text = fmtQty(Math.abs(n))
  if (n > 0) return `+${text}`
  if (n < 0) return `-${text}`
  return text
}

function tagLabel(tag) {
  if (tag === 'success') return isExchange.value ? '活跃' : '可充回'
  if (tag === 'warning') return isExchange.value ? '沉睡' : '仓库'
  if (tag === 'robot') return '做市'
  if (tag === 'alert') return '关注'
  return '动态'
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

const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }

const trendOption = computed(() => {
  const history = data.value?.history
  const legend = isExchange.value
    ? ['所内活跃', '所内沉睡', '做市账户']
    : ['可充回', '沉睡仓库']
  const series = [
    { name: legend[0], type: 'bar', stack: 'circ', data: history?.active || [], itemStyle: { color: 'rgba(76,217,160,0.82)' }, barWidth: '46%' },
    { name: legend[1], type: 'bar', stack: 'circ', data: history?.sleep || [], itemStyle: { color: isExchange.value ? 'rgba(255,179,71,0.82)' : 'rgba(167,139,250,0.82)' } }
  ]
  if (isExchange.value) {
    series.push({ name: '做市账户', type: 'bar', stack: 'circ', data: history?.mm || [], itemStyle: { color: 'rgba(106,154,255,0.82)' } })
  }
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: legend, textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 },
    grid: { left: '6%', right: '4%', top: '16%', bottom: '16%' },
    xAxis: {
      data: history?.dates || [],
      axisLabel: { color: '#4a6080', fontSize: 8, rotate: 40 }
    },
    yAxis: { ...yAxis, name: '万枚', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
    series
  }
})

const pieOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}<br/>{c}万  {d}%' },
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    data: (data.value?.composition || []).map((item) => ({
      name: item.name,
      value: item.value,
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
  line-height: 1.55;
  color: var(--text-qty);
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
.event-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 2px 8px;
}
.event-row {
  display: grid;
  grid-template-columns: 46px auto 1fr;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-elevated);
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.event-row:hover {
  border-color: var(--border-hover);
  background: var(--bg-kpi-hover);
}
.event-time {
  font-size: 11px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
.event-text {
  font-size: 12px;
  color: var(--text-qty);
}
.row-link {
  cursor: pointer;
}
.row-link:hover td {
  color: var(--text-title);
}
</style>
