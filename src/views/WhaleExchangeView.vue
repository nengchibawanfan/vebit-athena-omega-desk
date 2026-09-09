<template>
  <div class="page">
    <CollapsibleConfig class="config-bar" title="⚙️ 充提阈值" storage-key="whales-exchange">
      <template #extra>UID 充值 / 提现 · 已排除做市与金库等</template>
      <div class="group">
        <label>🐋 警报阈值</label>
        <input type="number" :value="appState.config.whaleThreshold" min="1" step="1" @change="onWhaleChange" />
        <span class="hint">万枚 · 做市 / 金库等内部 UID 不计入</span>
      </div>
    </CollapsibleConfig>

    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="card">
          <div class="card-header">
            <span>🚚 {{ pageTitle }}</span>
            <div class="header-tools">
              <router-link v-if="!isToday" class="inline-link" to="/whales/exchange">看今日</router-link>
              <router-link class="inline-link" to="/whales/exchange/history">历史充提</router-link>
              <span class="badge">{{ isToday ? '所内可卖供给' : `${data.dateLabel} · 所内可卖供给` }}</span>
            </div>
          </div>
          <StatusStrip :items="data.status" />
          <p class="blurb">
            充值进所 = 可卖供给增加；提现出金 = 货离开唯一市场。
          </p>
        </div>

        <div class="kpi-grid">
          <div class="kpi-item">
            <div class="label">{{ dayWord }}充值</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ff5a7a;">{{ fmtQty(data.kpis.depositAmt) }}<span class="unit">万</span></div>
              <div class="qty">{{ fmtQty(data.kpis.depositU) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">{{ signedQty(data.kpis.depositVsPrev) }}万 vs 前一日 · {{ data.kpis.depositCount }} 笔</div>
          </div>
          <div class="kpi-item">
            <div class="label">{{ dayWord }}提现</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#4cd9a0;">{{ fmtQty(data.kpis.withdrawAmt) }}<span class="unit">万</span></div>
              <div class="qty">{{ fmtQty(data.kpis.withdrawU) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">{{ signedQty(data.kpis.withdrawVsPrev) }}万 vs 前一日 · {{ data.kpis.withdrawCount }} 笔</div>
          </div>
          <div class="kpi-item">
            <div class="label">净充提</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: data.kpis.transferNet >= 0 ? '#ff5a7a' : '#4cd9a0' }">
                {{ signedQty(data.kpis.transferNet) }}<span class="unit">万</span>
              </div>
              <div class="qty">{{ signedQty(data.kpis.transferNetU) }}<span class="unit">万USDT</span></div>
            </div>
            <div class="sub">{{ data.kpis.transferNet >= 0 ? '交易所侧筹码增厚' : '交易所侧筹码流出' }}</div>
          </div>
          <div class="kpi-item">
            <div class="label">充值 UID</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#ff5a7a;">{{ data.kpis.depositUsers }}<span class="unit">人</span></div>
            </div>
            <div class="sub">前 3 户占充值 {{ data.kpis.topDepositShare }}%</div>
          </div>
          <div class="kpi-item">
            <div class="label">提现 UID</div>
            <div class="kpi-metrics">
              <div class="value" style="color:#4cd9a0;">{{ data.kpis.withdrawUsers }}<span class="unit">人</span></div>
            </div>
            <div class="sub">{{ data.kpis.withdrawCount }} 笔离场</div>
          </div>
          <div class="kpi-item" @click="$router.push('/alerts')">
            <div class="label">待处理</div>
            <div class="kpi-metrics">
              <div class="value" :style="{ color: data.kpis.alertCount ? '#ff5a7a' : '#4cd9a0' }">
                {{ data.kpis.pending }}<span class="unit">条</span>
              </div>
            </div>
            <div class="sub">红色 {{ data.kpis.alertCount }} · 单笔最大 UID {{ data.kpis.largestUid }}</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>📥 24h 充值 / 提现</span>
            <span class="badge">万枚 · 按小时</span>
          </div>
          <ChartBox :option="flowOption" size="combo" />
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header"><span>📉 净充提</span><span class="badge">充 − 提</span></div>
            <ChartBox :option="netOption" />
          </div>
          <div
            class="card largest-card"
            :class="{ clickable: hasLargest }"
            @click="openLargest"
          >
            <div class="card-header">
              <span>🏆 单笔最大</span>
              <span v-if="hasLargest" class="tag" :class="data.kpis.largestAction === '充值' ? 'alert' : 'success'">
                {{ data.kpis.largestAction }}
              </span>
            </div>
            <div v-if="hasLargest" class="largest-box">
              <div class="largest-top">
                <div>
                  <div class="largest-kicker">UID {{ data.kpis.largestUid }}</div>
                  <div class="largest-amt" :class="data.kpis.largestAction === '充值' ? 'amt-deposit' : 'amt-withdraw'">
                    {{ fmtQty(data.kpis.largestAmt) }}<span class="unit">万</span>
                  </div>
                  <div class="qty">{{ fmtQty(data.kpis.largestU) }}<span class="unit">万USDT</span></div>
                </div>
                <span v-if="data.kpis.largestTag" class="tag" :class="data.kpis.largestTagClass">{{ data.kpis.largestTag }}</span>
              </div>
              <div class="largest-rows">
                <div><span>时间</span><strong>{{ data.kpis.largestTime }}</strong></div>
                <div><span>网络</span><strong>{{ data.kpis.largestChain }}</strong></div>
                <div>
                  <span>状态</span>
                  <span class="tag" :class="data.kpis.largestStatusTag">{{ data.kpis.largestStatus }}</span>
                </div>
              </div>
            </div>
            <div v-else class="largest-empty">当日无超阈值充提</div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card detail-table-card">
            <div class="card-header"><span>📥 充值 TOP</span><span class="badge">按金额</span></div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>UID</th>
                    <th>标签</th>
                    <th>金额(万)</th>
                    <th>笔数</th>
                    <th>最近</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in data.topDeposits" :key="'d' + row.uid" class="row-link" @click="$router.push(userDetailPath(row.uid))">
                    <td>{{ row.uid }}</td>
                    <td><span class="tag" :class="row.tagClass">{{ row.tag }}</span></td>
                    <td class="amt-deposit">{{ fmtQty(row.amount) }}</td>
                    <td>{{ row.count }}</td>
                    <td>{{ row.lastTime }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="card detail-table-card">
            <div class="card-header"><span>📤 提现 TOP</span><span class="badge">按金额</span></div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>UID</th>
                    <th>标签</th>
                    <th>金额(万)</th>
                    <th>笔数</th>
                    <th>最近</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in data.topWithdraws" :key="'w' + row.uid" class="row-link" @click="$router.push(userDetailPath(row.uid))">
                    <td>{{ row.uid }}</td>
                    <td><span class="tag" :class="row.tagClass">{{ row.tag }}</span></td>
                    <td class="amt-withdraw">{{ fmtQty(row.amount) }}</td>
                    <td>{{ row.count }}</td>
                    <td>{{ row.lastTime }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card detail-table-card">
          <div class="card-header">
            <span>📋 充提明细</span>
            <span class="badge">{{ transferPager.total }} 笔 · 点 UID</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>时间</th>
                  <th>UID</th>
                  <th>标签</th>
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
                <tr v-for="row in transferPager.pagedRows" :key="row.uid + row.time + row.action" class="row-link" @click="$router.push(userDetailPath(row.uid))">
                  <td>{{ row.time }}</td>
                  <td>{{ row.uid }}</td>
                  <td><span class="tag" :class="row.tagClass">{{ row.tag }}</span></td>
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
          <TablePager
            v-model:page="transferPager.page"
            v-model:page-size="transferPager.pageSize"
            :page-count="transferPager.pageCount"
            :total="transferPager.total"
            :range-text="transferPager.rangeText"
          />
        </div>
      </template>
    </PageState>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api'
import { appState, updateConfig } from '@/stores/app'
import { userDetailPath } from '@/utils/uid'
import { usePageData } from '@/composables/usePageData'
import { usePager } from '@/composables/usePager'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import CollapsibleConfig from '@/components/CollapsibleConfig.vue'
import StatusStrip from '@/components/StatusStrip.vue'
import CopyAddr from '@/components/CopyAddr.vue'
import TablePager from '@/components/TablePager.vue'

const route = useRoute()
const router = useRouter()
const dayDate = computed(() => (typeof route.query.date === 'string' ? route.query.date : ''))
const { loading, error, data, bindPair, load } = usePageData(() =>
  api.getTransferToday(
    appState.currentPair,
    appState.config.whaleThreshold,
    appState.config.internalAccounts,
    dayDate.value
  )
)
bindPair()
watch(dayDate, () => load())

const transferPager = usePager(computed(() => data.value?.rows || []))

const isToday = computed(() => data.value?.isToday !== false)
const dayWord = computed(() => (isToday.value ? '今日' : '当日'))
const pageTitle = computed(() => (
  isToday.value ? '今日充提' : `${data.value?.dateTitle || '当日'}充提`
))
const hasLargest = computed(() => {
  const uid = data.value?.kpis?.largestUid
  return Boolean(uid && uid !== '—')
})

function openLargest() {
  if (!hasLargest.value) return
  router.push(userDetailPath(data.value.kpis.largestUid))
}

function onWhaleChange(event) {
  updateConfig({ whaleThreshold: Number(event.target.value) })
  load()
}

function fmtQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
}

function signedQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  const text = fmtQty(Math.abs(n))
  if (n > 0) return `+${text}`
  if (n < 0) return `-${text}`
  return text
}

const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }
const legend = { textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 }
const xAxis = computed(() => ({
  data: data.value?.hours?.labels || [],
  axisLabel: { color: '#4a6080', fontSize: 8, interval: 3 }
}))

const flowOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { ...legend, data: ['充值', '提现'] },
  grid: { left: '6%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [
    { name: '充值', type: 'bar', data: data.value?.hours?.deposit || [], itemStyle: { color: '#ff5a7a' }, barWidth: '28%' },
    { name: '提现', type: 'bar', data: data.value?.hours?.withdraw || [], itemStyle: { color: '#4cd9a0' }, barWidth: '28%' }
  ]
}))

const netOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '4%', top: '12%', bottom: '12%' },
  xAxis: xAxis.value,
  yAxis,
  series: [{
    name: '净充提',
    type: 'line',
    data: data.value?.hours?.net || [],
    smooth: true,
    lineStyle: { color: '#ffb347', width: 2 },
    areaStyle: { color: 'rgba(255,179,71,0.12)' },
    symbol: 'none'
  }]
}))
</script>

<style scoped>
.header-tools {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.blurb {
  margin-top: 10px;
  font-size: 11px;
  color: var(--text-soft);
  line-height: 1.5;
}
.inline-link {
  color: #6a9aff;
  text-decoration: none;
  margin-left: 6px;
}
.inline-link:hover {
  text-decoration: underline;
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
.amt-deposit {
  color: #ff5a7a;
}
.amt-withdraw {
  color: #4cd9a0;
}
.row-link {
  cursor: pointer;
}
.row-link:hover td {
  color: var(--text-title);
}
.largest-card.clickable {
  cursor: pointer;
}
.largest-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 148px;
  padding: 12px 14px 14px;
  gap: 14px;
}
.largest-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}
.largest-kicker {
  font-size: 11px;
  color: var(--text-soft);
  font-variant-numeric: tabular-nums;
}
.largest-amt {
  font-size: 22px;
  font-weight: 700;
  margin-top: 4px;
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}
.largest-amt .unit {
  font-size: 12px;
  font-weight: 400;
  margin-left: 4px;
  color: var(--text-soft);
}
.largest-rows {
  display: grid;
  gap: 0;
}
.largest-rows > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  border-top: 1px solid var(--border-row);
  padding: 8px 0 0;
  margin-top: 8px;
}
.largest-rows > div:first-child {
  margin-top: 0;
}
.largest-rows span:first-child {
  color: var(--text-muted);
}
.largest-rows strong {
  font-weight: 600;
  color: var(--text-title);
  font-variant-numeric: tabular-nums;
}
.largest-empty {
  min-height: 148px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-soft);
  font-size: 12px;
}
</style>
