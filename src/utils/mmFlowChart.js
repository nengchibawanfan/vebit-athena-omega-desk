function signed(value) {
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

function ohlcOf(raw) {
  const list = Array.isArray(raw) ? raw : []
  if (list.length >= 5) return list.slice(1, 5)
  return list
}

export function candlesFromCloses(closes = []) {
  return closes.map((closeRaw, i) => {
    const close = Number(closeRaw) || 0
    const prev = i > 0 ? Number(closes[i - 1]) || close : close
    const open = i === 0 ? close * 0.998 : prev
    const body = Math.abs(close - open)
    const wick = Math.max(body * 0.55, Math.abs(close) * 0.0024)
    const wobble = ((i * 3) % 5) * 0.12
    const high = Math.max(open, close) + wick * (0.55 + wobble)
    const low = Math.min(open, close) - wick * (0.45 + (1 - wobble) * 0.35)
    return [open, close, low, high]
  })
}

export function mmFlowChartOption({
  labels = [],
  lastHour = [],
  costHour = [],
  netHour = [],
  kline = null,
  interval = 3
} = {}) {
  const candles = Array.isArray(kline) && kline.length ? kline : candlesFromCloses(lastHour)
  const axisLabel = { color: '#4a6080', fontSize: 8 }
  const yAxisBase = {
    splitLine: { lineStyle: { color: '#111927' } },
    axisLabel,
    nameTextStyle: { color: '#4a6080', fontSize: 9 }
  }

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: (params) => {
        const name = params?.[0]?.axisValue ?? ''
        const lines = (params || []).map((item) => {
          if (item.seriesType === 'candlestick') {
            const [open, close, low, high] = ohlcOf(item.data)
            return `${item.marker}K线 开 ${fmtPrice(open)} / 收 ${fmtPrice(close)} / 低 ${fmtPrice(low)} / 高 ${fmtPrice(high)}`
          }
          if (item.seriesName === '做市净买入') {
            return `${item.marker}${item.seriesName} ${signed(item.value)}万`
          }
          return `${item.marker}${item.seriesName} ${fmtPrice(item.value)}`
        })
        return `${name}<br/>${lines.join('<br/>')}`
      }
    },
    axisPointer: { link: [{ xAxisIndex: [0, 1] }] },
    legend: {
      data: ['K线', '库存成本', '做市净买入'],
      textStyle: { color: '#4a6080', fontSize: 10 },
      top: 0
    },
    grid: [
      { left: '8%', right: '4%', top: '14%', height: '40%' },
      { left: '8%', right: '4%', top: '62%', height: '26%' }
    ],
    xAxis: [
      {
        type: 'category',
        data: labels,
        gridIndex: 0,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#1a2740' } }
      },
      {
        type: 'category',
        data: labels,
        gridIndex: 1,
        axisLabel: { ...axisLabel, interval },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#1a2740' } }
      }
    ],
    yAxis: [
      {
        ...yAxisBase,
        gridIndex: 0,
        name: '价格',
        scale: true
      },
      {
        ...yAxisBase,
        gridIndex: 1,
        name: '万',
        splitLine: { lineStyle: { color: '#111927' } }
      }
    ],
    series: [
      {
        name: 'K线',
        type: 'candlestick',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: candles,
        barMaxWidth: 14,
        itemStyle: {
          color: '#ff5a7a',
          color0: '#4cd9a0',
          borderColor: '#ff5a7a',
          borderColor0: '#4cd9a0'
        }
      },
      {
        name: '库存成本',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: costHour,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#ffb347', width: 2 }
      },
      {
        name: '做市净买入',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: netHour,
        barWidth: '42%',
        itemStyle: {
          color: (params) => (Number(params.value) >= 0 ? '#6a9aff' : '#ff5a7a')
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: '#4a6080', type: 'dashed', width: 1 },
          data: [{ yAxis: 0 }]
        }
      }
    ]
  }
}
