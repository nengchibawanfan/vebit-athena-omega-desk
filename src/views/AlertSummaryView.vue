<template>
  <div class="page">
    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="card">
          <div class="card-header">
            <span>🚨 操盘警报</span>
            <span class="badge">全站待处理 {{ data.kpis.pending }}</span>
          </div>
          <div class="monitor-status">
            <div v-for="item in data.status" :key="item.text" class="status-item">
              <span class="status-dot" :class="item.color"></span> {{ item.text }}
            </div>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-item" :class="{ active: levelFilter === 'all' }" @click="levelFilter = 'all'">
            <div class="label">全部警报</div>
            <div class="value">{{ data.kpis.total }}</div>
            <div class="sub">今日合计</div>
          </div>
          <div class="kpi-item" :class="{ active: levelFilter === '紧急' }" @click="levelFilter = '紧急'">
            <div class="label">紧急</div>
            <div class="value" style="color:#ff5a7a;">{{ data.kpis.urgent }}</div>
            <div class="sub">立刻处理</div>
          </div>
          <div class="kpi-item" :class="{ active: levelFilter === '预警' }" @click="levelFilter = '预警'">
            <div class="label">预警</div>
            <div class="value" style="color:#ffb347;">{{ data.kpis.warn }}</div>
            <div class="sub">越过阈值</div>
          </div>
          <div class="kpi-item" :class="{ active: levelFilter === '关注' }" @click="levelFilter = '关注'">
            <div class="label">关注</div>
            <div class="value" style="color:#4a8aff;">{{ data.kpis.watch }}</div>
            <div class="sub">持续盯盘</div>
          </div>
          <div class="kpi-item" :class="{ active: statusFilter === 'pending' }" @click="togglePending">
            <div class="label">待处理</div>
            <div class="value" style="color:#ffb347;">{{ data.kpis.pending }}</div>
            <div class="sub">已处理 {{ data.kpis.handled }}</div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span>📊 级别分布</span>
              <span class="badge">按条数</span>
            </div>
            <ChartBox :option="levelOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>🧩 来源分布</span>
              <span class="badge">{{ data.sources.length }} 类</span>
            </div>
            <ChartBox :option="sourceOption" />
          </div>
        </div>

        <div class="card detail-table-card">
          <div class="card-header">
            <span>📋 全部警报</span>
            <div class="header-actions">
              <button
                v-for="src in sourceOptions"
                :key="src"
                type="button"
                class="btn-sm"
                :class="{ primary: sourceFilter === src }"
                @click="sourceFilter = src"
              >{{ src }}</button>
              <span class="badge">{{ visibleRows.length }} 条</span>
            </div>
          </div>
          <div v-if="!visibleRows.length" class="empty-alerts">当前筛选下没有警报</div>
          <div v-else class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>时间</th>
                  <th>级别</th>
                  <th>来源</th>
                  <th>内容</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in visibleRows"
                  :key="row.id"
                  class="row-link"
                  @click="$router.push(row.to)"
                >
                  <td>{{ row.time }}</td>
                  <td>
                    <span class="alert-level">
                      <span class="status-dot" :style="{ background: row.color, boxShadow: 'none' }"></span>
                      {{ row.level }}
                    </span>
                  </td>
                  <td>{{ row.source }}</td>
                  <td>{{ row.text }}</td>
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
import { computed, ref } from 'vue'
import { api } from '@/api'
import { appState } from '@/stores/app'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'

const levelFilter = ref('all')
const sourceFilter = ref('全部')
const statusFilter = ref('all')

const { loading, error, data, bindPair } = usePageData(() => api.getAlertSummary(
  appState.currentPair,
  {
    whaleThreshold: appState.config.whaleThreshold,
    internalAccounts: appState.config.internalAccounts,
    excludedAddresses: appState.config.excludedAddresses,
    costDevWarn: appState.config.costDevWarn,
    depthLevels: appState.config.depthLevels,
    obiWarn: appState.config.obiWarn
  }
))
bindPair()

function togglePending() {
  statusFilter.value = statusFilter.value === 'pending' ? 'all' : 'pending'
}

const sourceOptions = computed(() => ['全部', ...(data.value?.sources || [])])

const visibleRows = computed(() => {
  const rows = data.value?.rows || []
  return rows.filter((row) => {
    if (levelFilter.value !== 'all' && row.level !== levelFilter.value) return false
    if (sourceFilter.value !== '全部' && row.source !== sourceFilter.value) return false
    if (statusFilter.value === 'pending' && row.status === '已处理') return false
    return true
  })
})

const levelOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['42%', '68%'],
    data: (data.value?.byLevel || []).map((item) => ({
      name: item.name,
      value: item.value,
      itemStyle: { color: item.color }
    })),
    label: { color: '#b0c8e8', fontSize: 10, formatter: '{b}\n{c}' }
  }]
}))

const sourceOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['42%', '68%'],
    data: (data.value?.bySource || []).map((item) => ({
      name: item.name,
      value: item.value,
      itemStyle: { color: item.color }
    })),
    label: { color: '#b0c8e8', fontSize: 10, formatter: '{b}\n{c}' }
  }]
}))
</script>

<style scoped>
.kpi-grid {
  grid-template-columns: repeat(5, 1fr);
}
.kpi-item {
  cursor: pointer;
}
.kpi-item.active {
  border-color: var(--border-hover);
  background: var(--bg-kpi-hover);
}
.header-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}
.alert-level {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.empty-alerts {
  padding: 18px 8px;
  font-size: 12px;
  color: var(--text-soft);
}
.row-link {
  cursor: pointer;
}
.row-link:hover td {
  color: var(--text-title);
}
@media (max-width: 1100px) {
  .kpi-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
