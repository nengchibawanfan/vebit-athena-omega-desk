import { DEFAULT_QUOTE, DEFAULT_ROBOT, QUOTE_SPREAD_TYPES, ROBOT_STRATEGIES } from '@/config/constants'

const STRATEGY_SET = new Set(ROBOT_STRATEGIES.map((item) => item.value))
const SPREAD_SET = new Set(QUOTE_SPREAD_TYPES.map((item) => item.value))

function num(value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function flag(value, fallback) {
  if (value === true || value === 'true' || value === 1 || value === '1') return true
  if (value === false || value === 'false' || value === 0 || value === '0') return false
  return !!fallback
}

export function cloneQuoteProfile(raw = {}) {
  const base = DEFAULT_QUOTE
  const spreadType = SPREAD_SET.has(raw.spreadType) ? raw.spreadType : base.spreadType
  return {
    id: Math.max(1, Math.round(num(raw.id, base.id))),
    enabled: flag(raw.enabled, true),
    spreadType,
    bidSpread: Math.max(0, num(raw.bidSpread, base.bidSpread)),
    askSpread: Math.max(0, num(raw.askSpread, base.askSpread)),
    minDistance: Math.max(0, num(raw.minDistance, base.minDistance)),
    maxDistance: Math.max(0, num(raw.maxDistance, base.maxDistance)),
    priceRandom: Math.max(0, num(raw.priceRandom, base.priceRandom)),
    minBuyAmt: Math.max(0, num(raw.minBuyAmt, base.minBuyAmt)),
    maxBuyAmt: Math.max(0, num(raw.maxBuyAmt, base.maxBuyAmt)),
    minSellAmt: Math.max(0, num(raw.minSellAmt, base.minSellAmt)),
    maxSellAmt: Math.max(0, num(raw.maxSellAmt, base.maxSellAmt)),
    bidDepth: Math.max(1, Math.round(num(raw.bidDepth, raw.levels ?? base.bidDepth))),
    askDepth: Math.max(1, Math.round(num(raw.askDepth, raw.levels ?? base.askDepth))),
    intervalMs: Math.max(1, Math.round(num(raw.intervalMs, raw.refreshMs ?? base.intervalMs))),
    maxIntervalMs: Math.max(1, Math.round(num(raw.maxIntervalMs, raw.intervalMs ?? raw.refreshMs ?? base.maxIntervalMs))),
    washEnabled: flag(raw.washEnabled, raw.wash === true),
    baseVolScale: Math.max(0, num(raw.baseVolScale, base.baseVolScale)),
    spikeBaseVol: Math.max(0, num(raw.spikeBaseVol, base.spikeBaseVol)),
    forceMin: Math.max(0, Math.round(num(raw.forceMin, base.forceMin))),
    forceMax: Math.max(0, Math.round(num(raw.forceMax, base.forceMax))),
    priceAmp: Math.max(0, num(raw.priceAmp, base.priceAmp)),
    spikeProb: Math.max(0, num(raw.spikeProb, base.spikeProb)),
    spikeVolGrowth: Math.max(0, num(raw.spikeVolGrowth, base.spikeVolGrowth)),
    effectiveVol: Math.max(0, num(raw.effectiveVol, base.effectiveVol))
  }
}

function normalizeQuotes(src = {}) {
  if (Array.isArray(src.quotes) && src.quotes.length) {
    return src.quotes.map((item, index) => cloneQuoteProfile({ ...item, id: item?.id ?? 210 + index }))
  }
  if (src.quote && typeof src.quote === 'object') {
    return [cloneQuoteProfile({ id: 210, ...src.quote, washEnabled: src.quote.washEnabled ?? src.wash?.enabled })]
  }
  return DEFAULT_ROBOT.quotes.map((item) => cloneQuoteProfile(item))
}

export function activeQuote(robot) {
  const list = robot?.quotes || []
  return list.find((item) => item.enabled) || list[0] || cloneQuoteProfile()
}

function cloneWashFromQuote(quote, rawWash = {}) {
  return {
    enabled: !!quote.washEnabled,
    sharePct: Math.max(0, Math.min(100, num(rawWash.sharePct, 12))),
    intervalMs: quote.intervalMs,
    minSize: Math.max(0, num(rawWash.minSize, 0.4)),
    maxSize: Math.max(0, num(rawWash.maxSize, 2.8))
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
  const quotes = normalizeQuotes(src)
  const quote = activeQuote({ quotes })
  const bots = Array.isArray(src.bots) && src.bots.length
    ? src.bots.map((bot, index) => cloneBot(bot, index))
    : DEFAULT_ROBOT.bots.map((bot, index) => cloneBot(bot, index))
  return {
    enabled: src.enabled !== false,
    quotes,
    quote,
    wash: cloneWashFromQuote(quote, src.wash),
    bots
  }
}

export function nextQuoteId(quotes) {
  const ids = (quotes || []).map((item) => Number(item.id) || 0)
  const max = ids.length ? Math.max(...ids) : 209
  return max + 1
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
  return next
}

export function strategyLabel(value) {
  return ROBOT_STRATEGIES.find((item) => item.value === value)?.label || value || '—'
}

export function strategyHint(value) {
  return ROBOT_STRATEGIES.find((item) => item.value === value)?.hint || ''
}
