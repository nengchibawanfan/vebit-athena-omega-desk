<template>
  <div class="holders-panel">
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
      <div class="card-header">
        <span>📋 沉睡分档明细</span>
        <span class="badge">≥{{ sizeThreshold }}万为大户一类 · {{ sleepSizeTiers.length }} 档</span>
      </div>
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

    <div class="card">
      <div class="card-header"><span>📊 持仓集中度</span><span class="badge">前5名占比</span></div>
      <ChartBox :option="pieOption" />
    </div>

    <div class="card detail-table-card">
      <div class="card-header">
        <span>👥 用户筹码明细</span>
        <span class="header-actions">
          <button class="btn-sm" :class="{ primary: tableFilter === 'all' }" @click="tableFilter = 'all'">全部</button>
          <button class="btn-sm" :class="{ primary: tableFilter === 'sleep' }" @click="tableFilter = 'sleep'">仅沉睡</button>
          <button v-if="bandFilter" class="btn-sm primary" @click="$emit('update:bandFilter', null)">均价 {{ bandFilter }} ✕</button>
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
            <tr v-for="row in holderPager.pagedRows" :key="row.id" class="row-link" :class="{ 'is-sleep': row.status === '沉睡' }" @click="$router.push(userDetailPath(row.id))">
              <td>{{ row.id }}</td>
              <td>{{ row.amount }}</td>
              <td>{{ row.costLabel || row.cost }}</td>
              <td>{{ row.costBand }}</td>
              <td :style="{ color: signedHex(row.pnlWan) }">{{ row.pnl }}</td>
              <td :style="{ color: signedHex(row.pnlWan) }">{{ row.ratio }}</td>
              <td>{{ row.lastActive }}</td>
              <td>{{ row.sleepDays }}</td>
              <td>{{ row.days }}</td>
              <td><span class="tag" :class="row.statusTag">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <TablePager
        v-model:page="holderPager.page"
        v-model:page-size="holderPager.pageSize"
        :page-count="holderPager.pageCount"
        :total="holderPager.total"
        :range-text="holderPager.rangeText"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { appState } from '@/stores/app'
import { userDetailPath } from '@/utils/uid'
import { usePager } from '@/composables/usePager'
import ChartBox from '@/components/ChartBox.vue'
import TablePager from '@/components/TablePager.vue'
import { signedHex } from '@/utils/palette'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  bandFilter: { type: String, default: null }
})
const emit = defineEmits(['update:bandFilter'])

const tableFilter = ref('all')
const costMetric = ref('amount')

watch(() => props.data, () => {
  tableFilter.value = 'all'
})

function toggleBand(name) {
  if (!name) return
  emit('update:bandFilter', props.bandFilter === name ? null : name)
}

function onCostChartClick(params) {
  const name = (props.data?.costBands || [])[params?.dataIndex]?.name
  if (name) toggleBand(name)
}

function fmtQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
}

const sizeThreshold = computed(() => {
  const n = Number(appState.config.sleepSizeThreshold)
  return n > 0 ? n : 50
})

const sleepSizeTiers = computed(() => {
  const rows = (props.data?.rows || []).filter((row) => row.status === '沉睡')
  const sleepAmount = Number(props.data?.kpis?.sleepAmount) || rows.reduce((sum, row) => sum + Number(row.amount || 0), 0)
  const totalAmount = Number(props.data?.kpis?.totalAmount) || 0
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

const filledCostBands = computed(() =>
  (props.data?.costBands || []).filter((row) => row.users > 0 || row.containsPrice)
)

const visibleRows = computed(() => {
  let rows = props.data?.rows || []
  if (tableFilter.value === 'sleep') rows = rows.filter((row) => row.status === '沉睡')
  if (props.bandFilter) rows = rows.filter((row) => row.costBand === props.bandFilter)
  return rows
})
const holderPager = usePager(visibleRows)

const tableBadge = computed(() => {
  const n = visibleRows.value.length
  if (props.bandFilter && tableFilter.value === 'sleep') return `沉睡 · ${props.bandFilter} · ${n} 人`
  if (props.bandFilter) return `${props.bandFilter} · ${n} 人`
  if (tableFilter.value === 'sleep') return `沉睡 ${n} 人`
  return props.data?.badge || `${n} 人`
})

const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }

const pieOption = computed(() => ({
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    data: props.data?.concentration || [],
    label: { color: '#b0c8e8', fontSize: 9, formatter: '{b}\n{d}%' },
    labelLine: { lineStyle: { color: '#2a3a5a' } }
  }]
}))

const costOption = computed(() => {
  const bands = props.data?.costBands || []
  const byUsers = costMetric.value === 'users'
  const lastName = props.data?.kpis?.lastBandName
  const avgName = props.data?.kpis?.avgBandName
  const lastLabel = props.data?.kpis?.lastPriceLabel
  const avgLabel = props.data?.kpis?.avgCostLabel
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
  const selected = props.bandFilter
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
</script>

<style scoped>
.holders-panel {
  display: contents;
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
tr.picked td {
  box-shadow: inset 0 0 0 1px var(--accent, #6a9aff);
}
</style>
