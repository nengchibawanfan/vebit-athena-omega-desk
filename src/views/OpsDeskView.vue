<template>
  <div class="page">
    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="card">
          <div class="card-header">
            <span>{{ header.title }}</span>
            <span class="badge">{{ header.badge }}</span>
          </div>
          <p class="blurb">
            做市账户{{ dumpIsToday ? '今日' : data.dump.dateLabel }}卖出 / 买入，以及库存和余额。
            <router-link v-if="!dumpIsToday" class="inline-link" to="/ops/dump">看今日</router-link>
            <router-link class="inline-link" to="/ops/dump/history">历史</router-link>
          </p>
          <div class="monitor-status">
            <div class="status-item">
              <span class="status-dot" :class="actionDot(data.stance.action)"></span>
              现价 {{ data.stance.lastPrice }}
            </div>
            <div class="status-item">
              <span class="status-dot" :class="Number(data.stance.mmDevPct) >= 0 ? 'green' : 'yellow'"></span>
              做市账户库存成本 {{ fmtPrice(data.stance.mmCost) }} · 偏离 {{ signed(data.stance.mmDevPct) }}%
            </div>
            <div class="status-item">
              <span class="status-dot" :class="Number(data.stance.devPct) >= 0 ? 'yellow' : 'green'"></span>
              真实用户持仓均价 {{ data.stance.avgCost }} · 偏离 {{ signed(data.stance.devPct) }}%
            </div>
          </div>
        </div>

        <div class="kpi-grid mm-kpis">
            <div class="kpi-item">
              <div class="label">{{ pairBase }}余额</div>
              <div class="kpi-metrics">
                <div class="value" style="color:#a78bfa;">{{ fmtQty(data.dump.dumpable) }}<span class="unit">万{{ pairBase }}</span></div>
                <div class="qty">自有 {{ fmtQty(data.dump.tokenOwn) }} · 借入虚增 {{ fmtQty(data.dump.tokenBorrowed) }}</div>
              </div>
            </div>
            <div class="kpi-item">
              <div class="label">{{ pairQuote }}余额</div>
              <div class="kpi-metrics">
                <div class="value" :style="{ color: Number(data.dump.ownUsdt) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                  {{ signedQty(data.dump.ownUsdt) }}<span class="unit">万{{ pairQuote }}</span>
                </div>
                <div class="qty">自有 {{ fmtQty(data.dump.cashTrueU) }} · 借入虚增 {{ fmtQty(data.dump.cashBorrowedU) }}</div>
              </div>
            </div>
            <div class="kpi-item">
              <div class="label">交易盈亏</div>
              <div class="kpi-metrics">
                <div class="value" :style="{ color: Number(data.dump.realizedU) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                  {{ signedQty(data.dump.realizedU) }}<span class="unit">万USDT</span>
                </div>
              </div>
              <div class="sub">均卖 − 均买 · 对倒部分</div>
            </div>
            <div class="kpi-item">
              <div class="label">存货浮盈</div>
              <div class="kpi-metrics">
                <div class="value" :style="{ color: Number(data.dump.floatU) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                  {{ signedQty(data.dump.floatU) }}<span class="unit">万USDT</span>
                </div>
              </div>
              <div class="sub">净库存按现价 {{ data.dump.lastPrice }} 计价</div>
            </div>
            <div class="kpi-item">
              <div class="label">{{ dumpWord }}盈亏</div>
              <div class="kpi-metrics">
                <div class="value" :style="{ color: Number(data.dump.totalU) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                  {{ signedQty(data.dump.totalU) }}<span class="unit">万USDT</span>
                </div>
              </div>
              <div class="sub">交易盈亏 + 存货浮盈</div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <span>🏦 做市账户明细</span>
              <span class="badge">{{ (data.mmToday?.accounts || []).length }} 个 UID</span>
            </div>
            <div v-if="!(data.mmToday?.accounts || []).length" class="empty-hint">还没有配置做市账户 UID，请到机器人配置里添加。</div>
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
                    <th>{{ dumpWord }}买(万)</th>
                    <th>{{ dumpWord }}卖(万)</th>
                    <th>净买入</th>
                    <th>交易盈亏</th>
                    <th>浮盈</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in data.mmToday.accounts" :key="row.uid">
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
          <div class="grid-2">
            <div class="card">
              <div class="card-header">
                <span>📤 交易情况</span>
                <span class="badge">均卖 {{ data.dump.avgSell }} · 均买 {{ data.dump.avgBuy }}</span>
              </div>
              <div class="trade-board">
                <div class="trade-legs">
                  <div class="trade-leg is-sell">
                    <div class="mini-label">卖出</div>
                    <div class="leg-metrics">
                      <div class="leg-row">
                        <span>数量</span>
                        <strong>{{ fmtQty(data.dump.sellHigh) }}<em>万</em></strong>
                      </div>
                      <div class="leg-row">
                        <span>金额</span>
                        <strong>{{ fmtQty(data.dump.usdtIn30) }}<em>万USDT</em></strong>
                      </div>
                      <div class="leg-row">
                        <span>均价</span>
                        <strong>{{ fmtPrice(data.dump.avgSell) }}</strong>
                      </div>
                      <div class="leg-row">
                        <span>人数</span>
                        <strong>{{ data.dump.sellUsers }}<em>人</em></strong>
                      </div>
                      <div class="leg-row">
                        <span>笔数</span>
                        <strong>{{ data.dump.sellFills }}<em>笔</em></strong>
                      </div>
                    </div>
                  </div>
                  <div class="trade-leg is-buy">
                    <div class="mini-label">买入</div>
                    <div class="leg-metrics">
                      <div class="leg-row">
                        <span>数量</span>
                        <strong>{{ fmtQty(data.dump.buyLow) }}<em>万</em></strong>
                      </div>
                      <div class="leg-row">
                        <span>金额</span>
                        <strong>{{ fmtQty(data.dump.usdtOut30) }}<em>万USDT</em></strong>
                      </div>
                      <div class="leg-row">
                        <span>均价</span>
                        <strong>{{ fmtPrice(data.dump.avgBuy) }}</strong>
                      </div>
                      <div class="leg-row">
                        <span>人数</span>
                        <strong>{{ data.dump.buyUsers }}<em>人</em></strong>
                      </div>
                      <div class="leg-row">
                        <span>笔数</span>
                        <strong>{{ data.dump.buyFills }}<em>笔</em></strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trade-meta">
                  <div>
                    <div class="mini-label">USDT 净增加</div>
                    <div class="mini-value" :style="{ color: Number(data.dump.usdtNet30) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                      {{ signedQty(data.dump.usdtNet30) }}<span>万USDT</span>
                    </div>
                  </div>
                  <div>
                    <div class="mini-label">代币净变动</div>
                    <div class="mini-value">{{ signedQty(data.dump.tokenDelta) }}<span>万</span></div>
                  </div>
                  <div>
                    <div class="mini-label">{{ dumpTradeAvg.label }}</div>
                    <div class="mini-value" :style="{ color: dumpTradeAvg.color }">{{ dumpTradeAvg.text }}</div>
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
                      <td style="color:#6a9aff;">{{ fmtQty(data.dump.retailBuy) }}</td>
                      <td style="color:#ff5a7a;">{{ fmtQty(data.dump.retailSell) }}</td>
                      <td>{{ signedQty(data.dump.retailNet) }}</td>
                    </tr>
                    <tr>
                      <td>聪明钱</td>
                      <td style="color:#6a9aff;">{{ fmtQty(data.dump.smartBuy) }}</td>
                      <td style="color:#ff5a7a;">{{ fmtQty(data.dump.smartSell) }}</td>
                      <td>{{ signedQty(data.dump.smartNet) }}</td>
                    </tr>
                    <tr>
                      <td>真实用户</td>
                      <td style="color:#6a9aff;">{{ fmtQty(data.dump.realBuy) }}</td>
                      <td style="color:#ff5a7a;">{{ fmtQty(data.dump.realSell) }}</td>
                      <td>{{ signedQty(data.dump.realNet) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="grid-2">
            <div class="card">
              <div class="card-header"><span>📦 做市库存</span><span class="badge">万枚 · 含借入虚增</span></div>
              <ChartBox :option="dumpInvOption" />
            </div>
            <div class="card">
              <div class="card-header"><span>🧩 自有 vs 借入虚增</span><span class="badge">做市库存拆分</span></div>
              <ChartBox :option="dumpBookOption" />
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <span>📈 {{ dumpWord }}K线</span>
              <span class="badge">库存成本 {{ fmtPrice(data.dump.invCost) }} · 柱在零上=买入</span>
            </div>
            <ChartBox size="combo" :option="dumpFlowOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>⏱ {{ dumpWord }}分时</span>
              <span class="badge">做市卖出 / 买入 · 万枚</span>
            </div>
            <ChartBox size="xlarge" :option="dumpHourOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>📋 {{ dumpWord }}成交明细</span>
              <span class="badge">做市视角 · {{ fillPager.total }} 笔 · 点 UID 进用户</span>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>方向</th>
                    <th>数量(万)</th>
                    <th>价格</th>
                    <th>金额(万USDT)</th>
                    <th>对手 UID</th>
                    <th>标签</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in fillPager.pagedRows"
                    :key="`${row.time}-${row.uid}-${index}`"
                    class="row-link"
                    @click="$router.push(userDetailPath(row.uid))"
                  >
                    <td>{{ row.time }}</td>
                    <td><span class="tag" :class="row.sideClass">{{ row.side }}</span></td>
                    <td :style="{ color: row.side === '卖出' ? '#ff5a7a' : '#6a9aff' }">{{ fmtQty(row.qty) }}</td>
                    <td>{{ fmtPrice(row.price) }}</td>
                    <td>{{ fmtQty(row.usdt) }}</td>
                    <td>{{ row.uid }}</td>
                    <td><span class="tag" :class="row.tagClass">{{ row.tag }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <TablePager
              v-model:page="fillPager.page"
              v-model:page-size="fillPager.pageSize"
              :page-count="fillPager.pageCount"
              :total="fillPager.total"
              :range-text="fillPager.rangeText"
            />
          </div>
      </template>
    </PageState>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'
import { appState } from '@/stores/app'
import { userDetailPath } from '@/utils/uid'
import { usePageData } from '@/composables/usePageData'
import { usePager } from '@/composables/usePager'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import TablePager from '@/components/TablePager.vue'
import { mmFlowChartOption } from '@/utils/mmFlowChart'
import { actionDot, namedHex } from '@/utils/palette'

const route = useRoute()
const dayDate = computed(() => (typeof route.query.date === 'string' ? route.query.date : ''))
const { loading, error, data, bindPair, load } = usePageData(() =>
  api.getOpsDesk(appState.currentPair, appState.config.sleepIdleDays, appState.config.internalAccounts || [], dayDate.value)
)
bindPair()
watch(dayDate, () => load())

const fillPager = usePager(computed(() => data.value?.dump?.fills || []))

const dumpIsToday = computed(() => data.value?.dump?.isToday !== false)
const dumpWord = computed(() => (dumpIsToday.value ? '今日' : '当日'))
const pairBase = computed(() => String(appState.currentPair || '').split('/')[0] || 'TOKEN')
const pairQuote = computed(() => String(appState.currentPair || '').split('/')[1] || 'USDT')

const dumpTradeAvg = computed(() => {
  const dump = data.value?.dump
  const delta = Number(dump?.tokenDelta)
  if (!Number.isFinite(delta) || delta === 0) {
    return { label: '交易均价', text: '--', color: '' }
  }
  if (delta > 0) {
    return { label: '买入均价', text: String(fmtPrice(dump.avgBuy)), color: '#6a9aff' }
  }
  return { label: '卖出均价', text: String(fmtPrice(dump.avgSell)), color: '#ff5a7a' }
})

const header = computed(() => {
  if (!dumpIsToday.value) {
    return {
      title: `📤 做市账户${data.value?.dump?.dateTitle || '当日'}`,
      badge: `${data.value?.dump?.dateLabel || ''} 交易 + 资产`
    }
  }
  return { title: '📤 做市账户今日', badge: '交易 + 资产' }
})

const dumpHourOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['卖出', '买入'], textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: {
    data: data.value?.dump?.hours || [],
    axisLabel: { color: '#4a6080', fontSize: 8 }
  },
  yAxis: {
    splitLine: { lineStyle: { color: '#111927' } },
    axisLabel: { color: '#4a6080', fontSize: 8 }
  },
  series: [
    { name: '卖出', type: 'bar', data: data.value?.dump?.sellHour || [], itemStyle: { color: '#ff5a7a' }, barWidth: '28%' },
    { name: '买入', type: 'bar', data: data.value?.dump?.buyHour || [], itemStyle: { color: '#6a9aff' }, barWidth: '28%' }
  ]
}))

const dumpFlowOption = computed(() => mmFlowChartOption({
  labels: data.value?.dump?.hours || [],
  lastHour: data.value?.dump?.lastHour || [],
  costHour: data.value?.dump?.costHour || [],
  netHour: data.value?.dump?.netHour || [],
  interval: 2
}))

const dumpInvOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: {
    data: data.value?.mmToday?.history?.hours || data.value?.dump?.hours || [],
    axisLabel: { color: '#4a6080', fontSize: 8, interval: 3 }
  },
  yAxis: {
    splitLine: { lineStyle: { color: '#111927' } },
    axisLabel: { color: '#4a6080', fontSize: 8 },
    name: '万枚',
    nameTextStyle: { color: '#4a6080', fontSize: 9 }
  },
  series: [{
    name: '做市库存',
    type: 'line',
    data: data.value?.mmToday?.history?.invHour || [],
    smooth: true,
    lineStyle: { color: '#a78bfa', width: 2 },
    areaStyle: { color: 'rgba(167,139,250,0.16)' },
    symbol: 'none'
  }]
}))

const dumpBookOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { textStyle: { color: '#4a6080', fontSize: 10 }, top: 0, data: ['自有代币', '借入虚增'] },
  series: [{
    type: 'pie',
    radius: ['42%', '68%'],
    data: (data.value?.mmToday?.book || []).map((item) => ({
      value: item.value,
      name: item.name,
      itemStyle: { color: namedHex(item.name) }
    })),
    label: { color: '#b0c8e8', fontSize: 10, formatter: '{b}\n{c} 万' }
  }]
}))

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

function signed(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n > 0 ? `+${n}` : String(n)
}

function fmtPrice(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  if (n >= 1000) return n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
  if (n >= 1) return n.toLocaleString('zh-CN', { maximumFractionDigits: 4 })
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 6 })
}
</script>

<style scoped>
.blurb {
  margin: 4px 0 10px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-muted, #9ab0cc);
}
.inline-link {
  margin-left: 8px;
  color: #6a9aff;
  text-decoration: none;
  font-size: 12px;
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
.mini-sub {
  margin-top: 2px;
  font-size: 11px;
  color: var(--text-muted);
}
.kpi-grid.mm-kpis {
  grid-template-columns: repeat(5, minmax(0, 1fr));
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
.value.range {
  font-size: 18px;
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
.gloss-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 4px 2px 8px;
}
.gloss-grid.four {
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: stretch;
}
.gloss-item {
  display: flex;
  flex-direction: column;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-elevated);
}
.gloss-name {
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-title, #e8f0ff);
}
.gloss-item p {
  margin: 0 0 10px;
  min-height: 56px;
  font-size: 12px;
  line-height: 1.55;
  color: var(--text-muted, #9ab0cc);
}
.gloss-mini {
  width: 100%;
  margin-top: auto;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.gloss-mini th,
.gloss-mini td {
  height: 26px;
  padding: 0 8px 0 0;
  border-bottom: 1px solid var(--border);
  font-size: 11px;
  line-height: 26px;
  text-transform: none;
  letter-spacing: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
.gloss-mini th:first-child,
.gloss-mini td:first-child {
  width: 52px;
  padding-left: 0;
}
.gloss-mini th {
  color: var(--text-muted, #9ab0cc);
  font-weight: 500;
}
.gloss-mini td {
  color: #b0c8e8;
}
.gloss-mini th:nth-child(n + 2),
.gloss-mini td:nth-child(n + 2) {
  text-align: right;
}
.gloss-mini tr:last-child td {
  border-bottom: 0;
}
.gloss-grid.three {
  grid-template-columns: 1fr 1fr 1fr;
}
@media (max-width: 720px) {
  .gloss-grid,
  .gloss-grid.three,
  .gloss-grid.four,
  .trade-legs,
  .trade-meta {
    grid-template-columns: 1fr;
  }
}
.empty-hint {
  padding: 18px 8px;
  font-size: 12px;
  color: #7a90b0;
  line-height: 1.5;
}
</style>
