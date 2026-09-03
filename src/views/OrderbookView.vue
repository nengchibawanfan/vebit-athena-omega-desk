<template>
  <PageState :loading="loading" :error="error">
    <div v-if="data" class="page">
      <CollapsibleConfig class="config-bar" title="⚙️ 盘口配置" storage-key="orderbook">
        <div class="group">
          <label>📊 盘口深度档位</label>
          <select :value="appState.config.depthLevels" @change="onDepthChange">
            <option :value="10">10档</option>
            <option :value="15">15档</option>
            <option :value="20">20档</option>
          </select>
          <span class="hint">调整后立即生效</span>
        </div>
      </CollapsibleConfig>

      <div class="card">
        <div class="card-header">
          <span>⚡ 用户挂单</span>
          <span class="badge">已剔除做市</span>
        </div>
        <p class="ob-blurb">
          买盘 = 砸价会打到的用户买单，你是在卖出。卖盘 = 拉价会吃到的用户卖单，等于高位买货。
          <router-link class="inline-link" to="/orderbook/blocks">大单</router-link>
        </p>
      </div>

      <div class="grid-3">
        <div class="card clickable" @click="$router.push('/detail-orders')">
          <div class="card-header">
            <span>📊 加权深度矩阵</span>
            <span class="badge">买/卖前{{ appState.config.depthLevels }}</span>
          </div>
          <ChartBox :option="depthOption" />
        </div>
        <div class="card clickable" @click="$router.push('/detail-orders')">
          <div class="card-header"><span>📈 逐笔足迹</span><span class="badge">Taker净买</span></div>
          <ChartBox :option="footprintOption" />
        </div>
        <div class="card clickable" @click="$router.push('/ops/stance')">
          <div class="card-header"><span>⚖️ OBI指数</span><span class="badge">剔除机器人</span></div>
          <ChartBox :option="obiOption" />
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span>📋 挂单明细 (前20档)</span><span class="badge">点击行查看完整列表</span></div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>价格</th><th>类型</th><th>数量(万)</th><th>账户标签</th><th>挂单时间</th><th>撤单次数</th></tr>
            </thead>
            <tbody>
              <tr v-for="row in data.rows" :key="row.price + row.account" class="clickable" @click="$router.push('/detail-orders')">
                <td>{{ row.price }}</td>
                <td><span class="tag" :class="row.tag">{{ row.side }}</span></td>
                <td>{{ row.amount }}</td>
                <td>{{ row.account }}</td>
                <td>{{ row.time }}</td>
                <td>{{ row.cancels }}</td>
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
import { appState, updateConfig } from '@/stores/app'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import CollapsibleConfig from '@/components/CollapsibleConfig.vue'

const { loading, error, data, bindPair } = usePageData(() =>
  api.getOrderbook(appState.currentPair, appState.config.depthLevels)
)
bindPair()

function onDepthChange(event) {
  updateConfig({ depthLevels: Number(event.target.value) })
}

const axisLabel = { color: '#4a6080', fontSize: 9 }
const yAxis = { splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } }

const depthOption = computed(() => ({
  grid: { left: '6%', right: '4%', top: '10%', bottom: '12%' },
  xAxis: { data: ['0.96', '0.98', '1.00', '1.02', '1.04'], axisLabel },
  yAxis,
  series: [
    { name: '买单', type: 'bar', data: data.value?.bid || [], itemStyle: { color: '#4cd9a0' }, barWidth: '30%' },
    { name: '卖单', type: 'bar', data: data.value?.ask || [], itemStyle: { color: '#ff5a7a' }, barWidth: '30%' }
  ],
  legend: { data: ['买单', '卖单'], textStyle: { color: '#4a6080', fontSize: 9 }, bottom: 0 }
}))

const footprintOption = computed(() => ({
  grid: { left: '6%', right: '4%', top: '10%', bottom: '12%' },
  xAxis: { data: ['09:30', '09:40', '09:50', '10:00', '10:10'], axisLabel: { color: '#4a6080', fontSize: 8 } },
  yAxis,
  series: [
    { name: '主动买', type: 'bar', stack: 'a', data: data.value?.footprintBuy || [], itemStyle: { color: '#4cd9a0' }, barWidth: '50%' },
    { name: '主动卖', type: 'bar', stack: 'a', data: data.value?.footprintSell || [], itemStyle: { color: '#ff5a7a' }, barWidth: '50%' },
    { name: '对倒', type: 'bar', stack: 'a', data: data.value?.footprintWash || [], itemStyle: { color: '#4a6a9a' }, barWidth: '50%' }
  ],
  legend: { data: ['主动买', '主动卖', '对倒'], textStyle: { color: '#4a6080', fontSize: 9 }, bottom: 0 }
}))

const obiOption = computed(() => ({
  grid: { left: '6%', right: '4%', top: '10%', bottom: '12%' },
  xAxis: { data: ['09:30', '09:50', '10:10', '10:30', '10:50'], axisLabel: { color: '#4a6080', fontSize: 8 } },
  yAxis: { min: -0.5, max: 0.6, splitLine: { lineStyle: { color: '#111927' } }, axisLabel: { color: '#4a6080', fontSize: 8 } },
  series: [{
    type: 'line',
    data: data.value?.obiData || [],
    smooth: true,
    lineStyle: { color: '#4a8aff', width: 2 },
    areaStyle: { color: 'rgba(74,138,255,0.15)' },
    markLine: {
      silent: true,
      data: [{ yAxis: 0.4 }, { yAxis: -0.4 }],
      lineStyle: { color: '#ffb347', type: 'dashed' }
    }
  }]
}))
</script>

<style scoped>
.ob-blurb {
  margin: 4px 0 10px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-muted, #9ab0cc);
}
.inline-link {
  color: #6a9aff;
  text-decoration: none;
  margin-left: 6px;
}
.inline-link:hover {
  text-decoration: underline;
}
</style>
