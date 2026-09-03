<template>
  <PageState :loading="loading" :error="error">
    <div v-if="data" class="page">
      <CollapsibleConfig class="rule-panel" :title="`📐 ${data.name}识别规则`" :storage-key="`persona-${data.key}`">
        <template #extra>{{ ruleStatus }}</template>
        <div class="rule-fields">
          <div v-for="field in ruleFields" :key="field.key" class="rule-field">
            <label>{{ field.label }}</label>
            <select v-if="field.type === 'select'" v-model="rules[field.key]" class="rule-inline-select">
              <option v-for="opt in field.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
            <input
              v-else
              v-model.number="rules[field.key]"
              type="number"
              :min="field.min"
              :max="field.max"
              :step="field.step || 1"
              class="rule-inline-input"
            />
            <span v-if="field.unit" class="unit">{{ field.unit }}</span>
          </div>
        </div>
        <div class="rule-actions">
          <button class="btn-sm primary" @click="saveRules">💾 保存规则</button>
          <button class="btn-sm secondary" @click="resetRules">↩️ 恢复默认</button>
          <span class="feedback">{{ ruleFeedback }}</span>
        </div>
      </CollapsibleConfig>

      <div class="card">
        <div class="card-header">
          <span>🏷️ {{ data.name }}</span>
          <span class="badge">操盘分册</span>
        </div>
        <p class="blurb">{{ data.blurb }}</p>
        <div class="persona-switch">
          <router-link
            v-for="item in personaLinks"
            :key="item.to"
            :to="item.to"
            class="persona-link"
            :class="{ active: route.path === item.to }"
          >{{ item.label }}</router-link>
        </div>
        <div class="monitor-status">
          <div v-for="item in data.status" :key="item.text" class="status-item">
            <span class="status-dot" :class="item.color"></span> {{ item.text }}
          </div>
        </div>
      </div>

      <div class="kpi-grid">
        <div v-for="kpi in data.kpis" :key="kpi.label" class="kpi-item">
          <div class="label">{{ kpi.label }}</div>
          <div class="kpi-metrics">
            <div class="value" :style="{ color: kpi.color || '#f0f6ff' }">
              {{ formatKpi(kpi.value) }}<span v-if="kpi.unit" class="unit">{{ kpi.unit }}</span>
            </div>
            <div v-if="kpi.qty" class="qty">{{ kpi.qty }}</div>
          </div>
          <div v-if="kpi.sub" class="sub">{{ kpi.sub }}</div>
        </div>
      </div>

      <div class="grid-2">
        <div v-for="chart in data.charts" :key="chart.title" class="card">
          <div class="card-header">
            <span>{{ chart.title }}</span>
            <span class="badge">{{ chart.badge }}</span>
          </div>
          <ChartBox :option="chartOption(chart)" />
        </div>
      </div>

      <div v-if="data.notes?.length" class="grid-2">
        <div v-for="note in data.notes" :key="note.title" class="card">
          <div class="card-header"><span>{{ note.title }}</span></div>
          <p class="note-text">{{ note.text }}</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span>👤 {{ data.name }}名单</span>
          <span class="badge">抽样 {{ data.rows.length }}</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th v-for="col in data.columns" :key="col.key">{{ col.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in data.rows"
                :key="row.id || row.cluster"
                class="row-link"
                @click="row.id && $router.push(userDetailPath(row.id))"
              >
                <td
                  v-for="col in data.columns"
                  :key="col.key"
                  :style="cellStyle(col, row[col.key])"
                >
                  {{ formatCell(col, row[col.key]) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </PageState>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'
import { appState } from '@/stores/app'
import { DEFAULT_RULE_CONFIG, PERSONA_RULE_FIELDS } from '@/config/constants'
import { loadRuleConfig, saveRuleConfig } from '@/utils/storage'
import { userDetailPath } from '@/utils/uid'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import CollapsibleConfig from '@/components/CollapsibleConfig.vue'

const route = useRoute()
const { loading, error, data, load, bindPair } = usePageData(() =>
  api.getPersonaProfile(route.meta.persona, appState.currentPair)
)
bindPair()

const rules = reactive({ ...loadRuleConfig() })
const ruleStatus = ref('配置已加载')
const ruleFeedback = ref('')

const ruleFields = computed(() => PERSONA_RULE_FIELDS[route.meta.persona] || [])
const personaLinks = [
  { to: '/user-profile/retail', label: '散户' },
  { to: '/user-profile/smart', label: '聪明钱' },
  { to: '/user-profile/wool', label: '羊毛党' },
  { to: '/user-profile/kol', label: 'KOL' },
  { to: '/user-profile/prog', label: '程序化' },
  { to: '/user-profile', label: '全部' }
]

watch(() => route.meta.persona, () => {
  load()
  Object.assign(rules, loadRuleConfig())
  ruleFeedback.value = ''
  ruleStatus.value = '配置已加载'
})

async function saveRules() {
  const next = { ...loadRuleConfig(), ...pickCurrent() }
  Object.assign(rules, next)
  saveRuleConfig(next)
  await api.saveUserRules(next)
  ruleFeedback.value = '✅ 本页规则已保存'
  ruleStatus.value = '配置已更新'
  load()
}

function resetRules() {
  const next = { ...loadRuleConfig() }
  for (const field of ruleFields.value) {
    next[field.key] = DEFAULT_RULE_CONFIG[field.key]
  }
  Object.assign(rules, next)
  saveRuleConfig(next)
  ruleFeedback.value = '↩️ 已恢复本页默认'
  ruleStatus.value = '配置已加载'
}

function pickCurrent() {
  const patch = {}
  for (const field of ruleFields.value) patch[field.key] = rules[field.key]
  return patch
}

function formatKpi(value) {
  if (typeof value === 'number') {
    return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
  }
  return value ?? '--'
}

function formatCell(col, value) {
  if (value == null) return '--'
  if (col.format === 'signed') {
    const n = Number(value)
    if (Number.isNaN(n)) return value
    const text = n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
    const signed = n > 0 ? `+${text}` : text
    return col.unit ? `${signed}${col.unit}` : signed
  }
  if (col.format === 'qty') {
    const n = Number(value)
    if (Number.isNaN(n)) return value
    const text = n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
    return col.unit ? `${text}${col.unit}` : text
  }
  return value
}

function cellStyle(col, value) {
  if (col.format !== 'signed') return undefined
  const n = Number(value)
  if (Number.isNaN(n)) return undefined
  return { color: n >= 0 ? '#6a9aff' : '#ff5a7a' }
}

function chartOption(chart) {
  const legend = { textStyle: { color: '#4a6080', fontSize: 10 }, top: 0, data: chart.legend || [] }
  const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }
  return {
    tooltip: { trigger: 'axis' },
    legend,
    grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
    xAxis: {
      data: chart.x || [],
      axisLabel: { color: '#4a6080', fontSize: 8, interval: (chart.x || []).length > 12 ? 3 : 0 }
    },
    yAxis,
    series: (chart.series || []).map((item) => ({
      name: item.name,
      type: item.type || 'line',
      data: item.data || [],
      smooth: item.type !== 'bar',
      symbol: item.type === 'bar' ? undefined : 'none',
      barWidth: item.type === 'bar' ? '28%' : undefined,
      lineStyle: item.type === 'bar' ? undefined : { color: item.color, width: 2 },
      itemStyle: { color: item.color }
    }))
  }
}
</script>

<style scoped>
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
.note-text {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.65;
  color: var(--text-body);
}
.blurb {
  margin: 0 0 10px;
  font-size: 12px;
  line-height: 1.65;
  color: #8aa0c0;
}
.persona-switch {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 12px;
}
.persona-link {
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: 99px;
  font-size: 11px;
  color: var(--text-muted);
  text-decoration: none;
}
.persona-link.active,
.persona-link:hover {
  color: var(--text-title, #e8f0ff);
  border-color: var(--border-hover, #3a4a62);
}
.rule-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  align-items: center;
}
.rule-field {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.rule-field label {
  font-size: 11px;
  color: var(--text-body);
}
.rule-field .unit {
  font-size: 10px;
  color: var(--text-muted);
}
.rule-inline-input,
.rule-inline-select {
  width: 64px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 4px;
  color: var(--text-title);
  font-size: 12px;
}
.rule-inline-select {
  width: 86px;
}
.feedback {
  font-size: 10px;
  color: #4cd9a0;
}
.row-link {
  cursor: pointer;
}
.row-link:hover td {
  color: var(--text-title);
}
</style>
