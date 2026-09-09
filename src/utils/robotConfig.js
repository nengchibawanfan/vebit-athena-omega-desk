import {
  DEFAULT_ORDER,
  DEFAULT_ORDER_RULE,
  DEFAULT_QUOTE,
  DEFAULT_ROBOT,
  DEFAULT_STRATEGIES,
  DEFAULT_WASH,
  QUOTE_SPREAD_TYPES,
  ROBOT_STRATEGIES
} from '@/config/constants'

const STRATEGY_SET = new Set(ROBOT_STRATEGIES.map((item) => item.value))
const SPREAD_SET = new Set(QUOTE_SPREAD_TYPES.map((item) => item.value))

function num(value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function cloneOrderRule(raw = {}, fallback = DEFAULT_ORDER_RULE, index = 0) {
  const src = raw && typeof raw === 'object' ? raw : {}
  const base = fallback || DEFAULT_ORDER_RULE
  return {
    id: Math.max(1, Math.round(num(src.id, index + 1))),
    minPrice: Math.max(0, num(src.minPrice ?? src.minPct, base.minPrice)),
    maxPrice: Math.max(0, num(src.maxPrice ?? src.maxPct, base.maxPrice)),
    minAmt: Math.max(0, num(src.minAmt, src.minBuyAmt ?? src.minSellAmt ?? base.minAmt)),
    maxAmt: Math.max(0, num(src.maxAmt, src.maxBuyAmt ?? src.maxSellAmt ?? base.maxAmt)),
    count: Math.max(1, Math.round(num(src.count, src.bidDepth ?? src.askDepth ?? base.count)))
  }
}

function cloneOrderSide(list, fallbackList, legacyRule) {
  if (Array.isArray(list)) {
    return list.map((item, index) => cloneOrderRule(item, fallbackList[index] || fallbackList[0] || DEFAULT_ORDER_RULE, index))
  }
  if (legacyRule) return [cloneOrderRule(legacyRule, fallbackList[0] || DEFAULT_ORDER_RULE, 0)]
  return (fallbackList || []).map((item, index) => cloneOrderRule(item, item, index))
}

export function sortOrderRules(rules) {
  return [...(rules || [])].sort((a, b) => {
    const min = Number(a.minPrice) - Number(b.minPrice)
    if (min) return min
    const max = Number(a.maxPrice) - Number(b.maxPrice)
    if (max) return max
    return Number(a.id) - Number(b.id)
  })
}

function cloneOrder(raw = {}, fallback = DEFAULT_ORDER) {
  const src = raw && typeof raw === 'object' ? raw : {}
  const base = fallback || DEFAULT_ORDER
  const hasSides = Array.isArray(src.bid) || Array.isArray(src.ask)
  const legacyBid = hasSides ? null : {
    minPrice: src.minPrice,
    maxPrice: src.maxPrice,
    minAmt: src.minBuyAmt ?? src.minAmt,
    maxAmt: src.maxBuyAmt ?? src.maxAmt,
    count: src.bidDepth ?? src.count
  }
  const legacyAsk = hasSides ? null : {
    minPrice: src.minPrice,
    maxPrice: src.maxPrice,
    minAmt: src.minSellAmt ?? src.minAmt,
    maxAmt: src.maxSellAmt ?? src.maxAmt,
    count: src.askDepth ?? src.count
  }
  const usedLegacy = !hasSides && (src.minBuyAmt != null || src.maxBuyAmt != null || src.bidDepth != null || src.minSellAmt != null)
  return {
    bid: sortOrderRules(cloneOrderSide(src.bid, base.bid, usedLegacy ? legacyBid : null)),
    ask: sortOrderRules(cloneOrderSide(src.ask, base.ask, usedLegacy ? legacyAsk : null))
  }
}

export function nextOrderRuleId(rules) {
  const ids = (rules || []).map((item) => Number(item.id) || 0)
  return (ids.length ? Math.max(...ids) : 0) + 1
}

export function orderSideCount(rules) {
  return (rules || []).reduce((sum, item) => sum + Math.max(0, Number(item.count) || 0), 0)
}

function cloneWash(raw = {}, fallback = DEFAULT_WASH) {
  const src = raw && typeof raw === 'object' ? raw : {}
  const base = fallback || DEFAULT_WASH
  return {
    minIntervalMs: Math.max(1, Math.round(num(src.minIntervalMs, src.intervalMs ?? base.minIntervalMs)))
  }
}

function cloneQuoteParams(raw = {}, fallback = DEFAULT_QUOTE) {
  const src = raw && typeof raw === 'object' ? raw : {}
  const base = fallback || DEFAULT_QUOTE
  const spreadType = SPREAD_SET.has(src.spreadType) ? src.spreadType : base.spreadType
  return {
    spreadType,
    bidSpread: Math.max(0, num(src.bidSpread, base.bidSpread)),
    askSpread: Math.max(0, num(src.askSpread, base.askSpread)),
    minDistance: Math.max(0, num(src.minDistance, base.minDistance)),
    maxDistance: Math.max(0, num(src.maxDistance, base.maxDistance)),
    priceRandom: Math.max(0, num(src.priceRandom, base.priceRandom))
  }
}

function isNestedPack(raw) {
  return !!(raw && typeof raw === 'object' && (raw.order || raw.wash || raw.quote))
}

export function cloneStrategyPack(key, raw = {}) {
  const defaults = DEFAULT_STRATEGIES[key] || DEFAULT_STRATEGIES.quote
  const src = raw && typeof raw === 'object' ? raw : {}
  if (isNestedPack(src)) {
    return {
      order: cloneOrder(src.order, defaults.order),
      wash: cloneWash(src.wash, defaults.wash),
      quote: cloneQuoteParams(src.quote, defaults.quote)
    }
  }
  return {
    order: cloneOrder(src, defaults.order),
    wash: cloneWash({ ...src, enabled: src.washEnabled ?? src.enabled }, defaults.wash),
    quote: cloneQuoteParams(src, defaults.quote)
  }
}

function legacyQuoteSeed(src = {}) {
  if (Array.isArray(src.quotes) && src.quotes.length) {
    return src.quotes.find((item) => item?.enabled !== false) || src.quotes[0]
  }
  if (src.quote && typeof src.quote === 'object') {
    return { ...src.quote, washEnabled: src.quote.washEnabled ?? src.wash?.enabled }
  }
  return null
}

export function cloneStrategies(src = {}) {
  const nested = src.strategies
  const list = Array.isArray(nested)
    ? Object.fromEntries(nested.map((item) => [item?.id || item?.key, item]))
    : nested && typeof nested === 'object'
      ? nested
      : null
  const seed = list ? null : legacyQuoteSeed(src)
  return Object.fromEntries(
    ROBOT_STRATEGIES.map((item) => {
      const found = list?.[item.value]
      if (found) return [item.value, cloneStrategyPack(item.value, found)]
      if (seed) return [item.value, cloneStrategyPack(item.value, seed)]
      return [item.value, cloneStrategyPack(item.value, DEFAULT_STRATEGIES[item.value])]
    })
  )
}

export function strategyPackOf(robot, key) {
  const strategies = robot?.strategies || {}
  return strategies[key] || strategies.quote || cloneStrategyPack('quote')
}

export function activeStrategyKey(robot) {
  const running = (robot?.bots || []).find((bot) => bot.running !== false)
  const key = running?.strategy || 'quote'
  return STRATEGY_SET.has(key) && robot?.strategies?.[key] ? key : 'quote'
}

function flattenQuote(pack) {
  const order = pack?.order || DEFAULT_ORDER
  const quote = pack?.quote || DEFAULT_QUOTE
  const wash = pack?.wash || DEFAULT_WASH
  return {
    ...quote,
    bidDepth: orderSideCount(order.bid),
    askDepth: orderSideCount(order.ask),
    washEnabled: false
  }
}

function flattenWash(pack) {
  const wash = pack?.wash || DEFAULT_WASH
  return {
    enabled: true,
    intervalMs: wash.minIntervalMs
  }
}

function cloneBot(raw = {}, index = 0) {
  const fallback = DEFAULT_ROBOT.bots[index] || DEFAULT_ROBOT.bots[0] || {
    uid: '',
    running: true,
    strategy: 'quote',
    wash: true
  }
  const strategy = STRATEGY_SET.has(raw.strategy) ? raw.strategy : fallback.strategy
  return {
    uid: String(raw.uid || fallback.uid || '').trim(),
    running: raw.running !== false,
    strategy,
    wash: raw.wash !== false
  }
}

export function cloneRobot(raw) {
  const src = raw && typeof raw === 'object' ? raw : {}
  const strategies = cloneStrategies(src)
  const bots = Array.isArray(src.bots) && src.bots.length
    ? src.bots.map((bot, index) => cloneBot(bot, index))
    : DEFAULT_ROBOT.bots.map((bot, index) => cloneBot(bot, index))
  const activeKey = activeStrategyKey({ strategies, bots })
  const pack = strategyPackOf({ strategies }, activeKey)
  return {
    enabled: src.enabled !== false,
    strategies,
    bots,
    quote: flattenQuote(pack),
    wash: flattenWash(pack)
  }
}

export function botWashOn(robot, bot) {
  return bot?.wash !== false
}

export function defaultBotForAccount(account, index) {
  const uid = String(account?.uid || '').trim()
  const preset = DEFAULT_ROBOT.bots.find((bot) => bot.uid === uid)
  if (preset) return cloneBot(preset, index)
  return {
    uid,
    running: true,
    strategy: index === 0 ? 'quote' : index === 1 ? 'inventory' : 'quote',
    wash: index === 0
  }
}

export function syncRobotBots(robot, mmAccounts) {
  const next = cloneRobot(robot)
  const prev = new Map((next.bots || []).map((bot) => [String(bot.uid), bot]))
  next.bots = (mmAccounts || [])
    .map((account) => String(account.uid || '').trim())
    .filter(Boolean)
    .map((uid, index) => {
      const found = prev.get(uid)
      return found ? cloneBot({ ...found, uid }, index) : defaultBotForAccount({ uid }, index)
    })
  const pack = strategyPackOf(next, activeStrategyKey(next))
  next.quote = flattenQuote(pack)
  next.wash = flattenWash(pack)
  return next
}

export function strategyLabel(value) {
  return ROBOT_STRATEGIES.find((item) => item.value === value)?.label || value || '—'
}

export function strategyHint(value) {
  return ROBOT_STRATEGIES.find((item) => item.value === value)?.hint || ''
}

export function spreadTypeLabel(value) {
  return QUOTE_SPREAD_TYPES.find((item) => item.value === value)?.label || value || '—'
}
