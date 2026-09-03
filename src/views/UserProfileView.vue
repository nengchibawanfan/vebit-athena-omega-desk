<template>
  <PageState :loading="loading" :error="error">
    <div v-if="data" class="page">
      <div class="card">
        <div class="card-header">
          <span>👤 对手盘</span>
          <span class="badge">散户是猎物 · 聪明钱是对家</span>
        </div>
        <p class="blurb">散户追涨接你的卖出，砍仓给你买入。聪明钱会跟你对做。羊毛 / KOL / 程序化用来过滤噪声，不进拉砸决策。</p>
      </div>
      <div class="kpi-grid total-only">
        <div class="kpi-item" style="cursor:default;">
          <div class="label">总用户数</div>
          <div class="value">{{ data.total.toLocaleString() }}</div>
          <div class="sub">今日活跃 {{ data.activeToday }} · 点下方卡片进对应画像</div>
        </div>
      </div>

      <div class="persona-card-grid">
        <div
          v-for="tag in data.tags"
          :key="tag.name"
          class="card clickable persona-card"
          :style="{ borderColor: tag.color }"
          @click="$router.push(tag.to)"
        >
          <div class="card-header">
            <span>🏷️ {{ tag.name }}</span>
            <span class="badge">进入</span>
          </div>
          <div class="persona-value" :style="{ color: tag.color }">
            {{ tag.value }}<span class="unit">人</span>
          </div>
          <div class="sub">占比 {{ tag.ratio }}</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <span>📊 用户标签分布</span>
            <span class="badge">点击扇区进入</span>
          </div>
          <ChartBox size="tall" :option="pieOption" @chart-click="onChartClick" />
        </div>
        <div class="card">
          <div class="card-header">
            <span>📈 标签覆盖趋势</span>
            <span class="badge">点击曲线进入</span>
          </div>
          <ChartBox size="tall" :option="trendOption" @chart-click="onChartClick" />
        </div>
      </div>

      <div class="card detail-table-card">
        <div class="card-header">
          <span>👤 用户标签列表</span>
          <span class="badge">共{{ data.total.toLocaleString() }}位用户 · 点击进该 UID 分析</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>用户ID</th><th>注册时间</th><th>交易笔数</th><th>胜率</th><th>盈亏比</th><th>标签</th></tr>
            </thead>
            <tbody>
              <tr v-for="row in data.users" :key="row.id" class="row-link" @click="$router.push(userDetailPath(row.id))">
                <td>{{ row.id }}</td>
                <td>{{ row.registered }}</td>
                <td>{{ row.trades }}</td>
                <td>{{ row.winRate }}</td>
                <td>{{ row.profitRatio }}</td>
                <td>
                  <span v-for="tag in row.tags" :key="tag.label" class="tag" :class="tag.className">{{ tag.label }}</span>
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
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'
import { userDetailPath } from '@/utils/uid'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'

const router = useRouter()
const { loading, error, data, load } = usePageData(() => api.getUserProfile())

onMounted(load)

function pathForName(name) {
  const label = name === '程序化' ? '程序化交易' : name
  return (data.value?.tags || []).find((item) => item.name === label)?.to
}

function onChartClick(event) {
  const to = pathForName(event.name) || pathForName(event.seriesName)
  if (to) router.push(to)
}

const pieOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    data: (data.value?.tags || []).map((tag) => ({
      value: tag.value,
      name: tag.name,
      itemStyle: { color: tag.color }
    })),
    label: { color: '#b0c8e8', fontSize: 10, formatter: '{b}\n{d}%' },
    labelLine: { lineStyle: { color: '#2a3a5a' } }
  }]
}))

const trendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '6%', right: '4%', top: '10%', bottom: '12%' },
  xAxis: { data: data.value?.trend?.dates || [], axisLabel: { color: '#4a6080', fontSize: 8 } },
  yAxis: { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } },
  series: [
    { name: '聪明钱', type: 'line', data: data.value?.trend?.smart || [], smooth: true, lineStyle: { color: '#4cd9a0' }, symbol: 'circle' },
    { name: '散户', type: 'line', data: data.value?.trend?.retail || [], smooth: true, lineStyle: { color: '#ffb347' }, symbol: 'circle' },
    { name: '羊毛党', type: 'line', data: data.value?.trend?.wool || [], smooth: true, lineStyle: { color: '#ff5a7a' }, symbol: 'circle' },
    { name: '吃客损KOL', type: 'line', data: data.value?.trend?.kol || [], smooth: true, lineStyle: { color: '#a78bfa' }, symbol: 'circle' },
    { name: '程序化', type: 'line', data: data.value?.trend?.prog || [], smooth: true, lineStyle: { color: '#4a8aff' }, symbol: 'circle' }
  ],
  legend: { data: ['聪明钱', '散户', '羊毛党', '吃客损KOL', '程序化'], textStyle: { color: '#4a6080', fontSize: 9 }, bottom: 0 }
}))
</script>

<style scoped>
.blurb {
  margin: 4px 0 10px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-muted, #9ab0cc);
}
.kpi-grid.total-only {
  grid-template-columns: 1fr;
}
.persona-card-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 14px;
}
.persona-card {
  text-align: center;
  padding-bottom: 14px;
}
.persona-value {
  font-size: 22px;
  font-weight: 700;
  margin-top: 4px;
}
.persona-value .unit {
  font-size: 12px;
  color: var(--text-soft);
  font-weight: 400;
  margin-left: 2px;
}
.persona-card .sub {
  font-size: 11px;
  color: var(--text-soft);
  margin-top: 2px;
}
.row-link {
  cursor: pointer;
}
.row-link:hover td {
  color: #f0f6ff;
}
@media (max-width: 1024px) {
  .persona-card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 600px) {
  .persona-card-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
