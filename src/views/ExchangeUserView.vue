<template>
  <div class="page">
    <div class="crumb">
      <router-link to="/desk/users">真实用户</router-link>
      <span> / 单 UID</span>
    </div>

    <div class="addr-search">
      <label>查询 UID</label>
      <input
        v-model="draft"
        class="addr-input"
        type="text"
        spellcheck="false"
        placeholder="输入交易所 UID，例如 104821"
        @keydown.enter.prevent="submitUid"
      />
      <button class="btn-sm primary" type="button" @click="submitUid">查询</button>
      <div class="range-switch">
        <button
          type="button"
          class="btn-sm"
          :class="{ primary: scope === 'pair' }"
          @click="setScope('pair')"
        >当前代币</button>
        <button
          type="button"
          class="btn-sm"
          :class="{ primary: scope === 'all' }"
          @click="setScope('all')"
        >全部代币</button>
      </div>
      <span class="hint">{{ feedback }}</span>
    </div>

    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="user-head">
          <div>
            <div class="user-token">{{ data.scopeLabel }}</div>
            <div class="user-id">UID {{ data.uid }}</div>
            <div class="user-meta">
              注册 {{ data.profile.registered }} · {{ data.profile.kyc }} · {{ data.profile.vip }}
              · {{ data.profile.region }} · 最近 {{ data.profile.lastActive }}
            </div>
          </div>
          <div class="tag-row">
            <router-link
              v-for="tag in data.tags"
              :key="tag.label"
              class="tag"
              :class="tag.className"
              :to="tag.to || '/user-profile'"
            >{{ tag.label }}</router-link>
          </div>
        </div>

        <div class="card">
          <StatusStrip :items="data.status" />
        </div>

        <div class="kpi-grid">
          <div class="kpi-item">
            <div class="label">净资产</div>
            <div class="kpi-metrics">
              <div class="value">{{ fmtQty(data.kpis.equityU) }}<span class="unit">万USDT</span></div>
              <div class="qty">现金 {{ fmtQty(data.kpis.cashU) }} · 代币 {{ fmtQty(data.kpis.tokenU) }}<span class="unit">万USDT</span></div>
            </div>
          </div>
          <div class="kpi-item">
            <div class="label">持仓</div>
            <div class="kpi-metrics">
              <div v-if="data.scope === 'all'" class="value" style="color:#6a9aff;">
                {{ fmtQty(data.kpis.tokenU) }}<span class="unit">万USDT</span>
              </div>
              <div v-else class="value" style="color:#6a9aff;">
                {{ fmtQty(data.kpis.posQty) }}<span class="unit">万</span>
              </div>
              <div v-if="data.scope === 'all'" class="qty">{{ data.assets.length }} 个代币</div>
              <div v-else class="qty">成本 {{ fmtPrice(data.kpis.avgCost) }} · 现价 {{ fmtPrice(data.kpis.lastPrice) }}</div>
            </div>
            <div class="sub">{{ data.scope === 'all' ? '分币种成本与现价见资产明细' : data.qtyNote }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">今日买入</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ fmtQty(data.kpis.todayBuy) }}<span class="unit">{{ data.qtyUnit }}</span></div>
            </div>
            <div class="sub">当日成交</div>
          </div>
          <div class="kpi-item">
            <div class="label">今日卖出</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ffb347;">{{ fmtQty(data.kpis.todaySell) }}<span class="unit">{{ data.qtyUnit }}</span></div>
              <div class="qty">净 {{ signedQty(data.kpis.todayNet) }}</div>
            </div>
            <div class="sub">当日成交</div>
          </div>
          <div class="kpi-item">
            <div class="label">总买入</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#6a9aff;">{{ fmtQty(data.kpis.totalBuy) }}<span class="unit">{{ data.qtyUnit }}</span></div>
            </div>
            <div class="sub">注册以来</div>
          </div>
          <div class="kpi-item">
            <div class="label">总卖出</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ffb347;">{{ fmtQty(data.kpis.totalSell) }}<span class="unit">{{ data.qtyUnit }}</span></div>
            </div>
            <div class="sub">注册以来</div>
          </div>
          <div class="kpi-item">
            <div class="label">浮盈亏</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: data.kpis.pnlU >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                {{ signedQty(data.kpis.pnlU) }}<span class="unit">万USDT</span>
              </div>
              <div class="qty" :style="{ color: data.kpis.pnlPct >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                {{ data.kpis.pnlPct >= 0 ? '+' : '' }}{{ data.kpis.pnlPct }}<span class="unit">%</span>
              </div>
            </div>
            <div class="sub">相对持仓成本</div>
          </div>
          <div class="kpi-item">
            <div class="label">近30日胜率</div>
            <div class="kpi-metrics">
              <div class="value">{{ data.kpis.winRate }}<span class="unit">%</span></div>
              <div class="qty">盈亏比 {{ data.kpis.profitRatio }}</div>
            </div>
            <div class="sub">{{ data.kpis.trades30 }} 笔 · {{ data.kpis.tradeDays }} 个交易日</div>
          </div>
          <div class="kpi-item">
            <div class="label">平均持仓</div>
            <div class="kpi-metrics">
              <div class="value">{{ data.kpis.avgHoldHours }}<span class="unit">小时</span></div>
              <div class="qty">挂撤 {{ data.kpis.cancelRatio }}%</div>
            </div>
            <div class="sub">单笔约 {{ fmtQty(data.kpis.avgTicket) }}{{ data.qtyUnit }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">近30日充值</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ff5a7a;">{{ fmtQty(data.kpis.deposit30) }}<span class="unit">万USDT</span></div>
              <div class="qty">提现 {{ fmtQty(data.kpis.withdraw30) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">入金 − 出金 {{ signedQty(data.kpis.deposit30 - data.kpis.withdraw30) }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">交易天数</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#a78bfa;">{{ data.kpis.tradeDays }}<span class="unit">天</span></div>
              <div class="qty">注册 {{ data.profile.days }} 天</div>
            </div>
            <div class="sub">近30日内有成交的日历日</div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span>💼 资产构成</span>
              <span class="badge">代币市值权重</span>
            </div>
            <ChartBox :option="assetOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>📋 资产明细</span>
              <span class="badge">现金 {{ fmtQty(data.cashU) }} 万USDT</span>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>代币</th>
                    <th>数量(万)</th>
                    <th>市值(万USDT)</th>
                    <th>成本</th>
                    <th>浮盈亏</th>
                    <th>权重</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in data.assets" :key="row.pair">
                    <td>{{ row.token }}</td>
                    <td>{{ fmtQty(row.qty) }}</td>
                    <td>{{ fmtQty(row.valueU) }}</td>
                    <td>{{ fmtPrice(row.cost) }}</td>
                    <td :style="{ color: row.pnl >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                      {{ signedQty(row.pnl) }} ({{ row.pnlPct >= 0 ? '+' : '' }}{{ row.pnlPct }}%)
                    </td>
                    <td>{{ row.weight }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>🧭 交易习惯</span>
            <span class="badge">{{ data.scopeLabel }}</span>
          </div>
          <div class="habit-grid">
            <div v-for="item in habits" :key="item.label" class="habit-item">
              <div class="habit-label">{{ item.label }}</div>
              <div class="habit-value">{{ item.value }}</div>
              <div class="habit-note">{{ item.note }}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📊 近30日买卖</span>
            <span class="badge">{{ data.qtyNote }}</span>
          </div>
          <ChartBox size="xlarge" :option="tradeOption" />
        </div>

        <div class="card">
          <div class="card-header">
            <span>📦 持仓与盈亏</span>
            <span class="badge">数量 + 浮盈亏</span>
          </div>
          <ChartBox size="tall" :option="posOption" />
        </div>

        <div class="card detail-table-card">
          <div class="card-header">
            <span>🧾 成交纪录</span>
            <span class="badge">{{ data.scope === 'all' ? '全部交易对' : data.pair }}</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>时间</th>
                  <th>交易对</th>
                  <th>方向</th>
                  <th>数量(万)</th>
                  <th>价格</th>
                  <th>金额(万USDT)</th>
                  <th>手续费</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in data.fills" :key="`${row.time}-${index}`">
                  <td>{{ row.time }}</td>
                  <td>{{ row.pair }}</td>
                  <td><span class="tag" :class="row.tag">{{ row.side }}</span></td>
                  <td>{{ fmtQty(row.qty) }}</td>
                  <td>{{ fmtPrice(row.price) }}</td>
                  <td>{{ fmtQty(row.notional) }}</td>
                  <td>{{ row.fee }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card detail-table-card">
          <div class="card-header">
            <span>🚚 充提历史</span>
            <div class="header-tools">
              <router-link class="inline-link" to="/whales/exchange">看全站充提</router-link>
              <span class="badge">{{ data.scope === 'all' ? '全部代币' : data.token }} · 近30日 · {{ transferRows.length }} 笔</span>
            </div>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>时间</th>
                  <th>代币</th>
                  <th>操作</th>
                  <th>金额(万)</th>
                  <th>约合USDT</th>
                  <th>网络</th>
                  <th>关联地址</th>
                  <th>状态</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in transferRows" :key="`${row.time}-${row.action}-${index}`">
                  <td>{{ row.time }}</td>
                  <td>{{ row.token }}</td>
                  <td :class="'amt-' + row.actionClass">{{ row.action }}</td>
                  <td :class="'amt-' + row.actionClass">{{ fmtQty(row.amount) }}</td>
                  <td>{{ fmtQty(row.amountU) }}</td>
                  <td>{{ row.chain }}</td>
                  <td><CopyAddr :address="row.address" /></td>
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api'
import { appState } from '@/stores/app'
import { expandUid, lastDeskUid, saveLastDeskUid, userDetailPath } from '@/utils/uid'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import CopyAddr from '@/components/CopyAddr.vue'
import StatusStrip from '@/components/StatusStrip.vue'
import { tokenHex } from '@/utils/palette'

const route = useRoute()
const router = useRouter()
const draft = ref('')
const feedback = ref('')
const scope = ref('pair')
const routeUid = computed(() => decodeURIComponent(String(route.params.uid || '')).trim())
const currentUid = computed(() => expandUid(routeUid.value) || lastDeskUid())

const { loading, error, data, bindPair, load } = usePageData(() => {
  const uid = currentUid.value
  saveLastDeskUid(uid)
  return api.getExchangeUser(appState.currentPair, uid, scope.value)
})
bindPair()
watch(routeUid, (uid) => {
  draft.value = uid || lastDeskUid()
  feedback.value = ''
  load()
})
watch(scope, () => load())

onMounted(() => {
  draft.value = currentUid.value
  if (!routeUid.value) router.replace(userDetailPath(currentUid.value))
})

function setScope(next) {
  if (scope.value === next) return
  scope.value = next
}

function parseUid(raw) {
  const value = String(raw || '').trim()
  if (!value) return { error: '请输入 UID' }
  if (value.includes('***')) return { error: '请输入完整 UID，不要用脱敏格式' }
  const uid = expandUid(value)
  if (!/^\d{4,12}$/.test(uid)) return { error: 'UID 为 4–12 位数字' }
  return { uid }
}

function submitUid() {
  const parsed = parseUid(draft.value)
  if (parsed.error) {
    feedback.value = parsed.error
    return
  }
  feedback.value = ''
  if (parsed.uid === currentUid.value) {
    load()
    return
  }
  router.push(userDetailPath(parsed.uid))
}

const HIDDEN_HABITS = new Set(['买卖偏好', '活跃时段'])
const habits = computed(() => (data.value?.habits || []).filter((item) => !HIDDEN_HABITS.has(item.label)))

const transferRows = computed(() => {
  const rows = data.value?.transfers || []
  if ((data.value?.scope || scope.value) === 'all') return rows
  const pair = data.value?.pair || appState.currentPair
  const token = data.value?.token || String(pair || '').split('/')[0]
  return rows.filter((row) => row.pair === pair || row.token === token)
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

function fmtPrice(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  if (n >= 1000) return n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
  if (n >= 1) return n.toLocaleString('zh-CN', { maximumFractionDigits: 4 })
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 6 })
}

const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }

const tradeOption = computed(() => {
  const history = data.value?.history
  const tokens = history?.tokens || []
  const all = data.value?.scope === 'all'
  return {
    tooltip: { trigger: 'axis' },
    legend: {
      data: all ? [...tokens.map((row) => `${row.name}买入`), '卖出合计'] : ['买入', '卖出'],
      textStyle: { color: '#4a6080', fontSize: 10 },
      top: 0
    },
    grid: { left: '6%', right: '4%', top: '16%', bottom: '16%' },
    xAxis: { data: history?.dates || [], axisLabel: { color: '#4a6080', fontSize: 8, rotate: 40 } },
    yAxis: { ...yAxis, name: data.value?.qtyUnit || '万', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
    series: all
      ? [
          ...tokens.map((row, index) => ({
            name: `${row.name}买入`,
            type: 'bar',
            stack: 'buy',
            data: row.buy,
            itemStyle: { color: tokenHex(row.name, index) }
          })),
          { name: '卖出合计', type: 'line', data: history?.sell || [], smooth: true, lineStyle: { color: '#ff5a7a', width: 2 }, symbol: 'circle', symbolSize: 4 }
        ]
      : [
          { name: '买入', type: 'bar', data: history?.buy || [], itemStyle: { color: '#6a9aff' }, barWidth: '32%' },
          { name: '卖出', type: 'bar', data: history?.sell || [], itemStyle: { color: '#ffb347' }, barWidth: '32%' }
        ]
  }
})

const posOption = computed(() => {
  const history = data.value?.history
  const pnls = history?.pnl || []
  const minPnl = pnls.length ? Math.min(...pnls, 0) - 2 : -4
  const maxPnl = pnls.length ? Math.max(...pnls, 0) + 2 : 4
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['持仓', '浮盈亏'], textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 },
    grid: { left: '10%', right: '10%', top: '16%', bottom: '14%' },
    xAxis: { data: history?.dates || [], axisLabel: { color: '#4a6080', fontSize: 8, rotate: 40 } },
    yAxis: [
      { ...yAxis, name: data.value?.scope === 'all' ? '万枚' : '万', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
      { splitLine: { show: false }, axisLabel: { color: '#4a6080', fontSize: 8 }, min: minPnl, max: maxPnl, name: '万USDT', nameTextStyle: { color: '#4a6080', fontSize: 9 } }
    ],
    series: [
      { name: '持仓', type: 'bar', data: history?.pos || [], itemStyle: { color: 'rgba(106,154,255,0.72)' }, barWidth: '42%' },
      { name: '浮盈亏', type: 'line', yAxisIndex: 1, data: pnls, smooth: true, lineStyle: { color: '#4cd9a0', width: 2 }, symbol: 'none' }
    ]
  }
})

const assetOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['42%', '68%'],
    data: (data.value?.assets || []).map((row, index) => ({
      value: row.valueU,
      name: row.token,
      itemStyle: { color: tokenHex(row.token, index) }
    })),
    label: { color: '#b0c8e8', fontSize: 10, formatter: '{b}\n{d}%' }
  }]
}))
</script>

<style scoped>
.crumb {
  font-size: 12px;
  color: var(--text-soft);
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
  color: var(--text-soft);
  white-space: nowrap;
}
.addr-input {
  flex: 1;
  min-width: 160px;
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
  border-color: var(--focus);
}
.range-switch {
  display: flex;
  gap: 6px;
}
.addr-search .hint {
  font-size: 11px;
  color: #ff8aa0;
  white-space: nowrap;
}
.user-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.user-token {
  font-size: 12px;
  color: var(--text-soft);
  margin-bottom: 4px;
}
.user-id {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-title);
  letter-spacing: 0.4px;
}
.user-meta {
  margin-top: 6px;
  font-size: 11px;
  color: var(--text-soft);
  line-height: 1.5;
}
.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}
.tag-row .tag {
  text-decoration: none;
}
.kpi-grid {
  grid-template-columns: repeat(4, 1fr);
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
.habit-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.habit-item {
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-panel);
}
.habit-label {
  font-size: 10px;
  color: var(--text-soft);
}
.habit-value {
  margin-top: 4px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-title);
}
.habit-note {
  margin-top: 2px;
  font-size: 10px;
  color: var(--text-muted);
}
.header-tools {
  display: flex;
  align-items: center;
  gap: 10px;
}
.inline-link {
  color: #6a9aff;
  text-decoration: none;
}
.inline-link:hover {
  text-decoration: underline;
}
.amt-deposit {
  color: #ff5a7a;
}
.amt-withdraw {
  color: #4cd9a0;
}
@media (max-width: 1100px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .habit-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
