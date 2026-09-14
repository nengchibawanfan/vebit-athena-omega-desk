import { PERSONA_PAGES } from '@/config/constants'

export const HEX = {
  buy: '#6a9aff',
  sell: '#ffb347',
  profit: '#4cd9a0',
  loss: '#ff5a7a',
  sleep: '#ffb347',
  active: '#4cd9a0',
  mm: '#6a9aff',
  purple: '#a78bfa',
  watch: '#4a8aff'
}

const SERIES = [HEX.buy, HEX.profit, HEX.sell, HEX.purple, HEX.loss, HEX.watch]

const TOKEN_HEX = {
  VBT: HEX.buy,
  BXT: HEX.profit
}

export function signedHex(value, invert = false) {
  const positive = Number(value) >= 0
  const good = invert ? !positive : positive
  return good ? HEX.profit : HEX.loss
}

export function signedDot(value, invert = false) {
  const positive = Number(value) >= 0
  const good = invert ? !positive : positive
  return good ? 'green' : 'yellow'
}

export function actionDot(action) {
  const text = String(action || '')
  if (text === '可卖出' || text === '可买入') return 'green'
  if (text === '先别拉' || text === '对手接不住' || text === '余额不够' || text === '自己USDT不够') return 'red'
  return 'yellow'
}

export function alertLevelHex(level) {
  if (level === '紧急') return HEX.loss
  if (level === '预警') return HEX.sell
  return HEX.watch
}

export function alertLevelDot(level) {
  if (level === '紧急') return 'red'
  if (level === '预警') return 'yellow'
  return 'green'
}

export function personaHex(keyOrName) {
  const text = String(keyOrName || '').trim()
  const hit = PERSONA_PAGES.find((item) => item.key === text || item.label === text || item.label.startsWith(text))
  return hit?.color || HEX.buy
}

export function tokenHex(symbol, index = 0) {
  const key = String(symbol || '').split('/')[0]
  return TOKEN_HEX[key] || SERIES[index % SERIES.length]
}

export function namedHex(name, index = 0) {
  const text = String(name || '')
  if (/聪明钱|散户|羊毛|KOL|程序化/.test(text)) return personaHex(text.replace(/交易$/, ''))
  if (text.includes('亏损 ≥50') || text.includes('亏损≥50')) return HEX.loss
  if (text.includes('亏损 20')) return '#ff7a94'
  if (text.includes('亏损')) return HEX.sell
  if (text.includes('盈利 ≥50') || text.includes('盈利≥50')) return HEX.purple
  if (text.includes('盈利 20')) return HEX.profit
  if (text.includes('盈利') || text.includes('小赚') || text.includes('浮盈')) return HEX.profit
  if (text.includes('深套')) return HEX.loss
  if (text.includes('浅套') || text.includes('被套')) return HEX.sell
  if (text.includes('大赚')) return HEX.purple
  if (text.includes('成本')) return HEX.buy
  if (text === '紧急') return HEX.loss
  if (text === '预警') return HEX.sell
  if (text === '关注') return HEX.watch
  if (text.includes('链上活跃')) return HEX.buy
  if (text.includes('链上沉睡')) return HEX.purple
  if (text.includes('所内活跃') || text === '活跃' || text.includes('可充回')) return HEX.active
  if (text.includes('所内沉睡') || text.includes('沉睡')) return HEX.sleep
  if (text.includes('做市')) return HEX.mm
  if (text.includes('仓库')) return HEX.purple
  if (text.includes('自有')) return HEX.profit
  if (text.includes('借入')) return HEX.sell
  if (text.includes('真实余额') || text === '现金') return HEX.buy
  if (text.includes('代币市值')) return HEX.sell
  if (text.includes('<1万')) return HEX.buy
  if (text.includes('1–10') || text.includes('1-10')) return HEX.profit
  if (text.includes('10–50') || text.includes('10-50')) return HEX.sell
  if (text.includes('≥50') || text.includes('>=50')) return HEX.purple
  if (/止损|卖出/.test(text) && !text.includes('买入')) return HEX.sell
  if (/买入|追涨/.test(text)) return HEX.buy
  if (/买/.test(text)) return HEX.buy
  if (/卖/.test(text)) return HEX.sell
  return SERIES[index % SERIES.length]
}

export function personaKpiHex(kpi, personaKey) {
  const label = String(kpi?.label || '')
  if (/人数|账号/.test(label)) return personaHex(personaKey)
  if (/净买|净卖|浮盈|盈亏/.test(label)) return signedHex(kpi?.value)
  if (label.includes('胜率')) return Number(kpi?.value) >= 50 ? HEX.profit : HEX.loss
  if (/浮亏|强平/.test(label)) return HEX.loss
  if (/仓位|持仓/.test(label)) return HEX.sell
  return undefined
}

export function statusDot(item) {
  const text = String(item?.text || '')
  if (/紧急|红色|离线|已停止|先别|不够|接不住|未配置/.test(text)) return 'red'
  if (/偏低|偏高|预警|监控|沉睡|自成交开|未认证|关注|对手/.test(text)) return 'yellow'
  return 'green'
}
