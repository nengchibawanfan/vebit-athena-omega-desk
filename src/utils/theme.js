const STORAGE_KEY = 'uiTheme'

export function readTheme() {
  return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
}

export function applyTheme(theme) {
  const next = theme === 'light' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', next)
  localStorage.setItem(STORAGE_KEY, next)
  return next
}

export function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function getChartChrome() {
  return {
    axis: cssVar('--chart-axis') || '#4a6080',
    split: cssVar('--chart-split') || '#111927',
    legend: cssVar('--chart-legend') || '#4a6080',
    text: cssVar('--text-body') || '#b0c8e8',
    title: cssVar('--text-title') || '#e8f0ff',
    tooltipBg: cssVar('--tooltip-bg') || '#111927',
    border: cssVar('--border') || '#1a2848'
  }
}
