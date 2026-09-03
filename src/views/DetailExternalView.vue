<template>
  <div class="page">
    <CollapsibleConfig class="filter-panel" title="⚙️ 仓库地址配置" storage-key="external-exclude">
      <template #extra>不能成交 · 充回所内才可卖</template>
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
            <span style="font-size:12px; color:#b0c8e8; white-space:nowrap;">天无转入/转出</span>
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
          <label>链上地址</label>
          <input v-model.trim="draft.address" class="addr" type="text" placeholder="0x... 或脱敏地址" />
        </div>
        <div class="field">
          <label>类型</label>
          <select v-model="draft.type">
            <option v-for="item in EXCLUDE_TYPES" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </div>
        <div class="field">
          <label>备注</label>
          <input v-model.trim="draft.remark" class="remark" type="text" placeholder="例如 Binance 热钱包" />
        </div>
        <button class="btn-sm primary" @click="addExcluded">➕ 添加</button>
        <span class="hint">{{ feedback }}</span>
      </div>
      <div class="table-wrap" v-if="excludedAddresses.length">
        <table>
          <thead>
            <tr><th>地址</th><th>类型</th><th>备注</th><th></th></tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in excludedAddresses" :key="row.address + index">
              <td :title="row.address">{{ maskAddr(row.address) }}</td>
              <td>
                <select :value="row.type" @change="updateExcluded(index, { type: $event.target.value })">
                  <option v-for="item in EXCLUDE_TYPES" :key="item.value" :value="item.value">{{ item.label }}</option>
                </select>
              </td>
              <td>
                <input class="remark-input" :value="row.remark" @change="updateExcluded(index, { remark: $event.target.value })" />
              </td>
              <td><button class="btn-sm secondary" @click="removeExcluded(index)">移除</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </CollapsibleConfig>

    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="kpi-grid external-kpis">
          <div class="kpi-item kpi-split">
            <div class="label">当前占比</div>
            <div class="kpi-split-row">
              <div class="kpi-split-cell">
                <div class="split-name">不排除地址</div>
                <div class="kpi-metrics">
                  <div class="value" style="color:#ff6b7a;">{{ data.kpis.grossPct }}<span class="unit">%</span></div>
                  <div class="qty">{{ fmtQty(data.kpis.grossAmount) }}<span class="unit">万</span></div>
                </div>
                <div class="sub">全量计入</div>
              </div>
              <div class="kpi-split-cell">
                <div class="split-name">排除地址</div>
                <div class="kpi-metrics">
                  <div class="value" style="color:#ffb347;">{{ data.kpis.currentPct }}<span class="unit">%</span></div>
                  <div class="qty">{{ fmtQty(data.kpis.currentAmount) }}<span class="unit">万</span></div>
                </div>
                <div class="sub">{{ data.kpis.currentSub }}</div>
              </div>
            </div>
          </div>
          <div class="kpi-item">
            <div class="label">近30日变化</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: data.kpis.change30 >= 0 ? '#ff5a7a' : '#4cd9a0' }">
                {{ data.kpis.change30 >= 0 ? '+' : '' }}{{ data.kpis.change30 }}<span class="unit">%</span>
              </div>
              <div class="qty" :style="{ color: data.kpis.change30Amount >= 0 ? '#ff5a7a' : '#4cd9a0' }">
                {{ data.kpis.change30Amount >= 0 ? '+' : '' }}{{ fmtQty(data.kpis.change30Amount) }}<span class="unit">万</span>
              </div>
            </div>
            <div class="sub">{{ data.kpis.change30 >= 0 ? '可充回供给增加' : '可充回供给减少' }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">30日峰值</div>
            <div class="kpi-metrics">
              <div class="value">{{ data.kpis.peak }}<span class="unit">%</span></div>
              <div class="qty">{{ fmtQty(data.kpis.peakAmount) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">历史高位参考</div>
          </div>
          <div class="kpi-item">
            <div class="label">沉睡筹码占比</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ data.kpis.sleepRatio }}<span class="unit">%</span></div>
              <div class="qty">{{ fmtQty(data.kpis.sleepAmount) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">≥{{ data.kpis.sleepIdleDays }}天无转入转出</div>
          </div>
          <div class="kpi-item">
            <div class="label">Top10 集中度</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ffb347;">{{ data.kpis.top10Ratio }}<span class="unit">%</span></div>
              <div class="qty">{{ fmtQty(data.kpis.top10Amount) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">头部地址持仓</div>
          </div>
          <div class="kpi-item">
            <div class="label">已排除持仓</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ data.kpis.excludedRatio }}<span class="unit">%</span></div>
              <div class="qty">{{ fmtQty(data.kpis.excludedTotal) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">{{ data.kpis.excludedCount }} 个地址</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📊 近30天链上筹码分布</span>
            <span class="badge">已剔除配置地址 · 点击某一天查看明细</span>
          </div>
          <ChartBox size="xlarge" class="chart-clickable" :option="comboOption" @chart-click="onHistoryClick" />
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header"><span>🧩 筹码来源构成</span><span class="badge">按托管类型</span></div>
            <ChartBox :option="sourceOption" />
          </div>
          <div class="card">
            <div class="card-header"><span>📈 Top10 地址持仓</span><span class="badge">集中度 · 点击柱状图查看地址详情</span></div>
            <ChartBox class="chart-clickable" :option="top10Option" @chart-click="onTop10Click" />
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span>🚨 近期异动</span><span class="badge">苏醒 / 大额净流入</span></div>
          <div class="alert-list">
            <table>
              <thead>
                <tr><th>时间</th><th>地址</th><th>类型</th><th>详情</th><th>状态</th></tr>
              </thead>
              <tbody>
                <tr v-for="row in data.alerts" :key="row.address + row.type">
                  <td>{{ row.time }}</td>
                  <td><CopyAddr :address="row.address" /></td>
                  <td><span class="tag" :class="row.statusTag">{{ row.type }}</span></td>
                  <td>{{ row.detail }}</td>
                  <td><span class="tag" :class="row.statusTag">{{ row.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card detail-table-card">
          <div class="card-header">
            <span>🚫 不计入统计的地址</span>
            <span class="badge">当前代币数量 · 合计 {{ data.kpis.excludedTotal }}万 · 占全量 {{ data.kpis.excludedRatio }}%</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>地址</th>
                  <th>类型</th>
                  <th>备注</th>
                  <th>当前代币(万)</th>
                  <th>占全量比</th>
                  <th>最后活跃</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!data.excluded.length">
                  <td colspan="7" class="text-muted">暂无排除地址</td>
                </tr>
                <tr v-for="(row, index) in data.excluded" :key="row.address + index">
                  <td><CopyAddr :address="row.address" /></td>
                  <td><span class="tag" :class="row.tag.className">{{ row.typeLabel }}</span></td>
                  <td>{{ row.remark || '—' }}</td>
                  <td>{{ row.amount }}</td>
                  <td>{{ row.ratio }}%</td>
                  <td>{{ row.lastActive }}</td>
                  <td><button class="btn-sm secondary" @click="removeExcluded(index)">移回统计</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card detail-table-card">
          <div class="card-header">
            <span>📋 链上筹码地址</span>
            <span class="badge">计入统计 · {{ data.addresses.length }} 个 · 合计 {{ fmtQty(data.kpis.currentAmount) }}万</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>地址(脱敏)</th>
                  <th>持仓(万)</th>
                  <th>占比</th>
                  <th>来源</th>
                  <th>近30日净流入</th>
                  <th>最后活跃</th>
                  <th>无转入转出(天)</th>
                  <th>状态</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in data.addresses" :key="row.address">
                  <td><CopyAddr :address="row.address" /></td>
                  <td>{{ row.amount }}</td>
                  <td>{{ row.ratio }}%</td>
                  <td><span class="tag" :class="row.tag.className">{{ row.tag.label }}</span></td>
                  <td :style="{ color: row.net30d >= 0 ? '#ff5a7a' : '#4cd9a0' }">
                    {{ row.net30d >= 0 ? '+' : '' }}{{ row.net30d }}
                  </td>
                  <td>{{ row.lastActive }}</td>
                  <td>{{ row.sleepDays }}</td>
                  <td><span class="tag" :class="row.statusTag">{{ row.status }}</span></td>
                  <td>
                    <button class="btn-sm secondary" @click="excludeFromList(row)">排除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </PageState>

    <SideDrawer :open="!!dayDetail" @close="closeDay">
      <template #title>
        {{ dayDetail?.dateKey }} 链上筹码明细
        <small style="margin-left:8px; color:#7a90b0; font-weight:400;">{{ dayDetail?.date }}</small>
      </template>
      <template v-if="dayDetail">
        <div class="day-kpis">
          <div class="kpi-item">
            <div class="label">当日占比</div>
            <div class="value" style="color:#ffb347;">{{ dayDetail.pct }}<span class="unit">%</span></div>
            <div class="qty">{{ fmtQty(dayDetail.amount) }}<span class="unit">万</span></div>
          </div>
          <div class="kpi-item">
            <div class="label">较前一日</div>
            <div class="value" :style="{ color: dayDetail.changePct >= 0 ? '#ff5a7a' : '#4cd9a0' }">
              {{ dayDetail.changePct >= 0 ? '+' : '' }}{{ dayDetail.changePct }}<span class="unit">%</span>
            </div>
            <div class="qty" :style="{ color: dayDetail.changeAmount >= 0 ? '#ff5a7a' : '#4cd9a0' }">
              {{ dayDetail.changeAmount >= 0 ? '+' : '' }}{{ fmtQty(dayDetail.changeAmount) }}<span class="unit">万</span>
            </div>
          </div>
          <div class="kpi-item">
            <div class="label">较当前</div>
            <div class="value" :style="{ color: dayDetail.vsNowPct >= 0 ? '#ff5a7a' : '#4cd9a0' }">
              {{ dayDetail.vsNowPct >= 0 ? '+' : '' }}{{ dayDetail.vsNowPct }}<span class="unit">%</span>
            </div>
            <div class="qty">
              {{ dayDetail.vsNowAmount >= 0 ? '+' : '' }}{{ fmtQty(dayDetail.vsNowAmount) }}<span class="unit">万</span>
            </div>
          </div>
          <div class="kpi-item">
            <div class="label">当日异动地址</div>
            <div class="value">{{ dayDetail.flows.length }}</div>
            <div class="sub">净流入绝对值 ≥ 5万</div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header"><span>🧩 当日来源构成</span></div>
            <ChartBox size="short" :option="daySourceOption" />
          </div>
          <div class="card">
            <div class="card-header"><span>📈 当日 Top10</span></div>
            <ChartBox size="short" class="chart-clickable" :option="dayTop10Option" @chart-click="onDayTop10Click" />
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span>🔄 当日主要净流入 / 流出</span></div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>地址</th><th>来源</th><th>当日净流入(万)</th><th>当日持仓(万)</th><th>占比</th></tr>
              </thead>
              <tbody>
                <tr v-if="!dayDetail.flows.length">
                  <td colspan="5" class="text-muted">当日无显著净流入流出</td>
                </tr>
                <tr v-for="row in dayDetail.flows" :key="row.address">
                  <td><CopyAddr :address="row.address" /></td>
                  <td><span class="tag" :class="row.tag.className">{{ row.tag.label }}</span></td>
                  <td :style="{ color: row.net1d >= 0 ? '#ff5a7a' : '#4cd9a0' }">
                    {{ row.net1d >= 0 ? '+' : '' }}{{ row.net1d }}
                  </td>
                  <td>{{ row.amount }}</td>
                  <td>{{ row.ratio }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📋 当日地址持仓</span>
            <span class="badge">{{ dayDetail.addresses.length }} 个 · {{ fmtQty(dayDetail.amount) }}万</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>地址</th>
                  <th>持仓(万)</th>
                  <th>占比</th>
                  <th>来源</th>
                  <th>当日净流入</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in dayDetail.addresses" :key="row.address">
                  <td><CopyAddr :address="row.address" /></td>
                  <td>{{ row.amount }}</td>
                  <td>{{ row.ratio }}%</td>
                  <td><span class="tag" :class="row.tag.className">{{ row.tag.label }}</span></td>
                  <td :style="{ color: row.net1d >= 0 ? '#ff5a7a' : '#4cd9a0' }">
                    {{ row.net1d >= 0 ? '+' : '' }}{{ row.net1d }}
                  </td>
                  <td><span class="tag" :class="row.statusTag">{{ row.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </SideDrawer>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api'
import { EXCLUDE_TYPES } from '@/config/constants'
import { appState, updateConfig } from '@/stores/app'
import { addressDetailPath, isExcludedAddr, maskAddr } from '@/utils/address'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import CollapsibleConfig from '@/components/CollapsibleConfig.vue'
import SideDrawer from '@/components/SideDrawer.vue'
import CopyAddr from '@/components/CopyAddr.vue'

const { loading, error, data, bindPair, load } = usePageData(() =>
  api.getExternalChips(
    appState.currentPair,
    appState.config.excludedAddresses || [],
    appState.config.sleepIdleDays
  )
)
bindPair()

function fmtQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
}

const route = useRoute()
const router = useRouter()
const selectedDateKey = ref('')

const dayDetail = computed(() => {
  const days = data.value?.history?.days || []
  return days.find((item) => item.dateKey === selectedDateKey.value) || null
})

function openDay(dateKey) {
  if (!dateKey) return
  selectedDateKey.value = dateKey
  if (route.query.date !== dateKey) {
    router.replace({ query: { ...route.query, date: dateKey } })
  }
}

function closeDay() {
  selectedDateKey.value = ''
  if (route.query.date) {
    const query = { ...route.query }
    delete query.date
    router.replace({ query })
  }
}

function onHistoryClick(params) {
  const dateKey = data.value?.history?.dateKeys?.[params.dataIndex]
  if (dateKey) openDay(dateKey)
}

function openAddress(address) {
  if (!address) return
  selectedDateKey.value = ''
  router.push(addressDetailPath(address))
}

function onTop10Click(params) {
  openAddress(data.value?.top10?.[params.dataIndex]?.address)
}

function onDayTop10Click(params) {
  openAddress(dayDetail.value?.top10?.[params.dataIndex]?.address)
}

watch(
  () => [route.query.date, data.value],
  () => {
    const dateKey = typeof route.query.date === 'string' ? route.query.date : ''
    if (!dateKey) {
      if (selectedDateKey.value) selectedDateKey.value = ''
      return
    }
    const exists = (data.value?.history?.days || []).some((item) => item.dateKey === dateKey)
    selectedDateKey.value = exists ? dateKey : ''
  },
  { immediate: true }
)

const feedback = ref('')
const draft = reactive({
  address: '',
  type: 'hot_wallet',
  remark: ''
})

const excludedAddresses = computed(() => appState.config.excludedAddresses || [])

function onSleepDaysChange(event) {
  setSleepDays(Number(event.target.value))
}

function setSleepDays(days) {
  const value = Number(days)
  if (!value || value < 1) return
  updateConfig({ sleepIdleDays: value })
  load()
}

function persist(list) {
  updateConfig({ excludedAddresses: list.map((item) => ({ ...item })) })
  load()
}

function addExcluded() {
  const address = draft.address.trim()
  if (!address) {
    feedback.value = '请填写地址'
    return
  }
  if (isExcludedAddr(address, excludedAddresses.value)) {
    feedback.value = '该地址已在排除列表中'
    return
  }
  persist([
    ...excludedAddresses.value,
    { address, type: draft.type, remark: draft.remark }
  ])
  draft.address = ''
  draft.remark = ''
  feedback.value = '✅ 已加入排除列表'
}

function updateExcluded(index, patch) {
  persist(excludedAddresses.value.map((item, i) => (i === index ? { ...item, ...patch } : item)))
}

function removeExcluded(index) {
  persist(excludedAddresses.value.filter((_, i) => i !== index))
  feedback.value = '↩️ 已移回统计'
}

function excludeFromList(row) {
  if (isExcludedAddr(row.address, excludedAddresses.value)) {
    feedback.value = '该地址已在排除列表中'
    return
  }
  persist([
    ...excludedAddresses.value,
    { address: row.address, type: 'other', remark: '从统计列表手动排除' }
  ])
  feedback.value = '✅ 已排除该地址'
}

const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }

const comboOption = computed(() => {
  const history = data.value?.history
  const percents = history?.percents || []
  const dates = history?.dates || []
  const dateKeys = history?.dateKeys || []
  const selected = selectedDateKey.value
  const minPct = percents.length ? Math.max(0, Math.floor(Math.min(...percents) - 4)) : 0
  const maxPct = percents.length ? Math.ceil(Math.max(...percents) + 4) : 50
  return {
    tooltip: {
      trigger: 'axis',
      formatter(params) {
        const title = params?.[0]?.axisValue || ''
        const lines = (params || []).map((item) => {
          const unit = item.seriesName === '占比' ? '%' : '万'
          const raw = item.value
          const value = raw && typeof raw === 'object' && !Array.isArray(raw) && 'value' in raw
            ? raw.value
            : raw
          return `${item.marker}${item.seriesName} ${value}${unit}`
        })
        lines.push('<span style="color:#7a90b0">点击查看当日明细</span>')
        return `${title}<br/>${lines.join('<br/>')}`
      }
    },
    legend: { data: ['链上筹码量', '占比'], textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 },
    grid: { left: '6%', right: '6%', top: '16%', bottom: '16%' },
    xAxis: {
      data: dates,
      axisLabel: { color: '#4a6080', fontSize: 8, rotate: 40 }
    },
    yAxis: [
      { ...yAxis, name: '万枚', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
      { splitLine: { show: false }, axisLabel: { color: '#4a6080', fontSize: 8 }, min: minPct, max: maxPct, name: '%', nameTextStyle: { color: '#4a6080', fontSize: 9 } }
    ],
    series: [
      {
        name: '链上筹码量',
        type: 'bar',
        cursor: 'pointer',
        data: (history?.amounts || []).map((value, index) => ({
          value,
          itemStyle: {
            color: dateKeys[index] === selected ? '#ff8aa0' : 'rgba(255,90,122,0.72)'
          }
        })),
        barWidth: '45%'
      },
      {
        name: '占比',
        type: 'line',
        yAxisIndex: 1,
        cursor: 'pointer',
        data: percents,
        smooth: true,
        lineStyle: { color: '#ffb347', width: 2 },
        symbol: 'circle',
        symbolSize: 5
      }
    ]
  }
})

const sourceColors = ['#6a9aff', '#ffb347', '#4cd9a0', '#ff5a7a']

const sourceOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    data: (data.value?.sourcePie || []).map((item, i) => ({
      ...item,
      itemStyle: { color: sourceColors[i] }
    })),
    label: { color: '#b0c8e8', fontSize: 10, formatter: '{b}\n{c}万  {d}%' },
    labelLine: { lineStyle: { color: '#2a3a5a' } }
  }]
}))

const top10Option = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (item) => `${item.name}<br/>持仓 ${Number(item.value).toLocaleString('zh-CN', { maximumFractionDigits: 1 })} 万<br/><span style="color:#7a90b0">点击查看地址详情</span>`
  },
  grid: { left: '8%', right: '6%', top: '10%', bottom: '22%' },
  xAxis: {
    type: 'category',
    data: (data.value?.top10 || []).map((item) => item.name),
    axisLabel: { color: '#4a6080', fontSize: 8, rotate: 30 }
  },
  yAxis,
  series: [{
    type: 'bar',
    cursor: 'pointer',
    data: (data.value?.top10 || []).map((item) => item.value),
    itemStyle: { color: '#ffb347' },
    barWidth: '45%'
  }]
}))

const daySourceOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    data: (dayDetail.value?.sourcePie || []).map((item, i) => ({
      ...item,
      itemStyle: { color: sourceColors[i] }
    })),
    label: { color: '#b0c8e8', fontSize: 10, formatter: '{b}\n{c}万  {d}%' },
    labelLine: { lineStyle: { color: '#2a3a5a' } }
  }]
}))

const dayTop10Option = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (item) => `${item.name}<br/>持仓 ${Number(item.value).toLocaleString('zh-CN', { maximumFractionDigits: 1 })} 万<br/><span style="color:#7a90b0">点击查看地址详情</span>`
  },
  grid: { left: '8%', right: '6%', top: '10%', bottom: '22%' },
  xAxis: {
    type: 'category',
    data: (dayDetail.value?.top10 || []).map((item) => item.name),
    axisLabel: { color: '#4a6080', fontSize: 8, rotate: 30 }
  },
  yAxis,
  series: [{
    type: 'bar',
    cursor: 'pointer',
    data: (dayDetail.value?.top10 || []).map((item) => item.value),
    itemStyle: { color: '#ffb347' },
    barWidth: '45%'
  }]
}))
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
.kpi-grid.external-kpis {
  grid-template-columns: minmax(260px, 2.1fr) repeat(5, minmax(0, 1fr));
  gap: 10px;
  align-items: stretch;
}
.kpi-grid.external-kpis > .kpi-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  min-height: 108px;
  padding: 12px 12px 10px;
  cursor: default;
}
.kpi-grid.external-kpis > .kpi-item:hover {
  border-color: var(--border);
  background: var(--bg-kpi);
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
.kpi-split-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  margin-top: 4px;
  flex: 1;
  min-height: 0;
}
.kpi-split-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  padding: 2px 14px 0;
}
.kpi-split-cell + .kpi-split-cell {
  border-left: 1px solid var(--border);
}
.split-name {
  font-size: 10px;
  color: #7a90b0;
  line-height: 1.2;
}
.kpi-split-cell .kpi-metrics {
  padding: 6px 0;
}
.kpi-split-cell .value {
  font-size: 20px;
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
@media (max-width: 1200px) {
  .kpi-grid.external-kpis {
    grid-template-columns: repeat(3, 1fr);
  }
  .kpi-split {
    grid-column: 1 / -1;
  }
}
@media (max-width: 720px) {
  .kpi-grid.external-kpis {
    grid-template-columns: 1fr 1fr;
  }
}
.chart-clickable {
  cursor: pointer;
}
.day-kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}
.day-kpis .kpi-item {
  cursor: default;
}
.day-kpis .kpi-item:hover {
  border-color: var(--border);
  background: var(--bg-kpi);
}
@media (max-width: 720px) {
  .day-kpis {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
