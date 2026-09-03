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

export function mmFlowChartOption({ labels = [], lastHour = [], costHour = [], netHour = [], interval = 3 } = {}) {
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
      data: ['现价', '库存成本', '做市净买入'],
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
        name: '现价',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: lastHour,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#e8f0ff', width: 2 }
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
