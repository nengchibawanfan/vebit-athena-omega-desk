<template>
  <div class="page">
    <div class="crumb">
      <router-link to="/chips/external">明细</router-link>
      <span> / 链上地址</span>
    </div>

    <div class="addr-search">
      <label>查询地址</label>
      <input
        v-model="draft"
        class="addr-input"
        type="text"
        spellcheck="false"
        placeholder="粘贴完整地址，例如 0x4e8c...2048ab"
        @keydown.enter.prevent="submitAddress"
      />
      <button class="btn-sm primary" type="button" @click="submitAddress">查询</button>
      <span class="hint">{{ feedback }}</span>
    </div>

    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="addr-head">
          <div>
            <div class="addr-token">{{ data.token }} · {{ data.pair }}</div>
            <CopyAddr :address="data.address" :link="false" />
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-item">
            <div class="label">当前持仓</div>
            <div class="value" style="color:#6a9aff;">{{ fmtQty(data.kpis.amount) }}<span class="unit">万</span></div>
            <div class="sub">占链上筹码 {{ data.kpis.pct }}%</div>
          </div>
          <div class="kpi-item">
            <div class="label">近30日变化</div>
            <div class="value" :style="{ color: data.kpis.change30 >= 0 ? '#ff5a7a' : '#4cd9a0' }">
              {{ data.kpis.change30 >= 0 ? '+' : '' }}{{ data.kpis.change30 }}<span class="unit">%</span>
            </div>
            <div class="qty" :style="{ color: data.kpis.change30Amount >= 0 ? '#ff5a7a' : '#4cd9a0' }">
              {{ data.kpis.change30Amount >= 0 ? '+' : '' }}{{ fmtQty(data.kpis.change30Amount) }}<span class="unit">万</span>
            </div>
          </div>
          <div class="kpi-item">
            <div class="label">30日净流入</div>
            <div class="value" :style="{ color: data.kpis.net30 >= 0 ? '#ff5a7a' : '#4cd9a0' }">
              {{ data.kpis.net30 >= 0 ? '+' : '' }}{{ fmtQty(data.kpis.net30) }}<span class="unit">万</span>
            </div>
            <div class="sub">转入 − 转出</div>
          </div>
          <div class="kpi-item">
            <div class="label">链上记录</div>
            <div class="value">{{ data.kpis.txCount }}</div>
            <div class="sub">最近活跃 {{ data.kpis.lastActive }}</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📊 近30天该地址 {{ data.token }} 持仓</span>
            <span class="badge">数量 + 占比</span>
          </div>
          <ChartBox size="xlarge" :option="comboOption" />
        </div>

        <div class="card">
          <div class="card-header">
            <span>⛓ 链上记录</span>
            <span class="badge">{{ data.token }} · 对手地址可下探</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>时间</th>
                  <th>方向</th>
                  <th>对手地址</th>
                  <th>数量(万)</th>
                  <th>Tx Hash</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in data.txs" :key="row.hash">
                  <td>{{ row.time }}</td>
                  <td><span class="tag" :class="row.tag">{{ row.type }}</span></td>
                  <td><CopyAddr :address="row.counterparty" /></td>
                  <td :style="{ color: row.amount >= 0 ? '#ff5a7a' : '#4cd9a0' }">
                    {{ row.amount >= 0 ? '+' : '' }}{{ row.amount }}
                  </td>
                  <td><CopyAddr :address="row.hash" :link="false" /></td>
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api'
import { appState } from '@/stores/app'
import { addressDetailPath, lastExternalAddress, saveLastExternalAddress } from '@/utils/address'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import CopyAddr from '@/components/CopyAddr.vue'

const route = useRoute()
const router = useRouter()
const draft = ref('')
const feedback = ref('')
const routeAddress = computed(() => decodeURIComponent(String(route.params.address || '')).trim())
const currentAddress = computed(() => routeAddress.value || lastExternalAddress())

const { loading, error, data, bindPair, load } = usePageData(() => {
  const address = currentAddress.value
  saveLastExternalAddress(address)
  return api.getAddressDetail(appState.currentPair, address)
})
bindPair()
watch(routeAddress, (addr) => {
  draft.value = addr || lastExternalAddress()
  feedback.value = ''
  load()
})

onMounted(() => {
  draft.value = currentAddress.value
  if (!routeAddress.value) router.replace(addressDetailPath(currentAddress.value))
})

function parseAddress(raw) {
  let value = String(raw || '').trim()
  if (!value) return { error: '请输入地址' }
  if (value.includes('...')) return { error: '请输入完整地址，不要用脱敏格式' }
  if (!value.startsWith('0x') && !value.startsWith('0X')) value = `0x${value}`
  if (!/^0x[0-9a-fA-F]{40}$/.test(value)) return { error: '请输入 0x 开头的 42 位地址' }
  return { address: value }
}

function submitAddress() {
  const parsed = parseAddress(draft.value)
  if (parsed.error) {
    feedback.value = parsed.error
    return
  }
  feedback.value = ''
  if (parsed.address.toLowerCase() === currentAddress.value.toLowerCase()) {
    load()
    return
  }
  router.push(addressDetailPath(parsed.address))
}

function fmtQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
}

const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }

const comboOption = computed(() => {
  const history = data.value?.history
  const percents = history?.percents || []
  const minPct = percents.length ? Math.max(0, Math.floor(Math.min(...percents) * 10) / 10 - 0.4) : 0
  const maxPct = percents.length ? Math.ceil(Math.max(...percents) * 10) / 10 + 0.4 : 5
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['持仓量', '转入', '转出', '占比'], textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 },
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
        name: '持仓量',
        type: 'bar',
        data: history?.amounts || [],
        itemStyle: { color: 'rgba(106,154,255,0.72)' },
        barWidth: '36%'
      },
      {
        name: '转入',
        type: 'line',
        data: history?.inflows || [],
        smooth: true,
        lineStyle: { color: '#ff5a7a', width: 2 },
        symbol: 'circle',
        symbolSize: 4
      },
      {
        name: '转出',
        type: 'line',
        data: history?.outflows || [],
        smooth: true,
        lineStyle: { color: '#4cd9a0', width: 2 },
        symbol: 'circle',
        symbolSize: 4
      },
      {
        name: '占比',
        type: 'line',
        yAxisIndex: 1,
        data: percents,
        smooth: true,
        lineStyle: { color: '#ffb347', width: 2 },
        symbol: 'none'
      }
    ]
  }
})
</script>

<style scoped>
.crumb {
  font-size: 12px;
  color: #7a90b0;
  margin-bottom: 12px;
}
.crumb a {
  color: #8eb6ff;
  text-decoration: none;
}
.crumb a:hover {
  text-decoration: underline;
}
.addr-search {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-kpi);
}
.addr-search label {
  flex-shrink: 0;
  font-size: 11px;
  color: #7a90b0;
  white-space: nowrap;
}
.addr-input {
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-input);
  color: var(--text-title);
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  outline: none;
}
.addr-input:focus {
  border-color: #4a8aff;
}
.addr-search .hint {
  font-size: 11px;
  color: #ff8aa0;
  white-space: nowrap;
}
.addr-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.addr-token {
  font-size: 12px;
  color: #7a90b0;
  margin-bottom: 6px;
}
.qty {
  font-size: 12px;
  color: var(--text-qty);
  font-weight: 600;
  margin-top: 1px;
}
.qty .unit {
  font-size: 10px;
  color: var(--text-soft);
  font-weight: 400;
  margin-left: 1px;
}
.kpi-item {
  cursor: default;
}
.kpi-grid {
  grid-template-columns: repeat(4, 1fr);
}
</style>
