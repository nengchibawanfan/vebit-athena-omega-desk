import { PAIRS, DEFAULT_CONFIG, DEFAULT_RULE_CONFIG } from '@/config/constants'
import {
  getPairData,
  generateMockAccounts,
  generateExternalChips,
  generateInternalChips,
  generateAddressDetail,
  generateExchangeUser,
  generateAlertSummary,
  generateOpsDesk,
  generateRobotStatus,
  generatePersonaProfile,
  generateDashboardDesk,
  generateMmToday,
  generateMmHistory,
  generateTradeHistory,
  generateUsersToday,
  generateUsersHistory,
  generateUsersAssetsHistory,
  generateExchangeWhales,
  generateTransferToday,
  generateTransferHistory,
  generateBlockTrades,
  generateOnchainWhales,
  generateUserChips,
  generateFloatChips,
  generateCircSupply,
  computeFloatSnapshot,
  generateObiDetail,
  generateCostDev,
  generateOrderBook,
  tickOrderBook,
  ORDERBOOK_ROWS,
  HOLDER_ROWS,
  USER_PROFILE
} from './data.js'

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export async function getPairs() {
  await delay()
  return [...PAIRS]
}

export async function getDashboard(pair, internalAccounts, sleepIdleDays) {
  await delay()
  const d = getPairData(pair)
  const desk = generateDashboardDesk(pair, internalAccounts)
  const snap = computeFloatSnapshot(pair, sleepIdleDays, internalAccounts)
  const robotPct = Number(d.robotInv)
  const listedFloat = Number(String(d.floatSupply).replace(/,/g, '')) || snap.floatNum
  const externalPct = Number(d.external)
  return clone({
    kpis: {
      floatSupply: snap.floatLabel,
      floatSupplySub: snap.floatSub,
      circSupply: snap.circLabel,
      circSupplySub: snap.circSub,
      floatOfCirc: snap.floatOfCirc,
      circExchange: snap.circExchange,
      circOnchain: snap.circOnchain,
      circExchangePct: snap.circExchangePct,
      circOnchainPct: snap.circOnchainPct,
      mmQty: snap.mmQty,
      mmOfExch: snap.mmOfExch,
      exchUser: snap.exchTotal,
      activeFloat: snap.activeFloat,
      activeFloatSub: `占流通 ${snap.activeOfCirc}%`,
      activeExchange: snap.activeExchange,
      activeOnchain: snap.activeOnchain,
      activeOfCirc: snap.activeOfCirc,
      activeExchangeOfCirc: snap.activeExchangeOfCirc,
      activeOnchainOfCirc: snap.activeOnchainOfCirc,
      sleepExchange: snap.sleepExchange,
      sleepOnchain: snap.sleepOnchain,
      sleepTotal: snap.sleepTotal,
      sleepOfFloat: snap.sleepOfFloat,
      sleepOfCirc: snap.sleepOfCirc,
      sleepExchangeOfCirc: snap.sleepExchangeOfCirc,
      sleepOnchainOfCirc: snap.sleepOnchainOfCirc,
      sleepExchangePct: snap.sleepExchangePct,
      sleepOnchainPct: snap.sleepOnchainPct,
      sleepIdleDays: snap.sleepIdleDays,
      obi: d.obi,
      obiSub: d.obiSub,
      priceDev: d.priceDev,
      priceDevSub: d.priceDevSub,
      activeOrder: d.activeOrder,
      activeOrderSub: d.activeOrderSub,
      robotInv: d.robotInv,
      robotInvSub: `做市账户库存 · ${d.robotInvSub}`,
      robotInvAmount: snap.mmQty,
      external: d.external,
      externalSub: d.externalSub,
      externalAmount: Number((listedFloat * externalPct / 100).toFixed(1)),
      internalPct: Number((100 - externalPct).toFixed(1)),
      internalAmount: Number((listedFloat * (100 - externalPct) / 100).toFixed(1)),
      ownedPct: Number(Math.max(0, 100 - externalPct - robotPct).toFixed(1)),
      ownedAmount: Number((listedFloat * Math.max(0, 100 - externalPct - robotPct) / 100).toFixed(1))
    },
    mm: desk.mm,
    users: desk.users,
    ops: generateOpsDesk(pair, sleepIdleDays, internalAccounts),
    depth: d.depth,
    cost: d.cost,
    dashWhale: d.dashWhale,
    whaleAlert: d.whaleAlert,
    alertSummary: d.alertSummary,
    alertItems: d.alertItems,
    costBadge: d.costBadge
  })
}

export async function getOpsDesk(pair, sleepIdleDays, internalAccounts, dateKey) {
  await delay()
  return clone(generateOpsDesk(pair, sleepIdleDays, internalAccounts, dateKey))
}

export async function getMmToday(pair, internalAccounts) {
  await delay()
  return clone(generateMmToday(pair, internalAccounts))
}

export async function getMmHistory(pair, days, internalAccounts) {
  await delay()
  return clone(generateMmHistory(pair, days, internalAccounts))
}

export async function getTradeHistory(pair, days, internalAccounts) {
  await delay()
  return clone(generateTradeHistory(pair, days, internalAccounts))
}

export async function getUsersToday(pair, internalAccounts, dateKey) {
  await delay()
  return clone(generateUsersToday(pair, internalAccounts, dateKey))
}

export async function getUsersHistory(pair, days, internalAccounts) {
  await delay()
  return clone(generateUsersHistory(pair, days, internalAccounts))
}

export async function getUsersAssetsHistory(pair, days, internalAccounts, sleepIdleDays) {
  await delay()
  return clone(generateUsersAssetsHistory(pair, days, internalAccounts, sleepIdleDays))
}

export async function getOrderbook(pair) {
  await delay()
  const d = getPairData(pair)
  return clone({
    bid: d.obDepthBid,
    ask: d.obDepthAsk,
    footprintBuy: d.footprintBuy,
    footprintSell: d.footprintSell,
    footprintWash: d.footprintWash,
    obiData: d.obiData,
    rows: ORDERBOOK_ROWS
  })
}

export async function getObiDetail(pair, depthLevels, obiWarn) {
  await delay()
  return clone(generateObiDetail(pair, depthLevels, obiWarn))
}

export async function getCostDev(pair, costDevWarn) {
  await delay()
  return clone(generateCostDev(pair, costDevWarn))
}

export async function getPosition(pair) {
  await delay()
  const d = getPairData(pair)
  return clone({
    cost: d.cost,
    costBadge: d.costBadge,
    pnlBadge: d.pnlBadge,
    price: d.price,
    holders: HOLDER_ROWS,
    timeLayers: {
      ghost: [30, 28, 22, 18],
      long: [25, 28, 32, 35],
      swing: [20, 24, 28, 32],
      scalp: [25, 20, 18, 15]
    },
    pnl: {
      profit: [20, 45, 80, 60, 30],
      loss: [30, 20, 10, 18, 25],
      ratio: [0.4, 0.7, 0.9, 0.75, 0.55]
    }
  })
}

export async function getRisk(pair) {
  await delay()
  const d = getPairData(pair)
  return clone({
    inventory: Number(d.robotInv),
    spread: '1.2x',
    maxOrder: '50万',
    deviationActual: [0.98, 1.00, 1.02, 1.01, 1.02],
    deviationTarget: [0.98, 1.00, 1.02, 1.04, 1.06],
    wash: [3.2, 4.5, 6.8, 5.5, 6.2],
    pnl: [1.2, 2.8, 3.5, 2.0, 2.3]
  })
}

export async function getMacro(pair, whaleThreshold) {
  await delay()
  const d = getPairData(pair)
  const bombRemain = Number(d.external)
  const onchain = generateOnchainWhales(pair, whaleThreshold)
  return clone({
    netflowIn: d.netflowIn,
    netflowOut: d.netflowOut,
    netflowBadge: d.netflowBadge,
    bombBadge: d.bombBadge,
    whaleBadge: d.whaleBadge,
    bomb: { controlled: 100 - bombRemain, external: bombRemain },
    sentiment: d.sentiment,
    whales: onchain.rows.slice(0, 3).map((row) => ({
      time: row.time.slice(0, 5),
      address: row.address,
      amount: row.amount,
      status: row.status,
      statusTag: row.statusTag
    }))
  })
}

const liveOrderBooks = new Map()

function liveOrderBook(pair) {
  if (!liveOrderBooks.has(pair)) liveOrderBooks.set(pair, generateOrderBook(pair))
  return liveOrderBooks.get(pair)
}

export async function getOrders(pair) {
  await delay()
  return clone(liveOrderBook(pair))
}

export function subscribeOrders(pair, handlers) {
  const book = liveOrderBook(pair)
  let timer = null
  let closed = false
  handlers.onStatus?.('mock')
  const kick = () => {
    if (closed) return
    handlers.onSnapshot?.(clone(book))
  }
  delay(80).then(() => {
    if (closed) return
    kick()
    timer = setInterval(() => {
      tickOrderBook(book)
      kick()
    }, 900)
  })
  return () => {
    closed = true
    if (timer) clearInterval(timer)
  }
}

export async function getHolders(pair, sleepIdleDays, internalAccounts) {
  await delay()
  return clone(generateUserChips(pair, sleepIdleDays, internalAccounts))
}

export async function getFloatChips(pair, sleepIdleDays, kind, internalAccounts) {
  await delay()
  return clone(generateFloatChips(pair, sleepIdleDays, kind, internalAccounts))
}

export async function getCircSupply(pair, kind, sleepIdleDays, internalAccounts) {
  await delay()
  return clone(generateCircSupply(pair, kind, sleepIdleDays, internalAccounts))
}

export async function getWhales(pair, whaleThreshold) {
  await delay()
  return clone(generateOnchainWhales(pair, whaleThreshold))
}

export async function getExchangeWhales(pair, whaleThreshold, internalAccounts) {
  await delay()
  return clone(generateExchangeWhales(pair, whaleThreshold, internalAccounts))
}

export async function getTransferToday(pair, whaleThreshold, internalAccounts, dateKey) {
  await delay()
  return clone(generateTransferToday(pair, whaleThreshold, internalAccounts, dateKey))
}

export async function getTransferHistory(pair, days, whaleThreshold, internalAccounts) {
  await delay()
  return clone(generateTransferHistory(pair, days, whaleThreshold, internalAccounts))
}

export async function getBlockTrades(pair, whaleThreshold, internalAccounts) {
  await delay()
  return clone(generateBlockTrades(pair, whaleThreshold, internalAccounts))
}

export async function getOnchainWhales(pair, whaleThreshold, excludedAddresses) {
  await delay()
  return clone(generateOnchainWhales(pair, whaleThreshold, excludedAddresses))
}

export async function getStableProfit(pair, filters = {}) {
  await delay()
  const cfg = { ...DEFAULT_CONFIG, ...filters }
  const accounts = generateMockAccounts(pair)
  const stableAccounts = accounts.filter((acc) =>
    acc.winDaysRatio >= cfg.winDaysRatio &&
    acc.singleGainRatio <= cfg.singleGainRatio &&
    acc.maxDrawdown <= cfg.maxDrawdown &&
    acc.recoveryDays <= cfg.recoveryDays &&
    acc.totalTrades >= cfg.totalTrades &&
    acc.activeDays >= cfg.activeDays
  )
  return clone({
    accounts,
    stableIds: stableAccounts.map((a) => a.id),
    total: accounts.length,
    stableCount: stableAccounts.length,
    ratio: accounts.length ? Math.round((stableAccounts.length / accounts.length) * 100) : 0
  })
}

export async function getTradeRisk(pair) {
  await delay()
  const d = getPairData(pair)
  const abnormal = d.abnormalAccounts || []
  const alerts = d.alertList || []
  return clone({
    alertsTotal: d.alerts,
    alertsDelta: Math.floor(d.alerts * 0.3),
    abnormalCount: abnormal.length,
    highFreq: abnormal.filter((a) => a.rule.includes('交易频率')).length,
    cancelAbnormal: abnormal.filter((a) => a.rule.includes('挂撤单')).length,
    priceManip: abnormal.filter((a) => a.rule.includes('价格')).length,
    largeOrder: alerts.filter((a) => a.type === '大额挂单').length,
    monitorStatus: d.monitorStatus,
    alertList: alerts,
    abnormalAccounts: abnormal,
    riskTypes: d.riskTypes,
    riskAlerts: d.riskAlerts
  })
}

export async function getUserProfile() {
  await delay()
  return clone(USER_PROFILE)
}

export async function getPersonaProfile(type, pair) {
  await delay()
  return clone(generatePersonaProfile(type, pair))
}

export async function getExternalChips(pair, excludedAddresses, sleepIdleDays) {
  await delay()
  return clone(generateExternalChips(pair, excludedAddresses, sleepIdleDays))
}

export async function getInternalChips(pair, internalAccounts) {
  await delay()
  return clone(generateInternalChips(pair, internalAccounts))
}

export async function getRobotStatus(pair, internalAccounts, robotConfig) {
  await delay()
  return clone(generateRobotStatus(pair, internalAccounts, robotConfig))
}

export async function getAddressDetail(pair, address) {
  await delay()
  return clone(generateAddressDetail(pair, address))
}

export async function getExchangeUser(pair, uid, scope) {
  await delay()
  return clone(generateExchangeUser(pair, uid, scope))
}

export async function getAlertSummary(pair, opts) {
  await delay()
  return clone(generateAlertSummary(pair, opts))
}

export async function getConfig() {
  await delay()
  return clone(DEFAULT_CONFIG)
}

export async function saveConfig(cfg) {
  await delay(80)
  return clone(cfg)
}

export async function getUserRules() {
  await delay()
  return clone(DEFAULT_RULE_CONFIG)
}

export async function saveUserRules(cfg) {
  await delay(80)
  return clone(cfg)
}
