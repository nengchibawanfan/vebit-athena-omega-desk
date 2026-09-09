export const PAIRS = ['VBT/USDT', 'BXT/USDT']

export const DESK_AS_OF = '2026-08-28'

export function normalizeDeskDate(value) {
  const raw = String(value || '').trim()
  if (!raw) return DESK_AS_OF
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  const md = raw.match(/^(\d{1,2})\/(\d{1,2})$/)
  if (md) {
    const year = DESK_AS_OF.slice(0, 4)
    return `${year}-${md[1].padStart(2, '0')}-${md[2].padStart(2, '0')}`
  }
  return DESK_AS_OF
}

export function deskDateLabel(dateKey) {
  const parts = normalizeDeskDate(dateKey).split('-')
  return `${parts[1]}/${parts[2]}`
}

export function deskDateTitle(dateKey) {
  const key = normalizeDeskDate(dateKey)
  if (key === DESK_AS_OF) return '今日'
  const parts = key.split('-')
  return `${Number(parts[1])}月${Number(parts[2])}日`
}

export function isDeskToday(dateKey) {
  return !dateKey || normalizeDeskDate(dateKey) === DESK_AS_OF
}

export const PAGE_TITLES = {
  dashboard: '今日总览',
  'ops-dump': '做市账户今日 <small>交易 + 资产 · 库存与 USDT</small>',
  'ops-dump-history': '做市账户历史 <small>交易 + 资产 · 点日期看当日</small>',
  'ops-absorb': '真实用户今日 <small>交易 + 资产 · 不含做市 / 金库等</small>',
  'ops-absorb-history': '真实用户历史 <small>交易 + 资产 · 点日期看当日</small>',
  'ops-ladder': '价格台阶 <small>真实挂单 · 厚度 · 成本偏离</small>',
  'circ-exchange': '交易所内流通总量 <small>活跃 + 沉睡 + 做市账户</small>',
  'circ-onchain': '链上仓库 <small>不能成交 · 充回所内才可卖</small>',
  orderbook: '盘面情况 <small>真实挂单 · 盘口大单 · 剔除做市</small>',
  position: '筹码行为 <small>持仓成本与用户心理</small>',
  risk: '机器人风控 <small>库存安全与策略参数</small>',
  robots: '机器人运行状态 <small>报价、做市库存与库存带</small>',
  'robots-config': '机器人配置 <small>策略 · 挂单 · 自成交 · 报价</small>',
  macro: '宏观威胁 <small>已并入链上仓库</small>',
  'detail-orders': '盘面情况 <small>已并入真实挂单与盘口大单</small>',
  'detail-holders': '持仓均价 <small>UID 所内剩余存货成本</small>',
  'detail-whales': '充提 <small>货进唯一市场</small>',
  'whales-exchange': '今日充提 <small>所内可卖供给 · 不含做市 / 金库等</small>',
  'whales-exchange-history': '历史充提 <small>日充值 / 提现 · 点日期看当日</small>',
  'whales-onchain': '链上仓库流水 <small>地址互转，不能成交</small>',
  'detail-external': '链上仓库明细 <small>随时可充回所内的筹码</small>',
  'chips-internal': '金库等 <small>不直接用来买入卖出 · 可周转的账在做市账户</small>',
  'chips-user': '真实用户持仓均价 <small>所内真实用户 · 不含做市 / 金库等</small>',
  'chips-external': '链上仓库明细 <small>不能成交 · 充回才可卖</small>',
  'chips-float': '真实浮动筹码 <small>已并入总览</small>',
  'chips-active': '活跃浮动筹码 <small>已并入所内流通</small>',
  'chips-address': '链上地址 <small>仓库门牌 · 会不会充回所内</small>',
  'desk-user': '单 UID <small>持仓、USDT、买卖</small>',
  'stable-profit': '稳定盈利账户 <small>已并入聪明钱</small>',
  'trade-risk': '交易风控 <small>已并入警报摘要</small>',
  'user-profile': '对手盘 <small>散户是猎物 · 聪明钱会跟你对做</small>',
  'persona-smart': '聪明钱 <small>会跟你对做 · 拉他们卖、砸他们买</small>',
  'persona-retail': '散户 <small>追涨接卖出 · 砍仓给你买入</small>',
  'persona-wool': '羊毛党 <small>从真实对手盘里剔除</small>',
  'persona-kol': '吃客损KOL <small>带散户追涨 · 放大器不是对手</small>',
  'persona-prog': '程序化交易 <small>扫薄档 · 和自有挂价分开</small>',
  'desk-mm': '做市账户今日资产情况 <small>你的代币和 USDT · 部分可能是从用户借入的虚增</small>',
  'desk-mm-history': '做市账户历史资产情况 <small>做市库存与现金 · 期末对齐今日</small>',
  'desk-users': '真实用户今日 <small>交易 + 资产 · 不含做市 / 金库等</small>',
  'desk-users-history': '真实用户历史 <small>交易 + 资产 · 点日期看当日</small>',
  'desk-users-chips': '筹码分布 <small>持仓均价 · 活跃 / 沉睡 · 不含做市 / 金库等</small>',
  'orderbook-obi': '价格台阶 <small>真实挂单 · 厚度 · 成本偏离</small>',
  'position-cost': '价格台阶 <small>真实挂单 · 厚度 · 成本偏离</small>',
  'stance-combo': '价格台阶 <small>真实挂单 · 厚度 · 成本偏离</small>',
  alerts: '报警 <small>充值、买墙、偏离、库存带</small>'
}

export const NAV_ITEMS = [
  { divider: true, label: '操盘' },
  { to: '/', page: 'dashboard', icon: '📊', label: '总览' },
  { to: '/ops/ladder', page: 'ops-ladder', icon: '🪜', label: '价格台阶' },
  {
    icon: '🤖',
    label: '做市账户',
    children: [
      { to: '/ops/dump', page: 'ops-dump', icon: '📤', label: '今日' },
      { to: '/ops/dump/history', page: 'ops-dump-history', icon: '📜', label: '历史' }
    ]
  },
  {
    icon: '👥',
    label: '真实用户',
    children: [
      { to: '/desk/users', page: 'desk-users', icon: '👥', label: '今日' },
      { to: '/desk/users/history', page: 'desk-users-history', icon: '📜', label: '历史' },
      { to: '/desk/users/chips', page: 'desk-users-chips', icon: '📊', label: '筹码分布' },
      { to: '/desk/user', page: 'desk-user', icon: '🔎', label: '单 UID', match: 'user' }
    ]
  },
  { divider: true, label: '对手盘' },
  { to: '/user-profile/retail', page: 'persona-retail', icon: '👤', label: '散户' },
  { to: '/user-profile/smart', page: 'persona-smart', icon: '🧠', label: '聪明钱' },
  { divider: true, label: '盘口' },
  { to: '/orderbook', page: 'orderbook', icon: '⚡', label: '盘面情况' },
  { divider: true, label: '自己的账' },
  {
    icon: '🦾',
    label: '机器人',
    children: [
      { to: '/robots', page: 'robots', icon: '📡', label: '运行状态' },
      { to: '/robots/config', page: 'robots-config', icon: '⚙️', label: '配置' }
    ]
  },
  { to: '/chips/internal', page: 'chips-internal', icon: '🔒', label: '金库等' },
  { divider: true, label: '仓库' },
  {
    icon: '🚚',
    label: '充提',
    children: [
      { to: '/whales/exchange', page: 'whales-exchange', icon: '📥', label: '今日充提' },
      { to: '/whales/exchange/history', page: 'whales-exchange-history', icon: '📜', label: '历史充提' }
    ]
  },
  { divider: true, label: '监控' },
  { to: '/alerts', page: 'alerts', icon: '🚨', label: '报警' }
]

export const PERSONA_PAGES = [
  { key: 'smart', page: 'persona-smart', label: '聪明钱', color: '#4cd9a0', className: 'success' },
  { key: 'retail', page: 'persona-retail', label: '散户', color: '#ffb347', className: 'warning' },
  { key: 'wool', page: 'persona-wool', label: '羊毛党', color: '#ff5a7a', className: 'alert' },
  { key: 'kol', page: 'persona-kol', label: '吃客损KOL', color: '#a78bfa', className: 'alert' },
  { key: 'prog', page: 'persona-prog', label: '程序化交易', color: '#4a8aff', className: 'robot' }
]

export const ROBOT_STRATEGIES = [
  { value: 'quote', label: '做市报价', hint: '买卖双边挂单，跟着现价' },
  { value: 'guard', label: '护盘托价', hint: '买盘加厚，卖盘减薄' },
  { value: 'inventory', label: '库存回归', hint: '库存偏高就卖、偏低就买' },
  { value: 'follow', label: '跟价推进', hint: '现价跟着目标台阶走' },
  { value: 'passive', label: '仅挂不吃', hint: '报价但不主动吃单' }
]

export const QUOTE_SPREAD_TYPES = [
  { value: 'fixed', label: '固定' },
  { value: 'percent', label: '百分比' }
]

export const DEFAULT_ORDER_RULE = {
  id: 1,
  minPrice: 0.1,
  maxPrice: 0.3,
  minAmt: 10000,
  maxAmt: 20000,
  count: 5
}

export const DEFAULT_ORDER = {
  bid: [{ id: 1, minPrice: 0.1, maxPrice: 0.3, minAmt: 10000, maxAmt: 20000, count: 5 }],
  ask: [{ id: 1, minPrice: 0.1, maxPrice: 0.3, minAmt: 10000, maxAmt: 20000, count: 5 }]
}

export const ORDER_SIDES = [
  { key: 'ask', label: 'Ask 卖' },
  { key: 'bid', label: 'Bid 买' }
]

export const ORDER_RULE_FIELDS = [
  { key: 'minPrice', label: '最小百分比', hint: '0.1 = 千分之一', step: '0.01' },
  { key: 'maxPrice', label: '最大百分比', hint: '0.3 = 千分之三', step: '0.01' },
  { key: 'minAmt', label: '最小每单数量 (USDT)', step: '0.00000001' },
  { key: 'maxAmt', label: '最大每单数量 (USDT)', step: '0.00000001' },
  { key: 'count', label: '挂单数量', step: '1' }
]

export const DEFAULT_WASH = {
  minIntervalMs: 1000
}

export const DEFAULT_QUOTE = {
  spreadType: 'fixed',
  bidSpread: 0.1,
  askSpread: 0.1,
  minDistance: 0.1,
  maxDistance: 0.2,
  priceRandom: 1
}

export const WASH_FIELDS = [
  { key: 'minIntervalMs', label: '最小成交时间间隔 (ms)', step: '1' }
]

export const QUOTE_FIELDS = [
  { key: 'spreadType', label: '价差类型', type: 'select', options: QUOTE_SPREAD_TYPES },
  { key: 'bidSpread', label: '买盘价差', step: '0.00000001' },
  { key: 'askSpread', label: '卖盘价差', step: '0.00000001' },
  { key: 'minDistance', label: '盘口最小距离', step: '0.00000001' },
  { key: 'maxDistance', label: '盘口最大距离', step: '0.00000001' },
  { key: 'priceRandom', label: '价格随机比例', step: '0.00000001' }
]

export const STRATEGY_SECTIONS = [
  { key: 'order', title: '挂单配置', hint: '百分比相对现价，0.1–0.3 即千分之一到千分之三', type: 'order' },
  { key: 'wash', title: '自成交配置', fields: WASH_FIELDS },
  { key: 'quote', title: '报价配置', hint: '价差、盘口距离、价格抖动', fields: QUOTE_FIELDS }
]

function strategyPack(order = {}, wash = {}, quote = {}) {
  return {
    order: order.bid || order.ask
      ? { bid: order.bid || [], ask: order.ask || [] }
      : { bid: DEFAULT_ORDER.bid.map((item) => ({ ...item })), ask: DEFAULT_ORDER.ask.map((item) => ({ ...item })) },
    wash: { ...DEFAULT_WASH, ...wash },
    quote: { ...DEFAULT_QUOTE, ...quote }
  }
}

export const DEFAULT_STRATEGIES = {
  quote: strategyPack(),
  guard: strategyPack(
    {
      bid: [
        { id: 1, minPrice: 0.05, maxPrice: 0.15, minAmt: 15000, maxAmt: 30000, count: 5 },
        { id: 2, minPrice: 0.2, maxPrice: 0.4, minAmt: 20000, maxAmt: 40000, count: 3 }
      ],
      ask: [
        { id: 1, minPrice: 0.1, maxPrice: 0.3, minAmt: 5000, maxAmt: 12000, count: 3 }
      ]
    },
    {},
    { bidSpread: 0.05, askSpread: 0.18, minDistance: 0.05, maxDistance: 0.15 }
  ),
  inventory: strategyPack(
    {
      bid: [{ id: 1, minPrice: 0.15, maxPrice: 0.35, minAmt: 8000, maxAmt: 18000, count: 4 }],
      ask: [{ id: 1, minPrice: 0.15, maxPrice: 0.35, minAmt: 8000, maxAmt: 18000, count: 4 }]
    },
    {},
    { bidSpread: 0.15, askSpread: 0.15, minDistance: 0.12, maxDistance: 0.3 }
  ),
  follow: strategyPack(
    {
      bid: [{ id: 1, minPrice: 0.05, maxPrice: 0.15, minAmt: 6000, maxAmt: 12000, count: 3 }],
      ask: [{ id: 1, minPrice: 0.05, maxPrice: 0.15, minAmt: 6000, maxAmt: 12000, count: 3 }]
    },
    {},
    { bidSpread: 0.06, askSpread: 0.06, minDistance: 0.04, maxDistance: 0.1, priceRandom: 0.5 }
  ),
  passive: strategyPack(
    {
      bid: [{ id: 1, minPrice: 0.2, maxPrice: 0.5, minAmt: 10000, maxAmt: 25000, count: 6 }],
      ask: [{ id: 1, minPrice: 0.2, maxPrice: 0.5, minAmt: 10000, maxAmt: 25000, count: 6 }]
    },
    {},
    { bidSpread: 0.2, askSpread: 0.2, minDistance: 0.15, maxDistance: 0.4 }
  )
}

export const DEFAULT_ROBOT = {
  enabled: true,
  strategies: DEFAULT_STRATEGIES,
  bots: [
    { uid: '88001', running: true, strategy: 'quote', wash: true },
    { uid: '88002', running: true, strategy: 'inventory', wash: false }
  ]
}

export const DEFAULT_CONFIG = {
  depthLevels: 10,
  obiWarn: 0.4,
  costDevWarn: 20,
  inventoryLow: 20,
  inventoryHigh: 80,
  washThreshold: 65,
  whaleThreshold: 50,
  winDaysRatio: 60,
  singleGainRatio: 30,
  maxDrawdown: 30,
  recoveryDays: 7,
  totalTrades: 100,
  activeDays: 30,
  tradeFreqThreshold: 20,
  cancelFreqThreshold: 15,
  volumeRatioThreshold: 10,
  priceChangeThreshold: 5,
  smallCancelThreshold: 10,
  sleepIdleDays: 30,
  sleepSizeThreshold: 50,
  excludedAddresses: [
    { address: '0x3f8a1c0123456789abcdef0123456789abcdb20d', type: 'hot_wallet', remark: 'Binance 热钱包' },
    { address: '0x7c21e40123456789abcdef0123456789abcd91aa', type: 'hot_wallet', remark: 'OKX 热钱包' },
    { address: '0xbb04d20123456789abcdef0123456789abcd55e1', type: 'lock_contract', remark: '团队锁仓合约' },
    { address: '0x19ae770123456789abcdef0123456789abcdc08f', type: 'lock_contract', remark: '顾问锁仓合约' }
  ],
  internalAccounts: [
    { uid: '88001', type: 'mm', remark: '做市主账户' },
    { uid: '88002', type: 'mm', remark: '做市备用账户' },
    { uid: '71001', type: 'treasury', remark: '平台金库多签' },
    { uid: '71002', type: 'treasury', remark: '运营周转钱包' },
    { uid: '62001', type: 'project', remark: '项目方多签' },
    { uid: '62002', type: 'project', remark: '生态激励钱包' },
    { uid: '53001', type: 'staff', remark: '核心团队' },
    { uid: '53002', type: 'staff', remark: '顾问归属' },
    { uid: '44001', type: 'lp', remark: '现货底池 LP' },
    { uid: '44002', type: 'lp', remark: '应急流动性' }
  ],
  robot: DEFAULT_ROBOT
}

export const EXCLUDE_TYPES = [
  { value: 'hot_wallet', label: '交易所热钱包' },
  { value: 'lock_contract', label: '合约锁仓' },
  { value: 'other', label: '其他' }
]

export const INTERNAL_ACCOUNT_TYPES = [
  { value: 'mm', label: '做市账户', borrowed: true },
  { value: 'treasury', label: '平台金库', borrowed: false },
  { value: 'project', label: '项目方', borrowed: false },
  { value: 'staff', label: '内部人员', borrowed: false },
  { value: 'lp', label: 'LP 底池', borrowed: false }
]

export const DEFAULT_RULE_CONFIG = {
  smartTradeCount: 15,
  smartWinRate: 60,
  smartProfitRatio: 1.5,
  smartPosition: 2,
  retailTradeCount: 15,
  retailNetProfit: 'negative',
  retailWinRate: 40,
  retailHoldRatio: 3,
  retailLiquidation: 50,
  woolDevice: 3,
  woolIP: 5,
  kolFollowMin: 20,
  kolDumpWindow: 15,
  kolReverseRatio: 60,
  progHoldTime: 1,
  progCancelRatio: 20
}

export const PERSONA_RULE_FIELDS = {
  smart: [
    { key: 'smartTradeCount', label: '交易笔数 ≥', min: 1, unit: '笔' },
    { key: 'smartWinRate', label: '胜率 ≥', min: 0, max: 100, unit: '%' },
    { key: 'smartProfitRatio', label: '盈亏比 ≥', min: 0, step: 0.1 },
    { key: 'smartPosition', label: '单笔仓位 ≥', min: 0, step: 0.1, unit: '倍' }
  ],
  retail: [
    { key: 'retailTradeCount', label: '交易笔数 ≥', min: 1, unit: '笔' },
    { key: 'retailNetProfit', label: '净收益', type: 'select', options: [{ value: 'negative', label: '为负数' }, { value: 'positive', label: '为正数' }] },
    { key: 'retailWinRate', label: '胜率 ≤', min: 0, max: 100, unit: '%' },
    { key: 'retailHoldRatio', label: '持仓时间比 ≥', min: 0, step: 0.5 },
    { key: 'retailLiquidation', label: '强平率 ≥', min: 0, max: 100, unit: '%' }
  ],
  wool: [
    { key: 'woolDevice', label: '同一设备 ≥', min: 1, unit: '个' },
    { key: 'woolIP', label: '同一IP段 ≥', min: 1, unit: '个' }
  ],
  kol: [
    { key: 'kolFollowMin', label: '跟风散户 ≥', min: 1, unit: '人' },
    { key: 'kolDumpWindow', label: '喊单后净卖窗口 ≤', min: 1, unit: '分钟' },
    { key: 'kolReverseRatio', label: '反向成交占比 ≥', min: 0, max: 100, unit: '%' }
  ],
  prog: [
    { key: 'progHoldTime', label: '持仓生命周期 ≤', min: 0, unit: '分钟' },
    { key: 'progCancelRatio', label: '挂撤比 ≥', min: 0, unit: '倍' }
  ]
}

export const PAIR_STORAGE_PREFIX = 'tradingConfig_'
