<template>
  <PageState :loading="loading" :error="error">
    <div v-if="data" class="page">
      <div class="card">
        <div class="card-header">
          <span>📡 做市运行状态</span>
          <div class="header-tools">
            <router-link class="inline-link" to="/robots/config">配置</router-link>
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
        <div class="kpi-item">
          <div class="label">运行机器人</div>
          <div class="kpi-metrics">
            <div class="value" :style="{ color: allOnline ? '#4cd9a0' : '#ffb347' }">
              {{ data.kpis.onlineCount }}<span class="unit">/{{ data.kpis.robotCount }}</span>
            </div>
            <div class="qty">在线 / 已配置 UID</div>
          </div>
          <div class="sub">来自机器人配置的 UID</div>
        </div>
        <div class="kpi-item">
          <div class="label">做市库存</div>
          <div class="kpi-metrics">
            <div class="value" :style="{ color: bandColor }">{{ fmtQty(data.kpis.borrowedAmount) }}<span class="unit">万</span></div>
            <div class="qty">自有 {{ fmtQty(data.kpis.tokenOwn) }} · 借入虚增 {{ fmtQty(data.kpis.tokenBorrowed) }}</div>
          </div>
          <div class="sub">做市账户代币 · {{ data.kpis.bandStatus }}</div>
        </div>
        <div class="kpi-item">
          <div class="label">今日盈亏</div>
          <div class="kpi-metrics">
            <div class="value" :style="{ color: data.kpis.dayPnlU >= 0 ? '#4cd9a0' : '#ff5a7a' }">
              {{ data.kpis.dayPnlU >= 0 ? '+' : '' }}{{ fmtQty(data.kpis.dayPnlU) }}<span class="unit">万USDT</span>
            </div>
            <div class="qty">交易盈亏 {{ signedQty(data.kpis.realizedU) }} · 浮盈 {{ signedQty(data.kpis.floatU) }}<span class="unit">万USDT</span></div>
          </div>
          <div class="sub">配对成交价差 + 今日净头寸盯市 · 不含期初库存</div>
        </div>
        <div class="kpi-item">
          <div class="label">今日成交额</div>
          <div class="kpi-metrics">
            <div class="value">{{ fmtQty(data.kpis.turnover) }}<span class="unit">万</span></div>
            <div class="qty">{{ fmtQty(data.kpis.turnoverU) }}<span class="unit">万USDT</span></div>
          </div>
          <div class="sub">买+卖成交量</div>
        </div>
        <div class="kpi-item">
          <div class="label">买卖成交比</div>
          <div class="kpi-metrics">
            <div class="value" :style="{ color: data.kpis.bsRatio >= 1 ? '#4cd9a0' : '#ffb347' }">{{ data.kpis.bsRatio }}</div>
            <div class="qty">买 / 卖</div>
          </div>
          <div class="sub">{{ data.kpis.bsRatio >= 1 ? '买更多 · 你在买入' : '卖更多 · 你在卖出' }}</div>
        </div>
        <div class="kpi-item">
          <div class="label">报价质量</div>
          <div class="kpi-metrics">
            <div class="value" style="color:#6a9aff;">{{ data.kpis.avgSpread }}<span class="unit">bps</span></div>
            <div class="qty">覆盖 {{ data.kpis.cover }}<span class="unit">%</span></div>
          </div>
          <div class="sub">均价差 · 盘口覆盖率</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span>📊 近24小时做市库存</span>
          <span class="badge">安全带 {{ appState.config.inventoryLow }}% – {{ appState.config.inventoryHigh }}%</span>
        </div>
        <ChartBox size="xlarge" :option="inventoryOption" />
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><span>💹 买/卖成交与累计盈亏</span><span class="badge">万枚</span></div>
          <ChartBox :option="flowOption" />
        </div>
        <div class="card">
          <div class="card-header"><span>📏 报价价差</span><span class="badge">bps</span></div>
          <ChartBox :option="spreadOption" />
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span>🤖 机器人账户</span>
          <span class="badge">{{ data.robots.length }} 个做市 UID</span>
        </div>
        <div v-if="!data.robots.length" class="empty-hint">
          还没有配置做市账户 UID，请到
          <router-link class="inline-link" to="/robots/config">机器人配置</router-link>
          添加。
        </div>
        <div v-else class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>UID</th>
                <th>备注</th>
                <th>角色</th>
                <th>策略</th>
                <th>状态</th>
                <th>自成交</th>
                <th>自有(万)</th>
                <th>借入虚增(万)</th>
                <th>占比</th>
                <th>今日PnL(万USDT)</th>
                <th>买成交</th>
                <th>卖成交</th>
                <th>价差bps</th>
                <th>撤单率</th>
                <th>心跳</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in data.robots" :key="row.uid">
                <td>{{ row.uid }}</td>
                <td>{{ row.remark }}</td>
                <td>{{ row.role }}</td>
                <td>{{ row.strategyLabel || '—' }}</td>
                <td><span class="tag" :class="row.statusTag">{{ row.status }}</span></td>
                <td>{{ row.washOn ? '开' : '关' }}</td>
                <td>{{ fmtQty(row.tokenOwn) }}</td>
                <td>{{ fmtQty(row.tokenBorrowed) }}</td>
                <td>{{ row.ratio }}%</td>
                <td :style="{ color: row.dayPnl >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                  {{ row.dayPnl >= 0 ? '+' : '' }}{{ row.dayPnl }}
                </td>
                <td>{{ row.buyFill }}</td>
                <td>{{ row.sellFill }}</td>
                <td>{{ row.spread }}</td>
                <td>{{ row.cancelRate }}%</td>
                <td>{{ row.heartbeat }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span>📝 近期做市动作</span><span class="badge">今日</span></div>
        <div class="alert-list">
          <table>
            <thead>
              <tr><th>时间</th><th>UID</th><th>类型</th><th>详情</th></tr>
            </thead>
            <tbody>
              <tr v-for="row in data.events" :key="row.time + row.type">
                <td>{{ row.time }}</td>
                <td>{{ row.uid }}</td>
                <td><span class="tag" :class="row.tag">{{ row.type }}</span></td>
                <td>{{ row.detail }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </PageState>
</template>

<script setup>
import { computed } from 'vue'
import { api } from '@/api'
import { appState } from '@/stores/app'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'

const { loading, error, data, bindPair } = usePageData(() =>
  api.getRobotStatus(appState.currentPair, appState.config.internalAccounts || [], appState.config.robot)
)
bindPair()

const allOnline = computed(() => {
  const k = data.value?.kpis
  return k && k.robotCount > 0 && k.onlineCount === k.robotCount
})

const bandColor = computed(() => {
  const status = data.value?.kpis?.bandStatus
  if (status === '库存偏低') return '#ffb347'
  if (status === '库存偏高') return '#ff5a7a'
  return '#4cd9a0'
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

const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }

const inventoryOption = computed(() => {
  const history = data.value?.history
  const low = appState.config.inventoryLow ?? 40
  const high = appState.config.inventoryHigh ?? 60
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: '6%', right: '4%', top: '12%', bottom: '14%' },
    xAxis: {
      data: history?.hours || [],
      axisLabel: { color: '#4a6080', fontSize: 8 }
    },
    yAxis: {
      ...yAxis,
      min: 20,
      max: 80,
      name: '%',
      nameTextStyle: { color: '#4a6080', fontSize: 9 }
    },
    series: [{
      name: '做市库存',
      type: 'line',
      data: history?.inventory || [],
      smooth: true,
      lineStyle: { color: '#ffb347', width: 2 },
      symbol: 'circle',
      symbolSize: 4,
      areaStyle: { color: 'rgba(255,179,71,0.12)' },
      markArea: {
        silent: true,
        itemStyle: { color: 'rgba(76,217,160,0.10)' },
        data: [[{ yAxis: low }, { yAxis: high }]]
      },
      markLine: {
        silent: true,
        symbol: 'none',
        lineStyle: { color: '#4cd9a0', type: 'dashed' },
        data: [{ yAxis: low }, { yAxis: high }]
      }
    }]
  }
})

const flowOption = computed(() => {
  const history = data.value?.history
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['买成交', '卖成交', '累计盈亏'], textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 },
    grid: { left: '8%', right: '8%', top: '18%', bottom: '14%' },
    xAxis: {
      data: history?.hours || [],
      axisLabel: { color: '#4a6080', fontSize: 8, interval: 3 }
    },
    yAxis: [
      { ...yAxis, name: '万枚', nameTextStyle: { color: '#4a6080', fontSize: 9 } },
      { splitLine: { show: false }, axisLabel: { color: '#4a6080', fontSize: 8 }, name: '盈亏', nameTextStyle: { color: '#4a6080', fontSize: 9 } }
    ],
    series: [
      {
        name: '买成交',
        type: 'bar',
        stack: 'vol',
        data: history?.buyVol || [],
        itemStyle: { color: 'rgba(76,217,160,0.75)' },
        barWidth: '45%'
      },
      {
        name: '卖成交',
        type: 'bar',
        stack: 'vol',
        data: history?.sellVol || [],
        itemStyle: { color: 'rgba(255,90,122,0.72)' }
      },
      {
        name: '累计盈亏',
        type: 'line',
        yAxisIndex: 1,
        data: history?.pnl || [],
        smooth: true,
        lineStyle: { color: '#6a9aff', width: 2 },
        symbol: 'circle',
        symbolSize: 4
      }
    ]
  }
})

const spreadOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '8%', right: '6%', top: '12%', bottom: '14%' },
  xAxis: {
    data: data.value?.history?.hours || [],
    axisLabel: { color: '#4a6080', fontSize: 8, interval: 3 }
  },
  yAxis: {
    ...yAxis,
    name: 'bps',
    nameTextStyle: { color: '#4a6080', fontSize: 9 }
  },
  series: [{
    name: '价差',
    type: 'line',
    data: data.value?.history?.spread || [],
    smooth: true,
    lineStyle: { color: '#6a9aff', width: 2 },
    areaStyle: { color: 'rgba(106,154,255,0.12)' },
    symbol: 'circle',
    symbolSize: 4
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
.inline-link {
  color: #6a9aff;
  text-decoration: none;
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
.empty-hint {
  padding: 18px 8px;
  font-size: 12px;
  color: #7a90b0;
  line-height: 1.5;
}
</style>
