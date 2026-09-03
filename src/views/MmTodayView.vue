<template>
  <div class="page">
    <PageState :loading="loading && !data" :error="error">
      <div v-if="data">
      <div class="card">
        <div class="card-header">
          <span>🤖 做市账户今日资产情况</span>
          <div class="header-tools">
            <router-link class="inline-link" to="/robots/config">机器人配置</router-link>
            <router-link class="inline-link" to="/desk/mm/history">历史资产情况</router-link>
            <router-link class="inline-link" to="/ops/dump">今日交易情况</router-link>
            <span class="badge">做市账户 · 部分可能是从用户借入的虚增</span>
          </div>
        </div>
        <div class="monitor-status">
          <div v-for="item in data.status" :key="item.text" class="status-item">
            <span class="status-dot" :class="item.color"></span> {{ item.text }}
          </div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-item" @click="$router.push('/robots')">
          <div class="label">{{ pairBase }}余额</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#a78bfa;">{{ fmtQty(data.kpis.tokenInv) }}<span class="unit">万{{ pairBase }}</span></div>
            <div class="qty">自有 {{ fmtQty(data.kpis.tokenOwn) }} · 借入虚增 {{ fmtQty(data.kpis.tokenBorrowed) }}</div>
          </div>
          <div class="sub">{{ data.kpis.bandStatus }} · 卖出用的货</div>
        </div>
        <div class="kpi-item" @click="$router.push('/robots')">
          <div class="label">{{ pairQuote }}余额</div>
          <div class="kpi-metrics">
            <div class="value" :style="{ color: Number(data.kpis.cashU) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
              {{ signedQty(data.kpis.cashU) }}<span class="unit">万{{ pairQuote }}</span>
            </div>
            <div class="qty">真实 {{ signedQty(data.kpis.cashTrueU) }} · 借入 {{ fmtQty(data.kpis.cashBorrowedU) }}</div>
          </div>
          <div class="sub">真实余额 + 借入金额 · 买入用的钱</div>
        </div>
        <div class="kpi-item">
          <div class="label">今日买入</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#6a9aff;">{{ fmtQty(data.kpis.buyQty) }}<span class="unit">万</span></div>
            <div class="qty">{{ fmtQty(data.kpis.buyU) }}<span class="unit">万USDT</span></div>
          </div>
          <div class="sub">做市买入</div>
        </div>
        <div class="kpi-item">
          <div class="label">今日卖出</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#ffb347;">{{ fmtQty(data.kpis.sellQty) }}<span class="unit">万</span></div>
            <div class="qty">{{ fmtQty(data.kpis.sellU) }}<span class="unit">万USDT</span></div>
          </div>
          <div class="sub">做市卖出</div>
        </div>
        <div class="kpi-item">
          <div class="label">平均买入价</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#6a9aff;">{{ fmtPrice(data.kpis.avgBuy) }}</div>
            <div class="qty">现价 {{ fmtPrice(data.kpis.lastPrice) }}</div>
          </div>
          <div class="sub">今日做市成交均价</div>
        </div>
        <div class="kpi-item">
          <div class="label">平均卖出价</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#ffb347;">{{ fmtPrice(data.kpis.avgSell) }}</div>
            <div class="qty">价差 {{ data.kpis.spreadBps }}<span class="unit">bps</span></div>
          </div>
          <div class="sub">买卖均价差 · 做市毛利空间</div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-item">
          <div class="label">今日盈亏</div>
          <div class="kpi-metrics">
            <div class="value" :style="{ color: data.kpis.totalU >= 0 ? '#4cd9a0' : '#ff5a7a' }">
              {{ signedQty(data.kpis.totalU) }}<span class="unit">万USDT</span>
            </div>
          </div>
          <div class="sub">交易盈亏 + 今日浮盈 · 不含期初库存</div>
        </div>
        <div class="kpi-item">
          <div class="label">净买入</div>
          <div class="kpi-metrics">
            <div class="value" :style="{ color: data.kpis.netQty >= 0 ? '#6a9aff' : '#ffb347' }">
              {{ signedQty(data.kpis.netQty) }}<span class="unit">万</span>
            </div>
          </div>
          <div class="sub">{{ data.kpis.netQty >= 0 ? '库存回补' : '库存消耗' }}</div>
        </div>
        <div class="kpi-item">
          <div class="label">配对成交</div>
          <div class="kpi-metrics">
            <div class="value">{{ fmtQty(data.kpis.matchedQty) }}<span class="unit">万</span></div>
          </div>
          <div class="sub">min(买, 卖) · 交易盈亏底数</div>
        </div>
        <div class="kpi-item">
          <div class="label">交易盈亏</div>
          <div class="kpi-metrics">
            <div class="value" :style="{ color: data.kpis.realizedU >= 0 ? '#4cd9a0' : '#ff5a7a' }">
              {{ signedQty(data.kpis.realizedU) }}<span class="unit">万USDT</span>
            </div>
          </div>
          <div class="sub">配对成交 × (均卖 − 均买)</div>
        </div>
        <div class="kpi-item">
          <div class="label">今日浮盈</div>
          <div class="kpi-metrics">
            <div class="value" :style="{ color: data.kpis.floatU >= 0 ? '#4cd9a0' : '#ff5a7a' }">
              {{ signedQty(data.kpis.floatU) }}<span class="unit">万USDT</span>
            </div>
          </div>
          <div class="sub">今日净头寸相对现价</div>
        </div>
        <div class="kpi-item" @click="$router.push('/robots')">
          <div class="label">报价价差</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#6a9aff;">{{ data.kpis.spreadBps }}<span class="unit">bps</span></div>
          </div>
          <div class="sub">点进机器人页看报价覆盖</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><span>💹 今日买 / 卖成交</span><span class="badge">万枚</span></div>
          <ChartBox :option="flowOption" />
        </div>
        <div class="card">
          <div class="card-header"><span>📈 交易盈亏 / 浮盈</span><span class="badge">万USDT · 累计</span></div>
          <ChartBox :option="pnlOption" />
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><span>📦 做市库存</span><span class="badge">万枚 · 含借入虚增</span></div>
          <ChartBox :option="invOption" />
        </div>
        <div class="card">
          <div class="card-header"><span>🧩 自有 vs 借入虚增</span><span class="badge">做市库存拆分</span></div>
          <ChartBox :option="bookOption" />
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span>🏦 做市账户明细</span>
          <span class="badge">{{ data.accounts.length }} 个 UID</span>
        </div>
        <div v-if="!data.accounts.length" class="empty-hint">还没有配置做市账户 UID，请在上方「做市账户配置」里添加。</div>
        <div v-else class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>UID</th>
                <th>备注</th>
                <th>状态</th>
                <th>代币自有</th>
                <th>代币借入</th>
                <th>做市账户余额</th>
                <th>真实余额</th>
                <th>借入金额</th>
                <th>今日买(万)</th>
                <th>今日卖(万)</th>
                <th>净买入</th>
                <th>交易盈亏</th>
                <th>浮盈</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in data.accounts" :key="row.uid">
                <td>{{ row.uid }}</td>
                <td>{{ row.remark }}</td>
                <td><span class="tag" :class="row.statusTag">{{ row.status }}</span></td>
                <td>{{ fmtQty(row.tokenOwn) }}</td>
                <td>{{ fmtQty(row.tokenBorrowed) }}</td>
                <td :style="{ color: Number(row.cashU) >= 0 ? '#4cd9a0' : '#ff5a7a' }">{{ signedQty(row.cashU) }}</td>
                <td :style="{ color: Number(row.cashTrueU) >= 0 ? '#4cd9a0' : '#ff5a7a' }">{{ signedQty(row.cashTrueU) }}</td>
                <td>{{ fmtQty(row.cashBorrowedU) }}</td>
                <td>{{ fmtQty(row.buyFill) }}</td>
                <td>{{ fmtQty(row.sellFill) }}</td>
                <td :style="{ color: row.netQty >= 0 ? '#6a9aff' : '#ffb347' }">{{ signedQty(row.netQty) }}</td>
                <td>{{ signedQty(row.realizedU) }}</td>
                <td>{{ signedQty(row.floatU) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span>📋 今日成交纪录</span>
          <span class="badge">真实用户 · 点 UID 进持仓分布</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>UID</th>
                <th>标签</th>
                <th>类型</th>
                <th>买入(万)</th>
                <th>卖出(万)</th>
                <th>净买入</th>
                <th>笔数</th>
                <th>均价</th>
                <th>首笔</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in data.traders" :key="row.uid" class="row-link" @click="$router.push(userDetailPath(row.uid))">
                <td>{{ row.uid }}</td>
                <td><span class="tag" :class="row.tagClass">{{ row.tag }}</span></td>
                <td>{{ row.kind }}</td>
                <td>{{ fmtQty(row.buy) }}</td>
                <td>{{ fmtQty(row.sell) }}</td>
                <td :style="{ color: row.net >= 0 ? '#6a9aff' : '#ffb347' }">{{ signedQty(row.net) }}</td>
                <td>{{ row.trades }}</td>
                <td>{{ fmtPrice(row.avgPrice) }}</td>
                <td>{{ row.firstTime }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </PageState>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { api } from '@/api'
import { appState } from '@/stores/app'
import { userDetailPath } from '@/utils/uid'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'

const { loading, error, data, bindPair } = usePageData(() =>
  api.getMmToday(appState.currentPair, appState.config.internalAccounts || [])
)
bindPair()

const pairBase = computed(() => String(appState.currentPair || '').split('/')[0] || 'TOKEN')
const pairQuote = computed(() => String(appState.currentPair || '').split('/')[1] || 'USDT')

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
const legend = { textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 }
const xAxis = computed(() => ({
  data: data.value?.history?.hours || [],
  axisLabel: { color: '#4a6080', fontSize: 8, interval: 3 }
}))

const flowOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { ...legend, data: ['买入', '卖出'] },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [
    { name: '买入', type: 'bar', data: data.value?.history?.buyHour || [], itemStyle: { color: '#6a9aff' }, barWidth: '28%' },
    { name: '卖出', type: 'bar', data: data.value?.history?.sellHour || [], itemStyle: { color: '#ffb347' }, barWidth: '28%' }
  ]
}))

const pnlOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { ...legend, data: ['交易盈亏', '浮盈'] },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [
    { name: '交易盈亏', type: 'line', data: data.value?.history?.realizedHour || [], smooth: true, lineStyle: { color: '#4cd9a0', width: 2 }, symbol: 'none' },
    { name: '浮盈', type: 'line', data: data.value?.history?.floatHour || [], smooth: true, lineStyle: { color: '#ffb347', width: 2 }, symbol: 'none' }
  ]
}))

const invOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis: { ...yAxis, name: '万枚', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
  series: [{
    name: '做市库存',
    type: 'line',
    data: data.value?.history?.invHour || [],
    smooth: true,
    lineStyle: { color: '#a78bfa', width: 2 },
    areaStyle: { color: 'rgba(167,139,250,0.16)' },
    symbol: 'none'
  }]
}))

const bookOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { ...legend, data: ['自有代币', '借入虚增'] },
  series: [{
    type: 'pie',
    radius: ['42%', '68%'],
    data: (data.value?.book || []).map((item) => ({
      value: item.value,
      name: item.name,
      itemStyle: { color: item.color }
    })),
    label: { color: '#b0c8e8', fontSize: 10, formatter: '{b}\n{c} 万' }
  }]
}))
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
.qty .unit {
  font-size: 10px;
  color: var(--text-soft);
  font-weight: 400;
}
.empty-hint {
  padding: 18px 8px;
  font-size: 12px;
  color: #7a90b0;
  line-height: 1.5;
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
.row-link {
  cursor: pointer;
}
.row-link:hover td {
  color: var(--text-title);
}
</style>
