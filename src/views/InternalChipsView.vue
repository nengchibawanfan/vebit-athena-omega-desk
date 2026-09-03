<template>
  <div class="page">
    <CollapsibleConfig class="filter-panel" title="⚙️ 金库等账户配置" storage-key="internal-accounts">
      <template #extra>金库 / 项目方 / 员工 / LP · 不直接买入卖出</template>
      <p class="config-note">
        买入卖出用的代币和 USDT 都在做市账户里。金库 / 项目方 / 员工 / LP 是另一本账，不能直接拿去买卖。做市 UID 请到
        <router-link class="inline-link" to="/robots/config">机器人配置</router-link>
        配置<span v-if="mmAccounts.length"> · 已配置 {{ mmAccounts.length }} 个</span>
      </p>
      <div class="exclude-form">
        <div class="field">
          <label>UID</label>
          <input v-model.trim="draft.uid" class="uid" type="text" placeholder="例如 71001" />
        </div>
        <div class="field">
          <label>类型</label>
          <select v-model="draft.type">
            <option v-for="item in ownedTypes" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </div>
        <div class="field">
          <label>备注</label>
          <input v-model.trim="draft.remark" class="remark" type="text" placeholder="例如 平台金库" />
        </div>
        <button class="btn-sm primary" @click="addAccount">➕ 添加</button>
        <span class="hint">{{ feedback }}</span>
      </div>
      <div class="table-wrap" v-if="internalAccounts.length">
        <table>
          <thead>
            <tr><th>UID</th><th>类型</th><th>备注</th><th></th></tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in internalAccounts" :key="row.uid + index" :class="{ 'is-mm': row.type === 'mm' }">
              <td>{{ row.uid }}</td>
              <td>
                <span v-if="row.type === 'mm'" class="type-lock">{{ typeLabel(row.type) }}</span>
                <select v-else :value="row.type" @change="updateAccount(index, { type: $event.target.value })">
                  <option v-for="item in ownedTypes" :key="item.value" :value="item.value">{{ item.label }}</option>
                </select>
              </td>
              <td>
                <span v-if="row.type === 'mm'">{{ row.remark || '—' }}</span>
                <input
                  v-else
                  class="remark-input"
                  :value="row.remark"
                  @change="updateAccount(index, { remark: $event.target.value })"
                />
              </td>
              <td>
                <span v-if="row.type === 'mm'" class="locked-hint">不可移除</span>
                <button v-else class="btn-sm secondary" @click="removeAccount(index)">移除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CollapsibleConfig>

    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="kpi-grid">
          <div class="kpi-item">
            <div class="label">内部合计</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ data.kpis.internalPct }}<span class="unit">%</span></div>
              <div class="qty">{{ fmtQty(data.kpis.internalAmount) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">{{ data.kpis.internalSub }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">金库等</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#4cd9a0;">{{ data.kpis.ownedPct }}<span class="unit">%</span></div>
              <div class="qty">{{ fmtQty(data.kpis.ownedAmount) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">{{ data.kpis.ownedSub }}</div>
          </div>
          <div class="kpi-item" @click="$router.push('/desk/mm')">
            <div class="label">做市账户</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: bandColor }">{{ fmtQty(data.kpis.dumpable) }}<span class="unit">万</span></div>
              <div class="qty" :style="{ color: Number(data.kpis.ownUsdt) >= 0 ? '#4cd9a0' : '#ff5a7a' }">{{ signedQty(data.kpis.ownUsdt) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">可周转库存 / 做市账户余额 · 点进做市账户</div>
          </div>
          <div class="kpi-item">
            <div class="label">锁仓/归属占比</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ffb347;">{{ data.kpis.lockedRatio }}<span class="unit">%</span></div>
              <div class="qty">{{ fmtQty(data.kpis.lockedAmount) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">占金库等 · 短期不可调用</div>
          </div>
          <div class="kpi-item">
            <div class="label">自有近30日</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: data.kpis.ownedChange30 >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                {{ data.kpis.ownedChange30 >= 0 ? '+' : '' }}{{ data.kpis.ownedChange30 }}<span class="unit">%</span>
              </div>
              <div class="qty" :style="{ color: data.kpis.ownedChange30Amount >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                {{ data.kpis.ownedChange30Amount >= 0 ? '+' : '' }}{{ fmtQty(data.kpis.ownedChange30Amount) }}<span class="unit">万</span>
              </div>
            </div>
            <div class="sub">
              做市库存 {{ data.kpis.invChange30 >= 0 ? '+' : '' }}{{ data.kpis.invChange30 }}%
              · {{ data.kpis.invChange30Amount >= 0 ? '+' : '' }}{{ fmtQty(data.kpis.invChange30Amount) }}万
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📊 近30天内部筹码：金库等 vs 做市库存</span>
            <span class="badge">柱状堆叠 · 折线为金库等占比</span>
          </div>
          <ChartBox size="xlarge" :option="comboOption" />
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header"><span>🧩 内部构成</span><span class="badge">做市含借入虚增</span></div>
            <ChartBox :option="compositionOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>🎯 做市库存 vs 安全带</span>
              <span class="badge">{{ data.kpis.targetLow }}% – {{ data.kpis.targetHigh }}%</span>
            </div>
            <ChartBox :option="inventoryOption" />
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span>🔄 近期内部调仓</span><span class="badge">近7日</span></div>
          <div class="alert-list">
            <table>
              <thead>
                <tr><th>时间</th><th>从</th><th>到</th><th>数量(万)</th><th>原因</th></tr>
              </thead>
              <tbody>
                <tr v-for="row in data.rebalance" :key="row.time + row.from">
                  <td>{{ row.time }}</td>
                  <td>{{ row.from }}</td>
                  <td>{{ row.to }}</td>
                  <td>{{ row.amount }}</td>
                  <td>{{ row.reason }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card detail-table-card">
          <div class="card-header">
            <span>📋 金库等明细</span>
            <span class="badge">{{ data.kpis.ownedAccountCount }} 个金库等 · {{ data.accounts.length - data.kpis.ownedAccountCount }} 个做市</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>UID</th>
                  <th>备注</th>
                  <th>类型</th>
                  <th>口径</th>
                  <th>持仓(万)</th>
                  <th>占内部比</th>
                  <th>成本(USDT)</th>
                  <th>浮盈亏(万USDT)</th>
                  <th>最近调仓</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in data.accounts" :key="row.id" :class="{ 'is-borrowed': row.borrowed }">
                  <td>{{ row.uid || row.id }}</td>
                  <td>{{ row.remark || row.name }}</td>
                  <td>{{ row.type }}</td>
                  <td><span class="tag" :class="row.tag.className">{{ row.borrowed ? '含虚增' : '自有' }}</span></td>
                  <td>{{ row.amount }}</td>
                  <td>{{ row.ratio }}%</td>
                  <td>{{ row.cost }}</td>
                  <td :style="{ color: row.pnl >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                    {{ row.pnl >= 0 ? '+' : '' }}{{ row.pnl }}
                  </td>
                  <td>{{ row.lastMove }}</td>
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
import { computed, reactive, ref } from 'vue'
import { api } from '@/api'
import { INTERNAL_ACCOUNT_TYPES } from '@/config/constants'
import { appState, updateConfig } from '@/stores/app'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import CollapsibleConfig from '@/components/CollapsibleConfig.vue'

const { loading, error, data, bindPair, load } = usePageData(() =>
  api.getInternalChips(appState.currentPair, appState.config.internalAccounts || [])
)
bindPair()

const ownedTypes = INTERNAL_ACCOUNT_TYPES.filter((item) => item.value !== 'mm')
const draft = reactive({
  uid: '',
  type: 'treasury',
  remark: ''
})

const internalAccounts = computed(() => appState.config.internalAccounts || [])
const ownedAccounts = computed(() => internalAccounts.value.filter((item) => item.type !== 'mm'))
const mmAccounts = computed(() => internalAccounts.value.filter((item) => item.type === 'mm'))

function persist(list) {
  updateConfig({ internalAccounts: list.map((item) => ({ ...item })) })
  load()
}

function persistOwned(nextOwned) {
  persist([...mmAccounts.value, ...nextOwned])
}

function typeLabel(type) {
  return INTERNAL_ACCOUNT_TYPES.find((item) => item.value === type)?.label || type
}

function addAccount() {
  const uid = draft.uid.trim()
  if (!uid) {
    feedback.value = '请填写 UID'
    return
  }
  if (internalAccounts.value.some((item) => String(item.uid).trim() === uid)) {
    feedback.value = '该 UID 已在列表中'
    return
  }
  persistOwned([
    ...ownedAccounts.value,
    { uid, type: draft.type, remark: draft.remark }
  ])
  draft.uid = ''
  draft.remark = ''
  feedback.value = '✅ 已加入金库等'
}

function updateAccount(index, patch) {
  const row = internalAccounts.value[index]
  if (!row || row.type === 'mm') return
  persist(internalAccounts.value.map((item, i) => (i === index ? { ...item, ...patch } : item)))
}

function removeAccount(index) {
  const row = internalAccounts.value[index]
  if (!row || row.type === 'mm') return
  persist(internalAccounts.value.filter((_, i) => i !== index))
  feedback.value = '↩️ 已移出金库等'
}

const bandColor = computed(() => {
  const status = data.value?.kpis?.bandStatus
  if (status === '库存偏低' || status === '未配置机器人') return '#ffb347'
  if (status === '库存偏高') return '#ff5a7a'
  return '#4cd9a0'
})

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

const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }

const comboOption = computed(() => {
  const history = data.value?.history
  const ownedPcts = history?.ownedPercents || []
  const minPct = ownedPcts.length ? Math.max(0, Math.floor(Math.min(...ownedPcts) - 4)) : 0
  const maxPct = ownedPcts.length ? Math.ceil(Math.max(...ownedPcts) + 4) : 100
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['金库等', '做市库存', '金库等占比'], textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 },
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
        name: '金库等',
        type: 'bar',
        stack: 'chips',
        data: history?.ownedAmounts || [],
        itemStyle: { color: 'rgba(76,217,160,0.78)' },
        barWidth: '45%'
      },
      {
        name: '做市库存',
        type: 'bar',
        stack: 'chips',
        data: history?.borrowedAmounts || [],
        itemStyle: { color: 'rgba(255,179,71,0.78)' }
      },
      {
        name: '金库等占比',
        type: 'line',
        yAxisIndex: 1,
        data: ownedPcts,
        smooth: true,
        lineStyle: { color: '#6a9aff', width: 2 },
        symbol: 'circle',
        symbolSize: 5
      }
    ]
  }
})

const compositionColors = ['#ffb347', '#4cd9a0', '#6a9aff', '#a78bfa', '#5ad0e8']

const compositionOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    data: (data.value?.composition || []).map((item, i) => ({
      ...item,
      itemStyle: { color: compositionColors[i] }
    })),
    label: { color: '#b0c8e8', fontSize: 10, formatter: '{b}\n{d}%' },
    labelLine: { lineStyle: { color: '#2a3a5a' } }
  }]
}))

const inventoryOption = computed(() => {
  const history = data.value?.history
  const low = data.value?.kpis?.targetLow ?? 40
  const high = data.value?.kpis?.targetHigh ?? 60
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: '8%', right: '6%', top: '12%', bottom: '16%' },
    xAxis: {
      data: history?.dates || [],
      axisLabel: { color: '#4a6080', fontSize: 8, rotate: 40 }
    },
    yAxis: {
      ...yAxis,
      min: 20,
      max: 80,
      name: '%',
      nameTextStyle: { color: '#4a6080', fontSize: 9 }
    },
    series: [{
      name: '做市库存',
      type: 'line',
      data: history?.inventory || [],
      smooth: true,
      lineStyle: { color: '#ffb347', width: 2 },
      symbol: 'circle',
      symbolSize: 4,
      areaStyle: { color: 'rgba(255,179,71,0.12)' },
      markArea: {
        silent: true,
        itemStyle: { color: 'rgba(76,217,160,0.10)' },
        data: [[{ yAxis: low }, { yAxis: high }]]
      },
      markLine: {
        silent: true,
        symbol: 'none',
        lineStyle: { color: '#4cd9a0', type: 'dashed' },
        data: [{ yAxis: low }, { yAxis: high }]
      }
    }]
  }
})
</script>

<style scoped>
.filter-panel :deep(select) {
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 3px 8px;
  color: var(--text-title);
  font-size: 11px;
}
.config-note {
  margin: 0 0 10px;
  font-size: 12px;
  color: var(--text-qty);
}
.inline-link {
  color: #6a9aff;
  text-decoration: none;
}
.inline-link:hover {
  text-decoration: underline;
}
.type-lock {
  font-size: 11px;
  color: var(--text-qty);
}
.locked-hint {
  font-size: 11px;
  color: var(--text-muted);
}
.is-mm td {
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
.is-borrowed td {
  color: #d8c8a8;
}
</style>
