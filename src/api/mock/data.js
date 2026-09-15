import { DEFAULT_CONFIG, DESK_AS_OF, INTERNAL_ACCOUNT_TYPES, PAIRS, PERSONA_PAGES, deskDateLabel, deskDateTitle, isDeskToday, normalizeDeskDate } from '@/config/constants'
import { botWashOn, cloneRobot, orderSideCount, strategyLabel, strategyPackOf, syncRobotBots } from '@/utils/robotConfig'

export const PAIR_DATA = {
  'VBT/USDT': {
    price: 65000,
    depth: [120, 200, 80, 40],
    cost: [80, 320, 480, 160],
    volume: 23,
    alerts: 12,
    obi: '+0.32',
    obiSub: '买盘偏厚',
    priceDev: '+18.5',
    priceDevSub: '平均成本 0.86USDT',
    activeOrder: '3.2',
    activeOrderSub: '惜售严重',
    robotInv: '42',
    robotInvSub: '安全区间',
    external: '28',
    externalSub: '仓库筹码可控',
    floatSupply: '1,502',
    floatSupplySub: '占总流通 50.1%',
    circSupply: '3,000',
    whaleAlert: '1条新警报',
    alertSummary: '3条待处理',
    alertItems: [
      { time: '10:42:18', level: '紧急', color: '#ff5a7a', text: '做市账户 USDT 告急，买入资金不够', to: '/ops/dump' },
      { time: '10:38:02', level: '预警', color: '#ffb347', text: '近端卖墙变厚，再拉是高位买货', to: '/ops/ladder' },
      { time: '10:21:55', level: '关注', color: '#4a8aff', text: '大额充值进所 230万，供给增加', to: '/whales/exchange' }
    ],
    costBadge: '密集峰 1.00',
    pnlBadge: '盈利率 58%',
    netflowBadge: '1h +23万',
    bombBadge: '剩余 28%',
    whaleBadge: '1条未处理',
    orderBadge: '共42笔挂单',
    holderBadge: '共128位用户',
    dashWhale: [5, 12, 8, 20, 10],
    obDepthBid: [80, 180, 320, 200, 90],
    obDepthAsk: [50, 90, 140, 280, 400],
    footprintBuy: [12, 25, 30, 40, 28],
    footprintSell: [8, 12, 18, 14, 20],
    footprintWash: [5, 10, 15, 18, 22],
    obiData: [0.12, 0.35, 0.42, 0.18, 0.32],
    netflowIn: [12, 25, 18, 30, 22],
    netflowOut: [8, 10, 15, 12, 18],
    sentiment: [2.1, 1.8, 3.5, -0.5, 0.8],
    riskAlerts: [2, 1, 3, 4, 6, 5, 8],
    riskTypes: [
      { value: 4, name: '交易频率' },
      { value: 3, name: '挂撤单异常' },
      { value: 2, name: '交易量占比' },
      { value: 2, name: '价格操纵' },
      { value: 1, name: '小额撤单' }
    ],
    abnormalAccounts: [
      { id: 'ACC1024', rule: '交易频率超标', val: '25笔/分钟', threshold: '20笔/分钟', time: '10:23:15', status: '未处理' },
      { id: 'ACC2048', rule: '挂撤单异常', val: '18次/分钟', threshold: '15次/分钟', time: '10:20:08', status: '未处理' },
      { id: 'ACC3072', rule: '交易量占比超标', val: '15%', threshold: '10%', time: '10:15:32', status: '监控中' },
      { id: 'ACC4096', rule: '价格操纵', val: '8% / 5min', threshold: '5% / 5min', time: '10:10:44', status: '未处理' },
      { id: 'ACC5120', rule: '小额撤单测试', val: '12次/分钟', threshold: '10次/分钟', time: '10:05:11', status: '监控中' }
    ],
    alertList: [
      { time: '10:23:15', acc: 'ACC1024', type: '交易频率', detail: '交易频率 25笔/分钟 (阈值20)', status: '未处理' },
      { time: '10:20:08', acc: 'ACC2048', type: '挂撤单异常', detail: '挂撤单 18次/分钟 (阈值15)', status: '未处理' },
      { time: '10:15:32', acc: 'ACC3072', type: '交易量占比', detail: '1h交易量占比 15% (阈值10%)', status: '监控中' },
      { time: '10:10:44', acc: 'ACC4096', type: '价格操纵', detail: '5分钟内拉盘 8% (阈值5%)', status: '未处理' },
      { time: '10:05:11', acc: 'ACC5120', type: '小额撤单', detail: '小额挂撤 12次/分钟 (阈值10)', status: '监控中' },
      { time: '09:58:03', acc: '—', type: '大额挂单', detail: '卖一远端 1.05USDT 挂单 80万枚', status: '已预警' },
      { time: '09:50:21', acc: 'ACC6144', type: '交易频率', detail: '交易频率 22笔/分钟 (阈值20)', status: '已处理' }
    ],
    monitorStatus: [
      { color: 'green', text: '量化程序运行正常' },
      { color: 'green', text: '盘口活跃度正常' },
      { color: 'yellow', text: '远端大单挂单预警 (1.05USDT 挂单 80万枚)' }
    ]
  },
  'BXT/USDT': {
    price: 3200,
    depth: [90, 180, 60, 30],
    cost: [60, 240, 360, 120],
    volume: 18,
    alerts: 8,
    obi: '+0.28',
    obiSub: '买盘偏厚',
    priceDev: '+12.3',
    priceDevSub: '平均成本 2850USDT',
    activeOrder: '4.5',
    activeOrderSub: '活跃度正常',
    robotInv: '38',
    robotInvSub: '安全区间',
    external: '32',
    externalSub: '仓库筹码可控',
    floatSupply: '1,280',
    floatSupplySub: '占总流通 42.7%',
    circSupply: '3,000',
    whaleAlert: '2条新警报',
    alertSummary: '4条待处理',
    alertItems: [
      { time: '10:36:11', level: '紧急', color: '#ff5a7a', text: '做市账户 USDT 告急，买入资金不够', to: '/ops/dump' },
      { time: '10:31:44', level: '预警', color: '#ffb347', text: '近端卖墙变厚，再拉是高位买货', to: '/ops/ladder' },
      { time: '10:18:20', level: '关注', color: '#4a8aff', text: '大额充值进所 180万，供给增加', to: '/whales/exchange' },
      { time: '10:12:08', level: '关注', color: '#a78bfa', text: '链上仓库转入 96万 · 可能充回', to: '/circ/onchain' }
    ],
    costBadge: '密集峰 3000',
    pnlBadge: '盈利率 52%',
    netflowBadge: '1h +18万',
    bombBadge: '剩余 32%',
    whaleBadge: '2条未处理',
    orderBadge: '共38笔挂单',
    holderBadge: '共96位用户',
    dashWhale: [3, 8, 6, 15, 7],
    obDepthBid: [60, 140, 280, 160, 70],
    obDepthAsk: [40, 70, 120, 220, 320],
    footprintBuy: [10, 20, 25, 35, 22],
    footprintSell: [6, 10, 15, 12, 16],
    footprintWash: [4, 8, 12, 14, 18],
    obiData: [0.10, 0.28, 0.38, 0.15, 0.28],
    netflowIn: [10, 20, 15, 25, 18],
    netflowOut: [6, 8, 12, 10, 14],
    sentiment: [1.8, 1.5, 2.8, -0.3, 0.6],
    riskAlerts: [1, 2, 2, 3, 4, 3, 5],
    riskTypes: [
      { value: 3, name: '交易频率' },
      { value: 2, name: '挂撤单异常' },
      { value: 1, name: '交易量占比' },
      { value: 1, name: '价格操纵' },
      { value: 1, name: '小额撤单' }
    ],
    abnormalAccounts: [
      { id: 'ACC2048', rule: '交易频率超标', val: '22笔/分钟', threshold: '20笔/分钟', time: '10:20:08', status: '未处理' },
      { id: 'ACC3072', rule: '挂撤单异常', val: '16次/分钟', threshold: '15次/分钟', time: '10:15:32', status: '监控中' },
      { id: 'ACC4096', rule: '价格操纵', val: '6% / 5min', threshold: '5% / 5min', time: '10:10:44', status: '未处理' }
    ],
    alertList: [
      { time: '10:20:08', acc: 'ACC2048', type: '交易频率', detail: '交易频率 22笔/分钟 (阈值20)', status: '未处理' },
      { time: '10:15:32', acc: 'ACC3072', type: '挂撤单异常', detail: '挂撤单 16次/分钟 (阈值15)', status: '监控中' },
      { time: '10:10:44', acc: 'ACC4096', type: '价格操纵', detail: '5分钟内拉盘 6% (阈值5%)', status: '未处理' },
      { time: '09:58:03', acc: '—', type: '大额挂单', detail: '卖一远端 3200USDT 挂单 60万枚', status: '已预警' }
    ],
    monitorStatus: [
      { color: 'green', text: '量化程序运行正常' },
      { color: 'green', text: '盘口活跃度正常' },
      { color: 'yellow', text: '远端大单挂单预警 (3200USDT 挂单 60万枚)' }
    ]
  }
}

export const ORDERBOOK_ROWS = [
  { price: '1.02', side: '卖', tag: 'robot', amount: 12, account: '机器人 #A3', time: '09:32:15', cancels: 1 },
  { price: '1.01', side: '买', tag: 'user', amount: 8.5, account: '用户 4***7', time: '09:40:02', cancels: 0 },
  { price: '1.03', side: '卖', tag: 'robot', amount: 20, account: '量化 #Q9', time: '09:28:44', cancels: 12 },
  { price: '0.99', side: '买', tag: 'user', amount: 35, account: '用户 1***0', time: '09:10:11', cancels: 0 },
  { price: '1.05', side: '卖', tag: 'robot', amount: 18, account: '机器人 #B7', time: '09:45:33', cancels: 2 }
]

export const DETAIL_ORDERS = [
  { price: '1.12', side: '卖', tag: 'robot', amount: 8.2, account: '机器人 #C2', time: '10:12:03', cancels: 0, filled: 1.5 },
  { price: '1.10', side: '卖', tag: 'robot', amount: 15.0, account: '机器人 #A3', time: '10:05:22', cancels: 1, filled: 6.0 },
  { price: '1.08', side: '卖', tag: 'user', amount: 4.3, account: '用户 5***9', time: '09:58:10', cancels: 0, filled: 0.0 },
  { price: '1.06', side: '卖', tag: 'robot', amount: 22.0, account: '量化 #Q9', time: '09:45:33', cancels: 5, filled: 18.0 },
  { price: '1.04', side: '卖', tag: 'user', amount: 6.7, account: '用户 8***2', time: '09:30:15', cancels: 2, filled: 1.2 },
  { price: '1.02', side: '卖', tag: 'robot', amount: 12.0, account: '机器人 #B7', time: '09:20:44', cancels: 0, filled: 8.0 },
  { price: '1.01', side: '买', tag: 'user', amount: 8.5, account: '用户 4***7', time: '09:40:02', cancels: 0, filled: 0.0 },
  { price: '0.99', side: '买', tag: 'user', amount: 35.0, account: '用户 1***0', time: '09:10:11', cancels: 0, filled: 20.0 },
  { price: '0.97', side: '买', tag: 'robot', amount: 18.0, account: '机器人 #D5', time: '08:55:30', cancels: 1, filled: 12.0 },
  { price: '0.95', side: '买', tag: 'user', amount: 6.2, account: '用户 2***3', time: '08:40:18', cancels: 0, filled: 6.2 },
  { price: '0.93', side: '买', tag: 'robot', amount: 10.0, account: '机器人 #E1', time: '08:25:55', cancels: 0, filled: 10.0 },
  { price: '0.91', side: '买', tag: 'user', amount: 4.1, account: '用户 9***6', time: '08:10:07', cancels: 0, filled: 0.0 }
]

export const HOLDER_ROWS = [
  { id: '3***2', amount: 280, cost: 0.82, pnl: '+56.2k', pnlColor: '#4cd9a0', lastActive: '今日 08:20' },
  { id: '7***1', amount: 150, cost: 1.05, pnl: '-4.5k', pnlColor: '#ff5a7a', lastActive: '昨日 22:10' },
  { id: '2***8', amount: 120, cost: 0.95, pnl: '+8.4k', pnlColor: '#4cd9a0', lastActive: '今日 07:45' },
  { id: '9***4', amount: 88, cost: 1.01, pnl: '+0.2k', pnlColor: '#ffb347', lastActive: '昨日 14:30' }
]

export const DETAIL_HOLDERS = [
  { id: '3***2', amount: 280, cost: 0.82, pnl: '+56.2k', pnlColor: '#4cd9a0', ratio: '+24%', lastActive: '今日 08:20', days: 12 },
  { id: '7***1', amount: 150, cost: 1.05, pnl: '-4.5k', pnlColor: '#ff5a7a', ratio: '-3%', lastActive: '昨日 22:10', days: 8 },
  { id: '2***8', amount: 120, cost: 0.95, pnl: '+8.4k', pnlColor: '#4cd9a0', ratio: '+7%', lastActive: '今日 07:45', days: 5 },
  { id: '9***4', amount: 88, cost: 1.05, pnl: '+0.2k', pnlColor: '#ffb347', ratio: '+0.2%', lastActive: '昨日 14:30', days: 3 },
  { id: '4***5', amount: 76, cost: 0.88, pnl: '+10.6k', pnlColor: '#4cd9a0', ratio: '+16%', lastActive: '今日 09:10', days: 9 },
  { id: '1***0', amount: 65, cost: 0.99, pnl: '+2.0k', pnlColor: '#4cd9a0', ratio: '+3%', lastActive: '今日 08:55', days: 2 },
  { id: '6***7', amount: 52, cost: 1.10, pnl: '-4.2k', pnlColor: '#ff5a7a', ratio: '-7%', lastActive: '昨日 20:15', days: 6 },
  { id: '8***3', amount: 48, cost: 0.92, pnl: '+4.8k', pnlColor: '#4cd9a0', ratio: '+11%', lastActive: '今日 06:30', days: 4 }
]

export const MACRO_WHALES = [
  { time: '10:23', address: '0x7f3...a2', amount: 230, status: '红色', statusTag: 'alert' },
  { time: '09:50', address: '0x1a9...b4', amount: 45, status: '监控中', statusTag: 'user' },
  { time: '08:15', address: '0x4c2...d7', amount: 18, status: '已处理', statusTag: 'user' }
]

export const DETAIL_WHALES = [
  { time: '10:23', address: '0x7f3...a2', action: '充值', amount: 230, status: '红色', statusTag: 'alert', note: '历史持仓500万' },
  { time: '09:50', address: '0x1a9...b4', action: '充值', amount: 45, status: '监控中', statusTag: 'user', note: '新地址' },
  { time: '08:15', address: '0x4c2...d7', action: '提现', amount: 18, status: '已处理', statusTag: 'user', note: '锁仓操作' },
  { time: '07:40', address: '0x9e1...f3', action: '充值', amount: 120, status: '红色', statusTag: 'alert', note: '大额流入' },
  { time: '06:10', address: '0x2b8...c5', action: '充值', amount: 32, status: '监控中', statusTag: 'user', note: '关联交易所' },
  { time: '04:55', address: '0x6d4...a9', action: '提现', amount: 10, status: '已处理', statusTag: 'user', note: '正常提现' },
  { time: '03:20', address: '0x8a1...e7', action: '充值', amount: 67, status: '监控中', statusTag: 'user', note: '疑似分拆' }
]

function pairSeedOf(pair) {
  return pair === 'VBT/USDT' ? 1 : 2
}

function clockNow(offsetSec = 0) {
  const d = new Date(Date.now() - offsetSec * 1000)
  return d.toLocaleTimeString('zh-CN', { hour12: false })
}

function summarizeOrderBook(rows) {
  const priceMap = new Map()
  rows.forEach((row) => {
    const key = String(row.price)
    if (!priceMap.has(key)) priceMap.set(key, { buy: 0, sell: 0 })
    const slot = priceMap.get(key)
    if (row.side === '买') slot.buy += Number(row.amount) || 0
    else slot.sell += Number(row.amount) || 0
  })
  const labels = [...priceMap.keys()].sort((a, b) => Number(a) - Number(b))
  const cancelRank = [...rows]
    .filter((row) => Number(row.cancels) > 0)
    .sort((a, b) => b.cancels - a.cancels)
    .slice(0, 5)
  return {
    badge: `共${rows.length}笔挂单 · 实时`,
    rows,
    volumeByPrice: {
      labels,
      buy: labels.map((label) => Number(priceMap.get(label).buy.toFixed(1))),
      sell: labels.map((label) => Number(priceMap.get(label).sell.toFixed(1)))
    },
    cancelTop: {
      labels: cancelRank.map((row) => String(row.account).replace('机器人 ', '').replace('量化 ', '').replace('用户 ', '')),
      values: cancelRank.map((row) => row.cancels)
    },
    ts: Date.now()
  }
}

export function generateOrderBook(pair) {
  const pairSeed = pairSeedOf(pair)
  const rows = DETAIL_ORDERS.map((row, i) => {
    const amount = Number((row.amount * (0.92 + ((i + pairSeed) % 5) * 0.03)).toFixed(1))
    const filled = Number(Math.min(Number(row.filled) || 0, amount).toFixed(1))
    return {
      id: `ord-${pairSeed}-${i}`,
      ...row,
      amount,
      filled
    }
  })
  const extras = [
    { side: '卖', tag: 'robot', account: '机器人 #F4' },
    { side: '卖', tag: 'user', account: '用户 6***1' },
    { side: '买', tag: 'robot', account: '机器人 #G8' },
    { side: '买', tag: 'user', account: '用户 3***4' },
    { side: '卖', tag: 'robot', account: '量化 #H2' },
    { side: '买', tag: 'user', account: '用户 7***8' }
  ]
  extras.forEach((item, i) => {
    const price = item.side === '卖'
      ? (1.03 + i * 0.015 + pairSeed * 0.002).toFixed(2)
      : (0.98 - i * 0.012 - pairSeed * 0.002).toFixed(2)
    const amount = Number((5 + ((i * 7 + pairSeed * 3) % 16) + i * 1.4).toFixed(1))
    rows.push({
      id: `ord-${pairSeed}-x${i}`,
      price,
      side: item.side,
      tag: item.tag,
      amount,
      account: item.account,
      time: clockNow(80 + i * 17),
      cancels: item.tag === 'robot' ? (i + pairSeed) % 4 : 0,
      filled: Number(Math.min((((i * 3 + pairSeed) % 8) * 0.6), amount).toFixed(1))
    })
  })
  const clustered = [
    { price: '1.04', side: '卖', tag: 'user', account: '用户 2***6', amount: 58.0 },
    { price: '1.04', side: '卖', tag: 'user', account: '用户 5***1', amount: 12.4 },
    { price: '0.99', side: '买', tag: 'user', account: '用户 8***3', amount: 72.0 },
    { price: '0.99', side: '买', tag: 'user', account: '用户 1***5', amount: 9.6 }
  ]
  clustered.forEach((item, i) => {
    rows.push({
      id: `ord-${pairSeed}-c${i}`,
      price: item.price,
      side: item.side,
      tag: item.tag,
      amount: item.amount,
      account: item.account,
      time: clockNow(40 + i * 11),
      cancels: 0,
      filled: 0
    })
  })
  rows.sort((a, b) => Number(b.price) - Number(a.price))
  return summarizeOrderBook(rows)
}

export function tickOrderBook(book) {
  const rows = book.rows.map((row) => ({ ...row }))
  const hits = Math.max(2, Math.min(5, Math.floor(Math.random() * 4) + 2))
  for (let n = 0; n < hits; n++) {
    const row = rows[Math.floor(Math.random() * rows.length)]
    if (!row) continue
    const delta = Number((((Math.random() - 0.42) * 2.4)).toFixed(1))
    row.amount = Number(Math.max(0.3, row.amount + delta).toFixed(1))
    if (Math.random() > 0.45) {
      row.filled = Number(((Number(row.filled) || 0) + Math.abs(delta) * 0.35).toFixed(1))
    }
    row.filled = Number(Math.min(Number(row.filled) || 0, row.amount).toFixed(1))
    if (row.tag === 'robot' && Math.random() > 0.72) row.cancels += 1
    row.time = clockNow()
  }
  if (Math.random() > 0.82 && rows.length > 10) {
    const idx = rows.findIndex((row) => row.filled >= row.amount * 0.95 && row.tag === 'user')
    if (idx >= 0) rows.splice(idx, 1)
  }
  if (Math.random() > 0.78) {
    const sell = Math.random() > 0.5
    const id = `ord-${Date.now().toString(36)}-${Math.floor(Math.random() * 99)}`
    rows.push({
      id,
      price: (sell ? 1.02 + Math.random() * 0.12 : 0.90 + Math.random() * 0.1).toFixed(2),
      side: sell ? '卖' : '买',
      tag: Math.random() > 0.55 ? 'robot' : 'user',
      amount: Number((3 + Math.random() * 14).toFixed(1)),
      account: Math.random() > 0.55 ? `机器人 #${String.fromCharCode(65 + Math.floor(Math.random() * 12))}${Math.floor(Math.random() * 9)}` : `用户 ${Math.floor(Math.random() * 9)}***${Math.floor(Math.random() * 9)}`,
      time: clockNow(),
      cancels: 0,
      filled: 0
    })
  }
  rows.sort((a, b) => Number(b.price) - Number(a.price))
  const next = summarizeOrderBook(rows)
  book.badge = next.badge
  book.rows = next.rows
  book.volumeByPrice = next.volumeByPrice
  book.cancelTop = next.cancelTop
  book.ts = next.ts
  return book
}

function makeWhaleAddress(index, pairSeed) {
  const hex = '0123456789abcdef'
  let body = ''
  for (let k = 0; k < 40; k++) {
    body += hex[(index * 23 + k * 11 + pairSeed * 9 + k * k) % 16]
  }
  return `0x${body}`
}

function clockAt(index, stepMin = 4) {
  const total = 10 * 60 + 42 - index * stepMin
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60)
  const h = String(Math.floor(wrapped / 60)).padStart(2, '0')
  const m = String(wrapped % 60).padStart(2, '0')
  const s = String((18 + index * 7) % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

const ACTION_META = {
  充值: { className: 'deposit', note: ['拆单入金', '历史大户回归', '关联多个 UID'] },
  提现: { className: 'withdraw', note: ['提现至链上仓库', '转入冷钱包', '货离开唯一市场'] },
  大额买入: { className: 'buy', note: ['追涨接货', '吃卖一', '分批买入'] },
  大额卖出: { className: 'sell', note: ['砍仓砸出', '挂卖扫出', '疑似分拆卖出'] }
}

function sumByAction(rows, action) {
  return rows.filter((row) => row.action === action).reduce((sum, row) => sum + row.amount, 0)
}

const TRANSFER_TAGS = [
  { label: '大户', className: 'warning' },
  { label: '量化', className: 'robot' },
  { label: '机构', className: 'user' },
  { label: '回归', className: 'success' }
]

const TRANSFER_CHAINS = ['ERC-20', 'TRC-20', 'BSC']

function transferLastPrice(pair) {
  return pairPxMeta(getPairData(pair)).lastPrice || 1
}

function toTransferU(qtyWan, last) {
  return Number((Number(qtyWan || 0) * Number(last || 1)).toFixed(1))
}

function packLargestKpis(row) {
  if (!row) {
    return {
      largestAmt: 0,
      largestU: 0,
      largestUid: '—',
      largestAction: '—',
      largestTime: '—',
      largestTag: '',
      largestTagClass: '',
      largestChain: '—',
      largestStatus: '—',
      largestStatusTag: ''
    }
  }
  return {
    largestAmt: row.amount,
    largestU: row.amountU,
    largestUid: row.uid,
    largestAction: row.action,
    largestTime: row.time,
    largestTag: row.tag || '',
    largestTagClass: row.tagClass || '',
    largestChain: row.chain || '—',
    largestStatus: row.status || '—',
    largestStatusTag: row.statusTag || ''
  }
}

function topByAction(rows, action, limit = 6) {
  const map = new Map()
  ;(rows || []).filter((row) => row.action === action).forEach((row) => {
    const prev = map.get(row.uid) || {
      uid: row.uid,
      tag: row.tag,
      tagClass: row.tagClass,
      amount: 0,
      count: 0,
      lastTime: row.time
    }
    prev.amount = Number((prev.amount + row.amount).toFixed(1))
    prev.count += 1
    if (String(row.time) > String(prev.lastTime)) prev.lastTime = row.time
    map.set(row.uid, prev)
  })
  return [...map.values()].sort((a, b) => b.amount - a.amount).slice(0, limit)
}

function uniqueActionUids(rows, action) {
  return new Set((rows || []).filter((row) => row.action === action).map((row) => row.uid)).size
}

function buildTransferToday(pair, threshold = 50, internalAccounts = []) {
  const pairSeed = pairSeedOf(pair)
  const minAmt = Number(threshold) > 0 ? Number(threshold) : 50
  const last = transferLastPrice(pair)
  const internalUids = new Set((internalAccounts || []).map((row) => String(row.uid || '').trim()).filter(Boolean))
  const statuses = [
    { status: '红色', statusTag: 'alert' },
    { status: '监控中', statusTag: 'warning' },
    { status: '已处理', statusTag: 'success' }
  ]
  const rows = []
  for (let i = 0; i < 22; i++) {
    const amount = Number((minAmt * 0.45 + ((i * 19 + pairSeed * 11) % 210) + (i === 0 ? 90 : 0)).toFixed(1))
    if (amount < minAmt && i > 5) continue
    const uid = String(18000 + i * 137 + pairSeed * 21)
    if (internalUids.has(uid)) continue
    const action = i % 3 === 2 ? '提现' : '充值'
    const meta = ACTION_META[action]
    const tag = TRANSFER_TAGS[(i + pairSeed) % TRANSFER_TAGS.length]
    const st = amount >= minAmt * 1.7 ? statuses[0] : statuses[(i + pairSeed) % 3]
    const qty = Number(Math.max(amount, i < 6 ? minAmt : amount).toFixed(1))
    rows.push({
      time: clockAt(i, 4),
      uid,
      tag: tag.label,
      tagClass: tag.className,
      action,
      actionClass: meta.className,
      amount: qty,
      amountU: toTransferU(qty, last),
      chain: TRANSFER_CHAINS[(i + pairSeed) % TRANSFER_CHAINS.length],
      address: makeWhaleAddress(i + 40 + pairSeed * 5, pairSeed),
      status: st.status,
      statusTag: st.statusTag,
      note: meta.note[(i + pairSeed) % meta.note.length]
    })
  }
  rows.sort((a, b) => (a.time < b.time ? 1 : -1))

  const depositAmt = Number(sumByAction(rows, '充值').toFixed(1))
  const withdrawAmt = Number(sumByAction(rows, '提现').toFixed(1))
  const transferNet = Number((depositAmt - withdrawAmt).toFixed(1))
  const depositCount = rows.filter((row) => row.action === '充值').length
  const withdrawCount = rows.filter((row) => row.action === '提现').length
  const depositUsers = uniqueActionUids(rows, '充值')
  const withdrawUsers = uniqueActionUids(rows, '提现')
  const alertCount = rows.filter((row) => row.status === '红色').length
  const pending = rows.filter((row) => row.status !== '已处理').length
  const largest = [...rows].sort((a, b) => b.amount - a.amount)[0] || null
  const hours = hours24()
  const depositHour = scaleHourSeries(waveSeries(24, Math.max(4, depositAmt / 18), Math.max(2, depositAmt / 28), pairSeed + 2), depositAmt)
  const withdrawHour = scaleHourSeries(waveSeries(24, Math.max(3, withdrawAmt / 20), Math.max(1.5, withdrawAmt / 32), pairSeed + 7), withdrawAmt)
  const netHour = depositHour.map((value, i) => Number((value - withdrawHour[i]).toFixed(1)))
  const topDeposits = topByAction(rows, '充值')
  const topWithdraws = topByAction(rows, '提现')
  const topDepositShare = depositAmt
    ? Number((topDeposits.slice(0, 3).reduce((sum, row) => sum + row.amount, 0) / depositAmt * 100).toFixed(1))
    : 0

  return {
    pair,
    base: String(pair || '').split('/')[0] || 'TOKEN',
    lastPrice: last,
    kpis: {
      depositAmt,
      depositU: toTransferU(depositAmt, last),
      depositCount,
      depositUsers,
      withdrawAmt,
      withdrawU: toTransferU(withdrawAmt, last),
      withdrawCount,
      withdrawUsers,
      transferNet,
      transferNetU: toTransferU(transferNet, last),
      alertCount,
      pending,
      ...packLargestKpis(largest),
      topDepositShare,
      skippedInternal: internalUids.size,
      depositVsPrev: 0,
      withdrawVsPrev: 0,
      netVsPrev: 0
    },
    rows,
    topDeposits,
    topWithdraws,
    hours: {
      labels: hours,
      deposit: depositHour,
      withdraw: withdrawHour,
      net: netHour
    },
    status: [
      {
        color: transferNet >= 0 ? 'yellow' : 'green',
        text: transferNet >= 0
          ? `净充入 ${fmtQtyPlain(transferNet)}万 · 所内可卖供给增加`
          : `净提出 ${fmtQtyPlain(Math.abs(transferNet))}万 · 货离开唯一市场`
      },
      {
        color: alertCount ? 'red' : 'green',
        text: `阈值 ${minAmt}万 · 红色 ${alertCount} · 待处理 ${pending} · 已排除内部 UID ${internalUids.size}`
      },
      {
        color: 'yellow',
        text: largest
          ? `单笔最大 ${largest.action} ${fmtQtyPlain(largest.amount)}万 · UID ${largest.uid}`
          : '当日无超阈值充提'
      }
    ]
  }
}

function applyTransferDay(payload, pair, threshold, internalAccounts, dateKey) {
  const key = normalizeDeskDate(dateKey)
  payload.dateKey = key
  payload.dateLabel = deskDateLabel(key)
  payload.dateTitle = deskDateTitle(key)
  payload.isToday = isDeskToday(key)

  const hist = generateTransferHistory(pair, 30, threshold, internalAccounts)
  const daysAsc = [...(hist.rows || [])].reverse()
  const idx = daysAsc.findIndex((row) => row.dateKey === key)
  const day = idx >= 0 ? daysAsc[idx] : null
  const prev = idx > 0 ? daysAsc[idx - 1] : null

  if (!payload.isToday) {
    if (!day) {
      payload.dateKey = DESK_AS_OF
      payload.dateLabel = deskDateLabel(DESK_AS_OF)
      payload.dateTitle = deskDateTitle(DESK_AS_OF)
      payload.isToday = true
    } else {
      const last = payload.lastPrice || 1
      const depScale = payload.kpis.depositAmt ? day.depositAmt / payload.kpis.depositAmt : 1
      const wdScale = payload.kpis.withdrawAmt ? day.withdrawAmt / payload.kpis.withdrawAmt : 1
      payload.hours.deposit = scaleHourSeries(payload.hours.deposit, day.depositAmt)
      payload.hours.withdraw = scaleHourSeries(payload.hours.withdraw, day.withdrawAmt)
      payload.hours.net = payload.hours.deposit.map((value, i) => Number((value - payload.hours.withdraw[i]).toFixed(1)))
      payload.rows = (payload.rows || []).map((row) => {
        const scale = row.action === '充值' ? depScale : wdScale
        const amount = Number((row.amount * scale).toFixed(1))
        return { ...row, amount, amountU: toTransferU(amount, last) }
      })
      payload.topDeposits = topByAction(payload.rows, '充值')
      payload.topWithdraws = topByAction(payload.rows, '提现')
      const largest = [...payload.rows].sort((a, b) => b.amount - a.amount)[0] || null
      payload.kpis.depositAmt = day.depositAmt
      payload.kpis.depositU = toTransferU(day.depositAmt, last)
      payload.kpis.depositCount = day.depositCount
      payload.kpis.depositUsers = day.depositUsers
      payload.kpis.withdrawAmt = day.withdrawAmt
      payload.kpis.withdrawU = toTransferU(day.withdrawAmt, last)
      payload.kpis.withdrawCount = day.withdrawCount
      payload.kpis.withdrawUsers = day.withdrawUsers
      payload.kpis.transferNet = day.netAmt
      payload.kpis.transferNetU = toTransferU(day.netAmt, last)
      payload.kpis.alertCount = Math.max(0, Math.round((payload.kpis.alertCount || 0) * ((depScale + wdScale) / 2)))
      payload.kpis.pending = Math.max(0, Math.round((payload.kpis.pending || 0) * ((depScale + wdScale) / 2)))
      Object.assign(payload.kpis, packLargestKpis(largest))
      payload.kpis.topDepositShare = day.depositAmt
        ? Number((payload.topDeposits.slice(0, 3).reduce((sum, row) => sum + row.amount, 0) / day.depositAmt * 100).toFixed(1))
        : 0
      payload.status = [
        {
          color: day.netAmt >= 0 ? 'yellow' : 'green',
          text: day.netAmt >= 0
            ? `${payload.dateLabel}净充入 ${fmtQtyPlain(day.netAmt)}万 · 所内可卖供给增加`
            : `${payload.dateLabel}净提出 ${fmtQtyPlain(Math.abs(day.netAmt))}万 · 货离开唯一市场`
        },
        {
          color: 'yellow',
          text: `充 ${day.depositCount} 笔 / ${day.depositUsers} UID · 提 ${day.withdrawCount} 笔 / ${day.withdrawUsers} UID`
        },
        {
          color: 'green',
          text: largest
            ? `单笔最大 ${largest.action} ${fmtQtyPlain(largest.amount)}万 · UID ${largest.uid}`
            : '当日无超阈值充提'
        }
      ]
    }
  }

  const liveDay = daysAsc.find((row) => row.dateKey === payload.dateKey)
  const liveIdx = daysAsc.findIndex((row) => row.dateKey === payload.dateKey)
  const livePrev = liveIdx > 0 ? daysAsc[liveIdx - 1] : prev
  if (liveDay && livePrev) {
    payload.kpis.depositVsPrev = Number((liveDay.depositAmt - livePrev.depositAmt).toFixed(1))
    payload.kpis.withdrawVsPrev = Number((liveDay.withdrawAmt - livePrev.withdrawAmt).toFixed(1))
    payload.kpis.netVsPrev = Number((liveDay.netAmt - livePrev.netAmt).toFixed(1))
  }
  return payload
}

export function generateTransferToday(pair, threshold = 50, internalAccounts = [], dateKey = '') {
  return applyTransferDay(buildTransferToday(pair, threshold, internalAccounts), pair, threshold, internalAccounts, dateKey)
}

export function generateTransferHistory(pair, days = 15, threshold = 50, internalAccounts = []) {
  const n = [7, 15, 30].includes(Number(days)) ? Number(days) : 15
  const today = buildTransferToday(pair, threshold, internalAccounts)
  const k = today.kpis
  const pairSeed = pairSeedOf(pair)
  const parts = String(pair || '').split('/')
  const base = parts[0] || 'TOKEN'
  const last = today.lastPrice || 1
  const FULL = 30
  const all = []

  for (let i = 0; i < FULL; i++) {
    const { date, dateKey } = deskCalendarDay(i, FULL)
    const t = i / Math.max(FULL - 1, 1)
    const wave = Math.sin((i + pairSeed) / 4.2) * 0.12
    const drift = (t - 0.5) * 0.08 * (pairSeed % 2 === 0 ? 1 : -1)
    const jitter = ((i * 5 + pairSeed) % 9 - 4) * 0.015
    const scale = i === FULL - 1 ? 1 : Math.max(0.62, Math.min(1.28, 1 + drift + wave + jitter))
    const wdScale = i === FULL - 1 ? 1 : Math.max(0.58, Math.min(1.32, 1 - drift * 0.6 + wave * 0.7 + jitter))
    const depositAmt = Number((k.depositAmt * scale).toFixed(1))
    const withdrawAmt = Number((k.withdrawAmt * wdScale).toFixed(1))
    const netAmt = Number((depositAmt - withdrawAmt).toFixed(1))
    const depositCount = i === FULL - 1 ? k.depositCount : Math.max(1, Math.round(k.depositCount * scale))
    const withdrawCount = i === FULL - 1 ? k.withdrawCount : Math.max(1, Math.round(k.withdrawCount * wdScale))
    const depositUsers = i === FULL - 1 ? k.depositUsers : Math.max(1, Math.round(k.depositUsers * (0.85 + scale * 0.15)))
    const withdrawUsers = i === FULL - 1 ? k.withdrawUsers : Math.max(1, Math.round(k.withdrawUsers * (0.85 + wdScale * 0.15)))
    all.push({
      date,
      dateKey,
      depositAmt,
      depositU: toTransferU(depositAmt, last),
      withdrawAmt,
      withdrawU: toTransferU(withdrawAmt, last),
      netAmt,
      netU: toTransferU(netAmt, last),
      depositCount,
      withdrawCount,
      depositUsers,
      withdrawUsers,
      largestAmt: Number((Math.max(depositAmt, withdrawAmt) / Math.max(depositCount + withdrawCount, 1) * 1.8).toFixed(1))
    })
  }

  const rowsAsc = all.slice(FULL - n)
  const first = rowsAsc[0]
  const lastRow = rowsAsc[rowsAsc.length - 1]
  const periodDeposit = Number(rowsAsc.reduce((sum, row) => sum + row.depositAmt, 0).toFixed(1))
  const periodWithdraw = Number(rowsAsc.reduce((sum, row) => sum + row.withdrawAmt, 0).toFixed(1))
  const periodNet = Number((periodDeposit - periodWithdraw).toFixed(1))
  const netInDays = rowsAsc.filter((row) => row.netAmt >= 0).length
  const maxDeposit = Math.max(...rowsAsc.map((row) => row.depositAmt))
  const maxWithdraw = Math.max(...rowsAsc.map((row) => row.withdrawAmt))

  return {
    range: n,
    pair,
    base,
    kpis: {
      periodDeposit,
      periodDepositU: toTransferU(periodDeposit, last),
      periodWithdraw,
      periodWithdrawU: toTransferU(periodWithdraw, last),
      periodNet,
      periodNetU: toTransferU(periodNet, last),
      netInDays,
      netOutDays: rowsAsc.length - netInDays,
      endDeposit: lastRow.depositAmt,
      endWithdraw: lastRow.withdrawAmt,
      endNet: lastRow.netAmt,
      startNet: first.netAmt,
      netChange: Number((lastRow.netAmt - first.netAmt).toFixed(1)),
      maxDeposit,
      maxWithdraw,
      avgDeposit: Number((periodDeposit / Math.max(rowsAsc.length, 1)).toFixed(1)),
      avgWithdraw: Number((periodWithdraw / Math.max(rowsAsc.length, 1)).toFixed(1))
    },
    status: [
      {
        color: periodNet >= 0 ? 'yellow' : 'green',
        text: `区间充 ${fmtQtyPlain(periodDeposit)} / 提 ${fmtQtyPlain(periodWithdraw)}万 · 净 ${signedPlain(periodNet)}万${base}`
      },
      {
        color: 'green',
        text: `净流入 ${netInDays} 天 · 净流出 ${rowsAsc.length - netInDays} 天 · 日均充 ${fmtQtyPlain(periodDeposit / Math.max(rowsAsc.length, 1))}万`
      },
      {
        color: 'yellow',
        text: `单日最高充 ${fmtQtyPlain(maxDeposit)} / 提 ${fmtQtyPlain(maxWithdraw)}万 · 期末点与「今日充提」对齐`
      }
    ],
    series: {
      dates: rowsAsc.map((row) => row.date),
      depositAmt: rowsAsc.map((row) => row.depositAmt),
      withdrawAmt: rowsAsc.map((row) => row.withdrawAmt),
      netAmt: rowsAsc.map((row) => row.netAmt)
    },
    rows: [...rowsAsc].reverse()
  }
}

export function generateBlockTrades(pair, threshold = 50, internalAccounts = []) {
  const pairSeed = pairSeedOf(pair)
  const minAmt = Number(threshold) > 0 ? Number(threshold) : 50
  const last = transferLastPrice(pair)
  const internalUids = new Set((internalAccounts || []).map((row) => String(row.uid || '').trim()).filter(Boolean))
  const tags = [
    { label: '大户', className: 'warning' },
    { label: '量化', className: 'robot' },
    { label: '做市对手', className: 'alert' },
    { label: '机构', className: 'user' }
  ]
  const statuses = [
    { status: '红色', statusTag: 'alert' },
    { status: '监控中', statusTag: 'warning' },
    { status: '已处理', statusTag: 'success' }
  ]
  const rows = []
  for (let i = 0; i < 18; i++) {
    const amount = Number((minAmt * 0.5 + ((i * 23 + pairSeed * 9) % 190) + (i === 0 ? 70 : 0)).toFixed(1))
    if (amount < minAmt && i > 4) continue
    const uid = String(24000 + i * 151 + pairSeed * 17)
    if (internalUids.has(uid)) continue
    const action = i % 2 === 0 ? '大额买入' : '大额卖出'
    const meta = ACTION_META[action]
    const tag = tags[(i + pairSeed) % tags.length]
    const st = amount >= minAmt * 1.6 ? statuses[0] : statuses[(i + pairSeed) % 3]
    const qty = Number(Math.max(amount, i < 4 ? minAmt : amount).toFixed(1))
    const impact = Number((0.35 + (i % 7) * 0.28 + (qty / Math.max(minAmt, 1)) * 0.04).toFixed(2))
    rows.push({
      time: clockAt(i, 5),
      uid,
      tag: tag.label,
      tagClass: tag.className,
      action,
      actionClass: meta.className,
      amount: qty,
      amountU: toTransferU(qty, last),
      impact,
      side: action === '大额买入' ? '买' : '卖',
      status: st.status,
      statusTag: st.statusTag,
      note: meta.note[(i + pairSeed) % meta.note.length]
    })
  }
  rows.sort((a, b) => (a.time < b.time ? 1 : -1))

  const buyAmt = Number(sumByAction(rows, '大额买入').toFixed(1))
  const sellAmt = Number(sumByAction(rows, '大额卖出').toFixed(1))
  const buyCount = rows.filter((row) => row.action === '大额买入').length
  const sellCount = rows.filter((row) => row.action === '大额卖出').length
  const tradeNet = Number((buyAmt - sellAmt).toFixed(1))
  const tradeVolume = Number((buyAmt + sellAmt).toFixed(1))
  const alertCount = rows.filter((row) => row.status === '红色').length
  const pending = rows.filter((row) => row.status !== '已处理').length
  const maxImpact = rows.reduce((best, row) => (row.impact > best ? row.impact : best), 0)
  const maxImpactRow = rows.find((row) => row.impact === maxImpact) || null
  const hours = hours24()
  const buyHour = scaleHourSeries(waveSeries(24, Math.max(3, buyAmt / 16), Math.max(1.5, buyAmt / 24), pairSeed + 3), buyAmt)
  const sellHour = scaleHourSeries(waveSeries(24, Math.max(3, sellAmt / 16), Math.max(1.5, sellAmt / 24), pairSeed + 8), sellAmt)

  return {
    pair,
    base: String(pair || '').split('/')[0] || 'TOKEN',
    lastPrice: last,
    kpis: {
      buyAmt,
      buyU: toTransferU(buyAmt, last),
      buyCount,
      sellAmt,
      sellU: toTransferU(sellAmt, last),
      sellCount,
      tradeNet,
      tradeNetU: toTransferU(tradeNet, last),
      tradeVolume,
      tradeVolumeU: toTransferU(tradeVolume, last),
      alertCount,
      pending,
      maxImpact,
      maxImpactUid: maxImpactRow ? maxImpactRow.uid : '—',
      skippedInternal: internalUids.size
    },
    rows,
    hours: {
      labels: hours,
      buy: buyHour,
      sell: sellHour,
      net: buyHour.map((value, i) => Number((value - sellHour[i]).toFixed(1)))
    },
    status: [
      {
        color: tradeNet >= 0 ? 'yellow' : 'green',
        text: tradeNet >= 0
          ? `大单净买入 ${fmtQtyPlain(tradeNet)}万`
          : `大单净卖出 ${fmtQtyPlain(Math.abs(tradeNet))}万`
      },
      {
        color: alertCount ? 'red' : 'green',
        text: `阈值 ${minAmt}万 · 红色 ${alertCount} · 待处理 ${pending}`
      }
    ]
  }
}

export function generateExchangeWhales(pair, threshold = 50, internalAccounts = []) {
  const transfers = buildTransferToday(pair, threshold, internalAccounts)
  const blocks = generateBlockTrades(pair, threshold, internalAccounts)
  const rows = [...transfers.rows, ...blocks.rows].sort((a, b) => (a.time < b.time ? 1 : -1))
  return {
    ...transfers,
    kpis: {
      ...transfers.kpis,
      buyAmt: blocks.kpis.buyAmt,
      buyCount: blocks.kpis.buyCount,
      sellAmt: blocks.kpis.sellAmt,
      sellCount: blocks.kpis.sellCount,
      tradeNet: blocks.kpis.tradeNet,
      tradeVolume: blocks.kpis.tradeVolume,
      alertCount: transfers.kpis.alertCount + blocks.kpis.alertCount,
      pending: transfers.kpis.pending + blocks.kpis.pending
    },
    rows,
    netflow: {
      labels: transfers.hours.labels.filter((_, i) => i % 3 === 0).map((label) => label.slice(0, 2)),
      depositValues: transfers.hours.deposit.filter((_, i) => i % 3 === 0),
      withdrawValues: transfers.hours.withdraw.filter((_, i) => i % 3 === 0),
      buyValues: blocks.hours.buy.filter((_, i) => i % 3 === 0),
      sellValues: blocks.hours.sell.filter((_, i) => i % 3 === 0)
    }
  }
}

export function generateOnchainWhales(pair, threshold = 50, excludedAddresses = []) {
  const pairSeed = pairSeedOf(pair)
  const minAmt = Number(threshold) > 0 ? Number(threshold) : 50
  const excluded = excludedAddresses || []
  const sources = ['未知地址', '交易所热钱包', '跨链桥', '新地址']
  const actions = ['转入', '转出']
  const notes = {
    转入: ['链上大额转入', '疑似交易所充值前奏', '新地址集中买入'],
    转出: ['转出至外部地址', '货离开唯一市场', '转入冷钱包']
  }
  const rows = []
  for (let i = 0; i < 12; i++) {
    const amount = Number((minAmt * 0.35 + ((i * 19 + pairSeed * 11) % 210) + (i === 0 ? 90 : 0)).toFixed(1))
    const action = actions[i % 2]
    const status = amount >= minAmt * 1.5 ? { status: '红色', statusTag: 'alert' } : i % 3 === 0 ? { status: '已处理', statusTag: 'success' } : { status: '监控中', statusTag: 'warning' }
    const address = i === 2 && excluded[0]?.address ? excluded[0].address : makeWhaleAddress(i + pairSeed * 3, pairSeed)
    const excludedHit = excluded.some((item) => String(item.address || '').toLowerCase() === address.toLowerCase())
    rows.push({
      time: clockAt(i, 5),
      address,
      action,
      actionClass: action === '转入' ? 'in' : 'out',
      amount: Number(Math.max(amount, i < 5 ? minAmt : amount).toFixed(1)),
      source: excludedHit ? '已排除热钱包' : sources[(i + pairSeed) % sources.length],
      excluded: excludedHit,
      status: status.status,
      statusTag: status.statusTag,
      note: notes[action][(i + pairSeed) % notes[action].length]
    })
  }
  const visible = rows.filter((row) => !row.excluded)
  const inAmt = visible.filter((row) => row.action === '转入').reduce((sum, row) => sum + row.amount, 0)
  const outAmt = visible.filter((row) => row.action === '转出').reduce((sum, row) => sum + row.amount, 0)
  const newCount = visible.filter((row) => row.source === '新地址').length
  const pending = visible.filter((row) => row.status !== '已处理').length
  const top = [...visible].sort((a, b) => b.amount - a.amount).slice(0, 6)
  const labels = ['08', '10', '12', '14', '16', '18', '20']
  return {
    kpis: {
      inAmt: Number(inAmt.toFixed(1)),
      outAmt: Number(outAmt.toFixed(1)),
      netAmt: Number((inAmt - outAmt).toFixed(1)),
      newCount,
      pending,
      topShare: Number((top.slice(0, 3).reduce((s, r) => s + r.amount, 0) / (inAmt + outAmt || 1) * 100).toFixed(1)),
      topAmount: Number(top.slice(0, 3).reduce((s, r) => s + r.amount, 0).toFixed(1)),
      skippedExcluded: rows.length - visible.length
    },
    rows: visible,
    netflow: {
      labels,
      values: labels.map((_, i) => Number((14 + ((i * 8 + pairSeed * 6) % 32) - 10).toFixed(1)))
    },
    concentration: {
      labels: top.map((row) => `${row.address.slice(0, 6)}...${row.address.slice(-4)}`),
      values: top.map((row) => row.amount),
      addresses: top.map((row) => row.address)
    }
  }
}

export const USER_PROFILE = {
  total: 1284,
  activeToday: 312,
  tags: [
    { name: '聪明钱', key: 'smart', to: '/user-profile/smart', value: 42, ratio: '3.3%', color: '#4cd9a0' },
    { name: '散户', key: 'retail', to: '/user-profile/retail', value: 892, ratio: '69.5%', color: '#ffb347' },
    { name: '羊毛党', key: 'wool', to: '/user-profile/wool', value: 67, ratio: '5.2%', color: '#ff5a7a' },
    { name: '吃客损KOL', key: 'kol', to: '/user-profile/kol', value: 23, ratio: '1.8%', color: '#a78bfa' },
    { name: '程序化交易', key: 'prog', to: '/user-profile/prog', value: 38, ratio: '3.0%', color: '#4a8aff' }
  ],
  trend: {
    dates: ['08/21', '08/22', '08/23', '08/24', '08/25', '08/26', '08/27'],
    smart: [38, 40, 39, 41, 42, 43, 42],
    retail: [880, 885, 890, 895, 898, 900, 892],
    wool: [60, 62, 65, 66, 67, 68, 67],
    kol: [18, 19, 20, 21, 22, 23, 23],
    prog: [32, 34, 35, 36, 37, 38, 38]
  },
  users: [
    { id: 'ACC1024', registered: '2026-08-20', trades: 28, winRate: '72%', profitRatio: 2.1, tags: [{ label: '聪明钱', className: 'success' }] },
    { id: 'ACC2048', registered: '2026-08-15', trades: 156, winRate: '32%', profitRatio: 0.4, tags: [{ label: '散户', className: 'warning' }, { label: '低胜率', className: 'danger' }] },
    { id: 'ACC3072', registered: '2026-08-22', trades: 8, winRate: '12%', profitRatio: 0.1, tags: [{ label: '羊毛党', className: 'alert' }] },
    { id: 'ACC4096', registered: '2026-08-18', trades: 34, winRate: '68%', profitRatio: 1.8, tags: [{ label: '程序化交易', className: 'robot' }] },
    { id: 'ACC5120', registered: '2026-08-10', trades: 22, winRate: '55%', profitRatio: 1.2, tags: [{ label: '吃客损KOL', className: 'alert' }] },
    { id: 'ACC6144', registered: '2026-08-01', trades: 45, winRate: '48%', profitRatio: 0.8, tags: [{ label: '散户', className: 'warning' }, { label: '喜欢扛单', className: 'danger' }] }
  ]
}

function hours24() {
  return Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
}

function waveSeries(len, base, amp, seed, digits = 1) {
  return Array.from({ length: len }, (_, i) => {
    const v = base + Math.sin((i + seed) / 3.1) * amp + ((i * 3 + seed) % 5 - 2) * (amp / 8)
    return Number(Math.max(0, v).toFixed(digits))
  })
}

function personaUsers(prefix, count, build) {
  const rows = []
  for (let i = 0; i < count; i++) rows.push(build(i, `${prefix}${1020 + i * 17}`))
  return rows
}

export function generatePersonaProfile(type, pair) {
  const seed = pair === 'VBT/USDT' ? 1 : 2
  const meta = PERSONA_PAGES.find((item) => item.key === type) || PERSONA_PAGES[0]
  const tag = USER_PROFILE.tags.find((item) => item.key === meta.key) || USER_PROFILE.tags[0]
  const hours = hours24()
  const dates = USER_PROFILE.trend.dates
  const count = tag.value

  const packs = {
    smart: () => ({
      blurb: '',
      status: [
        { color: 'green', text: `覆盖 ${count} 人 · 占全站 ${tag.ratio}` },
        { color: 'green', text: `均胜率 ${68 + seed}% · 均盈亏比 ${(1.8 + seed * 0.1).toFixed(1)}` },
        { color: 'green', text: '规则：交易笔数 / 胜率 / 盈亏比 / 单笔仓位' }
      ],
      kpis: [
        { label: '聪明钱人数', value: count, unit: '人', qty: `占全站 ${tag.ratio}`, sub: '规则命中 UID', color: meta.color },
        { label: '均胜率', value: 68 + seed, unit: '%', sub: '近30日已实现', color: '#4cd9a0' },
        { label: '均盈亏比', value: Number((1.8 + seed * 0.12).toFixed(1)), sub: '赚 / 亏 绝对值', color: '#4cd9a0' },
        { label: '今日净买入', value: Number((18 + seed * 3.2).toFixed(1)), unit: '万', qty: `${28 + seed} 人在买`, sub: '正数=跟你抢买入', color: '#6a9aff' },
        { label: '均仓位', value: Number((1.6 + seed * 0.1).toFixed(1)), unit: '倍', sub: '相对账户净值', color: '#ffb347' },
        { label: '今日活跃', value: 22 + seed, unit: '人', qty: `占本标签 ${Math.round((22 + seed) / count * 100)}%`, sub: '有成交' }
      ],
      charts: [
        { title: '人数趋势', badge: '近7天', x: dates, legend: ['聪明钱'], series: [{ name: '聪明钱', type: 'line', data: USER_PROFILE.trend.smart, color: meta.color }] },
        { title: '今日净买入', badge: '万枚', x: hours, legend: ['买入', '卖出'], series: [
          { name: '买入', type: 'bar', data: waveSeries(24, 1.4 + seed * 0.2, 0.8, seed), color: '#6a9aff' },
          { name: '卖出', type: 'bar', data: waveSeries(24, 0.7 + seed * 0.1, 0.5, seed + 2), color: '#ffb347' }
        ] }
      ],
      notes: [],
      columns: [
        { key: 'id', label: 'UID' },
        { key: 'winRate', label: '胜率' },
        { key: 'profitRatio', label: '盈亏比' },
        { key: 'position', label: '当前仓位', format: 'qty', unit: '万' },
        { key: 'net', label: '今日净买', format: 'signed', unit: '万' }
      ],
      rows: personaUsers('SM', 8, (i, id) => ({
        id,
        winRate: `${64 + ((i * 5 + seed) % 18)}%`,
        profitRatio: (1.5 + (i % 6) * 0.2 + seed * 0.05).toFixed(1),
        position: Number((8.4 + i * 2.1 + seed * 0.8).toFixed(1)),
        net: Number(((i % 2 ? 1 : -0.4) * (2.4 + i * 0.6 + seed)).toFixed(1))
      }))
    }),
    retail: () => ({
      blurb: '',
      status: [
        { color: 'yellow', text: `覆盖 ${count} 人 · 占全站 ${tag.ratio}` },
        { color: 'yellow', text: `均胜率 ${31 + seed}% · 浮亏账户 ${58 + seed}%` },
        { color: 'green', text: '规则：交易笔数 / 净收益 / 胜率 / 持仓时间比 / 强平率' }
      ],
      kpis: [
        { label: '散户人数', value: count, unit: '人', qty: `占全站 ${tag.ratio}`, sub: '最大标签', color: meta.color },
        { label: '均胜率', value: 31 + seed, unit: '%', sub: '近30日', color: '#ff5a7a' },
        { label: '浮亏占比', value: 58 + seed, unit: '%', qty: `${Math.round(count * (0.58 + seed / 100))} 人`, sub: '持仓成本高于现价', color: '#ff5a7a' },
        { label: '今日净买入', value: Number((-6.4 - seed * 1.1).toFixed(1)), unit: '万', sub: '正数=接你卖出 · 负数=给你买入', color: '#ffb347' },
        { label: '均持仓', value: Number((3.2 + seed * 0.2).toFixed(1)), unit: '天', sub: '喜欢扛单', color: '#ffb347' },
        { label: '今日强平/止损', value: 14 + seed, unit: '人', sub: '盘口冲击偏卖', color: '#ff5a7a' }
      ],
      charts: [
        { title: '人数趋势', badge: '近7天', x: dates, legend: ['散户'], series: [{ name: '散户', type: 'line', data: USER_PROFILE.trend.retail, color: meta.color }] },
        { title: '追涨 vs 止损', badge: '今日 · 万枚', x: hours, legend: ['追涨买', '止损卖'], series: [
          { name: '追涨买', type: 'bar', data: waveSeries(24, 4.2 + seed, 2.2, seed), color: '#6a9aff' },
          { name: '止损卖', type: 'bar', data: waveSeries(24, 5.1 + seed, 2.4, seed + 4), color: '#ff5a7a' }
        ] }
      ],
      notes: [],
      columns: [
        { key: 'id', label: 'UID' },
        { key: 'winRate', label: '胜率' },
        { key: 'position', label: '当前仓位', format: 'qty', unit: '万' },
        { key: 'pnl', label: '浮盈亏', format: 'signed', unit: '万' },
        { key: 'holdDays', label: '持仓(天)' }
      ],
      rows: personaUsers('RT', 10, (i, id) => ({
        id,
        winRate: `${18 + ((i * 7 + seed) % 22)}%`,
        position: Number((3.6 + i * 1.4 + seed * 0.5).toFixed(1)),
        pnl: Number((-(1.2 + i * 0.7 + seed * 0.3) * (i % 4 === 0 ? -0.4 : 1)).toFixed(1)),
        holdDays: 2 + ((i * 3 + seed) % 11)
      }))
    }),
    wool: () => ({
      blurb: '同一设备 / IP 段批量注册，为活动、返佣、体验金而来。成交额小、时间同步、路径相似，对价格发现几乎没有贡献，但会污染真实用户统计。',
      status: [
        { color: 'red', text: `覆盖 ${count} 人 · 占全站 ${tag.ratio}` },
        { color: 'yellow', text: `设备簇 ${8 + seed} 个 · IP 簇 ${5 + seed} 个` },
        { color: 'green', text: '规则：同一设备账户数 / 同一 IP 段账户数' }
      ],
      kpis: [
        { label: '羊毛账号', value: count, unit: '人', qty: `占全站 ${tag.ratio}`, sub: '命中设备或 IP 规则', color: meta.color },
        { label: '设备簇', value: 8 + seed, unit: '个', qty: `户均 ${(count / (8 + seed)).toFixed(1)} 号`, sub: '同设备多 UID', color: '#ff5a7a' },
        { label: 'IP 簇', value: 5 + seed, unit: '个', sub: '同 C 段', color: '#ffb347' },
        { label: '笔均金额', value: Number((0.12 + seed * 0.02).toFixed(2)), unit: '万', sub: '远低于真实用户', color: '#ffb347' },
        { label: '活动完成率', value: 86 + seed, unit: '%', sub: '领完即闲置' },
        { label: '今日同步成交', value: 19 + seed, unit: '笔', sub: '同一秒 ±3s' }
      ],
      charts: [
        { title: '新注册爆发', badge: '近7天', x: dates, legend: ['新羊毛号'], series: [{ name: '新羊毛号', type: 'bar', data: [6, 8, 5, 11, 9, 14, 7].map((v) => v + seed), color: meta.color }] },
        { title: '同步成交笔数', badge: '今日', x: hours, legend: ['同步笔数'], series: [{ name: '同步笔数', type: 'bar', data: hours.map((_, i) => (i >= 9 && i <= 11) || (i >= 20 && i <= 21) ? 4 + seed + (i % 3) : (i % 7 === 0 ? 1 : 0)), color: '#ff5a7a' }] }
      ],
      notes: [],
      columns: [
        { key: 'cluster', label: '簇' },
        { key: 'device', label: '设备指纹' },
        { key: 'ip', label: 'IP 段' },
        { key: 'accounts', label: '账号数' },
        { key: 'size', label: '今日成交', format: 'qty', unit: '万' },
        { key: 'last', label: '行为' }
      ],
      rows: Array.from({ length: 8 }, (_, i) => ({
        cluster: `W${seed}${10 + i}`,
        device: `d${(8800 + i * 13 + seed).toString(16)}`,
        ip: `103.${40 + seed}.${10 + i}.0/24`,
        accounts: 3 + ((i + seed) % 6),
        size: Number((0.08 + i * 0.03).toFixed(2)),
        last: i % 2 ? '领券后小额对倒' : '同一秒下单'
      }))
    }),
    kol: () => ({
      blurb: '喊单带散户追涨，自己先卖。散户跟风接你的卖出，他们是放大器，不是对手。',
      status: [
        { color: 'red', text: `覆盖 ${count} 人 · 占全站 ${tag.ratio}` },
        { color: 'yellow', text: `关联跟风散户 ${180 + seed * 12} 人 · 今日喊单 ${2 + (seed % 2)} 次` },
        { color: 'red', text: '10:18 喊多后 12 分钟内本人净卖出，跟风盘仍在买' },
        { color: 'green', text: '规则：跟风散户数 / 喊单后净卖窗口 / 反向成交占比' }
      ],
      kpis: [
        { label: 'KOL 人数', value: count, unit: '人', qty: `占全站 ${tag.ratio}`, sub: '喊单后反向成交', color: meta.color },
        { label: '关联散户', value: 180 + seed * 12, unit: '人', sub: '同向跟风 UID', color: '#ffb347' },
        { label: '喊单后净卖', value: Number((12.6 + seed * 1.4).toFixed(1)), unit: '万', sub: '本人在喊单窗口', color: '#ff5a7a' },
        { label: '跟风浮亏', value: Number((9.4 + seed).toFixed(1)), unit: '万', sub: '关联散户合计', color: '#ff5a7a' },
        { label: '今日喊单', value: 2 + (seed % 2), unit: '次', sub: '公开/社群' },
        { label: '平均滞后', value: 11 + seed, unit: '分钟', sub: '散户跟进延迟' }
      ],
      charts: [
        { title: '人数趋势', badge: '近7天', x: dates, legend: ['吃客损KOL'], series: [{ name: '吃客损KOL', type: 'line', data: USER_PROFILE.trend.kol, color: meta.color }] },
        { title: '喊单窗口成交', badge: '今日 · 万枚', x: hours, legend: ['KOL卖出', '跟风买入'], series: [
          { name: 'KOL卖出', type: 'bar', data: hours.map((_, i) => (i === 10 || i === 14 ? 6 + seed : i === 11 || i === 15 ? 3 : 0.2)), color: '#a78bfa' },
          { name: '跟风买入', type: 'bar', data: hours.map((_, i) => (i === 10 || i === 14 ? 2 : i === 11 || i === 15 ? 7 + seed : 0.4)), color: '#ffb347' }
        ] }
      ],
      notes: [],
      columns: [],
      rows: []
    }),
    prog: () => ({
      blurb: '持仓以秒到分钟计，挂撤比极高。拉砸时会把近端墙打薄。要和自有挂价机器人分开看。',
      status: [
        { color: 'green', text: `覆盖 ${count} 人 · 占全站 ${tag.ratio}` },
        { color: 'yellow', text: `均持仓 ${40 + seed * 6} 秒 · 均挂撤比 ${18 + seed}` },
        { color: 'yellow', text: '不含做市 / 金库 / 项目方等内部 UID' },
        { color: 'green', text: '规则：持仓生命周期 / 挂撤比' }
      ],
      kpis: [
        { label: '程序化账户', value: count, unit: '人', qty: `占全站 ${tag.ratio}`, sub: '已排除做市 UID', color: meta.color },
        { label: '均持仓', value: 40 + seed * 6, unit: '秒', sub: '生命周期阈值 1 分钟', color: '#6a9aff' },
        { label: '均挂撤比', value: 18 + seed, unit: '倍', sub: '挂单 / 成交', color: '#ffb347' },
        { label: '今日成交额', value: Number((86 + seed * 8).toFixed(1)), unit: '万', qty: `${(120 + seed * 10).toFixed(0)} 万USDT`, sub: '买+卖', color: '#6a9aff' },
        { label: '撤单率', value: Number((72 + seed).toFixed(1)), unit: '%', sub: '远高于真人' },
        { label: '在线策略', value: 21 + seed, unit: '个', sub: '心跳正常' }
      ],
      charts: [
        { title: '人数趋势', badge: '近7天', x: dates, legend: ['程序化'], series: [{ name: '程序化', type: 'line', data: USER_PROFILE.trend.prog, color: meta.color }] },
        { title: '挂单 vs 撤单', badge: '今日 · 笔', x: hours, legend: ['挂单', '撤单', '成交'], series: [
          { name: '挂单', type: 'line', data: waveSeries(24, 80 + seed * 6, 22, seed, 0), color: '#6a9aff' },
          { name: '撤单', type: 'line', data: waveSeries(24, 70 + seed * 5, 20, seed + 1, 0), color: '#ffb347' },
          { name: '成交', type: 'bar', data: waveSeries(24, 8 + seed, 4, seed + 3, 0), color: '#4cd9a0' }
        ] }
      ],
      notes: [],
      columns: [
        { key: 'id', label: 'UID' },
        { key: 'style', label: '风格' },
        { key: 'holdSec', label: '均持仓(秒)' },
        { key: 'cancel', label: '挂撤比' },
        { key: 'turnover', label: '今日成交', format: 'qty', unit: '万' },
        { key: 'latency', label: '延迟' }
      ],
      rows: personaUsers('PG', 8, (i, id) => ({
        id,
        style: ['扫单套利', '中频 CTA', '网格', '冰山拆单', '盘口跟随', '均值回归', '事件驱动', '做T'][i],
        holdSec: 8 + ((i * 11 + seed * 5) % 70),
        cancel: (12 + (i % 9) + seed).toFixed(1),
        turnover: Number((6 + i * 1.8 + seed).toFixed(1)),
        latency: `${8 + ((i * 3 + seed) % 24)}ms`
      }))
    })
  }

  const build = packs[meta.key] || packs.smart
  return {
    key: meta.key,
    name: meta.label,
    color: meta.color,
    className: meta.className,
    ...build()
  }
}

export function getPairData(pair) {
  return PAIR_DATA[pair] || PAIR_DATA['VBT/USDT']
}

function pairPxMeta(d) {
  const avgCost = Number((String(d.priceDevSub || '').match(/([\d.]+)/) || [])[1]) || 0.86
  const devPct = Number(String(d.priceDev || '').replace(/[^\d.+-]/g, '')) || 0
  const digits = avgCost >= 1000 ? 0 : avgCost >= 100 ? 1 : avgCost >= 10 ? 1 : 2
  const lastPrice = Number((avgCost * (1 + devPct / 100)).toFixed(digits))
  const step = avgCost >= 1000 ? 100 : avgCost >= 100 ? 10 : avgCost >= 10 ? 5 : 0.05
  const peak = Number((String(d.costBadge || '').match(/([\d.]+)/) || [])[1]) || avgCost
  return { avgCost, devPct, digits, lastPrice, step, peak }
}

function fmtPxValue(n, digits) {
  return Number(n).toLocaleString('zh-CN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })
}

export function generateUserChips(pair, sleepIdleDays = 30, internalAccounts) {
  const d = getPairData(pair)
  const pairSeed = pairSeedOf(pair)
  const idleDays = Number(sleepIdleDays) > 0 ? Number(sleepIdleDays) : 30
  const snap = computeFloatSnapshot(pair, idleDays, internalAccounts)
  const internal = generateInternalChips(pair, internalAccounts)
  const userToken = Number(Math.max(0, snap.exchTotal - Number(internal.kpis.ownedAmount || 0)).toFixed(1))
  const exchTotal = userToken
  const userCount = Number(snap.holders) || Number(String(d.holderBadge || '').replace(/\D/g, '')) || 128
  const px = pairPxMeta(d)

  const topIds = DETAIL_HOLDERS.map((row) => row.id)
  const n = userCount
  const rows = []
  for (let i = 0; i < n; i++) {
    const amountRaw = Number((260 * (0.86 ** i) + ((i * 11 + pairSeed * 5) % 16)).toFixed(1))
    let sleepDays
    if (i < 6) {
      sleepDays = i === 3 ? 42 : (i * 2 + pairSeed) % 4
    } else {
      sleepDays = (i * 7 + pairSeed * 5 + 3) % 78
    }
    const status = sleepDays >= idleDays ? '沉睡' : sleepDays <= 2 ? '活跃' : '监控中'
    const statusTag = status === '沉睡' ? 'warning' : status === '活跃' ? 'user' : 'robot'
    const nearPeak = i % 5 !== 1 && i % 5 !== 4
    const rawCost = nearPeak
      ? px.peak * (0.96 + ((i * 7 + pairSeed) % 9) / 100)
      : px.avgCost * (0.72 + ((i * 13 + pairSeed * 3) % 50) / 100)
    const cost = Number(rawCost.toFixed(Math.max(px.digits, 2)))
    const hh = String(6 + (i % 12)).padStart(2, '0')
    const mm = String((i * 17 + pairSeed * 5) % 60).padStart(2, '0')
    const lastActive = sleepDays === 0
      ? `今日 ${hh}:${mm}`
      : sleepDays === 1
        ? `昨日 ${hh}:${mm}`
        : `${sleepDays}天前`
    rows.push({
      id: i < topIds.length ? topIds[i] : `${(i + pairSeed) % 9 + 1}***${String(10 + i)}`,
      amount: amountRaw,
      cost,
      lastActive,
      days: sleepDays + 4 + ((i * 5 + pairSeed) % 48),
      sleepDays,
      status,
      statusTag
    })
  }

  function scaleGroup(list, target) {
    const sum = list.reduce((acc, row) => acc + row.amount, 0) || 1
    list.forEach((row) => {
      row.amount = Number(((row.amount / sum) * target).toFixed(1))
    })
  }

  const sleepRows = rows.filter((row) => row.sleepDays >= idleDays)
  scaleGroup(rows, exchTotal)
  rows.sort((a, b) => b.amount - a.amount)

  rows.forEach((row) => {
    const pnlWan = (px.lastPrice - row.cost) * row.amount
    row.pnlWan = Number(pnlWan.toFixed(1))
    row.pnl = `${pnlWan >= 0 ? '+' : ''}${pnlWan.toFixed(1)}万USDT`
    row.pnlColor = pnlWan >= 0 ? '#4cd9a0' : '#ff5a7a'
    row.ratio = `${pnlWan >= 0 ? '+' : ''}${(((px.lastPrice - row.cost) / (row.cost || 1)) * 100).toFixed(1)}%`
    row.costLabel = fmtPxValue(row.cost, px.digits)
  })

  const sleepAmount = Number(rows.filter((row) => row.sleepDays >= idleDays).reduce((sum, row) => sum + row.amount, 0).toFixed(1))
  const activeAmount = Number(rows.filter((row) => row.sleepDays < idleDays).reduce((sum, row) => sum + row.amount, 0).toFixed(1))
  const sleepUsers = sleepRows.length

  const costs = rows.map((row) => row.cost)
  const step = px.step
  const align = (n) => Number((Math.round(n / step) * step).toFixed(8))
  const lo0 = align(Math.floor(Math.min(...costs, px.lastPrice) / step) * step)
  const hi0 = align(Math.ceil(Math.max(...costs, px.lastPrice) / step) * step)
  const costBands = []
  for (let lo = lo0; lo < hi0 - step * 0.1; lo = align(lo + step)) {
    const hi = align(lo + step)
    const isLast = hi >= hi0 - step * 0.1
    const hit = rows.filter((row) => row.cost >= lo && (isLast ? row.cost <= hi : row.cost < hi))
    const amount = Number(hit.reduce((sum, row) => sum + row.amount, 0).toFixed(1))
    const activeHit = hit.filter((row) => row.sleepDays < idleDays)
    const sleepHit = hit.filter((row) => row.sleepDays >= idleDays)
    const mid = (lo + hi) / 2
    const vsPct = Number((((px.lastPrice - mid) / (mid || 1)) * 100).toFixed(1))
    const stance = hi <= px.lastPrice + 1e-9 ? '浮盈' : lo >= px.lastPrice - 1e-9 ? '浮亏' : '跨现价'
    const name = `${fmtPxValue(lo, px.digits)}–${fmtPxValue(hi, px.digits)}`
    costBands.push({
      name,
      min: lo,
      max: hi,
      amount,
      users: hit.length,
      ofTotal: exchTotal ? Number(((amount / exchTotal) * 100).toFixed(1)) : 0,
      activeAmount: Number(activeHit.reduce((sum, row) => sum + row.amount, 0).toFixed(1)),
      sleepAmount: Number(sleepHit.reduce((sum, row) => sum + row.amount, 0).toFixed(1)),
      activeUsers: activeHit.length,
      sleepUsers: sleepHit.length,
      vsPct,
      vsLabel: `${vsPct >= 0 ? '+' : ''}${vsPct}%`,
      stance,
      stanceTag: stance === '浮盈' ? 'user' : stance === '浮亏' ? 'alert' : 'warning',
      containsPrice: px.lastPrice >= lo && px.lastPrice < hi + (isLast ? 1e-9 : 0)
    })
  }

  rows.forEach((row) => {
    const band = costBands.find((item) => row.cost >= item.min && row.cost <= item.max + 1e-9)
      || costBands.find((item) => row.cost >= item.min && row.cost < item.max)
    row.costBand = band?.name || ''
  })

  const weightedAvg = exchTotal
    ? Number((rows.reduce((sum, row) => sum + row.cost * row.amount, 0) / exchTotal).toFixed(Math.max(px.digits, 2)))
    : px.avgCost
  const sortedByCost = [...rows].sort((a, b) => a.cost - b.cost)
  let accAmt = 0
  let medianCost = weightedAvg
  for (const row of sortedByCost) {
    accAmt += row.amount
    if (accAmt >= exchTotal / 2) {
      medianCost = row.cost
      break
    }
  }
  const profitRows = rows.filter((row) => row.cost < px.lastPrice)
  const lossRows = rows.filter((row) => row.cost >= px.lastPrice)
  const profitAmount = Number(profitRows.reduce((sum, row) => sum + row.amount, 0).toFixed(1))
  const lossAmount = Number(lossRows.reduce((sum, row) => sum + row.amount, 0).toFixed(1))
  const denseBand = [...costBands].sort((a, b) => b.amount - a.amount)[0] || null
  const mostUsersBand = [...costBands].sort((a, b) => b.users - a.users || b.amount - a.amount)[0] || null
  const lastBand = costBands.find((item) => item.containsPrice) || null
  const avgBand = costBands.find((item) => weightedAvg >= item.min && weightedAvg < item.max) || lastBand

  const pnlBuckets = [
    { name: '盈利 0–20%', minPct: 0, maxPct: 20, color: '#7ed9b0' },
    { name: '盈利 20–50%', minPct: 20, maxPct: 50, color: '#4cd9a0' },
    { name: '盈利 ≥50%', minPct: 50, maxPct: Infinity, color: '#a78bfa' },
    { name: '亏损 0–20%', minPct: -20, maxPct: 0, color: '#ffb347' },
    { name: '亏损 20–50%', minPct: -50, maxPct: -20, color: '#ff7a94' },
    { name: '亏损 ≥50%', minPct: -Infinity, maxPct: -50, color: '#ff5a7a' }
  ].map((def) => {
    const hit = rows.filter((row) => {
      const pct = ((px.lastPrice - row.cost) / (row.cost || 1)) * 100
      if (def.maxPct === Infinity) return pct >= def.minPct
      if (def.minPct === -Infinity) return pct <= def.maxPct
      if (def.maxPct === 0) return pct > def.minPct && pct < 0
      if (def.maxPct < 0) return pct > def.minPct && pct <= def.maxPct
      return pct >= def.minPct && pct < def.maxPct
    })
    const amount = Number(hit.reduce((sum, row) => sum + row.amount, 0).toFixed(1))
    return {
      ...def,
      amount,
      users: hit.length,
      pct: exchTotal ? Number(((amount / exchTotal) * 100).toFixed(1)) : 0
    }
  })
  const buckets = [
    { name: '0–2天', min: 0, max: 2 },
    { name: '3–7天', min: 3, max: 7 },
    { name: '8–14天', min: 8, max: 14 },
    { name: '15–29天', min: 15, max: 29 },
    { name: '30–59天', min: 30, max: 59 },
    { name: '60天+', min: 60, max: 9999 }
  ]
  const idleDist = buckets.map((bucket) => ({
    name: bucket.name,
    value: Number(rows
      .filter((row) => row.sleepDays >= bucket.min && row.sleepDays <= bucket.max)
      .reduce((sum, row) => sum + row.amount, 0)
      .toFixed(1)),
    users: rows.filter((row) => row.sleepDays >= bucket.min && row.sleepDays <= bucket.max).length,
    sleeping: bucket.min >= idleDays
  }))

  const end = new Date('2026-08-28T00:00:00')
  const dates = []
  const sleepAmounts = []
  const activeAmounts = []
  const sleepRatios = []
  const currentRatio = exchTotal ? sleepAmount / exchTotal : 0
  for (let i = 0; i < 30; i++) {
    const day = new Date(end)
    day.setDate(end.getDate() - (29 - i))
    dates.push(`${String(day.getMonth() + 1).padStart(2, '0')}/${String(day.getDate()).padStart(2, '0')}`)
    const wave = Math.sin((i + pairSeed) / 5) * 0.035
    const drift = ((29 - i) / 29) * 0.06 * (pairSeed % 2 === 0 ? 1 : -1)
    let ratio = Math.max(0.12, Math.min(0.68, currentRatio - 0.04 + drift + wave + ((i * 3 + pairSeed) % 5 - 2) * 0.004))
    if (i === 29) ratio = currentRatio
    const sleepAmt = Number((exchTotal * ratio).toFixed(1))
    sleepAmounts.push(sleepAmt)
    activeAmounts.push(Number((exchTotal - sleepAmt).toFixed(1)))
    sleepRatios.push(Number((ratio * 100).toFixed(1)))
  }

  const concentration = rows.slice(0, 5).map((row) => ({ value: row.amount, name: `用户${row.id}` }))
  concentration.push({
    value: Number(rows.slice(5).reduce((sum, row) => sum + row.amount, 0).toFixed(1)),
    name: '其他用户'
  })

  return {
    formula: '所内真实用户的剩余存货成本。不含做市账户，也不含金库 / 项目方 / 员工 / LP。买入按成交价入库，充值按到账现价入库；卖出只减数量。现价高于均价=浮盈会兑现；刚跌破均价=砍仓；深套=再砸不动。',
    badge: `真实用户 ${userCount} 人 · 不含做市 / 金库等`,
    kpis: {
      totalAmount: exchTotal,
      activeAmount,
      sleepAmount,
      sleepRatio: exchTotal ? Number(((sleepAmount / exchTotal) * 100).toFixed(1)) : 0,
      sleepUsers,
      activeUsers: n - sleepUsers,
      shownCount: n,
      userCount,
      sleepIdleDays: idleDays,
      change30: Number((sleepRatios[29] - sleepRatios[0]).toFixed(1)),
      change30Amount: Number((sleepAmounts[29] - sleepAmounts[0]).toFixed(1)),
      lastPrice: px.lastPrice,
      lastPriceLabel: fmtPxValue(px.lastPrice, px.digits),
      avgCost: weightedAvg,
      avgCostLabel: fmtPxValue(weightedAvg, px.digits),
      medianCost,
      medianCostLabel: fmtPxValue(medianCost, px.digits),
      digits: px.digits,
      devPct: px.devPct,
      denseName: denseBand?.name || '--',
      densePct: denseBand?.ofTotal || 0,
      denseUsers: denseBand?.users || 0,
      mostUsersName: mostUsersBand?.name || '--',
      mostUsers: mostUsersBand?.users || 0,
      mostUsersPct: mostUsersBand?.ofTotal || 0,
      profitAmount,
      profitPct: exchTotal ? Number(((profitAmount / exchTotal) * 100).toFixed(1)) : 0,
      profitUsers: profitRows.length,
      lossAmount,
      lossPct: exchTotal ? Number(((lossAmount / exchTotal) * 100).toFixed(1)) : 0,
      lossUsers: lossRows.length,
      lastBandName: lastBand?.name || '',
      avgBandName: avgBand?.name || ''
    },
    rows,
    concentration,
    costBands,
    pnlBuckets,
    costDist: {
      labels: costBands.map((item) => item.name),
      values: costBands.map((item) => item.amount)
    },
    idleDist,
    history: {
      dates,
      sleepAmounts,
      activeAmounts,
      sleepRatios
    }
  }
}

export function generateMockAccounts(pair) {
  const types = ['手动高手', '量化CTA', '恶意高频套利', '资金费率套利', '其他']
  const pairSeed = pair === 'VBT/USDT' ? 1 : 2
  const accounts = []
  for (let i = 0; i < 20; i++) {
    const type = types[(i + pairSeed) % types.length]
    accounts.push({
      id: `ACC${1000 + i + pairSeed * 100}`,
      type,
      winDaysRatio: 40 + ((i * 7 + pairSeed * 3) % 40),
      singleGainRatio: Number((10 + ((i * 5.3 + pairSeed) % 35)).toFixed(1)),
      maxDrawdown: Number((10 + ((i * 4.1 + pairSeed * 2) % 35)).toFixed(1)),
      recoveryDays: 1 + ((i + pairSeed) % 12),
      totalTrades: 50 + ((i * 11 + pairSeed * 9) % 150),
      activeDays: 15 + ((i * 3 + pairSeed) % 30)
    })
  }
  return accounts
}

export function generateExternalChips(pair, excludedConfig = [], sleepIdleDays = 30) {
  const d = getPairData(pair)
  const currentPct = Number(d.external)
  const pairSeed = pair === 'VBT/USDT' ? 1 : 2
  const hex = '0123456789abcdef'
  const sources = [
    { name: '未知链上地址', tag: { label: '未知', className: 'warning' } },
    { name: '跨链桥', tag: { label: '桥', className: 'user' } },
    { name: 'OTC柜台', tag: { label: 'OTC', className: 'alert' } },
    { name: '外部做市', tag: { label: '做市', className: 'robot' } }
  ]
  const typeMeta = {
    hot_wallet: { label: '交易所热钱包', className: 'robot' },
    lock_contract: { label: '合约锁仓', className: 'warning' },
    other: { label: '其他', className: 'user' }
  }

  function makeFullAddress(index) {
    let body = ''
    for (let k = 0; k < 40; k++) {
      body += hex[(index * 19 + k * 7 + pairSeed * 11 + k * k) % 16]
    }
    return `0x${body}`
  }

  function amountForAddress(address) {
    let hash = 0
    const text = String(address || '')
    for (let i = 0; i < text.length; i++) hash = (hash * 33 + text.charCodeAt(i)) % 9973
    return Number((120 + (hash % 860) / 10 + pairSeed * 18).toFixed(1))
  }

  function matchAddr(a, b) {
    const x = (a || '').trim().toLowerCase()
    const y = (b || '').trim().toLowerCase()
    if (!x || !y) return false
    if (x === y) return true
    const split = (value) => (value.includes('...') ? value.split('...') : null)
    const xp = split(x)
    const yp = split(y)
    if (xp && yp) return xp[0] === yp[0] && xp[1] === yp[1]
    if (xp) return y.startsWith(xp[0]) && y.endsWith(xp[1])
    if (yp) return x.startsWith(yp[0]) && x.endsWith(yp[1])
    return false
  }

  function shortAddr(addr) {
    const value = String(addr || '')
    if (!value.startsWith('0x') || value.length <= 12) return value
    return `${value.slice(0, 8)}...${value.slice(-4)}`
  }

  const end = new Date('2026-08-27T00:00:00')
  const dates = []
  const dateKeys = []
  const percents = []
  const amounts = []
  let pct = currentPct - 3.6
  for (let i = 0; i < 30; i++) {
    const day = new Date(end)
    day.setDate(end.getDate() - (29 - i))
    const mm = String(day.getMonth() + 1).padStart(2, '0')
    const dd = String(day.getDate()).padStart(2, '0')
    dates.push(`${mm}/${dd}`)
    dateKeys.push(`${day.getFullYear()}-${mm}-${dd}`)
    const wave = Math.sin((i + pairSeed) / 4) * 1.4
    const step = ((i * 7 + pairSeed * 13) % 9 - 4) * 0.12
    pct = Math.max(12, Math.min(48, pct + step + wave * 0.08))
    if (i === 29) pct = currentPct
    percents.push(Number(pct.toFixed(1)))
    amounts.push(Math.round(620 + pct * 32 + ((i * 17 + pairSeed * 9) % 90)))
  }

  const pool = []
  const idleDays = Number(sleepIdleDays) > 0 ? Number(sleepIdleDays) : 30
  for (let i = 0; i < 30; i++) {
    const src = sources[i % sources.length]
    const amount = Number((210 - i * 5.4 + pairSeed * 4 + ((i * 13) % 19)).toFixed(1))
    const net30d = Number((((i * 11 + pairSeed * 7) % 46) - 20).toFixed(1))
    const sleepDays = (i * 3 + pairSeed * 2 + 1) % 42
    const status = sleepDays <= 2 ? '苏醒' : sleepDays >= idleDays ? '沉睡' : '监控中'
    pool.push({
      address: makeFullAddress(i),
      amount,
      source: src.name,
      tag: src.tag,
      net30d,
      lastActive: sleepDays === 0 ? '今日' : sleepDays === 1 ? '昨日' : `${sleepDays}天前`,
      sleepDays,
      status,
      statusTag: status === '苏醒' ? 'alert' : status === '沉睡' ? 'user' : 'warning'
    })
  }
  pool.sort((a, b) => b.amount - a.amount)

  const excludeList = Array.isArray(excludedConfig) ? excludedConfig : []
  const counted = pool.filter((item) => !excludeList.some((ex) => matchAddr(ex.address, item.address)))
  const excluded = excludeList.map((cfg) => {
    const hit = pool.find((item) => matchAddr(item.address, cfg.address))
    const type = cfg.type || 'other'
    const meta = typeMeta[type] || typeMeta.other
    return {
      address: hit?.address || cfg.address,
      type,
      typeLabel: meta.label,
      tag: meta,
      remark: cfg.remark || '',
      amount: hit ? hit.amount : amountForAddress(cfg.address),
      lastActive: hit?.lastActive || '今日'
    }
  })

  const countedTotal = counted.reduce((sum, item) => sum + item.amount, 0)
  const excludedTotal = excluded.reduce((sum, item) => sum + item.amount, 0)
  const allTotal = countedTotal + excludedTotal || 1
  const factor = countedTotal / allTotal

  counted.forEach((item) => {
    item.ratio = countedTotal ? ((item.amount / countedTotal) * 100).toFixed(1) : '0.0'
  })
  excluded.forEach((item) => {
    item.ratio = ((item.amount / allTotal) * 100).toFixed(1)
  })

  const scaledPercents = percents.map((value) => Number((value * factor).toFixed(1)))
  const scaledAmounts = amounts.map((value) => Math.round(value * factor))
  const sourcePie = sources.map((src) => ({
    name: src.name,
    value: Number(counted.filter((item) => item.source === src.name).reduce((sum, item) => sum + item.amount, 0).toFixed(1))
  })).filter((item) => item.value > 0)

  const sleepAmt = counted.filter((item) => item.sleepDays >= idleDays).reduce((sum, item) => sum + item.amount, 0)
  const top10Amt = counted.slice(0, 10).reduce((sum, item) => sum + item.amount, 0)
  const net7 = Number(counted.slice(0, 14).reduce((sum, item) => sum + item.net30d, 0).toFixed(0))
  const change30 = Number((scaledPercents[29] - scaledPercents[0]).toFixed(1))
  const peak = Math.max(...scaledPercents)
  const peakIndex = scaledPercents.indexOf(peak)
  const change30Amount = Number((scaledAmounts[29] - scaledAmounts[0]).toFixed(1))

  const alerts = counted
    .filter((item) => item.status === '苏醒' || item.net30d >= 12)
    .slice(0, 6)
    .map((item) => ({
      time: item.lastActive,
      address: item.address,
      type: item.status === '苏醒' ? '沉睡地址苏醒' : '大额净流入',
      detail: item.status === '苏醒'
        ? `沉睡后转账，当前持仓 ${item.amount}万`
        : `近30日净流入 ${item.net30d}万`,
      status: item.status === '苏醒' ? '高优先' : '监控中',
      statusTag: item.status === '苏醒' ? 'alert' : 'warning'
    }))

  const days = dates.map((label, i) => {
    const dayScale = (scaledAmounts[i] || 1) / (scaledAmounts[29] || 1)
    const rows = counted.map((item, idx) => {
      const wobble = 0.86 + ((i * 5 + idx * 11 + pairSeed) % 13) / 40
      const amount = Number(Math.max(0.3, item.amount * dayScale * wobble).toFixed(1))
      const net1d = Number((((i * 7 + idx * 13 + pairSeed * 3) % 23) - 11).toFixed(1))
      return {
        address: item.address,
        source: item.source,
        tag: item.tag,
        amount,
        net1d,
        status: item.status,
        statusTag: item.statusTag
      }
    }).sort((a, b) => b.amount - a.amount)
    const total = rows.reduce((sum, row) => sum + row.amount, 0) || 1
    rows.forEach((row) => {
      row.ratio = ((row.amount / total) * 100).toFixed(1)
    })
    const sourcePieForDay = sources.map((src) => ({
      name: src.name,
      value: Number(rows.filter((row) => row.source === src.name).reduce((sum, row) => sum + row.amount, 0).toFixed(1))
    })).filter((item) => item.value > 0)
    const prevPct = i > 0 ? scaledPercents[i - 1] : scaledPercents[i]
    const prevAmount = i > 0 ? scaledAmounts[i - 1] : scaledAmounts[i]
    return {
      date: label,
      dateKey: dateKeys[i],
      pct: scaledPercents[i],
      amount: scaledAmounts[i],
      prevPct,
      prevAmount,
      changePct: Number((scaledPercents[i] - prevPct).toFixed(1)),
      changeAmount: Number((scaledAmounts[i] - prevAmount).toFixed(1)),
      vsNowPct: Number((scaledPercents[i] - scaledPercents[29]).toFixed(1)),
      vsNowAmount: Number((scaledAmounts[i] - scaledAmounts[29]).toFixed(1)),
      sourcePie: sourcePieForDay,
      top10: rows.slice(0, 10).map((row) => ({ name: shortAddr(row.address), value: row.amount, address: row.address })),
      addresses: rows,
      flows: rows.filter((row) => Math.abs(row.net1d) >= 5).slice(0, 8)
    }
  })

  return {
    kpis: {
      grossPct: percents[29],
      grossAmount: Number(allTotal.toFixed(1)),
      currentPct: scaledPercents[29],
      currentAmount: Number(countedTotal.toFixed(1)),
      currentSub: `已排除 ${excluded.length} 个地址`,
      change30,
      change30Amount,
      peak,
      peakAmount: scaledAmounts[peakIndex] ?? scaledAmounts[scaledAmounts.length - 1],
      sleepRatio: countedTotal ? Math.round((sleepAmt / countedTotal) * 100) : 0,
      sleepAmount: Number(sleepAmt.toFixed(1)),
      sleepIdleDays: idleDays,
      top10Ratio: countedTotal ? Math.round((top10Amt / countedTotal) * 100) : 0,
      top10Amount: Number(top10Amt.toFixed(1)),
      net7,
      awakeCount: counted.filter((item) => item.status === '苏醒').length,
      excludedTotal: Number(excludedTotal.toFixed(1)),
      excludedRatio: Number(((excludedTotal / allTotal) * 100).toFixed(1)),
      excludedCount: excluded.length
    },
    history: { dates, dateKeys, percents: scaledPercents, amounts: scaledAmounts, days },
    addresses: counted,
    excluded,
    sourcePie,
    top10: counted.slice(0, 10).map((item) => ({ name: shortAddr(item.address), value: item.amount, address: item.address })),
    alerts
  }
}

export function generateInternalChips(pair, accountsConfig = []) {
  const d = getPairData(pair)
  const pairSeed = pair === 'VBT/USDT' ? 1 : 2
  const externalPct = Number(d.external)
  const typeMeta = Object.fromEntries(INTERNAL_ACCOUNT_TYPES.map((item) => [item.value, item]))
  const source = Array.isArray(accountsConfig) ? accountsConfig : DEFAULT_CONFIG.internalAccounts
  const configured = source.map((item) => ({
    uid: String(item.uid || '').trim(),
    type: typeMeta[item.type] ? item.type : 'staff',
    remark: String(item.remark || '').trim()
  })).filter((item) => item.uid)

  const hasMm = configured.some((item) => item.type === 'mm')
  const hasOwned = configured.some((item) => item.type !== 'mm')
  const fullInternal = Number((100 - externalPct).toFixed(1))
  const robotInv = hasMm ? Number(d.robotInv) : 0
  const ownedPct = hasOwned ? Number((hasMm ? Math.max(0, fullInternal - robotInv) : fullInternal).toFixed(1)) : 0
  const internalPct = Number((ownedPct + robotInv).toFixed(1))
  const ownedShare = { treasury: 0.40, project: 0.32, staff: 0.12, lp: 0.16 }
  const presentOwned = ['treasury', 'project', 'staff', 'lp'].filter((key) => configured.some((item) => item.type === key))
  const shareSum = presentOwned.reduce((sum, key) => sum + ownedShare[key], 0) || 1
  const typePct = {
    mm: robotInv,
    treasury: 0,
    project: 0,
    staff: 0,
    lp: 0
  }
  presentOwned.forEach((key) => {
    typePct[key] = Number((ownedPct * ownedShare[key] / shareSum).toFixed(1))
  })
  const treasury = typePct.treasury
  const targetLow = 40
  const targetHigh = 60
  const bandStatus = !hasMm ? '未配置机器人' : robotInv < targetLow ? '库存偏低' : robotInv > targetHigh ? '库存偏高' : '安全区间'
  const floatSupply = Number(String(d.floatSupply).replace(/,/g, '')) || 1500
  const internalAmount = Number((floatSupply * internalPct / 100).toFixed(1))
  const ownedAmount = Number((floatSupply * ownedPct / 100).toFixed(1))
  const borrowedAmount = Number((floatSupply * robotInv / 100).toFixed(1))

  function hashUid(uid) {
    let hash = pairSeed * 17
    const text = String(uid)
    for (let i = 0; i < text.length; i++) hash = (hash * 33 + text.charCodeAt(i)) % 9973
    return hash
  }

  function distribute(total, items) {
    if (!items.length) return []
    if (!(total > 0)) return items.map((item) => ({ ...item, amount: 0 }))
    const weights = items.map((item) => 8 + (hashUid(item.uid) % 25))
    const sum = weights.reduce((acc, value) => acc + value, 0) || 1
    return items.map((item, index) => ({
      ...item,
      amount: Number((total * weights[index] / sum).toFixed(1))
    }))
  }

  const statusByType = {
    mm: ['运行中', '待命'],
    treasury: ['锁定', '可用'],
    project: ['锁仓中', '发放中'],
    staff: ['锁仓中', '归属中'],
    lp: ['提供中', '待命']
  }
  const statusTagByType = {
    mm: 'alert',
    treasury: 'user',
    project: 'warning',
    staff: 'robot',
    lp: 'success'
  }

  const end = new Date('2026-08-27T00:00:00')
  const dates = []
  const percents = []
  const amounts = []
  const inventory = []
  const ownedPercents = []
  const ownedAmounts = []
  const borrowedAmounts = []
  let pct = internalPct - 2.4
  let inv = robotInv - 3.2
  for (let i = 0; i < 30; i++) {
    const day = new Date(end)
    day.setDate(end.getDate() - (29 - i))
    const mm = String(day.getMonth() + 1).padStart(2, '0')
    const dd = String(day.getDate()).padStart(2, '0')
    dates.push(`${mm}/${dd}`)
    const wave = Math.sin((i + pairSeed) / 5) * 0.9
    const step = ((i * 5 + pairSeed * 11) % 7 - 3) * 0.08
    pct = Math.max(52, Math.min(92, pct + step + wave * 0.06))
    inv = Math.max(28, Math.min(68, inv + ((i * 3 + pairSeed) % 5 - 2) * 0.18 + wave * 0.12))
    if (i === 29) {
      pct = internalPct
      inv = robotInv
    }
    const owned = Number(Math.max(0, pct - inv).toFixed(1))
    percents.push(Number(pct.toFixed(1)))
    inventory.push(Number(inv.toFixed(1)))
    amounts.push(Number((floatSupply * pct / 100).toFixed(0)))
    ownedPercents.push(owned)
    ownedAmounts.push(Number((floatSupply * owned / 100).toFixed(0)))
    borrowedAmounts.push(Number((floatSupply * inv / 100).toFixed(0)))
  }

  const types = INTERNAL_ACCOUNT_TYPES.map((item) => ({
    key: item.value,
    name: item.value === 'mm' ? '做市账户' : item.label,
    tag: { label: item.value === 'mm' ? '含虚增' : '自有', className: item.borrowed ? 'alert' : item.value === 'treasury' ? 'user' : item.value === 'project' ? 'warning' : item.value === 'staff' ? 'robot' : 'success' },
    pct: typePct[item.value] || 0,
    borrowed: item.borrowed
  }))
  const composition = types.map((item) => ({
    name: item.name,
    value: Number((floatSupply * item.pct / 100).toFixed(1))
  })).filter((item) => item.value > 0)

  const typeIndex = {}
  const accounts = configured.flatMap((item) => {
    const meta = typeMeta[item.type] || typeMeta.staff
    const typeRow = types.find((row) => row.key === item.type) || types[3]
    const group = configured.filter((row) => row.type === item.type)
    const totalAmt = Number((floatSupply * (typePct[item.type] || 0) / 100).toFixed(1))
    if (!typeIndex[item.type]) {
      typeIndex[item.type] = distribute(totalAmt, group)
    }
    const found = typeIndex[item.type].find((row) => row.uid === item.uid)
    const idx = group.findIndex((row) => row.uid === item.uid)
    const statuses = statusByType[item.type] || ['监控中']
    const daysAgo = hashUid(item.uid) % 18
    return [{
      id: item.uid,
      uid: item.uid,
      name: item.remark || `UID ${item.uid}`,
      remark: item.remark,
      type: meta.label,
      typeKey: item.type,
      tag: typeRow.tag,
      borrowed: !!meta.borrowed,
      amount: found?.amount || 0,
      cost: Number((0.72 + (hashUid(item.uid) % 28) / 100).toFixed(2)),
      status: statuses[idx % statuses.length],
      statusTag: idx === 0 && item.type === 'treasury' ? 'user' : statusTagByType[item.type] || 'user',
      lastMove: daysAgo === 0 ? '今日 10:12' : daysAgo === 1 ? '昨日 21:40' : `${daysAgo}天前`
    }]
  }).map((row) => {
    const ratio = internalAmount ? Number(((row.amount / internalAmount) * 100).toFixed(1)) : 0
    const pnl = Number((row.amount * (1.00 - row.cost)).toFixed(1))
    return { ...row, ratio, pnl }
  })

  const rebalance = [
    { time: '08/27 10:12', from: 'MM-01 做市主账户', to: 'TRE-02 运营周转', amount: Number((18 + pairSeed * 3).toFixed(1)), reason: '做市库存偏高，把自有部分抽回金库', tag: 'user' },
    { time: '08/26 21:40', from: 'TRE-02 运营周转', to: 'MM-02 做市备用', amount: Number((12 + pairSeed * 2).toFixed(1)), reason: '夜盘挂价，从金库补做市自有库存', tag: 'robot' },
    { time: '08/25 14:08', from: 'PRJ-02 生态激励', to: 'LP-01 现货底池', amount: Number((8 + pairSeed).toFixed(1)), reason: '激励未发放部分回流底池', tag: 'success' },
    { time: '08/24 09:33', from: 'MM-01 做市主账户', to: 'LP-02 应急流动性', amount: Number((6.5 + pairSeed * 0.8).toFixed(1)), reason: '盘口变薄，预置应急流动性', tag: 'warning' },
    { time: '08/22 18:16', from: 'TRE-01 平台金库', to: 'MM-01 做市主账户', amount: Number((22 + pairSeed * 4).toFixed(1)), reason: '连续吃单后库存跌破安全带', tag: 'alert' },
    { time: '08/20 11:02', from: 'STF-02 顾问归属', to: 'TRE-01 平台金库', amount: Number((3.2 + pairSeed * 0.4).toFixed(1)), reason: '顾问份额到期，回收待归属', tag: 'user' }
  ]

  const borrowedShare = internalPct ? Math.round((robotInv / internalPct) * 100) : 0
  const change30 = Number((percents[29] - percents[0]).toFixed(1))
  const ownedChange30 = Number((ownedPercents[29] - ownedPercents[0]).toFixed(1))
  const invChange30 = Number((inventory[29] - inventory[0]).toFixed(1))
  const lockedAmt = accounts.filter((row) => !row.borrowed && String(row.status).includes('锁')).reduce((sum, row) => sum + row.amount, 0)
  const lockedRatio = ownedAmount ? Math.round((lockedAmt / ownedAmount) * 100) : 0
  const desk = generateDashboardDesk(pair, source)
  const dumpable = Number(desk.mm?.tokenInv) || borrowedAmount
  const ownUsdt = Number(desk.mm?.cashU) || 0
  const tokenOwn = Number(desk.mm?.tokenOwn) || 0
  const tokenBorrowed = Number(desk.mm?.tokenBorrowed) || 0
  const cashTrueU = Number(desk.mm?.cashTrueU) || Number(desk.mm?.cashOwnU) || 0
  const cashBorrowedU = Number(desk.mm?.cashBorrowedU) || 0

  return {
    kpis: {
      internalPct,
      internalAmount,
      internalSub: `做市 ${robotInv}% · 金库等 ${ownedPct}%`,
      ownedPct,
      ownedAmount,
      ownedSub: '金库 / 项目方 / 员工 / LP · 不直接用来买入卖出',
      dumpable,
      ownUsdt,
      tokenOwn,
      tokenBorrowed,
      cashTrueU,
      cashOwnU: cashTrueU,
      cashBorrowedU,
      tokenBorrowPct: desk.mm?.tokenBorrowPct || 0,
      cashBorrowPct: desk.mm?.cashBorrowPct || 0,
      robotInv,
      robotInvSub: bandStatus,
      borrowedAmount,
      borrowedShare,
      treasury,
      treasuryAmount: Number((floatSupply * treasury / 100).toFixed(1)),
      treasurySub: '自有可调度储备',
      change30,
      ownedChange30,
      ownedChange30Amount: Number((ownedAmounts[29] - ownedAmounts[0]).toFixed(1)),
      peak: Math.max(...percents),
      lockedRatio,
      lockedAmount: Number(lockedAmt.toFixed(1)),
      accountCount: accounts.length,
      ownedAccountCount: accounts.filter((row) => !row.borrowed).length,
      invChange30,
      invChange30Amount: Number((borrowedAmounts[29] - borrowedAmounts[0]).toFixed(1)),
      targetLow,
      targetHigh,
      bandStatus
    },
    history: { dates, percents, amounts, inventory, ownedPercents, ownedAmounts, borrowedAmounts },
    composition,
    accounts,
    rebalance
  }
}

export function generateAddressDetail(pair, address) {
  const d = getPairData(pair)
  const pairSeed = pair === 'VBT/USDT' ? 1 : 2
  const hex = '0123456789abcdef'
  const token = String(pair || '').split('/')[0] || 'TOKEN'
  const full = String(address || '').trim()
  let seed = pairSeed * 17
  for (let i = 0; i < full.length; i++) seed = (seed * 33 + full.charCodeAt(i)) % 9973

  function makeAddr(index) {
    let body = ''
    for (let k = 0; k < 40; k++) {
      body += hex[(index * 23 + k * 9 + seed + k * k) % 16]
    }
    return `0x${body}`
  }

  function makeHash(index) {
    let body = ''
    for (let k = 0; k < 64; k++) {
      body += hex[(index * 29 + k * 5 + seed * 3 + k) % 16]
    }
    return `0x${body}`
  }

  const currentAmt = Number((48 + (seed % 520) / 2 + pairSeed * 6).toFixed(1))
  const currentPct = Number((Number(d.external) * (0.03 + (seed % 50) / 800)).toFixed(2))
  const end = new Date('2026-08-27T00:00:00')
  const dates = []
  const amounts = []
  const percents = []
  const inflows = []
  const outflows = []
  let amt = currentAmt * 0.72
  for (let i = 0; i < 30; i++) {
    const day = new Date(end)
    day.setDate(end.getDate() - (29 - i))
    const mm = String(day.getMonth() + 1).padStart(2, '0')
    const dd = String(day.getDate()).padStart(2, '0')
    dates.push(`${mm}/${dd}`)
    const inflow = Number((Math.abs(Math.sin((i + seed) / 4)) * (6 + (i * 3 + seed) % 18)).toFixed(1))
    const outflow = Number((Math.abs(Math.cos((i + seed) / 5)) * (4 + (i * 5 + seed) % 14)).toFixed(1))
    amt = Math.max(4, amt + inflow - outflow)
    if (i === 29) amt = currentAmt
    amounts.push(Number(amt.toFixed(1)))
    percents.push(Number((currentPct * amt / currentAmt).toFixed(2)))
    inflows.push(inflow)
    outflows.push(outflow)
  }

  const types = [
    { type: '转入', tag: 'alert' },
    { type: '转出', tag: 'user' },
    { type: '合约交互', tag: 'warning' }
  ]
  const txs = []
  for (let i = 0; i < 22; i++) {
    const meta = types[i % types.length]
    const day = new Date(end)
    day.setDate(end.getDate() - (i % 28))
    const hh = String(8 + (i * 3) % 14).padStart(2, '0')
    const min = String((i * 7) % 60).padStart(2, '0')
    const amount = Number((3.2 + ((i * 11 + seed) % 86) / 2).toFixed(1))
    txs.push({
      time: `${String(day.getMonth() + 1).padStart(2, '0')}/${String(day.getDate()).padStart(2, '0')} ${hh}:${min}`,
      type: meta.type,
      tag: meta.tag,
      counterparty: makeAddr(i + 3),
      amount: meta.type === '转出' ? -amount : amount,
      hash: makeHash(i + 1),
      status: i % 9 === 0 ? '确认中' : '已确认',
      statusTag: i % 9 === 0 ? 'warning' : 'success'
    })
  }

  const change30 = Number((percents[29] - percents[0]).toFixed(2))
  const change30Amount = Number((amounts[29] - amounts[0]).toFixed(1))
  const net30 = Number((inflows.reduce((s, v) => s + v, 0) - outflows.reduce((s, v) => s + v, 0)).toFixed(1))

  return {
    address: full,
    token,
    pair,
    kpis: {
      amount: currentAmt,
      pct: currentPct,
      change30,
      change30Amount,
      net30,
      txCount: txs.length,
      lastActive: txs[0]?.time || '—'
    },
    history: { dates, amounts, percents, inflows, outflows },
    txs
  }
}

function mmBorrowRatios(pairSeed) {
  return {
    tokenBorrowPct: Number((34 + pairSeed * 4).toFixed(1)),
    cashBorrowPct: Number((26 + pairSeed * 3).toFixed(1))
  }
}

function splitMmTokens(tokenInv, pairSeed) {
  const { tokenBorrowPct } = mmBorrowRatios(pairSeed)
  const inv = Number(tokenInv) || 0
  const tokenBorrowed = Number((inv * tokenBorrowPct / 100).toFixed(1))
  const tokenOwn = Number((inv - tokenBorrowed).toFixed(1))
  return { tokenBorrowPct, tokenBorrowed, tokenOwn }
}

function mmAccountCash(tokenU, pairSeed, tradePnlU) {
  const { cashBorrowPct } = mmBorrowRatios(pairSeed)
  const tv = Number(tokenU) || 0
  const cashBorrowedU = Number((Math.max(0, tv) * cashBorrowPct / 100).toFixed(1))
  const startTrue = Number((tv * (pairSeed === 1 ? 0.16 : -0.14)).toFixed(1))
  const cashTrueU = Number((startTrue + Number(tradePnlU || 0)).toFixed(1))
  const cashU = Number((cashTrueU + cashBorrowedU).toFixed(1))
  return { cashTrueU, cashBorrowedU, cashU, cashBorrowPct }
}

function mmSessionPrices(pair, pairSeed, lastPrice) {
  const avgBuy = fmtDeskPrice(lastPrice * (1 - (7 + pairSeed) / 10000))
  const avgSell = fmtDeskPrice(lastPrice * (1 + (6 + pairSeed) / 10000))
  const spreadBps = lastPrice
    ? Number((((avgSell - avgBuy) / lastPrice) * 10000).toFixed(1))
    : 0
  return { avgBuy, avgSell, spreadBps }
}

function toPnlU(qty, deltaPrice) {
  return Number((qty * deltaPrice / 10000).toFixed(1))
}

function calcMmTradingPnl(buyQty, sellQty, avgBuy, avgSell, lastPrice) {
  const buy = Number(buyQty) || 0
  const sell = Number(sellQty) || 0
  const matched = Number(Math.min(buy, sell).toFixed(1))
  const netQty = Number((buy - sell).toFixed(1))
  const realizedU = toPnlU(matched, avgSell - avgBuy)
  const markCost = netQty >= 0 ? avgBuy : avgSell
  const floatU = toPnlU(netQty, lastPrice - markCost)
  const totalU = Number((realizedU + floatU).toFixed(1))
  return { matched, netQty, realizedU, floatU, totalU }
}

function pairSeedOfName(pair) {
  return pair === 'VBT/USDT' ? 1 : 2
}

function fmtDeskPrice(price) {
  const n = Number(price)
  if (Number.isNaN(n)) return 0
  if (Math.abs(n) >= 1000) return Number(n.toFixed(2))
  if (Math.abs(n) >= 1) return Number(n.toFixed(4))
  return Number(n.toFixed(6))
}

function generateUserPriceFlow({ lastPrice, avgBuy, avgSell, realBuy, realSell, pairSeed = 1 }) {
  const last = Number(lastPrice) || Number(avgBuy) || 1
  const buyPx = Number(avgBuy) || last
  const sellPx = Number(avgSell) || last
  const lo = Math.min(last, buyPx, sellPx) * 0.985
  const hi = Math.max(last, buyPx, sellPx) * 1.015
  const steps = 10
  const step = (hi - lo) / steps || last * 0.002
  const labels = []
  const prices = []
  const buyW = []
  const sellW = []
  for (let i = 0; i <= steps; i++) {
    const price = fmtDeskPrice(lo + step * i)
    prices.push(price)
    labels.push(String(price))
    const db = (price - buyPx) / step
    const ds = (price - sellPx) / step
    const noise = 0.1 + ((i * 7 + Number(pairSeed) * 3) % 5) * 0.05
    buyW.push(Math.exp(-0.45 * db * db) + noise)
    sellW.push(Math.exp(-0.45 * ds * ds) + noise * 0.85)
  }
  return {
    labels,
    prices,
    buy: scaleHourSeries(buyW, realBuy),
    sell: scaleHourSeries(sellW, realSell),
    lastPrice: fmtDeskPrice(last),
    avgBuy: fmtDeskPrice(buyPx),
    avgSell: fmtDeskPrice(sellPx)
  }
}

function priceDevPct(last, cost) {
  const a = Number(last)
  const b = Number(cost)
  if (!Number.isFinite(a) || !Number.isFinite(b) || !b) return 0
  return Number((((a - b) / b) * 100).toFixed(1))
}

function calcAvgNetPrice(usdtNet, netQty) {
  const usdt = Number(usdtNet)
  const qty = Number(netQty)
  if (!Number.isFinite(usdt) || !Number.isFinite(qty) || qty === 0) return null
  return fmtDeskPrice(usdt / qty)
}

function deskCalendarDay(index, full = 30) {
  const end = new Date(`${DESK_AS_OF}T00:00:00`)
  const day = new Date(end)
  day.setDate(end.getDate() - (full - 1 - index))
  const y = day.getFullYear()
  const m = String(day.getMonth() + 1).padStart(2, '0')
  const d = String(day.getDate()).padStart(2, '0')
  return { date: `${m}/${d}`, dateKey: `${y}-${m}-${d}` }
}

function buildMmPriceCostFlow({
  buyHour = [],
  sellHour = [],
  lastPrice,
  avgBuy,
  avgSell,
  tokenInv,
  tokenDelta,
  pairSeed = 1
}) {
  const n = Math.max(buyHour.length, sellHour.length)
  const last = Number(lastPrice) || 1
  const buyPxRatio = last ? Number(avgBuy || last) / last : 1
  const startInv = Math.max(1, Number(tokenInv || 0) - Number(tokenDelta || 0))
  let qty = startInv
  let cost = fmtDeskPrice(last * (0.968 + (Number(pairSeed) % 3) * 0.003))
  const maxFlow = Math.max(1, ...buyHour.map(Number), ...sellHour.map(Number))
  const lastHour = []
  const costHour = []
  const netHour = []

  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : 1
    const buy = Number(buyHour[i] || 0)
    const sell = Number(sellHour[i] || 0)
    const net = Number((buy - sell).toFixed(1))
    const wave = Math.sin((i + Number(pairSeed)) / 3.4) * 0.005
    const pressure = ((sell - buy) / maxFlow) * 0.007
    const openBias = (1 - t) * -0.011
    const px = i === n - 1 ? fmtDeskPrice(last) : fmtDeskPrice(last * (1 + openBias + wave + pressure))
    if (buy > 0 && qty + buy > 0) {
      const buyPx = fmtDeskPrice(px * buyPxRatio)
      cost = fmtDeskPrice((cost * qty + buy * buyPx) / (qty + buy))
      qty = Number((qty + buy).toFixed(1))
    }
    qty = Number(Math.max(0.1, qty - sell).toFixed(1))
    lastHour.push(px)
    costHour.push(cost)
    netHour.push(net)
  }

  return {
    lastHour,
    costHour,
    netHour,
    costNow: costHour.length ? costHour[costHour.length - 1] : fmtDeskPrice(cost)
  }
}

function scaleHourSeries(hours, target) {
  const list = Array.isArray(hours) ? hours : []
  const goal = Number(target) || 0
  const sum = list.reduce((acc, value) => acc + Number(value || 0), 0) || 1
  const out = list.map((value) => Number((Number(value || 0) / sum * goal).toFixed(1)))
  const got = Number(out.reduce((acc, value) => acc + value, 0).toFixed(1))
  const drift = Number((goal - got).toFixed(1))
  if (drift && out.length) {
    const idx = out.reduce((best, value, i) => (value >= out[best] ? i : best), 0)
    out[idx] = Number((out[idx] + drift).toFixed(1))
  }
  return out
}

function generateDumpFills({ pairSeed, sellQty, buyQty, avgSell, avgBuy, hours, sellHour, buyHour }) {
  const ids = ['104821', '106334', '108902', '111056', '113447', '115880', '118221', '120664', '122908', '125331']
  const tags = [
    { name: '散户', className: 'warning' },
    { name: '聪明钱', className: 'success' },
    { name: '羊毛党', className: 'alert' },
    { name: '程序化', className: 'robot' }
  ]
  const fills = []
  let seq = 0

  const pushSide = (side, hourLabel, hourQty, avgPrice, daySide) => {
    const qtyHour = Number(hourQty) || 0
    const day = Number(daySide) || 0
    if (qtyHour <= 0.05) return
    if (day && qtyHour < Math.max(0.3, day * 0.02)) return
    const n = day && qtyHour >= day * 0.08 ? 2 : 1
    let remain = qtyHour
    const hour = String(hourLabel || '00:00').slice(0, 2)
    for (let k = 0; k < n; k++) {
      const chunk = k === n - 1
        ? Number(remain.toFixed(2))
        : Number((qtyHour * (0.28 + ((seq + k) % 5) * 0.08)).toFixed(2))
      remain = Number((remain - chunk).toFixed(2))
      if (chunk <= 0) continue
      const jitter = 1 + (((seq * 7 + pairSeed + k) % 9) - 4) * 0.0018
      const price = fmtDeskPrice(Number(avgPrice) * jitter)
      const minute = String((seq * 11 + k * 17 + pairSeed) % 60).padStart(2, '0')
      const second = String((seq * 13 + k * 7 + pairSeed * 3) % 60).padStart(2, '0')
      const uid = ids[(seq + k + pairSeed) % ids.length]
      const tag = tags[(seq + k + (side === '卖出' ? 0 : 1)) % tags.length]
      fills.push({
        time: `${hour}:${minute}:${second}`,
        side,
        sideClass: side === '卖出' ? 'alert' : 'success',
        qty: chunk,
        price,
        usdt: Number((chunk * price).toFixed(2)),
        uid,
        tag: tag.name,
        tagClass: tag.className
      })
      seq += 1
    }
  }

  ;(hours || []).forEach((label, index) => {
    pushSide('卖出', label, sellHour?.[index] || 0, avgSell, sellQty)
    pushSide('买入', label, buyHour?.[index] || 0, avgBuy, buyQty)
  })

  const sellGot = Number(fills.filter((row) => row.side === '卖出').reduce((sum, row) => sum + row.qty, 0).toFixed(2))
  const buyGot = Number(fills.filter((row) => row.side === '买入').reduce((sum, row) => sum + row.qty, 0).toFixed(2))
  const sellDrift = Number(((Number(sellQty) || 0) - sellGot).toFixed(2))
  const buyDrift = Number(((Number(buyQty) || 0) - buyGot).toFixed(2))
  const lastSell = [...fills].reverse().find((row) => row.side === '卖出')
  const lastBuy = [...fills].reverse().find((row) => row.side === '买入')
  if (lastSell && sellDrift) {
    lastSell.qty = Number((lastSell.qty + sellDrift).toFixed(2))
    lastSell.usdt = Number((lastSell.qty * lastSell.price).toFixed(2))
  }
  if (lastBuy && buyDrift) {
    lastBuy.qty = Number((lastBuy.qty + buyDrift).toFixed(2))
    lastBuy.usdt = Number((lastBuy.qty * lastBuy.price).toFixed(2))
  }

  fills.sort((a, b) => (a.time < b.time ? 1 : a.time > b.time ? -1 : 0))
  return fills
}

function applyDumpDay(dump, pair, internalAccounts, dateKey) {
  const key = normalizeDeskDate(dateKey)
  const pairSeed = pairSeedOfName(pair)
  dump.dateKey = key
  dump.dateLabel = deskDateLabel(key)
  dump.dateTitle = deskDateTitle(key)
  dump.isToday = isDeskToday(key)

  const attachFills = () => {
    dump.fills = generateDumpFills({
      pairSeed,
      sellQty: dump.sellHigh,
      buyQty: dump.buyLow,
      avgSell: dump.avgSell,
      avgBuy: dump.avgBuy,
      hours: dump.hours,
      sellHour: dump.sellHour,
      buyHour: dump.buyHour
    })
    const realUsers = Math.max(1, Number(dump.realUsers) || 48)
    dump.sellUsers = Math.min(realUsers, Math.max(1, Math.round(realUsers * (0.54 + pairSeed * 0.02))))
    dump.buyUsers = Math.min(realUsers, Math.max(1, Math.round(realUsers * (0.49 + pairSeed * 0.015))))
    dump.sellFills = dump.sellUsers * (5 + (pairSeed % 4))
    dump.buyFills = dump.buyUsers * (4 + ((pairSeed + 1) % 4))
  }

  const attachFlow = () => {
    const flow = buildMmPriceCostFlow({
      buyHour: dump.buyHour,
      sellHour: dump.sellHour,
      lastPrice: dump.lastPrice,
      avgBuy: dump.avgBuy,
      avgSell: dump.avgSell,
      tokenInv: dump.dumpable,
      tokenDelta: dump.tokenDelta,
      pairSeed
    })
    dump.lastHour = flow.lastHour
    dump.costHour = flow.costHour
    dump.netHour = flow.netHour
    dump.invCost = flow.costNow
  }

  if (dump.isToday) {
    attachFills()
    attachFlow()
    return dump
  }

  const trade = generateTradeHistory(pair, 30, internalAccounts)
  const mmHist = generateMmHistory(pair, 30, internalAccounts)
  const day = (trade.rows || []).find((row) => row.dateKey === key)
  const mmDay = (mmHist.rows || []).find((row) => row.dateKey === key)
  if (!day) {
    dump.dateKey = DESK_AS_OF
    dump.dateLabel = deskDateLabel(DESK_AS_OF)
    dump.dateTitle = deskDateTitle(DESK_AS_OF)
    dump.isToday = true
    attachFills()
    attachFlow()
    return dump
  }

  const sellHigh = day.sellQty
  const buyLow = day.buyQty
  const lastPrice = day.lastPrice || fmtDeskPrice(Number(dump.lastPrice) * (1 + Math.sin(pairSeed + Number(key.slice(-2))) * 0.008))
  const tradePnl = calcMmTradingPnl(buyLow, sellHigh, day.avgBuy, day.avgSell, lastPrice)
  const sellScale = dump.sellHigh ? sellHigh / dump.sellHigh : 1
  const buyScale = dump.buyLow ? buyLow / dump.buyLow : 1

  dump.sellHigh = sellHigh
  dump.buyLow = buyLow
  dump.sold30 = sellHigh
  dump.boughtBack = buyLow
  dump.netDump30 = Number((sellHigh - buyLow).toFixed(1))
  dump.tokenDelta = day.tokenDelta
  dump.matched = tradePnl.matched
  dump.avgSell = day.avgSell
  dump.avgBuy = day.avgBuy
  dump.spreadPct = day.spreadPct
  dump.usdtIn30 = day.sellU
  dump.usdtOut30 = day.buyU
  dump.usdtNet30 = day.usdtNet
  dump.avgNetPrice = calcAvgNetPrice(day.usdtNet, day.tokenDelta)
  dump.lastPrice = lastPrice
  dump.realizedU = tradePnl.realizedU
  dump.floatU = tradePnl.floatU
  dump.totalU = tradePnl.totalU
  dump.sellHour = scaleHourSeries(dump.sellHour, sellHigh)
  dump.buyHour = scaleHourSeries(dump.buyHour, buyLow)
  dump.retailBuy = Number((dump.retailBuy * sellScale).toFixed(1))
  dump.retailSell = Number((dump.retailSell * buyScale).toFixed(1))
  dump.retailNet = Number((dump.retailBuy - dump.retailSell).toFixed(1))
  dump.smartBuy = Number((dump.smartBuy * sellScale).toFixed(1))
  dump.smartSell = Number((dump.smartSell * buyScale).toFixed(1))
  dump.smartNet = Number((dump.smartBuy - dump.smartSell).toFixed(1))
  dump.realBuy = Number((dump.realBuy * sellScale).toFixed(1))
  dump.realSell = Number((dump.realSell * buyScale).toFixed(1))
  dump.realNet = Number((dump.realBuy - dump.realSell).toFixed(1))

  if (mmDay) {
    dump.dumpable = mmDay.tokenInv
    dump.ownedAmt = mmDay.tokenInv
    dump.dumpableU = mmDay.tokenU
    dump.tokenOwn = mmDay.tokenOwn
    dump.tokenBorrowed = mmDay.tokenBorrowed
    dump.ownUsdt = mmDay.cashU
    dump.cashTrueU = mmDay.cashTrueU
    dump.cashOwnU = mmDay.cashTrueU
    dump.cashBorrowedU = mmDay.cashBorrowedU
  }

  attachFills()
  attachFlow()
  return dump
}

export function generateRobotStatus(pair, accountsConfig = [], robotConfig = null) {
  const d = getPairData(pair)
  const pairSeed = pairSeedOfName(pair)
  const price = Number(d.price) || 1
  const { avgBuy, avgSell, spreadBps } = mmSessionPrices(pair, pairSeed, price)
  const robotInv = Number(d.robotInv)
  const floatSupply = Number(String(d.floatSupply).replace(/,/g, '')) || 1500
  const borrowedAmount = Number((floatSupply * robotInv / 100).toFixed(1))
  const book = splitMmTokens(borrowedAmount, pairSeed)
  const source = Array.isArray(accountsConfig) ? accountsConfig : DEFAULT_CONFIG.internalAccounts
  const mmAccounts = source
    .map((item) => ({
      uid: String(item.uid || '').trim(),
      type: item.type,
      remark: String(item.remark || '').trim()
    }))
    .filter((item) => item.uid && item.type === 'mm')
  const robotCfg = syncRobotBots(cloneRobot(robotConfig), mmAccounts)
  const botByUid = new Map((robotCfg.bots || []).map((bot) => [bot.uid, bot]))

  function hashUid(uid) {
    let hash = pairSeed * 19
    const text = String(uid)
    for (let i = 0; i < text.length; i++) hash = (hash * 33 + text.charCodeAt(i)) % 9973
    return hash
  }

  const hours = []
  const inventory = []
  const buyVol = []
  const sellVol = []
  const pnl = []
  const spread = []
  let inv = robotInv - 2.4
  let accPnl = 0
  for (let i = 0; i < 24; i++) {
    hours.push(`${String(i).padStart(2, '0')}:00`)
    const wave = Math.sin((i + pairSeed) / 3.2) * 1.1
    inv = Math.max(26, Math.min(70, inv + ((i * 3 + pairSeed) % 5 - 2) * 0.22 + wave * 0.15))
    if (i === 23) inv = robotInv
    inventory.push(Number(inv.toFixed(1)))
    const buy = Number((18 + ((i * 7 + pairSeed * 5) % 16) + Math.max(0, 48 - inv) * 0.18).toFixed(1))
    const sell = Number((16 + ((i * 5 + pairSeed * 3) % 14) + Math.max(0, inv - 50) * 0.16).toFixed(1))
    buyVol.push(buy)
    sellVol.push(sell)
    accPnl = Number((accPnl + (buy - sell) * 0.08 + wave * 0.4).toFixed(1))
    pnl.push(accPnl)
    spread.push(Number((3.2 + ((i + pairSeed) % 7) * 0.28 + Math.abs(inv - 50) * 0.04).toFixed(1)))
  }

  const weights = mmAccounts.map((item) => 8 + (hashUid(item.uid) % 22))
  const weightSum = weights.reduce((sum, value) => sum + value, 0) || 1
  const robots = mmAccounts.map((item, index) => {
    const share = weights[index] / weightSum
    const amount = Number((borrowedAmount * share).toFixed(1))
    const bot = botByUid.get(item.uid) || { running: true, strategy: 'quote', wash: true }
    const running = robotCfg.enabled && bot.running !== false
    const online = running && (index === 0 || (hashUid(item.uid) % 7) !== 0)
    const buyFill = Number((120 + (hashUid(item.uid) % 80)).toFixed(1))
    const sellFill = Number((110 + (hashUid(`${item.uid}s`) % 75)).toFixed(1))
    const tradePnl = calcMmTradingPnl(buyFill, sellFill, avgBuy, avgSell, price)
    const latency = 12 + (hashUid(item.uid) % 18)
    const washOn = running && botWashOn(robotCfg, bot)
    const status = !running ? '已停止' : !online ? '离线' : (Math.abs(tradePnl.totalU) > 8 ? '告警' : '运行中')
    return {
      uid: item.uid,
      remark: item.remark || `做市账户 ${item.uid}`,
      role: index === 0 ? '主报价' : index === 1 ? '备用挂价' : '辅助档',
      strategy: bot.strategy || 'quote',
      strategyLabel: strategyLabel(bot.strategy || 'quote'),
      washOn,
      running,
      online,
      status,
      statusTag: !running || !online ? 'alert' : Math.abs(tradePnl.totalU) > 8 ? 'warning' : 'success',
      amount,
      tokenOwn: Number((book.tokenOwn * share).toFixed(1)),
      tokenBorrowed: Number((book.tokenBorrowed * share).toFixed(1)),
      ratio: borrowedAmount ? Number(((amount / borrowedAmount) * 100).toFixed(1)) : 0,
      buyFill,
      sellFill,
      dayPnl: tradePnl.totalU,
      realizedU: tradePnl.realizedU,
      floatU: tradePnl.floatU,
      spread: Number((3.4 + (hashUid(item.uid) % 12) / 10).toFixed(1)),
      cancelRate: Number((8 + (hashUid(item.uid) % 16)).toFixed(1)),
      quotes: 8 + (hashUid(item.uid) % 5),
      latency,
      heartbeat: !running ? '已停止' : online ? `${latency}ms · ${8 + (hashUid(item.uid) % 40)}秒前` : '失联'
    }
  })

  const onlineCount = robots.filter((row) => row.online).length
  const buyFill = robots.reduce((sum, row) => sum + row.buyFill, 0)
  const sellFill = robots.reduce((sum, row) => sum + row.sellFill, 0)
  const tradePnl = calcMmTradingPnl(buyFill, sellFill, avgBuy, avgSell, price)
  const turnover = Number((buyFill + sellFill).toFixed(1))
  const turnoverU = Number((turnover * price / 10000).toFixed(1))
  const bsRatio = sellFill ? Number((buyFill / sellFill).toFixed(2)) : 0
  const avgSpread = robots.length
    ? Number((robots.reduce((sum, row) => sum + row.spread, 0) / robots.length).toFixed(1))
    : spreadBps
  const cover = robots.length ? Number((92 + (pairSeed % 6) + onlineCount).toFixed(1)) : 0
  const bandStatus = robotInv < 40 ? '库存偏低' : robotInv > 60 ? '库存偏高' : '安全区间'
  const usedStrategies = [...new Set(robots.filter((row) => row.running).map((row) => row.strategy))]
  const quoteBits = usedStrategies.map((key) => {
    const pack = strategyPackOf(robotCfg, key)
    return `${strategyLabel(key)} bid ${orderSideCount(pack.order.bid)} / ask ${orderSideCount(pack.order.ask)}`
  })
  const washOnBots = robots.filter((row) => row.running && row.washOn)
  const washMs = usedStrategies.length
    ? strategyPackOf(robotCfg, usedStrategies[0]).wash.minIntervalMs
    : robotCfg.wash?.intervalMs
  const washText = washOnBots.length
    ? `自成交 ${washOnBots.length} UID · 间隔 ${washMs}ms`
    : '自成交关'

  const uid0 = robots[0]?.uid || '—'
  const uid1 = robots[1]?.uid || uid0
  const label0 = strategyLabel(robots[0]?.strategy)
  const pack0 = robots[0] ? strategyPackOf(robotCfg, robots[0].strategy) : null
  const bidCount = pack0 ? orderSideCount(pack0.order.bid) : 5
  const bidSpread = pack0?.quote?.bidSpread ?? 0.1
  const washMs0 = pack0?.wash?.minIntervalMs ?? washMs ?? 1000

  const events = [
    { time: '10:21:06', uid: uid0, type: '切换策略', detail: `做市报价 → ${label0}`, tag: 'robot' },
    { time: '10:08:44', uid: uid1, type: '调整挂单', detail: `Bid 档数 ${Math.max(1, bidCount - 1)} → ${bidCount} · 最小百分比 0.10→0.12`, tag: 'warning' },
    { time: '09:55:18', uid: uid0, type: '调整报价', detail: `买盘价差 ${Number((Number(bidSpread) + 0.02).toFixed(2))} → ${bidSpread}`, tag: 'robot' },
    { time: '09:40:02', uid: uid1, type: '调整自成交', detail: `最小成交间隔 ${Number(washMs0) + 200}ms → ${washMs0}ms`, tag: 'user' },
    { time: '09:22:51', uid: uid0, type: '切换策略', detail: `护盘托价 → ${label0}`, tag: 'success' },
    { time: '08:57:30', uid: uid1, type: '启停', detail: robots[1]?.running === false ? '停止运行' : '启动运行', tag: robots[1]?.running === false ? 'alert' : 'success' },
    { time: '08:31:14', uid: uid0, type: '开关自成交', detail: robots[0]?.washOn ? '自成交 关 → 开' : '自成交 开 → 关', tag: 'warning' }
  ]

  return {
    kpis: {
      robotCount: robots.length,
      onlineCount,
      robotInv,
      borrowedAmount,
      tokenOwn: book.tokenOwn,
      tokenBorrowed: book.tokenBorrowed,
      bandStatus,
      dayPnl: tradePnl.totalU,
      dayPnlU: tradePnl.totalU,
      realizedU: tradePnl.realizedU,
      floatU: tradePnl.floatU,
      matchedQty: tradePnl.matched,
      avgBuy,
      avgSell,
      turnover,
      turnoverU,
      bsRatio,
      avgSpread,
      cover
    },
    status: [
      { color: !robotCfg.enabled ? 'red' : onlineCount && onlineCount === robots.length ? 'green' : onlineCount ? 'yellow' : 'red', text: robots.length ? `${onlineCount}/${robots.length} 台做市在线` : '未配置做市账户 UID' },
      { color: bandStatus === '安全区间' ? 'green' : 'yellow', text: `做市库存 ${fmtQtyPlain(borrowedAmount)}万 · 自有 ${fmtQtyPlain(book.tokenOwn)} · 借入虚增 ${fmtQtyPlain(book.tokenBorrowed)} · ${bandStatus}` },
      { color: 'green', text: quoteBits.length ? `报价覆盖 ${cover}% · ${quoteBits.join(' · ')}` : `报价覆盖 ${cover}%` },
      { color: washOnBots.length ? 'yellow' : 'green', text: washText },
      { color: tradePnl.totalU >= 0 ? 'green' : 'yellow', text: `今日盈亏 ${tradePnl.totalU >= 0 ? '+' : ''}${tradePnl.totalU} 万USDT · 交易盈亏 ${tradePnl.realizedU >= 0 ? '+' : ''}${tradePnl.realizedU} · 浮盈 ${tradePnl.floatU >= 0 ? '+' : ''}${tradePnl.floatU}` }
    ],
    history: { hours, inventory, buyVol, sellVol, pnl, spread },
    robots,
    events
  }
}

export function generateDashboardDesk(pair, internalAccounts) {
  const robot = generateRobotStatus(pair, internalAccounts)
  const d = getPairData(pair)
  const pairSeed = pairSeedOfName(pair)
  const price = Number(d.price) || 1
  const buyQty = Number((robot.robots.reduce((sum, row) => sum + row.buyFill, 0) || (220 + pairSeed * 18)).toFixed(1))
  const sellQty = Number((robot.robots.reduce((sum, row) => sum + row.sellFill, 0) || (200 + pairSeed * 14)).toFixed(1))
  const { avgBuy, avgSell, spreadBps } = mmSessionPrices(pair, pairSeed, price)
  const tradePnl = calcMmTradingPnl(buyQty, sellQty, avgBuy, avgSell, price)
  const tokenInv = robot.kpis.borrowedAmount
  const toU = (qty) => Number((qty * price / 10000).toFixed(1))
  const tokenU = toU(tokenInv)
  const tokens = splitMmTokens(tokenInv, pairSeed)
  const cash = mmAccountCash(tokenU, pairSeed, tradePnl.totalU)
  const equityU = Number((cash.cashU + tokenU).toFixed(1))
  const holders = Number(String(d.holderBadge || '').replace(/\D/g, '')) || 128
  const realUsers = Math.min(holders, Math.round(holders * (0.38 + pairSeed * 0.05)) + ((pairSeed * 7) % 9))
  const realBuy = Number((sellQty * (0.91 + pairSeed * 0.01)).toFixed(1))
  const realSell = Number((buyQty * (0.89 + pairSeed * 0.01)).toFixed(1))
  const realNet = Number((realBuy - realSell).toFixed(1))
  const newTraders = Math.max(3, Math.round(realUsers * (0.06 + pairSeed * 0.01)))
  const tradedPct = Number((realUsers / Math.max(holders, 1) * 100).toFixed(1))
  const retailBuy = Number((realBuy * (0.62 - pairSeed * 0.02)).toFixed(1))
  const retailSell = Number((realSell * (0.64 - pairSeed * 0.01)).toFixed(1))
  const smartBuy = Number((realBuy * (0.12 + pairSeed * 0.01)).toFixed(1))
  const smartSell = Number((realSell * (0.10 + pairSeed * 0.01)).toFixed(1))
  const retailNet = Number((retailBuy - retailSell).toFixed(1))
  const smartNet = Number((smartBuy - smartSell).toFixed(1))
  const usdtNet = Number((toU(sellQty) - toU(buyQty)).toFixed(1))

  return {
    mm: {
      lastPrice: fmtDeskPrice(price),
      equityU,
      ...tokens,
      ...cash,
      cashOwnU: cash.cashTrueU,
      tokenInv,
      tokenU,
      online: `${robot.kpis.onlineCount}/${robot.kpis.robotCount || 0}`,
      buyQty,
      sellQty,
      buyU: toU(buyQty),
      sellU: toU(sellQty),
      netQty: tradePnl.netQty,
      matchedQty: tradePnl.matched,
      avgBuy,
      avgSell,
      spreadBps,
      spreadPct: avgBuy ? Number((((avgSell - avgBuy) / avgBuy) * 100).toFixed(2)) : 0,
      usdtNet,
      avgNetPrice: calcAvgNetPrice(usdtNet, tradePnl.netQty),
      realizedU: tradePnl.realizedU,
      floatU: tradePnl.floatU,
      totalU: tradePnl.totalU,
      bandStatus: robot.kpis.bandStatus
    },
    users: {
      realUsers,
      holders,
      tradedPct,
      realBuy,
      realSell,
      realBuyU: toU(realBuy),
      realSellU: toU(realSell),
      realNet,
      newTraders,
      retailBuy,
      retailSell,
      retailNet,
      smartBuy,
      smartSell,
      smartNet
    }
  }
}

export function generateMmToday(pair, internalAccounts) {
  const robot = generateRobotStatus(pair, internalAccounts)
  const desk = generateDashboardDesk(pair, internalAccounts)
  const mm = desk.mm
  const hours = robot.history.hours
  const buySum = robot.history.buyVol.reduce((sum, value) => sum + value, 0) || 1
  const sellSum = robot.history.sellVol.reduce((sum, value) => sum + value, 0) || 1
  const buyHour = robot.history.buyVol.map((value) => Number((value / buySum * mm.buyQty).toFixed(1)))
  const sellHour = robot.history.sellVol.map((value) => Number((value / sellSum * mm.sellQty).toFixed(1)))
  const invHour = robot.history.inventory.map((pct) => Number((pct / Math.max(robot.kpis.robotInv, 1) * mm.tokenInv).toFixed(1)))
  const realizedHour = []
  const floatHour = []
  const netHour = []
  let accBuy = 0
  let accSell = 0
  let accRealized = 0
  hours.forEach((_, index) => {
    accBuy += buyHour[index]
    accSell += sellHour[index]
    const slice = calcMmTradingPnl(buyHour[index], sellHour[index], mm.avgBuy, mm.avgSell, mm.lastPrice)
    accRealized = Number((accRealized + slice.realizedU).toFixed(1))
    const cum = calcMmTradingPnl(accBuy, accSell, mm.avgBuy, mm.avgSell, mm.lastPrice)
    realizedHour.push(accRealized)
    floatHour.push(cum.floatU)
    netHour.push(cum.netQty)
  })

  const accounts = robot.robots.map((row) => {
    const share = mm.equityU ? row.ratio / 100 : 0
    return {
      ...row,
      cashU: Number((mm.cashU * share).toFixed(1)),
      tokenU: Number((mm.tokenU * share).toFixed(1)),
      tokenOwn: Number((mm.tokenOwn * share).toFixed(1)),
      tokenBorrowed: Number((mm.tokenBorrowed * share).toFixed(1)),
      cashTrueU: Number((mm.cashTrueU * share).toFixed(1)),
      cashOwnU: Number((mm.cashTrueU * share).toFixed(1)),
      cashBorrowedU: Number((mm.cashBorrowedU * share).toFixed(1)),
      netQty: Number((row.buyFill - row.sellFill).toFixed(1))
    }
  })

  const users = generateUsersToday(pair, internalAccounts)
  const cashPct = mm.equityU ? Number((mm.cashU / mm.equityU * 100).toFixed(1)) : 0
  return {
    kpis: { ...mm, cashPct },
    status: [
      { color: robot.kpis.onlineCount && robot.kpis.onlineCount === robot.kpis.robotCount ? 'green' : robot.kpis.onlineCount ? 'yellow' : 'red', text: `做市在线 ${mm.online}` },
      { color: mm.bandStatus === '安全区间' ? 'green' : 'yellow', text: `做市库存 ${fmtQtyPlain(mm.tokenInv)}万 · 自有 ${fmtQtyPlain(mm.tokenOwn)} · 借入虚增 ${fmtQtyPlain(mm.tokenBorrowed)} · ${mm.bandStatus}` },
      { color: mm.totalU >= 0 ? 'green' : 'yellow', text: `今日盈亏 ${signedPlain(mm.totalU)}万USDT` },
      { color: 'green', text: `做市账户余额 ${signedPlain(mm.cashU)}万USDT = 真实 ${signedPlain(mm.cashTrueU)} + 借入 ${fmtQtyPlain(mm.cashBorrowedU)}` }
    ],
    history: { hours, buyHour, sellHour, invHour, realizedHour, floatHour, netHour, spread: robot.history.spread },
    accounts,
    traders: users.traders,
    capital: [
      { name: '现金', value: mm.cashU, color: '#6a9aff' },
      { name: '代币市值', value: mm.tokenU, color: '#ffb347' }
    ],
    book: [
      { name: '自有代币', value: mm.tokenOwn, color: '#4cd9a0' },
      { name: '借入虚增', value: mm.tokenBorrowed, color: '#ffb347' }
    ],
    cashBook: [
      { name: '真实余额', value: mm.cashTrueU, color: '#6a9aff' },
      { name: '借入金额', value: mm.cashBorrowedU, color: '#a78bfa' }
    ]
  }
}

const MM_HISTORY_SPLIT_KEYS = [
  'equityU', 'cashU', 'cashTrueU', 'cashOwnU', 'cashBorrowedU',
  'tokenU', 'tokenInv', 'tokenOwn', 'tokenBorrowed', 'buyQty', 'sellQty', 'realizedU'
]

function finishMmHistoryDay(row, out) {
  out.netQty = Number((Number(out.buyQty || 0) - Number(out.sellQty || 0)).toFixed(1))
  out.cashPct = out.equityU ? Number((out.cashU / out.equityU * 100).toFixed(1)) : 0
  out.date = row.date
  out.dateKey = row.dateKey
  return out
}

function scaleMmHistoryDay(row, share) {
  const out = {}
  MM_HISTORY_SPLIT_KEYS.forEach((key) => {
    out[key] = Number((Number(row[key] || 0) * share).toFixed(1))
  })
  return finishMmHistoryDay(row, out)
}

function remainderMmHistoryDay(row, parts) {
  const out = {}
  MM_HISTORY_SPLIT_KEYS.forEach((key) => {
    const used = parts.reduce((sum, part) => sum + Number(part[key] || 0), 0)
    out[key] = Number((Number(row[key] || 0) - used).toFixed(1))
  })
  return finishMmHistoryDay(row, out)
}

export function generateMmHistory(pair, days, internalAccounts = []) {
  const desk = generateDashboardDesk(pair, internalAccounts)
  const mm = desk.mm
  const pairSeed = pairSeedOfName(pair)
  const parts = String(pair || '').split('/')
  const base = parts[0] || 'TOKEN'
  const quote = parts[1] || 'USDT'
  const FULL = 30
  const requested = Number(days)
  const n = [7, 15, 30].includes(requested) ? requested : FULL
  const all = []

  for (let i = 0; i < FULL; i++) {
    const { date, dateKey } = deskCalendarDay(i, FULL)
    const t = i / Math.max(FULL - 1, 1)
    const wave = Math.sin((i + pairSeed) / 3.2) * 0.045
    const drift = (t - 0.5) * 0.08 * (pairSeed % 2 === 0 ? 1 : -1)
    const jitter = ((i * 7 + pairSeed * 3) % 11 - 5) * 0.008
    let invScale = Math.max(0.82, Math.min(1.18, 1 + drift + wave + jitter))
    if (i === FULL - 1) invScale = 1
    const tokenInv = Number((mm.tokenInv * invScale).toFixed(1))
    const tokenU = Number((mm.tokenU * invScale).toFixed(1))
    const tokens = splitMmTokens(tokenInv, pairSeed)
    const cashBorrowedU = Number((mm.cashBorrowedU * (i === FULL - 1 ? 1 : 0.94 + t * 0.06)).toFixed(1))
    const trueScale = i === FULL - 1 ? 1 : Number((0.62 + t * 0.38).toFixed(3))
    const cashTrueU = Number((mm.cashTrueU * trueScale).toFixed(1))
    const cashU = Number((cashTrueU + cashBorrowedU).toFixed(1))
    const equityU = Number((cashU + tokenU).toFixed(1))
    const buyQty = Number((mm.buyQty * (i === FULL - 1 ? 1 : (0.72 + ((i * 5 + pairSeed) % 9) * 0.05))).toFixed(1))
    const sellQty = Number((mm.sellQty * (i === FULL - 1 ? 1 : (0.7 + ((i * 4 + pairSeed * 2) % 9) * 0.05))).toFixed(1))
    const netQty = Number((buyQty - sellQty).toFixed(1))
    const cashPct = equityU ? Number((cashU / equityU * 100).toFixed(1)) : 0
    const pnl = calcMmTradingPnl(buyQty, sellQty, mm.avgBuy, mm.avgSell, mm.lastPrice)
    all.push({
      date,
      dateKey,
      equityU,
      cashU,
      cashTrueU,
      cashOwnU: cashTrueU,
      cashBorrowedU,
      tokenU,
      tokenInv,
      ...tokens,
      buyQty,
      sellQty,
      netQty,
      cashPct,
      realizedU: pnl.realizedU
    })
  }

  const rowsAsc = all.slice(FULL - n)
  const first = rowsAsc[0]
  const last = rowsAsc[rowsAsc.length - 1]
  const eqDelta = Number((last.equityU - first.equityU).toFixed(1))
  const eqPct = first.equityU ? Number((eqDelta / first.equityU * 100).toFixed(1)) : 0
  const invDelta = Number((last.tokenInv - first.tokenInv).toFixed(1))
  const invs = rowsAsc.map((row) => row.tokenInv)
  const periodBuy = Number(rowsAsc.reduce((sum, row) => sum + row.buyQty, 0).toFixed(1))
  const periodSell = Number(rowsAsc.reduce((sum, row) => sum + row.sellQty, 0).toFixed(1))
  const periodNet = Number((periodBuy - periodSell).toFixed(1))
  const periodRealized = Number(rowsAsc.reduce((sum, row) => sum + row.realizedU, 0).toFixed(1))
  const avgCashPct = Number((rowsAsc.reduce((sum, row) => sum + row.cashPct, 0) / Math.max(rowsAsc.length, 1)).toFixed(1))
  const maxInv = Math.max(...invs)
  const minInv = Math.min(...invs)

  const robot = generateRobotStatus(pair, internalAccounts)
  const mmBots = robot.robots || []
  const shareSum = mmBots.reduce((sum, bot) => sum + Number(bot.ratio || 0), 0) || 1
  const displayRows = [...rowsAsc].reverse()
  const accountBooks = mmBots.map((bot, index) => {
    const share = Number(bot.ratio || 0) / shareSum
    const isLast = index === mmBots.length - 1
    const rows = displayRows.map((row) => {
      if (!isLast) return scaleMmHistoryDay(row, share)
      const others = mmBots.slice(0, -1).map((item) => (
        scaleMmHistoryDay(row, Number(item.ratio || 0) / shareSum)
      ))
      return remainderMmHistoryDay(row, others)
    })
    return {
      uid: bot.uid,
      remark: bot.remark,
      role: bot.role,
      rows
    }
  })

  return {
    range: n,
    pair,
    base,
    quote,
    kpis: {
      startEquity: first.equityU,
      endEquity: last.equityU,
      equityChange: eqDelta,
      equityChangePct: eqPct,
      startInv: first.tokenInv,
      endInv: last.tokenInv,
      invChange: invDelta,
      maxInv,
      minInv,
      endCash: last.cashU,
      endTokenU: last.tokenU,
      endTokenOwn: last.tokenOwn,
      endTokenBorrowed: last.tokenBorrowed,
      endCashTrue: last.cashTrueU,
      endCashOwn: last.cashTrueU,
      endCashBorrowed: last.cashBorrowedU,
      endCashPct: last.cashPct,
      avgCashPct,
      periodBuy,
      periodSell,
      periodNet,
      periodRealized,
      bandStatus: mm.bandStatus
    },
    status: [
      {
        color: eqDelta >= 0 ? 'green' : 'yellow',
        text: `做市资金 ${fmtQtyPlain(first.equityU)} → ${fmtQtyPlain(last.equityU)}万USDT · ${signedPlain(eqPct)}%`
      },
      {
        color: mm.bandStatus === '安全区间' ? 'green' : 'yellow',
        text: `做市库存 ${fmtQtyPlain(last.tokenInv)}万${base} · 自有 ${fmtQtyPlain(last.tokenOwn)} · 借入虚增 ${fmtQtyPlain(last.tokenBorrowed)} · ${mm.bandStatus}`
      },
      {
        color: 'green',
        text: `做市账户余额 ${signedPlain(last.cashU)}万${quote} = 真实 ${signedPlain(last.cashTrueU)} + 借入 ${fmtQtyPlain(last.cashBorrowedU)}`
      },
      {
        color: periodNet >= 0 ? 'green' : 'yellow',
        text: `买 ${fmtQtyPlain(periodBuy)} / 卖 ${fmtQtyPlain(periodSell)}万 · 净 ${signedPlain(periodNet)} · 交易盈亏 ${signedPlain(periodRealized)}万USDT`
      }
    ],
    series: {
      dates: rowsAsc.map((row) => row.date),
      equity: rowsAsc.map((row) => row.equityU),
      cash: rowsAsc.map((row) => row.cashU),
      tokenU: rowsAsc.map((row) => row.tokenU),
      tokenInv: rowsAsc.map((row) => row.tokenInv),
      tokenOwn: rowsAsc.map((row) => row.tokenOwn),
      tokenBorrowed: rowsAsc.map((row) => row.tokenBorrowed),
      cashOwn: rowsAsc.map((row) => row.cashOwnU),
      cashBorrowed: rowsAsc.map((row) => row.cashBorrowedU),
      buyQty: rowsAsc.map((row) => row.buyQty),
      sellQty: rowsAsc.map((row) => row.sellQty),
      netQty: rowsAsc.map((row) => row.netQty),
      cashPct: rowsAsc.map((row) => row.cashPct),
      realizedU: rowsAsc.map((row) => row.realizedU)
    },
    rows: displayRows,
    accountBooks
  }
}

export function generateTradeHistory(pair, days, internalAccounts = []) {
  const desk = generateDashboardDesk(pair, internalAccounts)
  const mm = desk.mm
  const pairSeed = pairSeedOfName(pair)
  const parts = String(pair || '').split('/')
  const base = parts[0] || 'TOKEN'
  const quote = parts[1] || 'USDT'
  const FULL = 30
  const requested = Number(days)
  const n = [7, 15, 30].includes(requested) ? requested : FULL
  const all = []
  const sellUPer = mm.sellQty ? mm.sellU / mm.sellQty : 0
  const buyUPer = mm.buyQty ? mm.buyU / mm.buyQty : 0

  for (let i = 0; i < FULL; i++) {
    const { date, dateKey } = deskCalendarDay(i, FULL)
    const t = i / Math.max(FULL - 1, 1)
    const wave = Math.sin((i + pairSeed) / 3.2) * 0.045
    const buyQty = Number((mm.buyQty * (i === FULL - 1 ? 1 : (0.72 + ((i * 5 + pairSeed) % 9) * 0.05))).toFixed(1))
    const sellQty = Number((mm.sellQty * (i === FULL - 1 ? 1 : (0.7 + ((i * 4 + pairSeed * 2) % 9) * 0.05))).toFixed(1))
    const avgBuy = i === FULL - 1
      ? mm.avgBuy
      : fmtDeskPrice(mm.avgBuy * (1 - wave * 0.012 - (1 - t) * 0.004))
    const avgSell = i === FULL - 1
      ? mm.avgSell
      : fmtDeskPrice(mm.avgSell * (1 + wave * 0.01 + (1 - t) * 0.006))
    const spreadPct = avgBuy ? Number((((avgSell - avgBuy) / avgBuy) * 100).toFixed(2)) : 0
    const buyU = Number((buyQty * buyUPer).toFixed(1))
    const sellU = Number((sellQty * sellUPer).toFixed(1))
    const usdtNet = Number((sellU - buyU).toFixed(1))
    const tokenDelta = Number((buyQty - sellQty).toFixed(1))
    const lastPrice = i === FULL - 1
      ? mm.lastPrice
      : fmtDeskPrice(mm.lastPrice * (0.955 + t * 0.045 + wave * 0.35 + ((sellQty - buyQty) / Math.max(mm.sellQty, 1)) * 0.008))
    const dayPnl = calcMmTradingPnl(buyQty, sellQty, avgBuy, avgSell, lastPrice)
    all.push({
      date,
      dateKey,
      sellQty,
      buyQty,
      avgSell,
      avgBuy,
      spreadPct,
      sellU,
      buyU,
      usdtNet,
      tokenDelta,
      netQty: tokenDelta,
      realizedU: dayPnl.realizedU,
      lastPrice
    })
  }

  const periodDelta = all.reduce((sum, row) => sum + row.tokenDelta, 0)
  let walkQty = Math.max(1, Number(mm.tokenInv) - periodDelta)
  let walkCost = fmtDeskPrice(mm.lastPrice * 0.962)
  all.forEach((row) => {
    if (row.buyQty > 0 && walkQty + row.buyQty > 0) {
      walkCost = fmtDeskPrice((walkCost * walkQty + row.buyQty * row.avgBuy) / (walkQty + row.buyQty))
      walkQty = Number((walkQty + row.buyQty).toFixed(1))
    }
    walkQty = Number(Math.max(0.1, walkQty - row.sellQty).toFixed(1))
    row.invCost = walkCost
  })
  if (all.length) all[all.length - 1].lastPrice = mm.lastPrice

  const rowsAsc = all.slice(FULL - n)
  const last = rowsAsc[rowsAsc.length - 1]
  const periodSell = Number(rowsAsc.reduce((sum, row) => sum + row.sellQty, 0).toFixed(1))
  const periodBuy = Number(rowsAsc.reduce((sum, row) => sum + row.buyQty, 0).toFixed(1))
  const periodToken = Number((periodBuy - periodSell).toFixed(1))
  const periodUsdt = Number(rowsAsc.reduce((sum, row) => sum + row.usdtNet, 0).toFixed(1))
  const avgSpread = Number((rowsAsc.reduce((sum, row) => sum + row.spreadPct, 0) / Math.max(rowsAsc.length, 1)).toFixed(2))
  const periodSellU = Number(rowsAsc.reduce((sum, row) => sum + row.sellU, 0).toFixed(1))
  const periodBuyU = Number(rowsAsc.reduce((sum, row) => sum + row.buyU, 0).toFixed(1))
  const sellNotional = rowsAsc.reduce((sum, row) => sum + row.sellQty * Number(row.avgSell), 0)
  const buyNotional = rowsAsc.reduce((sum, row) => sum + row.buyQty * Number(row.avgBuy), 0)
  const avgSell = periodSell ? fmtDeskPrice(sellNotional / periodSell) : last.avgSell
  const avgBuy = periodBuy ? fmtDeskPrice(buyNotional / periodBuy) : last.avgBuy
  const pnl = calcMmTradingPnl(periodBuy, periodSell, avgBuy, avgSell, last.lastPrice)
  const users = desk.users || {}
  const realUsers = Math.max(1, Number(users.realUsers) || 48)
  const daySellUsers = Math.min(realUsers, Math.max(1, Math.round(realUsers * (0.54 + pairSeed * 0.02))))
  const dayBuyUsers = Math.min(realUsers, Math.max(1, Math.round(realUsers * (0.49 + pairSeed * 0.015))))
  const uniqScale = 1 + (n - 1) * 0.065
  const sellScale = mm.sellQty ? periodSell / mm.sellQty : n
  const buyScale = mm.buyQty ? periodBuy / mm.buyQty : n
  const scaleQty = (value, scale) => Number((Number(value || 0) * scale).toFixed(1))
  const retailBuy = scaleQty(users.retailBuy, sellScale)
  const retailSell = scaleQty(users.retailSell, buyScale)
  const smartBuy = scaleQty(users.smartBuy, sellScale)
  const smartSell = scaleQty(users.smartSell, buyScale)
  const realBuy = scaleQty(users.realBuy, sellScale)
  const realSell = scaleQty(users.realSell, buyScale)

  return {
    range: n,
    pair,
    base,
    quote,
    kpis: {
      periodSell,
      periodBuy,
      periodSellU,
      periodBuyU,
      periodToken,
      periodUsdt,
      avgSpread,
      matched: pnl.matched,
      realizedU: pnl.realizedU,
      floatU: pnl.floatU,
      totalU: pnl.totalU,
      avgSell,
      avgBuy,
      sellUsers: Math.max(1, Math.round(daySellUsers * uniqScale)),
      buyUsers: Math.max(1, Math.round(dayBuyUsers * uniqScale)),
      sellFills: daySellUsers * (5 + (pairSeed % 4)) * n,
      buyFills: dayBuyUsers * (4 + ((pairSeed + 1) % 4)) * n,
      retailBuy,
      retailSell,
      retailNet: Number((retailBuy - retailSell).toFixed(1)),
      smartBuy,
      smartSell,
      smartNet: Number((smartBuy - smartSell).toFixed(1)),
      realBuy,
      realSell,
      realNet: Number((realBuy - realSell).toFixed(1)),
      endSell: last.sellQty,
      endBuy: last.buyQty,
      endSpread: last.spreadPct,
      endUsdt: last.usdtNet,
      endAvgSell: last.avgSell,
      endAvgBuy: last.avgBuy,
      endLast: last.lastPrice,
      endCost: last.invCost
    },
    status: [
      {
        color: periodUsdt >= 0 ? 'green' : 'yellow',
        text: `USDT 净增加 ${signedPlain(periodUsdt)}万 · 今日 ${signedPlain(last.usdtNet)}万`
      },
      {
        color: 'green',
        text: `卖出 ${fmtQtyPlain(periodSell)} / 买入 ${fmtQtyPlain(periodBuy)}万${base} · 代币净 ${signedPlain(periodToken)}`
      },
      {
        color: last.lastPrice >= last.invCost ? 'green' : 'yellow',
        break: true,
        text: `现价 ${last.lastPrice} · 库存成本 ${last.invCost}`
      }
    ],
    series: {
      dates: rowsAsc.map((row) => row.date),
      sellQty: rowsAsc.map((row) => row.sellQty),
      buyQty: rowsAsc.map((row) => row.buyQty),
      usdtNet: rowsAsc.map((row) => row.usdtNet),
      spreadPct: rowsAsc.map((row) => row.spreadPct),
      tokenDelta: rowsAsc.map((row) => row.tokenDelta),
      lastPrice: rowsAsc.map((row) => row.lastPrice),
      invCost: rowsAsc.map((row) => row.invCost),
      netQty: rowsAsc.map((row) => row.tokenDelta)
    },
    rows: [...rowsAsc].reverse()
  }
}

export function generateUsersToday(pair, internalAccounts, dateKey = '') {
  const desk = generateDashboardDesk(pair, internalAccounts)
  const robot = generateRobotStatus(pair, internalAccounts)
  const u = desk.users
  const mm = desk.mm
  const pairSeed = pairSeedOfName(pair)
  const buyUsers = Math.min(u.realUsers, Math.round(u.realUsers * (0.54 + pairSeed * 0.02)))
  const sellUsers = Math.min(u.realUsers, Math.round(u.realUsers * (0.49 + pairSeed * 0.015)))
  const returning = Math.max(0, u.realUsers - u.newTraders)
  const avgTicket = Number(((u.realBuy + u.realSell) / Math.max(u.realUsers, 1)).toFixed(2))
  const avgBuy = fmtDeskPrice(mm.avgSell * (1 - pairSeed / 20000))
  const avgSell = fmtDeskPrice(mm.avgBuy * (1 + pairSeed / 20000))
  const hours = robot.history.hours
  const buySum = robot.history.sellVol.reduce((sum, value) => sum + value, 0) || 1
  const sellSum = robot.history.buyVol.reduce((sum, value) => sum + value, 0) || 1
  const buyHour = robot.history.sellVol.map((value) => Number((value / buySum * u.realBuy).toFixed(1)))
  const sellHour = robot.history.buyVol.map((value) => Number((value / sellSum * u.realSell).toFixed(1)))
  const userHour = hours.map((_, index) => {
    const wave = 0.35 + Math.abs(Math.sin((index + pairSeed) / 4)) * 0.65
    return Math.max(2, Math.round(u.realUsers / 18 * wave + ((index * 3 + pairSeed) % 4)))
  })
  const newHour = hours.map((_, index) => (index >= 8 && index <= 16 ? (index % 3 === 0 ? 1 : 0) : 0))
  const newHourTotal = newHour.reduce((sum, value) => sum + value, 0) || 1
  const newHourScaled = newHour.map((value) => Math.round(value / newHourTotal * u.newTraders))

  const tagDefs = [
    { name: '聪明钱', color: '#4cd9a0', className: 'success', weight: 0.12 + pairSeed * 0.01 },
    { name: '散户', color: '#ffb347', className: 'warning', weight: 0.62 - pairSeed * 0.02 },
    { name: '羊毛党', color: '#ff5a7a', className: 'alert', weight: 0.11 },
    { name: '程序化', color: '#6a9aff', className: 'robot', weight: 0.15 + pairSeed * 0.01 }
  ]
  const tags = tagDefs.map((item) => {
    const users = Math.max(1, Math.round(u.realUsers * item.weight))
    const buy = Number((u.realBuy * item.weight).toFixed(1))
    const sell = Number((u.realSell * (item.weight + 0.02)).toFixed(1))
    return {
      name: item.name,
      color: item.color,
      className: item.className,
      users,
      ratio: Number((users / Math.max(u.realUsers, 1) * 100).toFixed(1)),
      buy,
      sell,
      net: Number((buy - sell).toFixed(1))
    }
  })

  const ids = ['104821', '106334', '108902', '111056', '113447', '115880', '118221', '120664', '122908', '125331']
  const traders = ids.slice(0, Math.min(10, Math.max(6, Math.round(u.realUsers / 8)))).map((uid, index) => {
    const tag = tags[index % tags.length]
    const buy = Number((u.realBuy * (0.18 - index * 0.012) + (index % 3)).toFixed(1))
    const sell = Number((u.realSell * (0.16 - index * 0.011) + ((index + 1) % 4)).toFixed(1))
    const isNew = index >= ids.length - u.newTraders && index >= ids.length - 4
    return {
      uid,
      tag: tag.name,
      tagClass: tag.className,
      buy,
      sell,
      net: Number((buy - sell).toFixed(1)),
      trades: 6 + ((index * 5 + pairSeed) % 28),
      avgPrice: index % 2 ? avgSell : avgBuy,
      firstTime: `${String(8 + (index % 7)).padStart(2, '0')}:${String(5 + index * 6).padStart(2, '0')}`,
      kind: isNew ? '新增' : '回流'
    }
  })

  const payload = {
    kpis: {
      ...u,
      buyUsers,
      sellUsers,
      returning,
      avgTicket,
      avgBuy,
      avgSell,
      lastPrice: mm.lastPrice
    },
    status: [
      { color: 'green', text: `真实交易用户 ${u.realUsers} 人 · 占持仓 ${u.tradedPct}%` },
      { color: u.realNet >= 0 ? 'green' : 'yellow', text: `用户净买入 ${signedPlain(u.realNet)}万 · 买 ${fmtQtyPlain(u.realBuy)} / 卖 ${fmtQtyPlain(u.realSell)}` },
      { color: 'green', text: `新增 ${u.newTraders} · 回流 ${returning} · 人均成交 ${fmtQtyPlain(avgTicket)}万` },
      { color: 'yellow', text: '不含做市 / 金库 / 项目方等内部 UID' }
    ],
    history: { hours, buyHour, sellHour, userHour, newHour: newHourScaled },
    priceFlow: generateUserPriceFlow({
      lastPrice: mm.lastPrice,
      avgBuy,
      avgSell,
      realBuy: u.realBuy,
      realSell: u.realSell,
      pairSeed
    }),
    tags,
    traders
  }
  return applyUsersDay(payload, pair, internalAccounts, dateKey)
}

export function generateUsersHistory(pair, days, internalAccounts = []) {
  const today = generateUsersToday(pair, internalAccounts)
  const chips = generateUserChips(pair, 30, internalAccounts)
  const u = today.kpis
  const pairSeed = pairSeedOfName(pair)
  const holdNow = Number(chips.kpis?.totalAmount || 0)
  const costNow = Number(chips.kpis?.avgCost || u.lastPrice || 0)
  const parts = String(pair || '').split('/')
  const base = parts[0] || 'TOKEN'
  const FULL = 30
  const requested = Number(days)
  const n = [7, 15, 30].includes(requested) ? requested : FULL
  const all = []

  for (let i = 0; i < FULL; i++) {
    const { date, dateKey } = deskCalendarDay(i, FULL)
    const t = i / Math.max(FULL - 1, 1)
    const wave = Math.sin((i + pairSeed) / 4.1) * 0.08
    const drift = (t - 0.5) * 0.1 * (pairSeed % 2 === 0 ? -1 : 1)
    const jitter = ((i * 5 + pairSeed) % 9 - 4) * 0.012
    const scale = i === FULL - 1 ? 1 : Math.max(0.72, Math.min(1.22, 1 + drift + wave + jitter))
    const realUsers = i === FULL - 1 ? u.realUsers : Math.max(2, Math.round(u.realUsers * scale))
    const holders = i === FULL - 1
      ? u.holders
      : Math.max(realUsers, Math.round(u.holders * (0.97 + (scale - 1) * 0.18)))
    const newTraders = i === FULL - 1
      ? u.newTraders
      : Math.max(0, Math.round(u.newTraders * (0.5 + ((i * 3 + pairSeed) % 8) * 0.14)))
    const realBuy = Number((u.realBuy * (i === FULL - 1 ? 1 : (0.7 + ((i * 4 + pairSeed) % 9) * 0.05))).toFixed(1))
    const realSell = Number((u.realSell * (i === FULL - 1 ? 1 : (0.68 + ((i * 6 + pairSeed * 2) % 9) * 0.05))).toFixed(1))
    const realNet = Number((realBuy - realSell).toFixed(1))
    const avgBuy = i === FULL - 1
      ? u.avgBuy
      : fmtDeskPrice(u.avgBuy * (1 + wave * 0.01 + jitter * 0.4))
    const avgSell = i === FULL - 1
      ? u.avgSell
      : fmtDeskPrice(u.avgSell * (1 - wave * 0.008 + jitter * 0.3))
    const realBuyU = Number((realBuy * Number(avgBuy)).toFixed(1))
    const realSellU = Number((realSell * Number(avgSell)).toFixed(1))
    const tradedPct = holders ? Number((realUsers / holders * 100).toFixed(1)) : 0
    const avgTicket = Number(((realBuy + realSell) / Math.max(realUsers, 1)).toFixed(2))
    const returning = Math.max(0, realUsers - newTraders)
    all.push({
      date,
      dateKey,
      realUsers,
      holders,
      newTraders,
      returning,
      realBuy,
      realSell,
      realNet,
      realBuyU,
      realSellU,
      avgBuy,
      avgSell,
      tradedPct,
      avgTicket
    })
  }

  let holdQty = holdNow
  for (let i = FULL - 1; i >= 0; i--) {
    const wave = Math.sin((i + pairSeed) / 5) * 0.008
    const jitter = ((i * 3 + pairSeed) % 7 - 3) * 0.0015
    all[i].holdQty = Number(Math.max(0, holdQty).toFixed(1))
    all[i].avgCost = i === FULL - 1
      ? fmtDeskPrice(costNow)
      : fmtDeskPrice(costNow * (1 + wave + jitter))
    if (i > 0) holdQty = Number((holdQty - Number(all[i].realNet || 0)).toFixed(1))
  }

  const rowsAsc = all.slice(FULL - n)
  const first = rowsAsc[0]
  const last = rowsAsc[rowsAsc.length - 1]
  const userDelta = last.realUsers - first.realUsers
  const periodBuy = Number(rowsAsc.reduce((sum, row) => sum + row.realBuy, 0).toFixed(1))
  const periodSell = Number(rowsAsc.reduce((sum, row) => sum + row.realSell, 0).toFixed(1))
  const periodNet = Number((periodBuy - periodSell).toFixed(1))
  const periodBuyU = Number(rowsAsc.reduce((sum, row) => sum + row.realBuyU, 0).toFixed(1))
  const periodSellU = Number(rowsAsc.reduce((sum, row) => sum + row.realSellU, 0).toFixed(1))
  const buyNotional = rowsAsc.reduce((sum, row) => sum + row.realBuy * Number(row.avgBuy), 0)
  const sellNotional = rowsAsc.reduce((sum, row) => sum + row.realSell * Number(row.avgSell), 0)
  const avgBuy = periodBuy ? fmtDeskPrice(buyNotional / periodBuy) : last.avgBuy
  const avgSell = periodSell ? fmtDeskPrice(sellNotional / periodSell) : last.avgSell
  const periodNew = rowsAsc.reduce((sum, row) => sum + row.newTraders, 0)
  const avgUsers = Math.round(rowsAsc.reduce((sum, row) => sum + row.realUsers, 0) / Math.max(rowsAsc.length, 1))
  const maxUsers = Math.max(...rowsAsc.map((row) => row.realUsers))
  const minUsers = Math.min(...rowsAsc.map((row) => row.realUsers))

  return {
    range: n,
    pair,
    base,
    kpis: {
      endUsers: last.realUsers,
      startUsers: first.realUsers,
      userChange: userDelta,
      avgUsers,
      maxUsers,
      minUsers,
      endHolders: last.holders,
      endTradedPct: last.tradedPct,
      periodNew,
      periodBuy,
      periodSell,
      periodNet,
      periodBuyU,
      periodSellU,
      avgBuy,
      avgSell,
      endAvgTicket: last.avgTicket,
      endNet: last.realNet
    },
    status: [
      {
        color: 'green',
        text: `交易用户 ${first.realUsers} → ${last.realUsers} 人 · 均 ${avgUsers} · 高低 ${minUsers}–${maxUsers}`
      },
      {
        color: periodNet >= 0 ? 'green' : 'yellow',
        text: `买 ${fmtQtyPlain(periodBuy)} / 卖 ${fmtQtyPlain(periodSell)}万 · 净 ${signedPlain(periodNet)}万${base}`
      },
      {
        color: 'green',
        text: `新增 ${periodNew} 人 · 期末持仓 ${last.holders} · 当日成交占持仓 ${last.tradedPct}%`
      },
      { color: 'yellow', text: '不含做市 / 金库 / 项目方等内部 UID' }
    ],
    series: {
      dates: rowsAsc.map((row) => row.date),
      realUsers: rowsAsc.map((row) => row.realUsers),
      holders: rowsAsc.map((row) => row.holders),
      newTraders: rowsAsc.map((row) => row.newTraders),
      returning: rowsAsc.map((row) => row.returning),
      realBuy: rowsAsc.map((row) => row.realBuy),
      realSell: rowsAsc.map((row) => row.realSell),
      realNet: rowsAsc.map((row) => row.realNet),
      tradedPct: rowsAsc.map((row) => row.tradedPct),
      avgTicket: rowsAsc.map((row) => row.avgTicket)
    },
    rows: [...rowsAsc].reverse()
  }
}

export function generateUsersAssetsHistory(pair, days, internalAccounts = [], sleepIdleDays = 30) {
  const chips = generateUserChips(pair, sleepIdleDays, internalAccounts)
  const desk = generateDashboardDesk(pair, internalAccounts)
  const d = getPairData(pair)
  const pairSeed = pairSeedOf(pair)
  const px = pairPxMeta(d)
  const last = px.lastPrice
  const toU = (qtyWan) => Number((Number(qtyWan || 0) * last).toFixed(1))
  const parts = String(pair || '').split('/')
  const base = parts[0] || 'TOKEN'
  const userToken = Number(chips.kpis.totalAmount) || 0
  const userCashU = Number((desk.users.holders * (1.1 + pairSeed * 0.22) + userToken * last * 0.22).toFixed(1))
  const userTokenU = toU(userToken)
  const holders = desk.users.holders
  const FULL = 30
  const requested = Number(days)
  const n = [7, 15, 30].includes(requested) ? requested : FULL
  const all = []

  for (let i = 0; i < FULL; i++) {
    const { date, dateKey } = deskCalendarDay(i, FULL)
    const t = i / Math.max(FULL - 1, 1)
    const wave = Math.sin((i + pairSeed) / 4.6) * 0.04
    const drift = (t - 0.5) * 0.07 * (pairSeed % 2 === 0 ? 1 : -1)
    const jitter = ((i * 6 + pairSeed) % 9 - 4) * 0.01
    const cashScale = i === FULL - 1 ? 1 : Math.max(0.78, Math.min(1.18, 1 + drift + wave + jitter))
    const tokenScale = i === FULL - 1 ? 1 : Math.max(0.82, Math.min(1.14, 1 + drift * 0.7 + wave * 0.6))
    const cashU = Number((userCashU * cashScale).toFixed(1))
    const tokenQty = Number((userToken * tokenScale).toFixed(1))
    const tokenU = Number((userTokenU * tokenScale).toFixed(1))
    const dayAssets = Number((cashU + tokenU).toFixed(1))
    const dayHolders = i === FULL - 1
      ? holders
      : Math.max(2, Math.round(holders * (0.96 + (tokenScale - 1) * 0.35)))
    const cashPct = dayAssets ? Number((cashU / dayAssets * 100).toFixed(1)) : 0
    all.push({
      date,
      dateKey,
      cashU,
      tokenQty,
      tokenU,
      assetsU: dayAssets,
      holders: dayHolders,
      cashPct
    })
  }

  const rowsAsc = all.slice(FULL - n)
  const first = rowsAsc[0]
  const lastRow = rowsAsc[rowsAsc.length - 1]
  const cashDelta = Number((lastRow.cashU - first.cashU).toFixed(1))
  const tokenDelta = Number((lastRow.tokenQty - first.tokenQty).toFixed(1))
  const assetsDelta = Number((lastRow.assetsU - first.assetsU).toFixed(1))
  const assetsPct = first.assetsU ? Number((assetsDelta / first.assetsU * 100).toFixed(1)) : 0
  const holderDelta = lastRow.holders - first.holders

  return {
    range: n,
    pair,
    base,
    kpis: {
      endCash: lastRow.cashU,
      startCash: first.cashU,
      cashChange: cashDelta,
      endToken: lastRow.tokenQty,
      startToken: first.tokenQty,
      tokenChange: tokenDelta,
      endTokenU: lastRow.tokenU,
      endAssets: lastRow.assetsU,
      startAssets: first.assetsU,
      assetsChange: assetsDelta,
      assetsChangePct: assetsPct,
      endHolders: lastRow.holders,
      startHolders: first.holders,
      holderChange: holderDelta,
      endCashPct: lastRow.cashPct
    },
    status: [
      {
        color: assetsDelta >= 0 ? 'green' : 'yellow',
        text: `用户资产 ${fmtQtyPlain(first.assetsU)} → ${fmtQtyPlain(lastRow.assetsU)}万USDT · ${signedPlain(assetsPct)}%`
      },
      {
        color: cashDelta >= 0 ? 'green' : 'yellow',
        text: `USDT ${fmtQtyPlain(first.cashU)} → ${fmtQtyPlain(lastRow.cashU)}万 · 代币 ${fmtQtyPlain(first.tokenQty)} → ${fmtQtyPlain(lastRow.tokenQty)}万${base}`
      },
      {
        color: 'green',
        text: `持仓用户 ${first.holders} → ${lastRow.holders} 人 · 期末 USDT 占资产 ${lastRow.cashPct}%`
      },
      { color: 'yellow', text: '不含做市 / 金库 / 项目方等内部 UID' }
    ],
    series: {
      dates: rowsAsc.map((row) => row.date),
      cashU: rowsAsc.map((row) => row.cashU),
      tokenQty: rowsAsc.map((row) => row.tokenQty),
      tokenU: rowsAsc.map((row) => row.tokenU),
      assetsU: rowsAsc.map((row) => row.assetsU),
      holders: rowsAsc.map((row) => row.holders),
      cashPct: rowsAsc.map((row) => row.cashPct)
    },
    rows: [...rowsAsc].reverse()
  }
}

function applyAbsorbDay(absorb, pair, internalAccounts, dateKey, sleepIdleDays = 30) {
  const key = normalizeDeskDate(dateKey)
  absorb.dateKey = key
  absorb.dateLabel = deskDateLabel(key)
  absorb.dateTitle = deskDateTitle(key)
  absorb.isToday = isDeskToday(key)
  if (absorb.isToday) return absorb

  const hist = generateUsersAssetsHistory(pair, 30, internalAccounts, sleepIdleDays)
  const day = (hist.rows || []).find((row) => row.dateKey === key)
  if (!day) {
    absorb.dateKey = DESK_AS_OF
    absorb.dateLabel = deskDateLabel(DESK_AS_OF)
    absorb.dateTitle = deskDateTitle(DESK_AS_OF)
    absorb.isToday = true
    return absorb
  }

  const cashScale = absorb.userCashU ? day.cashU / absorb.userCashU : 1
  const tokenScale = absorb.userToken ? day.tokenQty / absorb.userToken : 1
  const holderScale = absorb.holders ? day.holders / absorb.holders : 1

  absorb.userCashU = day.cashU
  absorb.userToken = day.tokenQty
  absorb.userTokenU = day.tokenU
  absorb.assetsU = day.assetsU
  absorb.holders = day.holders
  absorb.newMoneyU = Number((Number(absorb.newMoneyU || 0) * cashScale).toFixed(1))
  absorb.oldMoneyU = Number((absorb.userCashU - absorb.newMoneyU).toFixed(1))
  absorb.bid2Qty = Number((Number(absorb.bid2Qty || 0) * tokenScale).toFixed(1))
  absorb.bid5Qty = Number((Number(absorb.bid5Qty || 0) * tokenScale).toFixed(1))
  absorb.bid10Qty = Number((Number(absorb.bid10Qty || 0) * tokenScale).toFixed(1))
  absorb.ask2Qty = Number((Number(absorb.ask2Qty || 0) * tokenScale).toFixed(1))
  absorb.ask5Qty = Number((Number(absorb.ask5Qty || 0) * tokenScale).toFixed(1))
  absorb.ask10Qty = Number((Number(absorb.ask10Qty || 0) * tokenScale).toFixed(1))
  absorb.bid2U = Number((Number(absorb.bid2U || 0) * cashScale).toFixed(1))
  absorb.bid5U = Number((Number(absorb.bid5U || 0) * cashScale).toFixed(1))
  absorb.bid10U = Number((Number(absorb.bid10U || 0) * cashScale).toFixed(1))
  absorb.ask2U = Number((Number(absorb.ask2U || 0) * cashScale).toFixed(1))
  absorb.ask5U = Number((Number(absorb.ask5U || 0) * cashScale).toFixed(1))
  absorb.ask10U = Number((Number(absorb.ask10U || 0) * cashScale).toFixed(1))
  absorb.inboundQty = Number((Number(absorb.inboundQty || 0) * tokenScale).toFixed(1))
  absorb.coverDump = Number(absorb.dumpableU || 0) > 0.1
    ? Number(Math.min(999, absorb.bid5U / absorb.dumpableU * 100).toFixed(0))
    : absorb.coverDump
  absorb.cashBands = (absorb.cashBands || []).map((band) => ({
    ...band,
    users: Math.max(1, Math.round(Number(band.users || 0) * holderScale)),
    cashU: Number((Number(band.cashU || 0) * cashScale).toFixed(1))
  }))
  return absorb
}

function applyUsersDay(payload, pair, internalAccounts, dateKey) {
  const key = normalizeDeskDate(dateKey)
  payload.dateKey = key
  payload.dateLabel = deskDateLabel(key)
  payload.dateTitle = deskDateTitle(key)
  payload.isToday = isDeskToday(key)
  if (payload.isToday) return payload

  const hist = generateUsersHistory(pair, 30, internalAccounts)
  const day = (hist.rows || []).find((row) => row.dateKey === key)
  if (!day) {
    payload.dateKey = DESK_AS_OF
    payload.dateLabel = deskDateLabel(DESK_AS_OF)
    payload.dateTitle = deskDateTitle(DESK_AS_OF)
    payload.isToday = true
    return payload
  }

  const kpis = payload.kpis
  const buyScale = kpis.realBuy ? day.realBuy / kpis.realBuy : 1
  const sellScale = kpis.realSell ? day.realSell / kpis.realSell : 1
  const userScale = kpis.realUsers ? day.realUsers / kpis.realUsers : 1

  kpis.realUsers = day.realUsers
  kpis.holders = day.holders
  kpis.newTraders = day.newTraders
  kpis.returning = day.returning
  kpis.realBuy = day.realBuy
  kpis.realSell = day.realSell
  kpis.realNet = day.realNet
  kpis.tradedPct = day.tradedPct
  kpis.avgTicket = day.avgTicket
  kpis.buyUsers = Math.min(day.realUsers, Math.max(1, Math.round((kpis.buyUsers || 0) * userScale)))
  kpis.sellUsers = Math.min(day.realUsers, Math.max(1, Math.round((kpis.sellUsers || 0) * userScale)))
  kpis.realBuyU = Number(((kpis.realBuyU || 0) * buyScale).toFixed(1))
  kpis.realSellU = Number(((kpis.realSellU || 0) * sellScale).toFixed(1))
  kpis.avgBuy = day.avgBuy
  kpis.avgSell = day.avgSell

  payload.priceFlow = generateUserPriceFlow({
    lastPrice: kpis.lastPrice || day.avgBuy,
    avgBuy: day.avgBuy,
    avgSell: day.avgSell,
    realBuy: day.realBuy,
    realSell: day.realSell,
    pairSeed: pairSeedOfName(pair) + Number(key.slice(-2) || 0)
  })

  payload.history.buyHour = scaleHourSeries(payload.history.buyHour, day.realBuy)
  payload.history.sellHour = scaleHourSeries(payload.history.sellHour, day.realSell)
  payload.history.userHour = (payload.history.userHour || []).map((value) => Math.max(1, Math.round(Number(value || 0) * userScale)))
  payload.history.newHour = scaleHourSeries(payload.history.newHour, day.newTraders).map((value) => Math.max(0, Math.round(value)))

  payload.tags = (payload.tags || []).map((tag) => {
    const buy = Number((tag.buy * buyScale).toFixed(1))
    const sell = Number((tag.sell * sellScale).toFixed(1))
    const users = Math.max(1, Math.round(tag.users * userScale))
    return {
      ...tag,
      users,
      ratio: day.realUsers ? Number((users / day.realUsers * 100).toFixed(1)) : 0,
      buy,
      sell,
      net: Number((buy - sell).toFixed(1))
    }
  })

  payload.traders = (payload.traders || []).map((row) => {
    const buy = Number((row.buy * buyScale).toFixed(1))
    const sell = Number((row.sell * sellScale).toFixed(1))
    return {
      ...row,
      buy,
      sell,
      net: Number((buy - sell).toFixed(1))
    }
  })

  payload.status = [
    { color: 'green', text: `真实交易用户 ${day.realUsers} 人 · 占持仓 ${day.tradedPct}%` },
    { color: day.realNet >= 0 ? 'green' : 'yellow', text: `用户净买入 ${signedPlain(day.realNet)}万 · 买 ${fmtQtyPlain(day.realBuy)} / 卖 ${fmtQtyPlain(day.realSell)}` },
    { color: 'green', text: `新增 ${day.newTraders} · 回流 ${day.returning} · 人均成交 ${fmtQtyPlain(day.avgTicket)}万` },
    { color: 'yellow', text: `${payload.dateLabel} · 不含做市 / 金库 / 项目方等内部 UID` }
  ]
  return payload
}

function fmtQtyPlain(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
}

function signedPlain(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  const text = n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
  return n > 0 ? `+${text}` : text
}

export function computeFloatSnapshot(pair, sleepIdleDays = 30, internalAccounts) {
  const d = getPairData(pair)
  const circNum = Number(String(d.circSupply || '').replace(/,/g, '')) || 0
  const externalPct = Number(d.external)
  const desk = generateDashboardDesk(pair, internalAccounts)
  const idleDays = Number(sleepIdleDays) > 0 ? Number(sleepIdleDays) : 30
  const tradedRatio = Math.min(0.82, Math.max(0.35, Number(desk.users.tradedPct || 45) / 100 + 0.12))
  const onchainActiveRatio = Math.min(0.72, Math.max(0.22, 0.28 + idleDays / 120))
  const pct = (part, whole) => (whole ? Number((part / whole * 100).toFixed(1)) : 0)

  const circOnchain = Number((circNum * externalPct / 100).toFixed(1))
  const circExchange = Number(Math.max(0, circNum - circOnchain).toFixed(1))
  const mmQty = Number((Number(desk.mm?.tokenInv) || 0).toFixed(1))
  const mmClamped = Number(Math.min(Math.max(0, mmQty), circExchange).toFixed(1))
  const exchTotal = Number(Math.max(0, circExchange - mmClamped).toFixed(1))
  const onchainTotal = circOnchain

  const activeExchange = Number((exchTotal * tradedRatio).toFixed(1))
  const sleepExchange = Number(Math.max(0, exchTotal - activeExchange).toFixed(1))
  const activeOnchain = Number((onchainTotal * onchainActiveRatio).toFixed(1))
  const sleepOnchain = Number(Math.max(0, onchainTotal - activeOnchain).toFixed(1))
  const activeFloat = Number((activeExchange + activeOnchain).toFixed(1))
  const sleepTotal = Number((sleepExchange + sleepOnchain).toFixed(1))
  const floatNum = Number((activeFloat + sleepTotal).toFixed(1))
  const floatOfCirc = pct(floatNum, circNum)

  return {
    floatNum,
    floatLabel: fmtQtyPlain(floatNum),
    floatSub: circNum ? `占总流通 ${floatOfCirc}% · 不含做市` : d.floatSupplySub,
    circNum,
    circLabel: d.circSupply || String(circNum),
    circSub: circNum ? `真实浮动 + 做市库存` : d.floatSupplySub,
    floatOfCirc,
    circExchange,
    circOnchain,
    circExchangePct: pct(circExchange, circNum),
    circOnchainPct: pct(circOnchain, circNum),
    mmQty: mmClamped,
    mmOfExch: pct(mmClamped, circExchange),
    mmOfCirc: pct(mmClamped, circNum),
    exchTotal,
    onchainTotal,
    exchPct: pct(exchTotal, floatNum),
    onchainPct: pct(onchainTotal, floatNum),
    activeExchange,
    activeOnchain,
    activeFloat,
    activeOfFloat: pct(activeFloat, floatNum),
    activeOfCirc: pct(activeFloat, circNum),
    activeExchangeOfCirc: pct(activeExchange, circNum),
    activeOnchainOfCirc: pct(activeOnchain, circNum),
    activeOfExch: pct(activeExchange, exchTotal),
    activeOfOnchain: pct(activeOnchain, onchainTotal),
    sleepExchange,
    sleepOnchain,
    sleepTotal,
    sleepExchangePct: pct(sleepExchange, exchTotal),
    sleepOnchainPct: pct(sleepOnchain, onchainTotal),
    sleepOfFloat: pct(sleepTotal, floatNum),
    sleepOfCirc: pct(sleepTotal, circNum),
    sleepExchangeOfCirc: pct(sleepExchange, circNum),
    sleepOnchainOfCirc: pct(sleepOnchain, circNum),
    sleepIdleDays: idleDays,
    tradedPct: desk.users.tradedPct,
    holders: desk.users.holders,
    realUsers: desk.users.realUsers
  }
}

export function generateFloatChips(pair, sleepIdleDays = 30, kind = 'real', internalAccounts) {
  const snap = computeFloatSnapshot(pair, sleepIdleDays, internalAccounts)
  const pairSeed = pairSeedOfName(pair)
  const isReal = kind !== 'active'
  const dates = []
  const exchActive = []
  const exchSleep = []
  const onchainActive = []
  const onchainSleep = []
  const realTotals = []
  const activeTotals = []
  const activeRatios = []

  function scale(current, index) {
    if (index === 29) return current
    const t = index / 29
    const wave = Math.sin((index + pairSeed) / 5) * 0.035
    const drift = (1 - t) * 0.05 * (pairSeed % 2 === 0 ? 1 : -1)
    const jitter = ((index * 3 + pairSeed) % 5 - 2) * 0.004
    return Number((current * Math.max(0.84, Math.min(1.16, 1 + drift + wave + jitter))).toFixed(1))
  }

  const end = new Date('2026-08-28T00:00:00')
  for (let i = 0; i < 30; i++) {
    const day = new Date(end)
    day.setDate(end.getDate() - (29 - i))
    dates.push(`${String(day.getMonth() + 1).padStart(2, '0')}/${String(day.getDate()).padStart(2, '0')}`)
    const ea = scale(snap.activeExchange, i)
    const es = scale(snap.sleepExchange, i)
    const oa = scale(snap.activeOnchain, i)
    const os = scale(snap.sleepOnchain, i)
    const real = Number((ea + es + oa + os).toFixed(1))
    const active = Number((ea + oa).toFixed(1))
    exchActive.push(ea)
    exchSleep.push(es)
    onchainActive.push(oa)
    onchainSleep.push(os)
    realTotals.push(real)
    activeTotals.push(active)
    activeRatios.push(real ? Number((active / real * 100).toFixed(1)) : 0)
  }

  const seriesEnd = isReal ? realTotals : activeTotals
  const change30Amount = Number((seriesEnd[29] - seriesEnd[0]).toFixed(1))
  const change30 = seriesEnd[0] ? Number(((seriesEnd[29] - seriesEnd[0]) / seriesEnd[0] * 100).toFixed(1)) : 0
  const activeChange30 = Number((activeRatios[29] - activeRatios[0]).toFixed(1))

  return {
    kind: isReal ? 'real' : 'active',
    formula: isReal
      ? '真实浮动 = 所内活跃 + 所内沉睡 + 链上活跃 + 链上沉睡。做市库存从所内拆出，计入交易所内流通，不计入真实浮动。'
      : `活跃浮动 = 所内近${snap.sleepIdleDays}天有成交的用户持仓 + 链上近${snap.sleepIdleDays}天有转账余额（不含做市账户）`,
    kpis: {
      ...snap,
      change30,
      change30Amount,
      activeChange30
    },
    composition: [
      { name: '所内活跃', value: snap.activeExchange, color: '#4cd9a0' },
      { name: '所内沉睡', value: snap.sleepExchange, color: '#ffb347' },
      { name: '链上活跃', value: snap.activeOnchain, color: '#6a9aff' },
      { name: '链上沉睡', value: snap.sleepOnchain, color: '#a78bfa' }
    ],
    buckets: isReal
      ? [
          { name: '所内可卖', amount: snap.exchTotal, pct: snap.exchPct, to: '/desk/users/chips', note: '所内活跃 + 所内沉睡，不含做市账户', tag: 'user', tagLabel: '所内' },
          { name: '链上可动用', amount: snap.onchainTotal, pct: snap.onchainPct, to: '/chips/external', note: '链上活跃 + 链上沉睡', tag: 'robot', tagLabel: '链上' },
          { name: '活跃浮动', amount: snap.activeFloat, pct: snap.activeOfFloat, to: '/chips/active', note: '所内近期成交 + 链上近期转账', tag: 'success', tagLabel: '活跃' },
          { name: '沉睡合计', amount: snap.sleepTotal, pct: snap.sleepOfFloat, to: '/desk/users/chips', note: `所内沉睡 ${snap.sleepExchange}万 · 链上沉睡 ${snap.sleepOnchain}万`, tag: 'warning', tagLabel: '沉睡' }
        ]
      : [
          { name: '所内活跃', amount: snap.activeExchange, pct: snap.activeOfExch, to: '/desk/users/chips', note: `≥${snap.sleepIdleDays}天内有成交的所内持仓`, tag: 'user', tagLabel: '所内' },
          { name: '链上活跃', amount: snap.activeOnchain, pct: snap.activeOfOnchain, to: '/chips/external', note: `≥${snap.sleepIdleDays}天内有转入转出`, tag: 'robot', tagLabel: '链上' },
          { name: '真实浮动', amount: snap.floatNum, pct: 100, to: '/chips/float', note: snap.floatSub, tag: 'success', tagLabel: '口径' },
          { name: '沉睡对照', amount: snap.sleepTotal, pct: snap.sleepOfFloat, to: '/desk/users/chips', note: '真实浮动 − 活跃浮动', tag: 'warning', tagLabel: '沉睡' }
        ],
    history: {
      dates,
      exchActive,
      exchSleep,
      onchainActive,
      onchainSleep,
      realTotals,
      activeTotals,
      activeRatios
    }
  }
}

export function generateCircSupply(pair, kind = 'exchange', sleepIdleDays = 30, internalAccounts) {
  const snap = computeFloatSnapshot(pair, sleepIdleDays, internalAccounts)
  const isExch = kind !== 'onchain'
  const pairSeed = pairSeedOfName(pair)
  const idleDays = snap.sleepIdleDays
  const accounts = Array.isArray(internalAccounts) ? internalAccounts : DEFAULT_CONFIG.internalAccounts
  const mmAccounts = accounts.filter((item) => item.type === 'mm')
  const pct = (part, whole) => (whole ? Number((part / whole * 100).toFixed(1)) : 0)

  function scale(current, index) {
    if (index === 29) return current
    const t = index / 29
    const wave = Math.sin((index + pairSeed + (isExch ? 0 : 2)) / 5) * 0.035
    const drift = (1 - t) * 0.05 * (pairSeed % 2 === 0 ? 1 : -1)
    const jitter = ((index * 3 + pairSeed) % 5 - 2) * 0.004
    return Number((current * Math.max(0.84, Math.min(1.16, 1 + drift + wave + jitter))).toFixed(1))
  }

  const dates = []
  const activeSeries = []
  const sleepSeries = []
  const mmSeries = []
  const totals = []
  const end = new Date('2026-08-28T00:00:00')
  for (let i = 0; i < 30; i++) {
    const day = new Date(end)
    day.setDate(end.getDate() - (29 - i))
    dates.push(`${String(day.getMonth() + 1).padStart(2, '0')}/${String(day.getDate()).padStart(2, '0')}`)
    const active = scale(isExch ? snap.activeExchange : snap.activeOnchain, i)
    const sleep = scale(isExch ? snap.sleepExchange : snap.sleepOnchain, i)
    const mm = isExch ? scale(snap.mmQty, i) : 0
    activeSeries.push(active)
    sleepSeries.push(sleep)
    if (isExch) mmSeries.push(mm)
    totals.push(Number((active + sleep + mm).toFixed(1)))
  }

  const change30Amount = Number((totals[29] - totals[0]).toFixed(1))
  const change30 = totals[0] ? Number(((totals[29] - totals[0]) / totals[0] * 100).toFixed(1)) : 0
  const netIn30 = Number((Math.abs(change30Amount) * 1.35 + 8 + pairSeed).toFixed(1))
  const netOut30 = Number((netIn30 - change30Amount).toFixed(1))

  const total = isExch ? snap.circExchange : snap.circOnchain
  const active = isExch ? snap.activeExchange : snap.activeOnchain
  const sleep = isExch ? snap.sleepExchange : snap.sleepOnchain

  const composition = isExch
    ? [
        { name: '所内活跃', value: snap.activeExchange, color: '#4cd9a0' },
        { name: '所内沉睡', value: snap.sleepExchange, color: '#ffb347' },
        { name: '做市账户', value: snap.mmQty, color: '#6a9aff' }
      ]
    : [
        { name: '可充回', value: snap.activeOnchain, color: '#4cd9a0' },
        { name: '沉睡仓库', value: snap.sleepOnchain, color: '#a78bfa' }
      ]

  const buckets = isExch
    ? [
        { name: '所内活跃', amount: snap.activeExchange, pct: pct(snap.activeExchange, total), to: '/desk/users', note: `近${idleDays}天有成交的用户持仓`, tag: 'success', tagLabel: '活跃' },
        { name: '所内沉睡', amount: snap.sleepExchange, pct: pct(snap.sleepExchange, total), to: '/desk/users/chips', note: `≥${idleDays}天无成交 · 点进筹码分布`, tag: 'warning', tagLabel: '沉睡' },
        { name: '做市账户', amount: snap.mmQty, pct: snap.mmOfExch, to: '/ops/dump', note: '做市账上的代币 · 一部分可能是从用户借入的虚增', tag: 'robot', tagLabel: '做市' }
      ]
    : [
        { name: '可充回', amount: snap.activeOnchain, pct: pct(snap.activeOnchain, total), to: '/chips/external', note: `近${idleDays}天有转账 · 随时可能充进所内`, tag: 'success', tagLabel: '可充回' },
        { name: '沉睡仓库', amount: snap.sleepOnchain, pct: pct(snap.sleepOnchain, total), to: '/chips/external', note: `≥${idleDays}天无转账`, tag: 'warning', tagLabel: '仓库' }
      ]

  const hex = '0123456789abcdef'
  function makeAddr(index) {
    let body = ''
    for (let k = 0; k < 40; k++) body += hex[(index * 17 + k * 9 + pairSeed * 13 + k * k) % 16]
    return `0x${body}`
  }

  const rows = []
  if (isExch) {
    const userTarget = snap.exchTotal
    const n = 14
    const weights = []
    for (let i = 0; i < n; i++) weights.push(220 * (0.78 ** i) + ((i * 9 + pairSeed * 4) % 18))
    const weightSum = weights.reduce((acc, value) => acc + value, 0) || 1
    for (let i = 0; i < n; i++) {
      const amount = Number((weights[i] / weightSum * userTarget).toFixed(1))
      const sleepDays = i < 5 ? (i * 3 + pairSeed) % 6 : 18 + ((i * 11 + pairSeed * 3) % 52)
      const sleeping = sleepDays >= idleDays
      rows.push({
        id: `${(i + pairSeed) % 9 + 1}***${String(20 + i * 3)}`,
        kind: sleeping ? '沉睡' : '活跃',
        tag: sleeping ? 'warning' : 'success',
        amount,
        pct: pct(amount, total),
        last: sleepDays <= 1 ? (sleepDays ? '昨日' : '今日') : `${sleepDays}天前`,
        note: sleeping ? `闲置 ${sleepDays} 天` : '近期有成交',
        to: `/desk/user/${104821 + i * 17 + pairSeed * 3}`
      })
    }
    const mmCount = Math.max(mmAccounts.length, 0)
    let mmAssigned = 0
    mmAccounts.forEach((item, index) => {
      const share = index === mmCount - 1
        ? Number((snap.mmQty - mmAssigned).toFixed(1))
        : Number((snap.mmQty / mmCount).toFixed(1))
      mmAssigned = Number((mmAssigned + Math.max(0, share)).toFixed(1))
      rows.push({
        id: item.uid,
        kind: '做市',
        tag: 'robot',
        amount: Math.max(0, share),
        pct: pct(Math.max(0, share), total),
        last: '今日',
        note: item.remark || '做市账户',
        to: '/ops/dump'
      })
    })
    if (!mmAccounts.length && snap.mmQty > 0) {
      rows.push({
        id: 'MM-合计',
        kind: '做市',
        tag: 'robot',
        amount: snap.mmQty,
        pct: snap.mmOfExch,
        last: '今日',
        note: '未配置做市 UID · 按做市库存合计',
        to: '/ops/dump'
      })
    }
  } else {
    const n = 16
    const weights = []
    for (let i = 0; i < n; i++) weights.push(180 * (0.82 ** i) + ((i * 7 + pairSeed * 5) % 22))
    const weightSum = weights.reduce((acc, value) => acc + value, 0) || 1
    for (let i = 0; i < n; i++) {
      const amount = Number((weights[i] / weightSum * total).toFixed(1))
      const sleepDays = i < 6 ? (i * 2 + pairSeed) % 8 : 16 + ((i * 9 + pairSeed * 2) % 48)
      const sleeping = sleepDays >= idleDays
      const address = makeAddr(i + 3)
      rows.push({
        id: `${address.slice(0, 8)}...${address.slice(-4)}`,
        address,
        kind: sleeping ? '沉睡' : '可充回',
        tag: sleeping ? 'warning' : 'success',
        amount,
        pct: pct(amount, total),
        last: sleepDays <= 1 ? (sleepDays ? '昨日' : '今日') : `${sleepDays}天前`,
        note: sleeping ? `无转账 ${sleepDays} 天` : '近期有转入转出 · 可能充回所内',
        to: `/chips/external/address/${encodeURIComponent(address)}`
      })
    }
  }
  rows.sort((a, b) => b.amount - a.amount)
  const top10 = rows.slice(0, 10).reduce((sum, row) => sum + row.amount, 0)
  const top10Pct = pct(top10, total)
  const entityCount = isExch
    ? (snap.holders || 0) + mmAccounts.length
    : 48 + pairSeed * 7

  const topUser = rows.find((row) => row.kind !== '做市') || rows[0]
  const events = isExch
    ? [
        { time: '10:42', text: `UID ${topUser?.id || '--'} 买入 ${fmtQtyPlain(12 + pairSeed)}万 · 你在卖出`, tag: 'success', to: topUser?.to || '/desk/users' },
        { time: '10:18', text: `做市库存变动 ${fmtQtyPlain(snap.mmQty)}万 · 点进做市账户`, tag: 'robot', to: '/ops/dump' },
        { time: '09:51', text: `沉睡仓 ${fmtQtyPlain(8 + pairSeed * 2)}万转活跃`, tag: 'warning', to: '/desk/users' },
        { time: '09:12', text: `大额挂单进入买一，所内活跃抬升`, tag: 'user', to: '/ops/ladder' }
      ]
    : [
        { time: '10:36', text: `${topUser?.id || '0x'} 转入 ${fmtQtyPlain(18 + pairSeed * 2)}万`, tag: 'success', to: topUser?.to || '/chips/external' },
        { time: '10:04', text: `仓库地址转出 ${fmtQtyPlain(6 + pairSeed)}万 · 可能准备充回`, tag: 'warning', to: '/chips/external' },
        { time: '09:28', text: `近1h 链上互转 ${fmtQtyPlain(netIn30 / 30)}万 · 不能成交`, tag: 'user', to: '/chips/external' },
        { time: '08:57', text: `大额地址接近沉睡窗口 ${idleDays} 天`, tag: 'alert', to: '/chips/external' }
      ]

  return {
    kind: isExch ? 'exchange' : 'onchain',
    formula: isExch
      ? '所内才能成交。活跃会追会砍；沉睡暂时不动。做市账户是你的账：代币和 USDT 都在这里，其中一部分可能是从用户借入的虚增（用户账上已扣，合计里不再减一遍）。'
      : `链上是仓库，不能成交。近${idleDays}天有转账视为可能随时充回所内；充回之后才变成可卖供给。`,
    kpis: {
      ...snap,
      total,
      totalPct: isExch ? snap.circExchangePct : snap.circOnchainPct,
      active,
      sleep,
      activePct: pct(active, total),
      sleepPct: pct(sleep, total),
      change30,
      change30Amount,
      netIn30,
      netOut30,
      top10Pct,
      entityCount,
      entityLabel: isExch ? 'UID' : '地址'
    },
    composition,
    buckets,
    history: {
      dates,
      active: activeSeries,
      sleep: sleepSeries,
      mm: mmSeries,
      totals
    },
    rows: rows.slice(0, 16),
    events,
    status: isExch
      ? [
          { color: 'green', text: `所内流通 ${fmtQtyPlain(total)}万 · 占流通 ${snap.circExchangePct}%` },
          { color: 'green', text: `活跃 ${fmtQtyPlain(snap.activeExchange)} · 沉睡 ${fmtQtyPlain(snap.sleepExchange)} · 做市 ${fmtQtyPlain(snap.mmQty)}` },
          { color: snap.mmOfExch > 40 ? 'yellow' : 'green', text: `做市占所内 ${snap.mmOfExch}% · 前10集中度 ${top10Pct}%` }
        ]
      : [
          { color: 'green', text: `链上仓库 ${fmtQtyPlain(total)}万 · 占流通 ${snap.circOnchainPct}%` },
          { color: 'yellow', text: `链上不能成交 · 可充回 ${fmtQtyPlain(snap.activeOnchain)}万 · 沉睡仓库 ${fmtQtyPlain(snap.sleepOnchain)}万` },
          { color: top10Pct > 55 ? 'yellow' : 'green', text: `地址 ${entityCount} · 前10集中度 ${top10Pct}% · 充回所内才可卖` }
        ]
  }
}

function parseSigned(value) {
  const n = Number(String(value).replace(/[^\d.+-]/g, ''))
  return Number.isNaN(n) ? 0 : n
}

export function generateObiDetail(pair, depthLevels = 10, obiWarn = 0.4) {
  const d = getPairData(pair)
  const pairSeed = pairSeedOf(pair)
  const levels = Number(depthLevels) > 0 ? Number(depthLevels) : 10
  const warn = Number(obiWarn) > 0 ? Number(obiWarn) : 0.4
  const realObi = Number(parseSigned(d.obi).toFixed(2))
  const mmSkew = Number((0.06 + pairSeed * 0.015).toFixed(2))
  const grossObi = Number(Math.max(-0.92, Math.min(0.92, realObi - mmSkew)).toFixed(2))
  const nearTotal = Number((720 + pairSeed * 55).toFixed(1))
  const bidQty = Number((nearTotal * (1 + realObi) / 2).toFixed(1))
  const askQty = Number((nearTotal - bidQty).toFixed(1))
  const bidAskRatio = askQty ? Number((bidQty / askQty).toFixed(2)) : 0
  const mmBid = Number((bidQty * (0.28 + pairSeed * 0.02)).toFixed(1))
  const mmAsk = Number((askQty * (0.34 + pairSeed * 0.02)).toFixed(1))
  const realBid = Number((bidQty - mmBid).toFixed(1))
  const realAsk = Number((askQty - mmAsk).toFixed(1))
  const distToWarn = Number((warn - Math.abs(realObi)).toFixed(2))
  const bias = realObi >= 0.35 ? '买盘强势' : realObi >= 0.15 ? '买盘偏厚' : realObi <= -0.35 ? '卖盘强势' : realObi <= -0.15 ? '卖盘偏厚' : '买卖均衡'
  const alert = Math.abs(realObi) >= warn

  const hours = []
  const realSeries = []
  const grossSeries = []
  const bidSeries = []
  const askSeries = []
  for (let i = 0; i < 24; i++) {
    const h = 9 + Math.floor(i / 2)
    const m = i % 2 === 0 ? '00' : '30'
    hours.push(`${String(h).padStart(2, '0')}:${m}`)
    const t = i / 23
    const wave = Math.sin((i + pairSeed) / 3.2) * 0.08
    let v = realObi - 0.12 * (1 - t) + wave + ((i * 3 + pairSeed) % 5 - 2) * 0.012
    if (i === 23) v = realObi
    v = Number(Math.max(-0.7, Math.min(0.7, v)).toFixed(2))
    realSeries.push(v)
    grossSeries.push(Number(Math.max(-0.7, Math.min(0.7, v - mmSkew + wave * 0.3)).toFixed(2)))
    const tot = Number((nearTotal * (0.88 + t * 0.12 + Math.abs(wave))).toFixed(1))
    bidSeries.push(Number((tot * (1 + v) / 2).toFixed(1)))
    askSeries.push(Number((tot - bidSeries[i]).toFixed(1)))
  }

  const dayLabels = []
  const dayObi = []
  const end = new Date('2026-08-28T00:00:00')
  for (let i = 0; i < 14; i++) {
    const day = new Date(end)
    day.setDate(end.getDate() - (13 - i))
    dayLabels.push(`${String(day.getMonth() + 1).padStart(2, '0')}/${String(day.getDate()).padStart(2, '0')}`)
    const wave = Math.sin((i + pairSeed) / 2.4) * 0.09
    let v = i === 13 ? realObi : Number((realObi - 0.08 + wave + ((i * 5 + pairSeed) % 7 - 3) * 0.02).toFixed(2))
    dayObi.push(Number(Math.max(-0.55, Math.min(0.58, v)).toFixed(2)))
  }

  const levelCount = Math.min(levels, 10)
  const bidSrc = d.obDepthBid || [80, 180, 320, 200, 90]
  const askSrc = d.obDepthAsk || [50, 90, 140, 280, 400]
  const depthRows = []
  for (let i = 0; i < Math.max(bidSrc.length, askSrc.length, 5); i++) {
    if (i >= levelCount && i >= 5) break
    const bid = Number((bidSrc[i % bidSrc.length] * (0.85 + (i % 3) * 0.08)).toFixed(1))
    const ask = Number((askSrc[i % askSrc.length] * (0.85 + ((i + 1) % 3) * 0.08)).toFixed(1))
    const tick = Number((1.02 - i * 0.004).toFixed(3))
    depthRows.push({
      level: i + 1,
      bidPrice: tick.toFixed(3),
      askPrice: (tick + 0.002 + i * 0.001).toFixed(3),
      bid,
      ask,
      net: Number((bid - ask).toFixed(1))
    })
  }

  const events = []
  realSeries.forEach((value, i) => {
    if (i === 0) return
    const prev = realSeries[i - 1]
    const crossed = (Math.abs(prev) < warn && Math.abs(value) >= warn) || (Math.abs(value - prev) >= 0.12)
    if (crossed) {
      events.push({
        time: hours[i],
        obi: value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2),
        type: Math.abs(value) >= warn ? '触及预警' : '急变',
        detail: value > prev ? '买盘突然增厚或卖墙撤销' : '卖盘增厚或买墙撤离',
        status: Math.abs(value) >= warn ? '红色' : '监控中',
        statusTag: Math.abs(value) >= warn ? 'alert' : 'warning'
      })
    }
  })
  if (!events.length) {
    events.push({
      time: hours[Math.max(0, hours.length - 4)],
      obi: realObi >= 0 ? `+${realObi.toFixed(2)}` : realObi.toFixed(2),
      type: '稳态',
      detail: '近端厚度变化不大',
      status: '监控中',
      statusTag: 'user'
    })
  }

  const playbooks = [
    {
      title: '对操盘手',
      color: 'green',
      items: [
        '买盘厚：砸价会先打到用户买单。那是你把货卖给他们（卖出还能成交），不是买入。买入要等他们市价砍仓。',
        '卖盘厚：拉价会先吃到用户卖单。那是你在高位把货买回来，划不来。停拉，等人杀跌再买入。',
        '真实买盘转薄：再砸会打穿，自己把货卖给空气。真实卖盘转厚：再拉是给上方挂单送钱。',
        `±${warn} 是预警。越过之后先看是用户墙还是自己做市单，再决定拉还是砸。`
      ]
    },
    {
      title: '对做市',
      color: 'yellow',
      items: [
        '报价只看真实 OBI。毛值接近 0、真实仍偏卖，说明外面没人买，你在自嗨。',
        '买盘偏厚：卖一可以略紧，让追涨的人成交（帮你卖出），别用自己的买单挡住。',
        '卖盘偏厚：买一要更厚、价差略放宽，防止被扫穿后库存被动变多。',
        '单边超过预警，检查库存带和做市账户余额：该停拉或停砸，而不是两边等量硬顶。'
      ]
    }
  ]

  const combos = [
    { scene: '买盘厚 + 偏离不高', meaning: '散户还愿意追，下方也有买单', action: '可拉，卖出：把货卖给追涨的人' },
    { scene: '买盘厚 + 偏离已经很高', meaning: '人人有利润，但买单还在', action: '停拉，先卖出兑现；下一步再砸盘买入' },
    { scene: '卖盘厚 + 偏离很高', meaning: '获利盘挂着等你来接', action: '别拉。拉等于高位买入，等他们砍' },
    { scene: '卖盘厚 + 偏离为负', meaning: '套牢盘在出，有货可买', action: '可砸，买入：用做市账户余额买回刚才卖掉的货' }
  ]

  return {
    formula: '近端用户买量 − 卖量，再除以总和。买盘厚：砸价会打到他们的买单，你是在卖出。卖盘厚：拉价会吃到他们的卖单，你是在高位买货。必须剔除做市自挂。',
    kpis: {
      realObi,
      realObiLabel: realObi >= 0 ? `+${realObi.toFixed(2)}` : realObi.toFixed(2),
      grossObi,
      grossObiLabel: grossObi >= 0 ? `+${grossObi.toFixed(2)}` : grossObi.toFixed(2),
      bias: d.obiSub || bias,
      bidQty,
      askQty,
      bidAskRatio,
      mmBid,
      mmAsk,
      realBid,
      realAsk,
      warn,
      distToWarn,
      alert,
      levels,
      peak: Math.max(...realSeries),
      trough: Math.min(...realSeries)
    },
    history: { hours, realSeries, grossSeries, bidSeries, askSeries, dayLabels, dayObi },
    depthRows,
    events: events.slice(-8),
    playbooks,
    combos
  }
}

export function generateCostDev(pair, costDevWarn = 20) {
  const d = getPairData(pair)
  const pairSeed = pairSeedOf(pair)
  const warn = Number(costDevWarn) > 0 ? Number(costDevWarn) : 20
  const dev = Number(parseSigned(d.priceDev).toFixed(1))
  const costMatch = String(d.priceDevSub || '').match(/([\d.]+)/)
  const avgCost = costMatch ? Number(costMatch[1]) : 0.86
  const digits = avgCost >= 100 ? 2 : avgCost >= 1 ? 4 : 6
  const lastPrice = Number((avgCost * (1 + dev / 100)).toFixed(digits))
  const densePeak = avgCost
  const profitRatio = Number(String(d.pnlBadge || '').replace(/\D/g, '')) || 58
  const underwater = Number((100 - profitRatio).toFixed(1))
  const alert = Math.abs(dev) >= warn
  const stance = dev >= 20 ? '停拉 · 先卖出兑现' : dev >= 8 ? '可拉，卖出 · 散户还在追' : dev >= 0 ? '贴近成本 · 可拉可砸' : dev >= -8 ? '刚翻亏 · 可砸，买入' : '深套 · 再砸他们不动'

  const bandLabels = [-15, -8, 0, 8, 15, 25].map((pct) => Number((avgCost * (1 + pct / 100)).toFixed(digits === 6 ? 4 : Math.min(digits, 4))))
  const bandAmounts = (d.cost || [80, 320, 480, 160, 90, 50]).slice(0, 6)
  while (bandAmounts.length < 6) bandAmounts.push(40 + pairSeed * 8)
  const peakIndex = bandAmounts.indexOf(Math.max(...bandAmounts))

  const buckets = [
    { name: '盈利 0–20%', color: '#7ed9b0', weight: Math.max(10, 16 + Math.round(dev / 4)) },
    { name: '盈利 20–50%', color: '#4cd9a0', weight: Math.max(8, 12 + Math.round(dev / 3)) },
    { name: '盈利 ≥50%', color: '#a78bfa', weight: Math.max(4, 6 + Math.round(dev / 5)) },
    { name: '亏损 0–20%', color: '#ffb347', weight: Math.max(8, 18 - Math.round(dev / 3)) },
    { name: '亏损 20–50%', color: '#ff7a94', weight: Math.max(6, 14 - Math.round(dev / 3)) },
    { name: '亏损 ≥50%', color: '#ff5a7a', weight: Math.max(3, 10 - Math.round(dev / 2)) }
  ]
  const weightSum = buckets.reduce((sum, item) => sum + item.weight, 0) || 1
  const exchHint = Number(String(d.floatSupply).replace(/,/g, '')) * (100 - Number(d.external)) / 100
  buckets.forEach((item) => {
    item.amount = Number((exchHint * item.weight / weightSum).toFixed(1))
    item.pct = Number((item.weight / weightSum * 100).toFixed(1))
  })

  const dates = []
  const devSeries = []
  const priceSeries = []
  const costSeries = []
  const end = new Date('2026-08-28T00:00:00')
  for (let i = 0; i < 30; i++) {
    const day = new Date(end)
    day.setDate(end.getDate() - (29 - i))
    dates.push(`${String(day.getMonth() + 1).padStart(2, '0')}/${String(day.getDate()).padStart(2, '0')}`)
    const t = i / 29
    const wave = Math.sin((i + pairSeed) / 4.2) * 3.2
    let v = i === 29 ? dev : Number((dev - 6 * (1 - t) + wave).toFixed(1))
    v = Number(Math.max(-12, Math.min(36, v)).toFixed(1))
    devSeries.push(v)
    const px = Number((avgCost * (1 + v / 100)).toFixed(digits))
    priceSeries.push(px)
    costSeries.push(avgCost)
  }

  const holderRows = DETAIL_HOLDERS.map((row) => {
    const pnlPct = Number((((lastPrice - row.cost) / row.cost) * 100).toFixed(1))
    return {
      ...row,
      lastPrice,
      pnlPct,
      band: pnlPct >= 50 ? '盈利 ≥50%' : pnlPct >= 20 ? '盈利 20–50%' : pnlPct >= 0 ? '盈利 0–20%' : pnlPct > -20 ? '亏损 0–20%' : pnlPct > -50 ? '亏损 20–50%' : '亏损 ≥50%',
      bandTag: pnlPct >= 0 ? 'user' : pnlPct > -20 ? 'warning' : 'alert'
    }
  })

  const playbooks = [
    {
      title: '对操盘手',
      color: 'green',
      items: [
        '偏离不高：散户浮盈还少，还愿意追。这是卖出窗口，把货卖给他们。',
        '现价刚离开成本密集峰往上：阻力小，可再拉一档；已经远离，停拉兑现，下一步砸下来买回。',
        '刚翻亏层变厚：砍仓会给你货，这是买入窗口。深套占比高时再砸他们不动，做市账户余额会打光。',
        `超过 ±${warn}% 视为压力区：要么卖出把利润兑现，要么承认这波空间用完，改为宽幅买入卖出。`
      ]
    },
    {
      title: '对做市',
      color: 'yellow',
      items: [
        '偏离高：卖一附近真实卖压会突然变厚。卖价可略抬，让获利盘自己成交，你去买入而不是硬接。',
        '偏离低或为负：买一要更扎实，防止套牢盘恐慌砸穿你的买入价。',
        '成本密集峰是磁铁。报价贴着峰上沿或下沿，不要把存货堆在远离成本的真空区。',
        '和近端厚度一起看：高偏离 + 真实卖盘变厚 = 立刻停拉，先卖出、再等砍仓。'
      ]
    }
  ]

  const combos = [
    { scene: '偏离不高 + 买盘厚', meaning: '散户还愿意追', action: '可拉，卖出' },
    { scene: '偏离很高 + 买盘还在', meaning: '人人赚钱，但还有人接', action: '停拉，先把货卖掉' },
    { scene: '偏离很高 + 卖盘厚', meaning: '获利盘挂着等你来接', action: '别拉。等他们砍，再买入' },
    { scene: '偏离为负 + 卖盘厚', meaning: '套牢盘在出', action: '可砸，买入，用做市账户余额买回' }
  ]

  return {
            formula: '现价相对所内真实用户持仓均价（和「持仓均价」同一批人，不含做市 / 金库等）。(现价 − 均价) ÷ 均价。正数=他们在赚钱：再拉会兑现。负数=他们在亏：刚翻亏会砍给你买入，深套则扛着不动。',
    kpis: {
      lastPrice,
      avgCost,
      dev,
      devLabel: `${dev >= 0 ? '+' : ''}${dev}`,
      profitRatio,
      underwater,
      densePeak,
      denseLabel: d.costBadge || `密集峰 ${densePeak}`,
      warn,
      alert,
      stance,
      change30: Number((devSeries[29] - devSeries[0]).toFixed(1)),
      peakDev: Math.max(...devSeries),
      troughDev: Math.min(...devSeries)
    },
    history: { dates, devSeries, priceSeries, costSeries, bandLabels, bandAmounts, peakIndex },
    buckets,
    holders: holderRows,
    playbooks,
    combos
  }
}

const TOKEN_COLORS = {
  VBT: '#ffb347',
  BXT: '#6a9aff'
}

export function generateExchangeUser(pair, uid, scope = 'pair') {
  const token = String(pair || '').split('/')[0] || 'TOKEN'
  const pairSeed = pairSeedOfName(pair)
  const fullUid = String(uid || '104821').trim() || '104821'
  const all = scope === 'all'
  let seed = pairSeed * 19 + (all ? 41 : 0)
  for (let i = 0; i < fullUid.length; i++) seed = (seed * 33 + fullUid.charCodeAt(i)) % 9973

  const primary = PERSONA_PAGES[seed % PERSONA_PAGES.length]
  const extra = PERSONA_PAGES[(seed * 3 + 2) % PERSONA_PAGES.length]
  const tags = [{ label: primary.label, className: primary.className, to: `/user-profile/${primary.key}` }]
  if (extra.key !== primary.key && seed % 3 !== 0) {
    tags.push({ label: extra.label, className: extra.className, to: `/user-profile/${extra.key}` })
  }
  if (seed % 5 === 0) tags.push({ label: '大户', className: 'robot', to: '/desk/users' })
  if (seed % 7 === 0) tags.push({ label: '高频', className: 'warning' })

  const pairs = all ? PAIRS : [pair]
  const posBase = Number((12 + (seed % 160) / 2 + (all ? 8 : 0)).toFixed(1))
  const assets = pairs.map((item, index) => {
    const t = item.split('/')[0]
    const ps = pairSeedOfName(item)
    const px = Number((0.86 + ps * 0.04 + (seed % 12) / 400).toFixed(4))
    const scale = all ? (0.28 + ((seed + index * 19) % 90) / 100) : 1
    const qty = Number((posBase * scale).toFixed(1))
    const cost = Number((px * (0.86 + ((seed + index * 7) % 28) / 200)).toFixed(4))
    const valueU = Number((qty * px).toFixed(1))
    const pnl = Number((qty * (px - cost)).toFixed(1))
    const pnlPct = Number((((px - cost) / Math.max(cost, 0.0001)) * 100).toFixed(1))
    return {
      token: t,
      pair: item,
      qty,
      price: px,
      cost,
      valueU,
      pnl,
      pnlPct,
      color: TOKEN_COLORS[t] || '#6a9aff'
    }
  })
  const tokenValue = Number(assets.reduce((sum, row) => sum + row.valueU, 0).toFixed(1))
  assets.forEach((row) => {
    row.weight = Number((row.valueU / Math.max(tokenValue, 0.1) * 100).toFixed(1))
  })
  const cashU = Number((22 + (seed % 90) / 2 + (all ? 36 : 0)).toFixed(1))
  const equityU = Number((tokenValue + cashU).toFixed(1))
  const posQty = Number(assets.reduce((sum, row) => sum + row.qty, 0).toFixed(1))
  const avgCost = Number((assets.reduce((sum, row) => sum + row.cost * row.qty, 0) / Math.max(posQty, 0.1)).toFixed(4))
  const lastPrice = assets[0]?.price || 1
  const pnlU = Number(assets.reduce((sum, row) => sum + row.pnl, 0).toFixed(1))
  const pnlPct = Number((pnlU / Math.max(tokenValue - pnlU, 0.1) * 100).toFixed(1))

  const qtyUnit = all ? '万USDT' : '万'
  const todayBuy = Number(((all ? 18 : 6.4) + (seed % 40) / 4).toFixed(1))
  const todaySell = Number(((all ? 14 : 5.1) + (seed % 32) / 5).toFixed(1))
  const todayNet = Number((todayBuy - todaySell).toFixed(1))
  const trades30 = 18 + (seed % 86) + (all ? 24 : 0)
  const winRate = Number((38 + (seed % 42) + (primary.key === 'smart' ? 12 : 0)).toFixed(1))
  const profitRatio = Number((0.6 + (seed % 28) / 10 + (primary.key === 'smart' ? 0.6 : 0)).toFixed(1))
  const avgHoldHours = Number((2 + (seed % 46) + (primary.key === 'prog' ? -8 : 6)).toFixed(1))
  const cancelRatio = Number((6 + (seed % 28) + (primary.key === 'prog' ? 12 : 0)).toFixed(1))
  const tradeDays = 6 + (seed % 22) + (all ? 4 : 0)
  const avgTicket = Number(((todayBuy + todaySell) / Math.max(4 + (seed % 8), 1)).toFixed(2))
  const openOrderCount = 1 + (seed % 7)
  const orderSides = [
    { side: '买', tag: 'user' },
    { side: '卖', tag: 'warning' }
  ]
  const orders = []
  for (let i = 0; i < openOrderCount; i++) {
    const meta = orderSides[(i + seed) % 2]
    const p = pairs[i % pairs.length]
    const t = p.split('/')[0]
    const px = assets.find((row) => row.pair === p)?.price || lastPrice
    const slip = 1 + ((i * 5 + seed) % 11 - 5) / 400
    const qty = Number((0.8 + ((i * 17 + seed) % 36) / 10).toFixed(1))
    const price = Number((px * slip).toFixed(4))
    orders.push({
      time: clockNow(40 + i * 23),
      pair: p,
      token: t,
      side: meta.side,
      tag: meta.tag,
      qty,
      price,
      notional: Number((qty * price).toFixed(2))
    })
  }
  orders.sort((a, b) => Number(b.price) - Number(a.price))
  const openOrders = orders.length
  const ticketLabel = avgTicket >= 8 ? '大单' : avgTicket >= 3 ? '中单' : '小单'
  const holdLabel = avgHoldHours < 4 ? '超短' : avgHoldHours < 18 ? '日内' : avgHoldHours < 48 ? '波段' : '长持'
  const freq = trades30 / Math.max(tradeDays, 1)
  const freqLabel = freq >= 4 ? '高频' : freq >= 2 ? '中频' : '低频'

  const habits = [
    { label: '平均持仓', value: `${Math.max(0.4, avgHoldHours)}小时`, note: holdLabel },
    { label: '挂撤比', value: `${cancelRatio}%`, note: '撤单 / 挂单' },
    { label: '单笔规模', value: ticketLabel, note: `人均约 ${avgTicket}${qtyUnit}` },
    { label: '成交频率', value: freqLabel, note: `日均 ${freq.toFixed(1)} 笔` }
  ]

  const end = new Date('2026-08-28T00:00:00')
  const dates = []
  const buySeries = []
  const sellSeries = []
  const posSeries = []
  const pnlSeries = []
  const tokenSeries = pairs.map((item) => ({
    name: item.split('/')[0],
    color: TOKEN_COLORS[item.split('/')[0]] || '#6a9aff',
    buy: [],
    pos: []
  }))
  let runningPos = posQty * 0.68
  let runningPnl = pnlU * 0.35
  for (let i = 0; i < 30; i++) {
    const day = new Date(end)
    day.setDate(end.getDate() - (29 - i))
    dates.push(`${String(day.getMonth() + 1).padStart(2, '0')}/${String(day.getDate()).padStart(2, '0')}`)
    const buyDay = Number((Math.abs(Math.sin((i + seed) / 4.2)) * (all ? 9 : 3.2) + ((i * 3 + seed) % 7) * 0.35).toFixed(1))
    const sellDay = Number((Math.abs(Math.cos((i + seed) / 5.1)) * (all ? 7.5 : 2.6) + ((i * 5 + seed) % 6) * 0.28).toFixed(1))
    runningPos = Math.max(0.4, runningPos + buyDay - sellDay)
    runningPnl = Number((runningPnl + (buyDay - sellDay) * (0.12 + (seed % 8) / 50)).toFixed(1))
    if (i === 29) {
      runningPos = posQty
      runningPnl = pnlU
    }
    buySeries.push(buyDay)
    sellSeries.push(sellDay)
    posSeries.push(Number(runningPos.toFixed(1)))
    pnlSeries.push(Number(runningPnl.toFixed(1)))
    tokenSeries.forEach((row, index) => {
      const share = all ? (0.18 + ((seed + index * 11) % 40) / 100) : 1
      row.buy.push(Number((buyDay * share).toFixed(1)))
      row.pos.push(Number((runningPos * share).toFixed(1)))
    })
  }
  const buy30 = Number(buySeries.reduce((sum, value) => sum + value, 0).toFixed(1))
  const sell30 = Number(sellSeries.reduce((sum, value) => sum + value, 0).toFixed(1))
  const lifeMul = Number((2.1 + (seed % 18) / 10 + (80 + (seed % 520)) / 240).toFixed(2))
  const totalBuy = Number((buy30 * lifeMul).toFixed(1))
  const totalSell = Number((sell30 * lifeMul).toFixed(1))

  const sides = [
    { side: '买入', tag: 'user' },
    { side: '卖出', tag: 'warning' }
  ]
  const fills = []
  for (let i = 0; i < 16; i++) {
    const meta = sides[(i + seed) % 2]
    const p = pairs[i % pairs.length]
    const t = p.split('/')[0]
    const px = assets.find((row) => row.pair === p)?.price || lastPrice
    const slip = 1 + ((i * 7 + seed) % 9 - 4) / 800
    const day = new Date(end)
    day.setDate(end.getDate() - (i % 12))
    const hh = String(8 + (i * 3 + seed) % 14).padStart(2, '0')
    const min = String((i * 11 + seed) % 60).padStart(2, '0')
    const qty = Number((0.6 + ((i * 13 + seed) % 48) / 10 + (all ? 0.8 : 0)).toFixed(2))
    fills.push({
      time: `${String(day.getMonth() + 1).padStart(2, '0')}/${String(day.getDate()).padStart(2, '0')} ${hh}:${min}`,
      pair: p,
      token: t,
      side: meta.side,
      tag: meta.tag,
      qty,
      price: Number((px * slip).toFixed(4)),
      fee: Number((qty * px * 0.001).toFixed(3)),
      notional: Number((qty * px).toFixed(2))
    })
  }

  const month = String((seed % 9) + 1).padStart(2, '0')
  const dayNum = String((seed % 27) + 1).padStart(2, '0')
  const vip = `VIP${seed % 4}`
  const kyc = seed % 9 === 0 ? '未认证' : '已认证'
  const regions = ['新加坡', '香港', '韩国', '不明']
  const lastFill = fills[0]?.time || '今日'

  const transferStatuses = [
    { status: '红色', statusTag: 'alert' },
    { status: '监控中', statusTag: 'warning' },
    { status: '已处理', statusTag: 'success' }
  ]
  const allTransfers = []
  for (let i = 0; i < PAIRS.length * 6; i++) {
    const action = i % 3 === 2 ? '提现' : '充值'
    const meta = ACTION_META[action]
    const p = PAIRS[i % PAIRS.length]
    const t = p.split('/')[0]
    const px = assets.find((row) => row.pair === p)?.price
      || Number((0.86 + pairSeedOfName(p) * 0.04 + (seed % 12) / 400).toFixed(4))
    const day = new Date(end)
    day.setDate(end.getDate() - (i % 18))
    const hh = String(9 + (i * 2 + seed) % 12).padStart(2, '0')
    const min = String((i * 17 + seed) % 60).padStart(2, '0')
    const qty = Number((1.2 + ((i * 11 + seed) % 36) / 4 + 1.4 + (i === 0 ? 8 : 0)).toFixed(1))
    const st = qty >= 12 ? transferStatuses[0] : transferStatuses[(i + seed) % 3]
    allTransfers.push({
      time: `${String(day.getMonth() + 1).padStart(2, '0')}/${String(day.getDate()).padStart(2, '0')} ${hh}:${min}`,
      pair: p,
      token: t,
      action,
      actionClass: meta.className,
      amount: qty,
      amountU: Number((qty * px).toFixed(1)),
      chain: TRANSFER_CHAINS[(i + seed) % TRANSFER_CHAINS.length],
      address: makeWhaleAddress(i + 70 + seed, pairSeed),
      status: st.status,
      statusTag: st.statusTag,
      note: meta.note[(i + seed) % meta.note.length]
    })
  }
  allTransfers.sort((a, b) => (a.time < b.time ? 1 : a.time > b.time ? -1 : 0))
  const transfers = all
    ? allTransfers
    : allTransfers.filter((row) => row.pair === pair || row.token === token)
  const deposit30 = Number(transfers.filter((row) => row.action === '充值').reduce((sum, row) => sum + row.amountU, 0).toFixed(1))
  const withdraw30 = Number(transfers.filter((row) => row.action === '提现').reduce((sum, row) => sum + row.amountU, 0).toFixed(1))

  return {
    uid: fullUid,
    pair,
    token,
    scope: all ? 'all' : 'pair',
    scopeLabel: all ? '全部代币' : `当前代币 · ${token}`,
    qtyUnit,
    qtyNote: all ? '折 USDT 合计' : `${token} 数量`,
    profile: {
      registered: `${2023 + (seed % 3)}-${month}-${dayNum}`,
      lastActive: lastFill,
      kyc,
      vip,
      days: 80 + (seed % 520),
      region: regions[seed % 4]
    },
    tags,
    habits,
    kpis: {
      equityU,
      cashU,
      tokenU: tokenValue,
      posQty,
      avgCost,
      lastPrice,
      pnlU,
      pnlPct,
      todayBuy,
      todaySell,
      todayNet,
      totalBuy,
      totalSell,
      trades30,
      winRate,
      profitRatio,
      avgHoldHours: Math.max(0.4, avgHoldHours),
      cancelRatio,
      tradeDays,
      avgTicket,
      openOrders,
      deposit30,
      withdraw30
    },
    status: [
      { color: 'green', text: `交易天数 ${tradeDays} 天` },
      { color: todayNet >= 0 ? 'green' : 'yellow', text: `今日净${todayNet >= 0 ? '买' : '卖'} ${signedPlain(todayNet)}${qtyUnit}` },
      { color: pnlU >= 0 ? 'green' : 'red', text: `持仓浮盈亏 ${signedPlain(pnlU)}万USDT · ${pnlPct >= 0 ? '+' : ''}${pnlPct}%` },
      { color: 'yellow', text: `近30日成交 ${trades30} 笔 · ${tradeDays} 个交易日 · 挂撤 ${cancelRatio}%` }
    ],
    assets,
    cashU,
    history: {
      dates,
      buy: buySeries,
      sell: sellSeries,
      pos: posSeries,
      pnl: pnlSeries,
      tokens: tokenSeries
    },
    fills,
    orders,
    transfers
  }
}

function alertLevelMeta(level) {
  if (level === '紧急') return { color: '#ff5a7a', rank: 0 }
  if (level === '预警') return { color: '#ffb347', rank: 1 }
  return { color: '#4a8aff', rank: 2 }
}

function alertStatusTag(status) {
  if (status === '未处理' || status === '红色') return 'alert'
  if (status === '已处理') return 'success'
  return 'warning'
}

export function generateAlertSummary(pair, opts = {}) {
  const d = getPairData(pair)
  const whaleThreshold = Number(opts.whaleThreshold) > 0 ? Number(opts.whaleThreshold) : 50
  const internalAccounts = opts.internalAccounts || []
  const excludedAddresses = opts.excludedAddresses || []
  const rows = []
  const seen = new Set()

  function push(item) {
    const text = String(item.text || '').trim()
    const time = String(item.time || '').trim()
    if (!text) return
    const key = `${time}|${text}`
    if (seen.has(key)) return
    seen.add(key)
    const level = item.level || '关注'
    const meta = alertLevelMeta(level)
    const status = item.status || '未处理'
    rows.push({
      id: `alert-${rows.length + 1}`,
      time: time || '--',
      level,
      color: item.color || meta.color,
      rank: meta.rank,
      source: item.source || '系统',
      text,
      detail: item.detail || '',
      status,
      statusTag: alertStatusTag(status),
      to: item.to || '/alerts'
    })
  }

  const sourceByTo = {
    '/risk': '做市',
    '/robots': '做市',
    '/orderbook/obi': '盘口',
    '/ops/stance': '价格台阶',
    '/orderbook': '盘口',
    '/whales/exchange': '充提',
    '/orderbook/blocks': '盘口',
    '/whales/onchain': '链上仓库',
    '/position/cost-dev': '价格台阶',
    '/position': '价格台阶',
    '/trade-risk': '警报',
    '/ops/absorb': '真实用户',
    '/desk/users': '真实用户',
    '/ops/dump': '买卖',
    '/ops/ladder': '价格台阶',
    '/user-profile/smart': '聪明钱',
    '/user-profile/retail': '散户',
    '/chips/internal': '自己的账',
    '/desk/mm': '做市'
  }

  ;(d.alertItems || []).forEach((item) => {
    push({
      time: item.time,
      level: item.level,
      color: item.color,
      source: sourceByTo[item.to] || '指挥',
      text: item.text,
      status: item.level === '紧急' ? '未处理' : item.level === '预警' ? '监控中' : '未处理',
      to: item.to
    })
  })

  const tradeLevel = (type) => {
    if (type === '价格操纵') return '紧急'
    if (type === '交易频率' || type === '挂撤单异常' || type === '交易量占比') return '预警'
    return '关注'
  }
  ;(d.alertList || []).forEach((item) => {
    const uid = String(item.acc || '').trim()
    const toUser = uid && uid !== '—'
    push({
      time: item.time,
      level: tradeLevel(item.type),
      source: '交易风控',
      text: toUser ? `UID ${uid} · ${item.detail}` : item.detail,
      detail: item.type,
      status: item.status === '已预警' ? '监控中' : (item.status || '未处理'),
      to: toUser ? `/desk/user/${encodeURIComponent(uid.replace(/\D/g, '') || uid)}` : '/alerts'
    })
  })

  const transfers = generateTransferToday(pair, whaleThreshold, internalAccounts)
  ;(transfers.rows || []).forEach((row) => {
    if (row.status !== '红色') return
    push({
      time: row.time,
      level: '紧急',
      source: '充提',
      text: `UID ${row.uid} ${row.action} ${row.amount}万`,
      detail: row.note,
      status: '未处理',
      to: `/desk/user/${encodeURIComponent(row.uid)}`
    })
  })

  const blocks = generateBlockTrades(pair, whaleThreshold, internalAccounts)
  ;(blocks.rows || []).forEach((row) => {
    if (row.status !== '红色') return
    push({
      time: row.time,
      level: '紧急',
      source: '盘口大单',
      text: `UID ${row.uid} ${row.action} ${row.amount}万`,
      detail: row.note,
      status: '未处理',
      to: `/desk/user/${encodeURIComponent(row.uid)}`
    })
  })

  const chainWhales = generateOnchainWhales(pair, whaleThreshold, excludedAddresses)
  ;(chainWhales.rows || []).forEach((row) => {
    if (row.status === '已处理') return
    push({
      time: row.time,
      level: row.status === '红色' ? '紧急' : '关注',
      source: '链上仓库',
      text: `${row.action} ${row.amount}万 · ${row.source || ''}`,
      detail: row.note,
      status: row.status === '红色' ? '未处理' : '监控中',
      to: row.address ? `/chips/external/address/${encodeURIComponent(row.address)}` : '/circ/onchain'
    })
  })

  const robot = generateRobotStatus(pair, internalAccounts)
  if (robot.kpis.bandStatus && robot.kpis.bandStatus !== '安全区间') {
    push({
      time: '10:08:00',
      level: '预警',
      source: '做市',
      text: `做市库存 ${robot.kpis.robotInv}% · ${robot.kpis.bandStatus}`,
      status: '监控中',
      to: '/ops/dump'
    })
  }

  const cost = generateCostDev(pair, opts.costDevWarn)
  if (cost?.kpis?.alert) {
    push({
      time: '10:19:41',
      level: '预警',
      source: '筹码',
      text: `价格偏离成本 ${cost.kpis.devLabel}% · ${cost.kpis.stance}`,
      status: '监控中',
      to: '/ops/ladder'
    })
  }

  const obi = generateObiDetail(pair, opts.depthLevels, opts.obiWarn)
  if (obi?.kpis?.alert) {
    push({
      time: '10:38:02',
      level: '预警',
      source: '盘口',
      text: `近端厚度 ${d.obi} · ${d.obiSub === '买盘偏厚' ? '砸价会打到买单' : '拉价会吃到卖单'}`,
      status: '监控中',
      to: '/ops/ladder'
    })
  }

  const ops = generateOpsDesk(pair, opts.sleepIdleDays, internalAccounts)
  if (ops?.stance?.action) {
    push({
      time: '10:44:08',
      level: ops.stance.actionColor === 'red' ? '紧急' : ops.stance.actionColor === 'yellow' ? '预警' : '关注',
      source: '价格台阶',
      text: ops.stance.action,
      detail: ops.stance.actionWhy,
      status: '监控中',
      to: '/ops/ladder'
    })
  }
  const blocked = (ops?.ladder || []).find((row) => row.playKind === 'no')
  if (blocked) {
    push({
      time: '10:41:16',
      level: '预警',
      source: '价格台阶',
      text: `${blocked.label} ${blocked.price} · ${blocked.play}`,
      detail: blocked.playWhy,
      status: '监控中',
      to: '/ops/ladder'
    })
  }
  if (Number(ops?.users?.smartNet) > 0) {
    push({
      time: '10:39:40',
      level: '关注',
      source: '聪明钱',
      text: `聪明钱净买 ${ops.users.smartNet}万 · 买入在跟你抢货`,
      status: '监控中',
      to: '/user-profile/smart'
    })
  }
  if (Number(ops?.dump?.ownUsdt) < Number(ops?.absorb?.bid5U) * 0.35) {
    push({
      time: '10:37:22',
      level: '紧急',
      source: '自己的账',
      text: `做市账户余额 ${signedPlain(ops.dump.ownUsdt)}万USDT · 真实 ${signedPlain(ops.dump.cashTrueU)} + 借入 ${fmtQtyPlain(ops.dump.cashBorrowedU)} · 买入资金偏薄`,
      status: '未处理',
      to: '/ops/dump'
    })
  }

  const timeRank = (value) => {
    const parts = String(value).split(':').map(Number)
    if (parts.length < 2 || Number.isNaN(parts[0])) return 0
    return (parts[0] * 3600) + (parts[1] * 60) + (parts[2] || 0)
  }
  rows.sort((a, b) => timeRank(b.time) - timeRank(a.time) || a.rank - b.rank)

  const pending = rows.filter((row) => row.status !== '已处理')
  const urgent = rows.filter((row) => row.level === '紧急')
  const warn = rows.filter((row) => row.level === '预警')
  const watch = rows.filter((row) => row.level === '关注')
  const sources = [...new Set(rows.map((row) => row.source))]
  const byLevel = [
    { name: '紧急', value: urgent.length, color: '#ff5a7a' },
    { name: '预警', value: warn.length, color: '#ffb347' },
    { name: '关注', value: watch.length, color: '#4a8aff' }
  ].filter((item) => item.value > 0)
  const bySource = sources.map((name, index) => ({
    name,
    value: rows.filter((row) => row.source === name).length,
    color: ['#6a9aff', '#ffb347', '#a78bfa', '#4cd9a0', '#ff5a7a', '#ff6b7a'][index % 6]
  }))

  return {
    kpis: {
      total: rows.length,
      pending: pending.length,
      urgent: urgent.length,
      warn: warn.length,
      watch: watch.length,
      handled: rows.length - pending.length
    },
    status: [
      { color: urgent.length ? 'red' : pending.length ? 'yellow' : 'green', text: urgent.length ? `${urgent.length} 条紧急未消化` : pending.length ? `${pending.length} 条待处理` : '当前无待处理警报' },
      { color: warn.length ? 'yellow' : 'green', text: `预警 ${warn.length} · 关注 ${watch.length}` },
      { color: 'green', text: `今日合计 ${rows.length} 条 · 已处理 ${rows.length - pending.length}` }
    ],
    sources,
    byLevel,
    bySource,
    rows
  }
}

const LADDER_PNL_BANDS = [
  { key: 'p30', label: '浮盈 ≥30%', short: '+30%', kind: 'profit', test: (pnl) => pnl >= 30 },
  { key: 'p20', label: '浮盈 20–30%', short: '+20–30%', kind: 'profit', test: (pnl) => pnl >= 20 && pnl < 30 },
  { key: 'p10', label: '浮盈 10–20%', short: '+10–20%', kind: 'profit', test: (pnl) => pnl >= 10 && pnl < 20 },
  { key: 'p5', label: '浮盈 5–10%', short: '+5–10%', kind: 'profit', test: (pnl) => pnl >= 5 && pnl < 10 },
  { key: 'p0', label: '浮盈 0–5%', short: '+0–5%', kind: 'profit', test: (pnl) => pnl > 0 && pnl < 5 },
  { key: 'l0', label: '浮亏 0–5%', short: '−0–5%', kind: 'loss', test: (pnl) => pnl <= 0 && pnl > -5 },
  { key: 'l5', label: '浮亏 5–10%', short: '−5–10%', kind: 'loss', test: (pnl) => pnl <= -5 && pnl > -10 },
  { key: 'l10', label: '浮亏 10–20%', short: '−10–20%', kind: 'loss', test: (pnl) => pnl <= -10 && pnl > -20 },
  { key: 'l20', label: '浮亏 20–30%', short: '−20–30%', kind: 'loss', test: (pnl) => pnl <= -20 && pnl > -30 },
  { key: 'l30', label: '浮亏 ≥30%', short: '−30%', kind: 'loss', test: (pnl) => pnl <= -30 }
]

function ladderPnlSellRate(pnlPct) {
  const x = Math.abs(Number(pnlPct) || 0)
  if (x <= 0) return 0
  if (x <= 5) return Number(((x / 5) * 0.10).toFixed(4))
  if (x <= 10) return Number((0.10 + (x - 5) / 5 * 0.10).toFixed(4))
  if (x <= 30) return Number((0.20 + (x - 10) / 20 * 0.10).toFixed(4))
  return 0.30
}

function ladderRowSellRate(row, price) {
  const cost = Number(row.cost) || 0
  if (!cost) return 0
  return ladderPnlSellRate(((price - cost) / cost) * 100)
}

function buildLadderSellBands(rows, price, userToken, rateOf) {
  const buckets = LADDER_PNL_BANDS.map((band) => ({ ...band, holdAmt: 0, sellAmt: 0 }))
  for (const row of rows) {
    const cost = Number(row.cost) || 0
    const pnl = ((price - cost) / (cost || 1)) * 100
    const band = buckets.find((item) => item.test(pnl))
    if (!band) continue
    const amt = Number(row.amount) || 0
    band.holdAmt += amt
    band.sellAmt += amt * rateOf(row)
  }
  const expectedSell = Number(buckets.reduce((sum, band) => sum + band.sellAmt, 0).toFixed(1))
  const sellBands = buckets
    .map((band) => {
      const holdAmt = Number(band.holdAmt.toFixed(1))
      const sellAmt = Number(band.sellAmt.toFixed(1))
      return {
        key: band.key,
        label: band.label,
        short: band.short,
        kind: band.kind,
        holdAmt,
        sellAmt,
        holdPct: userToken ? Number((holdAmt / userToken * 100).toFixed(1)) : 0,
        sellPct: expectedSell ? Number((sellAmt / expectedSell * 100).toFixed(1)) : 0
      }
    })
    .filter((band) => band.holdAmt > 0)
  return { expectedSell, sellBands }
}

export function generateOpsDesk(pair, sleepIdleDays = 30, internalAccounts, dateKey = '') {
  const d = getPairData(pair)
  const pairSeed = pairSeedOf(pair)
  const px = pairPxMeta(d)
  const chips = generateUserChips(pair, sleepIdleDays, internalAccounts)
  const desk = generateDashboardDesk(pair, internalAccounts)
  const internal = generateInternalChips(pair, internalAccounts)
  const obi = generateObiDetail(pair)
  const last = px.lastPrice
  const toU = (qtyWan) => Number((Number(qtyWan || 0) * last).toFixed(1))

  const userToken = Number(chips.kpis.totalAmount) || 0
  const userCashU = Number((desk.users.holders * (1.1 + pairSeed * 0.22) + userToken * last * 0.22).toFixed(1))
  const userTokenU = toU(userToken)
  const lockedRatio = Number(internal.kpis.lockedRatio) || 0
  const treasuryAmt = Number(internal.kpis.ownedAmount) || 0
  const dumpable = Number(desk.mm.tokenInv) || 0
  const dumpableU = Number(desk.mm.tokenU) || toU(dumpable)
  const ownUsdtNow = Number(desk.mm.cashU) || 0
  const tokenOwn = Number(desk.mm.tokenOwn) || 0
  const tokenBorrowed = Number(desk.mm.tokenBorrowed) || 0
  const cashTrueU = Number(desk.mm.cashTrueU) || 0
  const cashBorrowedU = Number(desk.mm.cashBorrowedU) || 0

  const realBidQty = Number(obi.kpis.realBid) || 80
  const realAskQty = Number(obi.kpis.realAsk) || 80
  const bid2Qty = Number((realBidQty * 0.32).toFixed(1))
  const bid5Qty = Number((realBidQty * 0.7).toFixed(1))
  const bid10Qty = Number((realBidQty * 1.18).toFixed(1))
  const ask2Qty = Number((realAskQty * 0.32).toFixed(1))
  const ask5Qty = Number((realAskQty * 0.7).toFixed(1))
  const ask10Qty = Number((realAskQty * 1.18).toFixed(1))
  const bid2U = toU(bid2Qty)
  const bid5U = toU(bid5Qty)
  const bid10U = toU(bid10Qty)
  const ask2U = toU(ask2Qty)
  const ask5U = toU(ask5Qty)
  const ask10U = toU(ask10Qty)

  const sellHigh = Number((desk.users.realBuy * (18 + pairSeed) / 10).toFixed(1))
  const buyLow = Number((sellHigh * (0.97 + pairSeed * 0.008)).toFixed(1))
  const avgSell = Number((last * (1.08 + pairSeed * 0.006)).toFixed(Math.max(px.digits, 2)))
  const avgBuy = Number((last * (0.92 - pairSeed * 0.004)).toFixed(Math.max(px.digits, 2)))
  const usdtIn30 = Number((sellHigh * avgSell).toFixed(1))
  const usdtOut30 = Number((buyLow * avgBuy).toFixed(1))
  const usdtNet30 = Number((usdtIn30 - usdtOut30).toFixed(1))
  const tokenDelta = Number((buyLow - sellHigh).toFixed(1))
  const matched = Number(Math.min(sellHigh, buyLow).toFixed(1))
  const spreadPct = avgBuy ? Number((((avgSell - avgBuy) / avgBuy) * 100).toFixed(1)) : 0
  const sold30 = sellHigh
  const boughtBack = buyLow
  const netDump30 = Number((sellHigh - buyLow).toFixed(1))

  const dates = []
  const userHold = []
  const ownedHold = []
  const usdtIn = []
  const ownUsdt = []
  const end = new Date('2026-08-28T00:00:00')
  const startUsdt = Number(Math.max(8, ownUsdtNow - usdtNet30).toFixed(1))
  for (let i = 0; i < 30; i++) {
    const day = new Date(end)
    day.setDate(end.getDate() - (29 - i))
    dates.push(`${String(day.getMonth() + 1).padStart(2, '0')}/${String(day.getDate()).padStart(2, '0')}`)
    const t = i / 29
    const wave = Math.sin((i + pairSeed) / 5) * 0.02
    userHold.push(Number((userToken * (0.97 + t * 0.03 + wave * 0.3)).toFixed(1)))
    ownedHold.push(Number((dumpable * (1 + wave) - tokenDelta * (1 - t)).toFixed(1)))
    const u = Number((startUsdt + (ownUsdtNow - startUsdt) * t + Math.abs(wave) * 6).toFixed(1))
    ownUsdt.push(u)
    usdtIn.push(Number((usdtNet30 / 30 * (0.5 + t * 0.9 + Math.abs(wave) * 3)).toFixed(1)))
  }
  if (dates.length) {
    userHold[29] = userToken
    ownedHold[29] = dumpable
    ownUsdt[29] = ownUsdtNow
  }

  const cashBands = [
    { name: '<1万USDT', users: Math.round(desk.users.holders * 0.46), cashU: Number((userCashU * 0.08).toFixed(1)), color: '#6a9aff' },
    { name: '1–10万USDT', users: Math.round(desk.users.holders * 0.32), cashU: Number((userCashU * 0.28).toFixed(1)), color: '#4cd9a0' },
    { name: '10–50万USDT', users: Math.round(desk.users.holders * 0.16), cashU: Number((userCashU * 0.37).toFixed(1)), color: '#ffb347' },
    { name: '≥50万USDT', users: Math.max(1, Math.round(desk.users.holders * 0.06)), cashU: Number((userCashU * 0.27).toFixed(1)), color: '#a78bfa' }
  ]

  const newMoneyU = Number((userCashU * (0.22 + pairSeed * 0.03)).toFixed(1))
  const oldMoneyU = Number((userCashU - newMoneyU).toFixed(1))
  const inboundQty = Number((12 + pairSeed * 4 + (pairSeed % 3) * 8).toFixed(1))

  const rows = chips.rows || []
  const sumAmt = (list) => Number(list.reduce((sum, row) => sum + Number(row.amount || 0), 0).toFixed(1))
  const wallUAt = (pct) => {
    const abs = Math.abs(pct)
    if (abs <= 2) return bid2U
    if (abs <= 5) return bid5U
    if (abs <= 10) return bid10U
    return Number((bid10U * 1.45).toFixed(1))
  }

  const askUAt = (pct) => {
    const abs = Math.abs(pct)
    if (abs <= 2) return ask2U
    if (abs <= 5) return ask5U
    if (abs <= 10) return ask10U
    return Number((ask10U * 1.45).toFixed(1))
  }

  const steps = [20, 10, 5, 0, -5, -10, -20]
  const ladder = steps.map((pct) => {
    const price = Number((last * (1 + pct / 100)).toFixed(px.digits))
    const profitRows = rows.filter((row) => row.cost < price)
    const lossRows = rows.filter((row) => row.cost >= price)
    const profitAmt = sumAmt(profitRows)
    const lossAmt = sumAmt(lossRows)
    const profitPct = userToken ? Number((profitAmt / userToken * 100).toFixed(1)) : 0
    const lossPct = userToken ? Number((lossAmt / userToken * 100).toFixed(1)) : 0
    const side = pct < 0 ? 'down' : pct > 0 ? 'up' : 'spot'
    const wallU = wallUAt(pct)
    const wallQty = price ? Number((wallU / price).toFixed(1)) : 0
    const askU = askUAt(pct)
    const askQty = price ? Number((askU / price).toFixed(1)) : 0
    const bookQty = Number((wallQty + askQty).toFixed(1))

    const newlyAmt = sumAmt(rows.filter((row) => row.cost < last && row.cost >= price))

    let wallBuyQty = 0
    let chipName = '浮盈'
    let chipAmt = profitAmt
    let chipPct = profitPct
    let chipUsers = profitRows.length

    if (side === 'down') {
      wallBuyQty = wallQty
      chipName = '被套'
      chipAmt = lossAmt
      chipPct = lossPct
      chipUsers = lossRows.length
    } else if (side === 'spot') {
      wallBuyQty = wallQty
    }

    const { expectedSell, sellBands } = buildLadderSellBands(rows, price, userToken, (row) => (
      ladderRowSellRate(row, price)
    ))

    const buyParts = [
      { key: 'wall', kind: 'wall', label: '已挂单买墙', buyAmt: wallBuyQty }
    ]
    const expectedBuy = Number(buyParts.reduce((sum, part) => sum + Number(part.buyAmt || 0), 0).toFixed(1))
    const buyBands = buyParts
      .map((part) => ({
        ...part,
        buyAmt: Number(part.buyAmt.toFixed(1)),
        buyPct: expectedBuy ? Number((part.buyAmt / expectedBuy * 100).toFixed(1)) : 0
      }))
      .filter((part) => part.buyAmt > 0)
    const expectedSellU = Number((expectedSell * price).toFixed(1))
    const expectedBuyU = Number((expectedBuy * price).toFixed(1))
    const netQty = Number((expectedBuy - expectedSell).toFixed(1))
    const cover = expectedSellU > 0.1 ? Number(Math.min(999, expectedBuyU / expectedSellU * 100).toFixed(0)) : (expectedBuyU > 0 ? 999 : 0)
    const spendableU = Math.max(0, ownUsdtNow)
    const capByOwnU = price ? Number((spendableU / price).toFixed(1)) : 0
    const youDump = Number(Math.min(dumpable, expectedBuy).toFixed(1))
    const youAbsorb = Number(Math.min(expectedSell, capByOwnU).toFixed(1))
    const whySell = side === 'down'
      ? `到这一档，浮亏按亏损率砍仓：浮亏5%约卖10%仓，10%约卖20%，30%约卖30%。本档预估卖出 ${fmtQtyPlain(expectedSell)}万。`
      : side === 'up'
        ? `到这一档，浮盈按盈利率兑现：浮盈5%约卖10%仓，10%约卖20%，30%约卖30%。本档预估卖出 ${fmtQtyPlain(expectedSell)}万。`
        : `到现价，浮盈按盈利率兑现、浮亏按亏损率砍仓。浮盈/浮亏5%约卖10%仓，10%约卖20%，30%约卖30%。本档预估卖出 ${fmtQtyPlain(expectedSell)}万。`
    const whyBuy = side === 'down'
      ? `价格砸到这一档，该档及以下真实用户买单会成交。不计未挂单的闲置资金。本档预估买入 ${fmtQtyPlain(expectedBuy)}万。`
      : side === 'up'
        ? `买墙挂在现价下方，跟不上。未挂单资金不算。本档预估买入 ${fmtQtyPlain(expectedBuy)}万。`
        : `现价附近真实用户买单。不计未挂单的闲置资金。本档预估买入 ${fmtQtyPlain(expectedBuy)}万。`
    let play = '看'
    let playWhy = ''
    if (side === 'up') {
      play = expectedBuy >= Math.max(dumpable * 0.2, 1) ? '可卖出' : '对手接不住'
      playWhy = `卖出：维持这一档要对手买 ${fmtQtyPlain(expectedBuy)}万，做市库存 ${fmtQtyPlain(dumpable)}万，最多卖掉 ${fmtQtyPlain(youDump)}万。`
    } else if (side === 'down') {
      play = ownUsdtNow >= expectedSellU * 0.55 ? '可买入' : '余额不够'
      playWhy = `买入：维持这一档要对手卖 ${fmtQtyPlain(expectedSell)}万（${fmtQtyPlain(expectedSellU)}万USDT），做市账户余额 ${signedPlain(ownUsdtNow)}万USDT，最多买回 ${fmtQtyPlain(youAbsorb)}万。`
    } else {
      play = netQty >= 0 ? '可卖出' : '可买入'
      playWhy = `现价：预估卖出 ${fmtQtyPlain(expectedSell)}万 · 预估买入 ${fmtQtyPlain(expectedBuy)}万。用户持有流通代币 ${fmtQtyPlain(userToken)}万。`
    }
    const stance = play
    const playKind = (play === '可卖出' || play === '可买入') ? 'ok' : (play === '对手接不住' || play === '余额不够' || play === '自己USDT不够') ? 'no' : 'watch'

    return {
      pct,
      side,
      label: pct === 0 ? '现价' : (pct > 0 ? `+${pct}%` : `${pct}%`),
      price: fmtPxValue(price, px.digits),
      lastPrice: chips.kpis.lastPriceLabel,
      profitAmt,
      profitPct,
      lossAmt,
      lossPct,
      chipName,
      chipAmt,
      chipPct,
      users: chipUsers,
      newlyTrapped: newlyAmt,
      surfaceToken: side === 'up' ? 0 : wallQty,
      surfaceTokenU: side === 'up' ? 0 : Number((Number(wallU) || 0).toFixed(1)),
      bookQty,
      expectedSell,
      sellBands,
      expectedSellU,
      expectedBuy,
      buyBands,
      expectedBuyU,
      netQty,
      youDump,
      youAbsorb,
      play,
      playKind,
      playWhy,
      bidU: wallU,
      wallQty,
      askQty,
      cover,
      stance,
      whySell,
      whyBuy
    }
  })

  ladder.forEach((row) => {
    if (row.pct === 0) {
      row.bandQty = 0
      row.bandU = 0
      row.cumQty = 0
      row.cumU = 0
      row.bookSide = 'spot'
      return
    }
    const cumU = row.pct > 0 ? askUAt(row.pct) : wallUAt(row.pct)
    const pxn = Number(last * (1 + row.pct / 100))
    row.cumU = Number(Number(cumU).toFixed(1))
    row.cumQty = pxn ? Number((cumU / pxn).toFixed(1)) : 0
    row.bookSide = row.pct > 0 ? 'ask' : 'bid'
  })
  const fillLadderBand = (list) => {
    let prevQty = 0
    let prevU = 0
    for (const row of list) {
      row.bandQty = Number(Math.max(0, row.cumQty - prevQty).toFixed(1))
      row.bandU = Number(Math.max(0, row.cumU - prevU).toFixed(1))
      prevQty = row.cumQty
      prevU = row.cumU
    }
  }
  fillLadderBand(ladder.filter((row) => row.pct < 0).sort((a, b) => b.pct - a.pct))
  fillLadderBand(ladder.filter((row) => row.pct > 0).sort((a, b) => a.pct - b.pct))

  const net = Number(desk.users.realNet) || 0
  const dev = px.devPct
  let action = '别动'
  let actionColor = 'red'
  let actionWhy = ''
  if (net > 0 && dev < 16 && userCashU > bid5U) {
    action = '可拉，卖出'
    actionColor = 'green'
  } else if (dev >= 16 && net > 0) {
    action = '停拉，等高位卖完'
    actionColor = 'yellow'
  } else if (net < 0 && bid5U > toU(Math.abs(net) * 3)) {
    action = '可砸，买入'
    actionColor = 'yellow'
  } else if (inboundQty > 20) {
    action = '先别拉'
    actionColor = 'red'
  }

  const ups = ladder.filter((row) => row.pct > 0)
  const downs = ladder.filter((row) => row.pct < 0).sort((a, b) => b.pct - a.pct)
  const nextStop = ups.find((row) => row.play !== '可卖出') || ups[ups.length - 1] || { label: '现价', price: chips.kpis.lastPriceLabel }
  const lastSafeDown = downs.filter((row) => row.play === '可买入').at(-1)
  const nextFloor = lastSafeDown || { label: '现价', price: chips.kpis.lastPriceLabel }
  const mmToday = generateMmToday(pair, internalAccounts)
  const usersOverlay = dateKey && !isDeskToday(dateKey)
    ? generateUsersToday(pair, internalAccounts, dateKey).kpis
    : null
  const users = usersOverlay
    ? {
        ...desk.users,
        realBuy: usersOverlay.realBuy,
        realSell: usersOverlay.realSell,
        realNet: usersOverlay.realNet,
        realUsers: usersOverlay.realUsers,
        holders: usersOverlay.holders,
        newTraders: usersOverlay.newTraders
      }
    : desk.users

  const payload = {
    formula: '',
    surfaceToken: userToken,
    ladderBlurb: '现价到该档的真实挂单：往上是卖墙，往下是买墙。现价行为起点，挂单为 0。',
    ladderGloss: {
      upSell: '到了这个价格，浮盈账户按盈利率兑现一部分仓位。赚得越多，可能卖出的仓位比例越高。',
      upSellRates: [
        { pnl: '5%', pct: 10 },
        { pnl: '10%', pct: 20 },
        { pnl: '30%', pct: 30 }
      ],
      downSell: '到了这个价格，浮亏账户按亏损率砍掉一部分仓位。亏得越多，可能卖出的仓位比例越高。',
      downSellRates: [
        { pnl: '5%', pct: 10 },
        { pnl: '10%', pct: 20 },
        { pnl: '30%', pct: 30 }
      ]
    },
    stance: {
      action,
      actionColor,
      actionWhy,
      lastPrice: chips.kpis.lastPriceLabel,
      avgCost: chips.kpis.avgCostLabel,
      devPct: dev,
      nextStop: nextStop.label,
      nextStopPrice: nextStop.price,
      nextFloor: nextFloor.label,
      nextFloorPrice: nextFloor.price
    },
    dump: applyDumpDay({
      sellHigh: desk.mm.sellQty,
      buyLow: desk.mm.buyQty,
      sold30,
      boughtBack,
      netDump30,
      tokenDelta: desk.mm.netQty,
      matched: desk.mm.matchedQty,
      avgSell: desk.mm.avgSell,
      avgBuy: desk.mm.avgBuy,
      avgNetPrice: desk.mm.avgNetPrice,
      lastPrice: desk.mm.lastPrice,
      spreadPct: desk.mm.spreadPct,
      usdtIn30: desk.mm.sellU,
      usdtOut30: desk.mm.buyU,
      usdtNet30: desk.mm.usdtNet,
      realizedU: desk.mm.realizedU,
      floatU: desk.mm.floatU,
      totalU: desk.mm.totalU,
      hours: mmToday.history.hours,
      sellHour: mmToday.history.sellHour,
      buyHour: mmToday.history.buyHour,
      retailBuy: desk.users.retailBuy,
      retailSell: desk.users.retailSell,
      retailNet: desk.users.retailNet,
      smartBuy: desk.users.smartBuy,
      smartSell: desk.users.smartSell,
      smartNet: desk.users.smartNet,
      realBuy: desk.users.realBuy,
      realSell: desk.users.realSell,
      realNet: desk.users.realNet,
      realUsers: users.realUsers,
      userToken,
      ownedAmt: dumpable,
      ownUsdt: ownUsdtNow,
      dumpable,
      dumpableU,
      tokenOwn,
      tokenBorrowed,
      cashTrueU,
      cashOwnU: cashTrueU,
      cashBorrowedU
    }, pair, internalAccounts, dateKey),
    absorb: applyAbsorbDay({
      userCashU,
      userToken,
      userTokenU,
      assetsU: Number((userCashU + userTokenU).toFixed(1)),
      holders: desk.users.holders,
      newMoneyU,
      oldMoneyU,
      bid2Qty,
      bid5Qty,
      bid10Qty,
      ask2Qty,
      ask5Qty,
      ask10Qty,
      bid2U,
      bid5U,
      bid10U,
      ask2U,
      ask5U,
      ask10U,
      realObi: obi.kpis.realObiLabel,
      inboundQty,
      cashBands,
      dumpableU,
      coverDump: dumpableU > 0.1 ? Number(Math.min(999, bid5U / dumpableU * 100).toFixed(0)) : 0
    }, pair, internalAccounts, dateKey, sleepIdleDays),
    ammo: {
      ownedAmt: dumpable,
      ownedPct: internal.kpis.ownedPct,
      lockedRatio,
      borrowedAmt: tokenBorrowed,
      dumpable,
      mmCashU: ownUsdtNow,
      treasuryAmt
    },
    users,
    ladder,
    mmToday,
    history: { dates, userHold, ownedHold, usdtIn, ownUsdt }
  }
  const lastPx = Number(payload.dump.lastPrice) || Number(payload.stance.lastPrice)
  payload.stance.mmCost = payload.dump.invCost
  payload.stance.mmLast = payload.dump.lastPrice
  payload.stance.mmDevPct = priceDevPct(lastPx, payload.dump.invCost)
  return payload
}

