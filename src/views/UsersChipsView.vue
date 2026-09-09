<template>
  <PageState :loading="loading" :error="error">
    <div v-if="data" class="page">
      <CollapsibleConfig
        class="filter-panel"
        title="⚙️ 用户筹码配置"
        storage-key="user-chips-sleep"
      >
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

      <div class="card">
        <div class="card-header">
          <span>📊 筹码分布</span>
          <div class="header-tools">
            <router-link class="inline-link" to="/desk/users">真实用户今日</router-link>
            <span class="badge">持仓均价 · 活跃 / 沉睡 · 不含做市 / 金库等</span>
          </div>
        </div>
        <StatusStrip v-if="data.status?.length" :items="data.status" />
      </div>

      <div v-if="hk" class="kpi-grid">
        <div class="kpi-item">
          <div class="label">持仓均价</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#6a9aff;">{{ hk.avgCostLabel }}</div>
            <div class="qty">中位 {{ hk.medianCostLabel }}</div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">现价</div>
          <div class="kpi-metrics">
            <div class="value">{{ hk.lastPriceLabel }}</div>
            <div class="qty" :style="{ color: hk.devPct >= 0 ? '#ffb347' : '#4cd9a0' }">
              {{ hk.devPct >= 0 ? '+' : '' }}{{ hk.devPct }}<span class="unit">%</span>
            </div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">浮盈筹码</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#4cd9a0;">{{ hk.profitPct }}<span class="unit">%</span></div>
            <div class="qty">{{ fmtQty(hk.profitAmount) }}<span class="unit">万</span> · {{ hk.profitUsers }}人</div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">浮亏筹码</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#ff5a7a;">{{ hk.lossPct }}<span class="unit">%</span></div>
            <div class="qty">{{ fmtQty(hk.lossAmount) }}<span class="unit">万</span> · {{ hk.lossUsers }}人</div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">活跃筹码</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#4cd9a0;">{{ fmtQty(hk.activeAmount) }}<span class="unit">万</span></div>
            <div class="qty">{{ hk.activeUsers }}<span class="unit">人</span></div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">持仓用户</div>
          <div class="kpi-metrics">
            <div class="value">{{ hk.userCount }}<span class="unit">人</span></div>
          </div>
        </div>
      </div>

      <div v-if="hk" class="kpi-grid">
        <div class="kpi-item is-link" :class="{ picked: bandFilter === hk.denseName }" @click="toggleBand(hk.denseName)">
          <div class="label">密集成本区</div>
          <div class="kpi-metrics">
            <div class="value range">{{ hk.denseName }}</div>
            <div class="qty">{{ hk.densePct }}<span class="unit">%</span> · {{ hk.denseUsers }}人</div>
          </div>
        </div>
        <div class="kpi-item is-link" :class="{ picked: bandFilter === hk.mostUsersName }" @click="toggleBand(hk.mostUsersName)">
          <div class="label">人数最多区间</div>
          <div class="kpi-metrics">
            <div class="value range">{{ hk.mostUsersName }}</div>
            <div class="qty">{{ hk.mostUsers }}<span class="unit">人</span> · {{ hk.mostUsersPct }}%</div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">沉睡筹码</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#ffb347;">{{ fmtQty(hk.sleepAmount) }}<span class="unit">万</span></div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">沉睡占比</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#ffb347;">{{ hk.sleepRatio }}<span class="unit">%</span></div>
          </div>
        </div>
        <div class="kpi-item">
          <div class="label">沉睡用户</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#a78bfa;">{{ hk.sleepUsers }}<span class="unit">人</span></div>
          </div>
        </div>
      </div>

      <div v-if="returnBands.length" class="grid-2">
        <div class="card">
          <div class="card-header"><span>📈 收益率分档</span><span class="badge">持仓均价相对现价</span></div>
          <ChartBox :option="returnPieOption" />
        </div>
        <div class="card">
          <div class="card-header"><span>📋 分档明细</span><span class="badge">{{ returnBands.length }} 档</span></div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>档位</th><th>人数</th><th>持仓(万)</th><th>占比</th></tr>
              </thead>
              <tbody>
                <tr v-for="row in returnBands" :key="row.name">
                  <td>{{ row.name }}</td>
                  <td>{{ row.users }}</td>
                  <td>{{ fmtQty(row.amount) }}</td>
                  <td>{{ row.pct }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <UserHoldersPanel
        :data="data"
        v-model:band-filter="bandFilter"
      />
    </div>
  </PageState>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { api } from '@/api'
import { appState, updateConfig } from '@/stores/app'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import StatusStrip from '@/components/StatusStrip.vue'
import CollapsibleConfig from '@/components/CollapsibleConfig.vue'
import UserHoldersPanel from '@/components/UserHoldersPanel.vue'
import { namedHex } from '@/utils/palette'

const bandFilter = ref(null)
const { loading, error, data, bindPair, load } = usePageData(async () => {
  const pair = appState.currentPair
  const accounts = appState.config.internalAccounts || []
  return api.getHolders(pair, appState.config.sleepIdleDays, accounts)
})
bindPair()
watch(() => data.value, () => {
  bandFilter.value = null
})

const hk = computed(() => data.value?.kpis || null)
const returnBands = computed(() => data.value?.pnlBuckets || [])

function toggleBand(name) {
  if (!name) return
  bandFilter.value = bandFilter.value === name ? null : name
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

function fmtQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
}

const returnPieOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: (item) => `${item.name}<br/>${item.value} 万 · ${item.percent}%` },
  series: [{
    type: 'pie',
    radius: ['42%', '68%'],
    data: returnBands.value.map((item, index) => ({
      name: item.name,
      value: item.amount,
      itemStyle: { color: namedHex(item.name, index) }
    })),
    label: { color: '#b0c8e8', fontSize: 9, formatter: '{b}\n{d}%' },
    labelLine: { lineStyle: { color: '#2a3a5a' } }
  }]
}))
</script>

<style scoped>
.kpi-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.kpi-item.is-link {
  cursor: pointer;
}
.kpi-item.is-link:hover,
.kpi-item.picked {
  border-color: var(--accent, #6a9aff);
  background: var(--bg-kpi-hover);
}
.value.range {
  font-size: 15px;
  letter-spacing: -0.02em;
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
