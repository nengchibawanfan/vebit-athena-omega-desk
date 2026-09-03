<template>
  <div ref="el" class="chart-box" :class="sizeClass"></div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { appState } from '@/stores/app'
import { getChartChrome } from '@/utils/theme'

const props = defineProps({
  option: { type: Object, default: () => ({}) },
  size: { type: String, default: '' }
})

const emit = defineEmits(['chartClick'])

const el = ref(null)
let chart = null
let resizeObserver = null

const sizeClass = computed(() => {
  if (props.size === 'tall') return 'tall'
  if (props.size === 'xlarge') return 'xlarge'
  if (props.size === 'combo') return 'combo'
  if (props.size === 'short') return 'short'
  return ''
})

const CHROME_HEX = new Set(['#111927', '#4a6080', '#b0c8e8', '#e8f0ff', '#5a7a9a'])

function patchAxis(axis, chrome) {
  if (!axis) return axis
  const list = Array.isArray(axis) ? axis : [axis]
  const patched = list.map((item) => {
    const next = { ...item }
    if (item.axisLabel) next.axisLabel = { ...item.axisLabel, color: chrome.axis }
    if (item.nameTextStyle) next.nameTextStyle = { ...item.nameTextStyle, color: chrome.axis }
    if (item.splitLine?.lineStyle) {
      next.splitLine = {
        ...item.splitLine,
        lineStyle: { ...item.splitLine.lineStyle, color: chrome.split }
      }
    }
    return next
  })
  return Array.isArray(axis) ? patched : patched[0]
}

function withChrome(option) {
  const chrome = getChartChrome()
  const next = { ...option, backgroundColor: 'transparent' }
  next.xAxis = patchAxis(option.xAxis, chrome)
  next.yAxis = patchAxis(option.yAxis, chrome)
  if (option.legend) {
    const legends = Array.isArray(option.legend) ? option.legend : [option.legend]
    const patched = legends.map((item) => ({
      ...item,
      textStyle: { ...item.textStyle, color: chrome.legend }
    }))
    next.legend = Array.isArray(option.legend) ? patched : patched[0]
  }
  if (option.tooltip) {
    next.tooltip = {
      ...option.tooltip,
      backgroundColor: chrome.tooltipBg,
      borderColor: chrome.border,
      textStyle: { ...(option.tooltip.textStyle || {}), color: chrome.text }
    }
  }
  if (option.series) {
    next.series = option.series.map((series) => {
      const item = { ...series }
      if (series.label && CHROME_HEX.has(series.label.color)) {
        item.label = { ...series.label, color: chrome.text }
      }
      if (series.lineStyle && CHROME_HEX.has(series.lineStyle.color)) {
        item.lineStyle = {
          ...series.lineStyle,
          color: series.lineStyle.color === '#e8f0ff' ? chrome.title : chrome.axis
        }
      }
      if (series.markLine?.lineStyle && CHROME_HEX.has(series.markLine.lineStyle.color)) {
        item.markLine = {
          ...series.markLine,
          lineStyle: { ...series.markLine.lineStyle, color: chrome.axis }
        }
      }
      return item
    })
  }
  return next
}

function applyOption() {
  if (!chart || !props.option) return
  chart.setOption(withChrome(props.option), true)
}

function bindChart() {
  if (!chart) return
  chart.on('click', (params) => {
    if (params?.componentType !== 'series' || params.dataIndex == null) return
    emit('chartClick', {
      dataIndex: params.dataIndex,
      name: params.name,
      seriesName: params.seriesName,
      value: params.value
    })
  })
}

function initChart() {
  if (!el.value) return
  chart?.dispose()
  chart = echarts.init(el.value, appState.theme === 'light' ? undefined : 'dark')
  bindChart()
  applyOption()
}

onMounted(() => {
  initChart()
  resizeObserver = new ResizeObserver(() => {
    if (chart && !chart.isDisposed()) chart.resize()
  })
  resizeObserver.observe(el.value)
})

watch(() => props.option, applyOption, { deep: true })
watch(() => appState.theme, () => initChart())

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chart?.dispose()
  chart = null
})
</script>
