<template>
  <div class="page">
    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="card">
          <div class="card-header">
            <span>📜 做市账户历史</span>
            <span class="badge">全部历史 · 点日期看当日</span>
          </div>
          <StatusStrip :items="data.status" />
        </div>

        <div class="kpi-grid hist-kpis">
          <div class="kpi-item">
            <div class="label">{{ data.base }}余额</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#a78bfa;">{{ fmtQty(data.mm?.kpis?.endInv) }}<span class="unit">万{{ data.base }}</span></div>
              <div class="qty">自有 {{ fmtQty(data.mm?.kpis?.endTokenOwn) }} · 借入虚增 {{ fmtQty(data.mm?.kpis?.endTokenBorrowed) }}</div>
            </div>
          </div>
          <div class="kpi-item">
            <div class="label">{{ data.quote }}余额</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: Number(data.mm?.kpis?.endCash) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                {{ signedQty(data.mm?.kpis?.endCash) }}<span class="unit">万{{ data.quote }}</span>
              </div>
              <div class="qty">自有 {{ fmtQty(data.mm?.kpis?.endCashTrue) }} · 借入虚增 {{ fmtQty(data.mm?.kpis?.endCashBorrowed) }}</div>
            </div>
          </div>
          <div class="kpi-item">
            <div class="label">真实交易量</div>
            <div class="kpi-metrics">
              <div class="value">{{ fmtQty(data.kpis.matched) }}<span class="unit">万</span></div>
            </div>
            <div class="sub">买卖重叠的部分</div>
          </div>
          <div class="kpi-item">
            <div class="label">交易盈亏</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: Number(data.kpis.realizedU) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                {{ signedQty(data.kpis.realizedU) }}<span class="unit">万USDT</span>
              </div>
            </div>
            <div class="sub">均卖 − 均买 · 对倒部分</div>
          </div>
          <div class="kpi-item">
            <div class="label">存货浮盈</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: Number(data.kpis.floatU) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                {{ signedQty(data.kpis.floatU) }}<span class="unit">万USDT</span>
              </div>
            </div>
            <div class="sub">净库存按现价 {{ data.kpis.endLast }} 计价</div>
          </div>
          <div class="kpi-item">
            <div class="label">盈亏</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: Number(data.kpis.totalU) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                {{ signedQty(data.kpis.totalU) }}<span class="unit">万USDT</span>
              </div>
            </div>
            <div class="sub">交易盈亏 + 存货浮盈</div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span>📤 交易情况</span>
              <span class="badge">均卖 {{ fmtPrice(data.kpis.avgSell) }} · 均买 {{ fmtPrice(data.kpis.avgBuy) }}</span>
            </div>
            <div class="trade-board">
              <div class="trade-legs">
                <div class="trade-leg is-sell">
                  <div class="mini-label">卖出</div>
                  <div class="leg-metrics">
                    <div class="leg-row">
                      <span>数量</span>
                      <strong>{{ fmtQty(data.kpis.periodSell) }}<em>万</em></strong>
                    </div>
                    <div class="leg-row">
                      <span>金额</span>
                      <strong>{{ fmtQty(data.kpis.periodSellU) }}<em>万USDT</em></strong>
                    </div>
                    <div class="leg-row">
                      <span>均价</span>
                      <strong>{{ fmtPrice(data.kpis.avgSell) }}</strong>
                    </div>
                    <div class="leg-row">
                      <span>人数</span>
                      <strong>{{ data.kpis.sellUsers }}<em>人</em></strong>
                    </div>
                    <div class="leg-row">
                      <span>笔数</span>
                      <strong>{{ data.kpis.sellFills }}<em>笔</em></strong>
                    </div>
                  </div>
                </div>
                <div class="trade-leg is-buy">
                  <div class="mini-label">买入</div>
                  <div class="leg-metrics">
                    <div class="leg-row">
                      <span>数量</span>
                      <strong>{{ fmtQty(data.kpis.periodBuy) }}<em>万</em></strong>
                    </div>
                    <div class="leg-row">
                      <span>金额</span>
                      <strong>{{ fmtQty(data.kpis.periodBuyU) }}<em>万USDT</em></strong>
                    </div>
                    <div class="leg-row">
                      <span>均价</span>
                      <strong>{{ fmtPrice(data.kpis.avgBuy) }}</strong>
                    </div>
                    <div class="leg-row">
                      <span>人数</span>
                      <strong>{{ data.kpis.buyUsers }}<em>人</em></strong>
                    </div>
                    <div class="leg-row">
                      <span>笔数</span>
                      <strong>{{ data.kpis.buyFills }}<em>笔</em></strong>
                    </div>
                  </div>
                </div>
              </div>
              <div class="trade-meta">
                <div>
                  <div class="mini-label">USDT 净增加</div>
                  <div class="mini-value" :style="{ color: Number(data.kpis.periodUsdt) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                    {{ signedQty(data.kpis.periodUsdt) }}<span>万USDT</span>
                  </div>
                </div>
                <div>
                  <div class="mini-label">代币净变动</div>
                  <div class="mini-value">{{ signedQty(data.kpis.periodToken) }}<span>万</span></div>
                </div>
                <div>
                  <div class="mini-label">{{ periodTradeAvg.label }}</div>
                  <div class="mini-value" :style="{ color: periodTradeAvg.color }">{{ periodTradeAvg.text }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <span>🎯 交易对手方</span>
              <span class="badge">用户买 = 你卖 · 用户卖 = 你买</span>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>对手</th>
                    <th>买(万)</th>
                    <th>卖(万)</th>
                    <th>净(万)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>散户</td>
                    <td style="color:#6a9aff;">{{ fmtQty(data.kpis.retailBuy) }}</td>
                    <td style="color:#ff5a7a;">{{ fmtQty(data.kpis.retailSell) }}</td>
                    <td>{{ signedQty(data.kpis.retailNet) }}</td>
                  </tr>
                  <tr>
                    <td>聪明钱</td>
                    <td style="color:#6a9aff;">{{ fmtQty(data.kpis.smartBuy) }}</td>
                    <td style="color:#ff5a7a;">{{ fmtQty(data.kpis.smartSell) }}</td>
                    <td>{{ signedQty(data.kpis.smartNet) }}</td>
                  </tr>
                  <tr>
                    <td>真实用户</td>
                    <td style="color:#6a9aff;">{{ fmtQty(data.kpis.realBuy) }}</td>
                    <td style="color:#ff5a7a;">{{ fmtQty(data.kpis.realSell) }}</td>
                    <td>{{ signedQty(data.kpis.realNet) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>💰 做市资金 / 做市账户余额 / 代币市值</span>
            <span class="badge">万USDT · 全部历史</span>
          </div>
          <ChartBox :option="assetOption" size="tall" />
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span>📦 {{ data.base }} 做市库存</span>
              <span class="badge">自有 vs 借入虚增</span>
            </div>
            <ChartBox :option="invOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>💵 余额占比</span>
              <span class="badge">%</span>
            </div>
            <ChartBox :option="cashPctOption" />
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📈 K线</span>
            <span class="badge">库存成本 {{ fmtPrice(data.kpis.endCost) }} · 柱在零上=买入</span>
          </div>
          <ChartBox size="combo" :option="flowCostOption" />
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span>💹 日卖出 / 买入</span>
              <span class="badge">万枚</span>
            </div>
            <ChartBox :option="flowOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>💵 日 USDT 净增加</span>
              <span class="badge">万USDT</span>
            </div>
            <ChartBox :option="usdtOption" />
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📋 每日明细</span>
            <span class="badge">点日期看当日 · 新 → 旧</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>日期</th>
                  <th>卖出(万)</th>
                  <th>买入(万)</th>
                  <th>均卖</th>
                  <th>均买</th>
                  <th>卖出金额</th>
                  <th>买入金额</th>
                  <th>净买入</th>
                  <th>USDT净增加</th>
                  <th>已实现盈亏</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in data.rows" :key="row.dateKey || row.date" class="row-link" @click="$router.push(dumpDayTo(row))">
                  <td>
                    <router-link class="date-link" :to="dumpDayTo(row)" @click.stop>{{ row.date }}</router-link>
                  </td>
                  <td style="color:#ff5a7a;">{{ fmtQty(row.sellQty) }}</td>
                  <td style="color:#6a9aff;">{{ fmtQty(row.buyQty) }}</td>
                  <td>{{ fmtPrice(row.avgSell) }}</td>
                  <td>{{ fmtPrice(row.avgBuy) }}</td>
                  <td style="color:#ff5a7a;">{{ fmtQty(row.sellU) }}</td>
                  <td style="color:#6a9aff;">{{ fmtQty(row.buyU) }}</td>
                  <td :style="{ color: Number(row.netQty ?? row.tokenDelta) >= 0 ? '#6a9aff' : '#ffb347' }">{{ signedQty(row.netQty ?? row.tokenDelta) }}</td>
                  <td :style="{ color: Number(row.usdtNet) >= 0 ? '#4cd9a0' : '#ff5a7a' }">{{ signedQty(row.usdtNet) }}</td>
                  <td :style="{ color: Number(row.realizedU) >= 0 ? '#4cd9a0' : '#ff5a7a' }">{{ signedQty(row.realizedU) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-for="table in detailTables" :key="table.key" class="card">
          <div class="card-header">
            <span>📋 每日资产 · {{ table.title }}</span>
            <span class="badge">{{ table.badge }}</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>日期</th>
                  <th>做市资金(万USDT)</th>
                  <th>做市账户余额</th>
                  <th>真实余额</th>
                  <th>借入金额</th>
                  <th>代币自有</th>
                  <th>代币借入</th>
                  <th>买(万)</th>
                  <th>卖(万)</th>
                  <th>净买入</th>
                  <th>交易盈亏(万USDT)</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in table.rows"
                  :key="row.dateKey || row.date"
                  class="row-link"
                  @click="$router.push(dumpDayTo(row))"
                >
                  <td>
                    <router-link class="date-link" :to="dumpDayTo(row)" @click.stop>{{ row.date }}</router-link>
                  </td>
                  <td>{{ fmtQty(row.equityU) }}</td>
                  <td :style="{ color: Number(row.cashU) >= 0 ? '#6a9aff' : '#ff5a7a' }">{{ signedQty(row.cashU) }}</td>
                  <td :style="{ color: Number(row.cashTrueU) >= 0 ? '#4cd9a0' : '#ff5a7a' }">{{ signedQty(row.cashTrueU) }}</td>
                  <td>{{ fmtQty(row.cashBorrowedU) }}</td>
                  <td>{{ fmtQty(row.tokenOwn) }}</td>
                  <td>{{ fmtQty(row.tokenBorrowed) }}</td>
                  <td style="color:#6a9aff;">{{ fmtQty(row.buyQty) }}</td>
                  <td style="color:#ffb347;">{{ fmtQty(row.sellQty) }}</td>
                  <td :style="{ color: row.netQty >= 0 ? '#6a9aff' : '#ffb347' }">{{ signedQty(row.netQty) }}</td>
                  <td :style="{ color: row.realizedU >= 0 ? '#4cd9a0' : '#ff5a7a' }">{{ signedQty(row.realizedU) }}</td>
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
import { computed } from 'vue'
import { api } from '@/api'
import { appState } from '@/stores/app'
import { isDeskToday } from '@/config/constants'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import StatusStrip from '@/components/StatusStrip.vue'
import { mmFlowChartOption } from '@/utils/mmFlowChart'

const { loading, error, data, bindPair } = usePageData(async () => {
  const pair = appState.currentPair
  const accounts = appState.config.internalAccounts || []
  const [trade, mm] = await Promise.all([
    api.getTradeHistory(pair, 'all', accounts),
    api.getMmHistory(pair, 'all', accounts)
  ])
  return { ...trade, mm }
})
bindPair()

const periodTradeAvg = computed(() => {
  const kpis = data.value?.kpis
  const delta = Number(kpis?.periodToken)
  if (!Number.isFinite(delta) || delta === 0) {
    return { label: '交易均价', text: '--', color: '' }
  }
  if (delta > 0) {
    return { label: '买入均价', text: String(fmtPrice(kpis.avgBuy)), color: '#6a9aff' }
  }
  return { label: '卖出均价', text: String(fmtPrice(kpis.avgSell)), color: '#ff5a7a' }
})

const detailTables = computed(() => {
  const mm = data.value?.mm
  if (!mm) return []
  const books = Array.isArray(mm.accountBooks) ? mm.accountBooks : []
  return [
    { key: 'total', title: '合计', badge: '两个账户加总 · 新 → 旧', rows: mm.rows || [] },
    ...books.map((book) => ({
      key: book.uid,
      title: `${book.remark || '做市账户'} ${book.uid}`,
      badge: book.role ? `${book.role} · ${book.uid}` : book.uid,
      rows: book.rows || []
    }))
  ]
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

function dumpDayTo(row) {
  if (!row?.dateKey || isDeskToday(row.dateKey)) return '/ops/dump'
  return { path: '/ops/dump', query: { date: row.dateKey } }
}

function axisInterval(range) {
  const n = Number(range) || 30
  if (n <= 7) return 0
  if (n <= 15) return 1
  if (n <= 30) return 4
  return Math.max(4, Math.ceil(n / 8) - 1)
}

const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }
const legend = { textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 }
const xAxis = computed(() => ({
  data: data.value?.series?.dates || [],
  axisLabel: {
    color: '#4a6080',
    fontSize: 8,
    interval: axisInterval(data.value?.range)
  }
}))

const flowCostOption = computed(() => mmFlowChartOption({
  labels: data.value?.series?.dates || [],
  lastHour: data.value?.series?.lastPrice || [],
  costHour: data.value?.series?.invCost || [],
  netHour: data.value?.series?.netQty || [],
  interval: axisInterval(data.value?.range)
}))

const flowOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { ...legend, data: ['卖出', '买入'] },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [
    { name: '卖出', type: 'bar', data: data.value?.series?.sellQty || [], itemStyle: { color: '#ff5a7a' }, barWidth: '28%' },
    { name: '买入', type: 'bar', data: data.value?.series?.buyQty || [], itemStyle: { color: '#6a9aff' }, barWidth: '28%' }
  ]
}))

const usdtOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis: { ...yAxis, name: '万USDT', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
  series: [{
    name: 'USDT净增加',
    type: 'bar',
    data: data.value?.series?.usdtNet || [],
    itemStyle: {
      color: (params) => (Number(params.value) >= 0 ? '#4cd9a0' : '#ff5a7a')
    },
    barWidth: '42%'
  }]
}))

const mmAxis = computed(() => ({
  data: data.value?.mm?.series?.dates || [],
  axisLabel: {
    color: '#4a6080',
    fontSize: 8,
    interval: axisInterval(data.value?.range)
  }
}))

const assetOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { ...legend, data: ['做市资金', '做市账户余额', '代币市值'] },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: mmAxis.value,
  yAxis: { ...yAxis, name: '万USDT', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
  series: [
    {
      name: '做市资金',
      type: 'line',
      data: data.value?.mm?.series?.equity || [],
      smooth: true,
      lineStyle: { color: '#e8f0ff', width: 2 },
      symbol: 'none'
    },
    {
      name: '做市账户余额',
      type: 'line',
      data: data.value?.mm?.series?.cash || [],
      smooth: true,
      lineStyle: { color: '#6a9aff', width: 2 },
      areaStyle: { color: 'rgba(106,154,255,0.08)' },
      symbol: 'none'
    },
    {
      name: '代币市值',
      type: 'line',
      data: data.value?.mm?.series?.tokenU || [],
      smooth: true,
      lineStyle: { color: '#ffb347', width: 2 },
      areaStyle: { color: 'rgba(255,179,71,0.08)' },
      symbol: 'none'
    }
  ]
}))

const invOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { ...legend, data: ['自有代币', '借入虚增'] },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: mmAxis.value,
  yAxis: { ...yAxis, name: '万枚', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
  series: [
    {
      name: '自有代币',
      type: 'bar',
      stack: 'inv',
      data: data.value?.mm?.series?.tokenOwn || [],
      itemStyle: { color: 'rgba(76,217,160,0.82)' },
      barWidth: '45%'
    },
    {
      name: '借入虚增',
      type: 'bar',
      stack: 'inv',
      data: data.value?.mm?.series?.tokenBorrowed || [],
      itemStyle: { color: 'rgba(255,179,71,0.82)' }
    }
  ]
}))

const cashPctOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: mmAxis.value,
  yAxis: { ...yAxis, name: '%', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
  series: [{
    name: '余额占比',
    type: 'line',
    data: data.value?.mm?.series?.cashPct || [],
    smooth: true,
    lineStyle: { color: '#6a9aff', width: 2 },
    areaStyle: { color: 'rgba(106,154,255,0.12)' },
    symbol: 'none'
  }]
}))
</script>

<style scoped>
.date-link {
  color: #6a9aff;
  text-decoration: none;
  font-weight: 600;
}
.date-link:hover {
  text-decoration: underline;
}
.row-link {
  cursor: pointer;
}
.row-link:hover td {
  color: var(--text-title);
}
.kpi-grid.hist-kpis {
  grid-template-columns: repeat(6, minmax(0, 1fr));
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
}
.trade-board {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 2px 2px 8px;
}
.trade-legs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.trade-leg {
  padding: 10px 12px;
  border-radius: 8px;
  text-align: left;
}
.trade-leg.is-sell {
  background: rgba(255, 90, 122, 0.08);
}
.trade-leg.is-buy {
  background: rgba(106, 154, 255, 0.08);
}
.trade-leg.is-sell .leg-row strong {
  color: #ff5a7a;
}
.trade-leg.is-buy .leg-row strong {
  color: #6a9aff;
}
.leg-metrics {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
}
.leg-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}
.leg-row span {
  font-size: 10px;
  color: var(--text-muted);
}
.leg-row strong {
  font-size: 14px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.leg-row em {
  margin-left: 2px;
  font-style: normal;
  font-size: 10px;
  font-weight: 400;
  color: var(--text-soft);
}
.trade-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 2px 4px 0;
}
.mini-label {
  font-size: 10px;
  color: var(--text-muted);
}
.mini-value {
  margin-top: 4px;
  font-size: 18px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.mini-value span {
  margin-left: 2px;
  font-size: 11px;
  font-weight: 400;
  color: var(--text-soft);
}
@media (max-width: 720px) {
  .trade-legs,
  .trade-meta {
    grid-template-columns: 1fr;
  }
}
</style>
