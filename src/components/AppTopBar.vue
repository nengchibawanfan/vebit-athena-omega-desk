<template>
  <div class="top-bar">
    <div class="page-title" v-html="title"></div>
    <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
      <div class="pair-selector">
        <label>交易对</label>
        <select :value="appState.currentPair" @change="onPairChange">
          <option v-for="pair in appState.pairs" :key="pair" :value="pair">{{ pair }}</option>
        </select>
      </div>
      <div class="clock">{{ clock }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { PAGE_TITLES, deskDateTitle, isDeskToday } from '@/config/constants'
import { appState, setPair } from '@/stores/app'

const route = useRoute()
const clock = ref('--:--:--')
let timer = null

const title = computed(() => {
  if (route.meta.page === 'ops-dump' && !isDeskToday(route.query.date)) {
    return `做市账户${deskDateTitle(route.query.date)} <small>交易 + 资产 · 点回今日看最新</small>`
  }
  if (route.meta.page === 'desk-users' && !isDeskToday(route.query.date)) {
    return `真实用户${deskDateTitle(route.query.date)} <small>交易 + 资产 · 点回今日看最新</small>`
  }
  if (route.meta.page === 'whales-exchange' && !isDeskToday(route.query.date)) {
    return `${deskDateTitle(route.query.date)}充提 <small>所内可卖供给 · 不含做市 / 金库等</small>`
  }
  return PAGE_TITLES[route.meta.page] || 'ATHENA'
})

function tick() {
  clock.value = new Date().toLocaleTimeString('zh-CN', { hour12: false })
}

function onPairChange(event) {
  setPair(event.target.value)
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>
