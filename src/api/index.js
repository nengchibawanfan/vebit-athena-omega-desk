import http from './http'
import * as mock from './mock/index.js'
import { openOrdersSocket } from './ws.js'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

function call(mockFn, requestFn) {
  return useMock ? mockFn() : requestFn()
}

export const api = {
  getPairs() {
    return call(
      () => mock.getPairs(),
      () => http.get('/pairs')
    )
  },

  getDashboard(pair, internalAccounts, sleepIdleDays) {
    return call(
      () => mock.getDashboard(pair, internalAccounts, sleepIdleDays),
      () => http.get('/dashboard', {
        params: {
          pair,
          internalAccounts: JSON.stringify(internalAccounts || []),
          sleepIdleDays
        }
      })
    )
  },

  getOpsDesk(pair, sleepIdleDays, internalAccounts, dateKey) {
    return call(
      () => mock.getOpsDesk(pair, sleepIdleDays, internalAccounts, dateKey),
      () => http.get('/ops/desk', {
        params: {
          pair,
          sleepIdleDays,
          internalAccounts: JSON.stringify(internalAccounts || []),
          date: dateKey || undefined
        }
      })
    )
  },

  getMmToday(pair, internalAccounts) {
    return call(
      () => mock.getMmToday(pair, internalAccounts),
      () => http.get('/desk/mm', {
        params: {
          pair,
          internalAccounts: JSON.stringify(internalAccounts || [])
        }
      })
    )
  },

  getMmHistory(pair, days, internalAccounts) {
    return call(
      () => mock.getMmHistory(pair, days, internalAccounts),
      () => http.get('/desk/mm/history', {
        params: {
          pair,
          days,
          internalAccounts: JSON.stringify(internalAccounts || [])
        }
      })
    )
  },

  getTradeHistory(pair, days, internalAccounts) {
    return call(
      () => mock.getTradeHistory(pair, days, internalAccounts),
      () => http.get('/ops/dump/history', {
        params: {
          pair,
          days,
          internalAccounts: JSON.stringify(internalAccounts || [])
        }
      })
    )
  },

  getUsersToday(pair, internalAccounts, dateKey) {
    return call(
      () => mock.getUsersToday(pair, internalAccounts, dateKey),
      () => http.get('/desk/users', {
        params: {
          pair,
          internalAccounts: JSON.stringify(internalAccounts || []),
          date: dateKey || undefined
        }
      })
    )
  },

  getUsersHistory(pair, days, internalAccounts) {
    return call(
      () => mock.getUsersHistory(pair, days, internalAccounts),
      () => http.get('/desk/users/history', {
        params: {
          pair,
          days,
          internalAccounts: JSON.stringify(internalAccounts || [])
        }
      })
    )
  },

  getUsersAssetsHistory(pair, days, internalAccounts, sleepIdleDays) {
    return call(
      () => mock.getUsersAssetsHistory(pair, days, internalAccounts, sleepIdleDays),
      () => http.get('/ops/absorb/history', {
        params: {
          pair,
          days,
          internalAccounts: JSON.stringify(internalAccounts || []),
          sleepIdleDays
        }
      })
    )
  },

  getOrderbook(pair, levels) {
    return call(
      () => mock.getOrderbook(pair, levels),
      () => http.get('/orderbook', { params: { pair, levels } })
    )
  },

  getObiDetail(pair, depthLevels, obiWarn) {
    return call(
      () => mock.getObiDetail(pair, depthLevels, obiWarn),
      () => http.get('/orderbook/obi', { params: { pair, depthLevels, obiWarn } })
    )
  },

  getCostDev(pair, costDevWarn) {
    return call(
      () => mock.getCostDev(pair, costDevWarn),
      () => http.get('/position/cost-dev', { params: { pair, costDevWarn } })
    )
  },

  getPosition(pair) {
    return call(
      () => mock.getPosition(pair),
      () => http.get('/position', { params: { pair } })
    )
  },

  getRisk(pair) {
    return call(
      () => mock.getRisk(pair),
      () => http.get('/risk', { params: { pair } })
    )
  },

  getRobotStatus(pair, internalAccounts, robotConfig) {
    return call(
      () => mock.getRobotStatus(pair, internalAccounts, robotConfig),
      () => http.get('/robot-status', {
        params: {
          pair,
          internalAccounts: JSON.stringify(internalAccounts || []),
          robot: JSON.stringify(robotConfig || {})
        }
      })
    )
  },

  getMacro(pair, whaleThreshold) {
    return call(
      () => mock.getMacro(pair, whaleThreshold),
      () => http.get('/macro', { params: { pair, whaleThreshold } })
    )
  },

  getOrders(pair) {
    return call(
      () => mock.getOrders(pair),
      () => http.get('/orders', { params: { pair } })
    )
  },

  subscribeOrders(pair, handlers) {
    if (useMock) return mock.subscribeOrders(pair, handlers)
    return openOrdersSocket(pair, handlers)
  },

  getHolders(pair, sleepIdleDays, internalAccounts) {
    return call(
      () => mock.getHolders(pair, sleepIdleDays, internalAccounts),
      () => http.get('/holders', {
        params: {
          pair,
          sleepIdleDays,
          internalAccounts: JSON.stringify(internalAccounts || [])
        }
      })
    )
  },

  getFloatChips(pair, sleepIdleDays, kind, internalAccounts) {
    return call(
      () => mock.getFloatChips(pair, sleepIdleDays, kind, internalAccounts),
      () => http.get('/chips/float', {
        params: {
          pair,
          sleepIdleDays,
          kind,
          internalAccounts: JSON.stringify(internalAccounts || [])
        }
      })
    )
  },

  getCircSupply(pair, kind, sleepIdleDays, internalAccounts) {
    return call(
      () => mock.getCircSupply(pair, kind, sleepIdleDays, internalAccounts),
      () => http.get('/circ/supply', {
        params: {
          pair,
          kind,
          sleepIdleDays,
          internalAccounts: JSON.stringify(internalAccounts || [])
        }
      })
    )
  },

  getWhales(pair, whaleThreshold, excludedAddresses) {
    return call(
      () => mock.getOnchainWhales(pair, whaleThreshold, excludedAddresses),
      () => http.get('/whales/onchain', {
        params: {
          pair,
          whaleThreshold,
          excludedAddresses: JSON.stringify(excludedAddresses || [])
        }
      })
    )
  },

  getExchangeWhales(pair, whaleThreshold, internalAccounts) {
    return call(
      () => mock.getExchangeWhales(pair, whaleThreshold, internalAccounts),
      () => http.get('/whales/exchange', {
        params: {
          pair,
          whaleThreshold,
          internalAccounts: JSON.stringify(internalAccounts || [])
        }
      })
    )
  },

  getTransferToday(pair, whaleThreshold, internalAccounts, dateKey) {
    return call(
      () => mock.getTransferToday(pair, whaleThreshold, internalAccounts, dateKey),
      () => http.get('/whales/exchange', {
        params: {
          pair,
          whaleThreshold,
          internalAccounts: JSON.stringify(internalAccounts || []),
          date: dateKey || undefined
        }
      })
    )
  },

  getTransferHistory(pair, days, whaleThreshold, internalAccounts) {
    return call(
      () => mock.getTransferHistory(pair, days, whaleThreshold, internalAccounts),
      () => http.get('/whales/exchange/history', {
        params: {
          pair,
          days,
          whaleThreshold,
          internalAccounts: JSON.stringify(internalAccounts || [])
        }
      })
    )
  },

  getBlockTrades(pair, whaleThreshold, internalAccounts) {
    return call(
      () => mock.getBlockTrades(pair, whaleThreshold, internalAccounts),
      () => http.get('/orderbook/blocks', {
        params: {
          pair,
          whaleThreshold,
          internalAccounts: JSON.stringify(internalAccounts || [])
        }
      })
    )
  },

  getOnchainWhales(pair, whaleThreshold, excludedAddresses) {
    return call(
      () => mock.getOnchainWhales(pair, whaleThreshold, excludedAddresses),
      () => http.get('/whales/onchain', {
        params: {
          pair,
          whaleThreshold,
          excludedAddresses: JSON.stringify(excludedAddresses || [])
        }
      })
    )
  },

  getExternalChips(pair, excludedAddresses, sleepIdleDays) {
    return call(
      () => mock.getExternalChips(pair, excludedAddresses, sleepIdleDays),
      () => http.get('/external-chips', {
        params: {
          pair,
          sleepIdleDays,
          excludedAddresses: JSON.stringify(excludedAddresses || [])
        }
      })
    )
  },

  getInternalChips(pair, internalAccounts) {
    return call(
      () => mock.getInternalChips(pair, internalAccounts),
      () => http.get('/internal-chips', {
        params: {
          pair,
          internalAccounts: JSON.stringify(internalAccounts || [])
        }
      })
    )
  },

  getAddressDetail(pair, address) {
    return call(
      () => mock.getAddressDetail(pair, address),
      () => http.get('/address-detail', { params: { pair, address } })
    )
  },

  getExchangeUser(pair, uid, scope) {
    return call(
      () => mock.getExchangeUser(pair, uid, scope),
      () => http.get('/exchange-user', { params: { pair, uid, scope } })
    )
  },

  getAlertSummary(pair, opts = {}) {
    return call(
      () => mock.getAlertSummary(pair, opts),
      () => http.get('/alerts', {
        params: {
          pair,
          whaleThreshold: opts.whaleThreshold,
          costDevWarn: opts.costDevWarn,
          depthLevels: opts.depthLevels,
          obiWarn: opts.obiWarn,
          internalAccounts: JSON.stringify(opts.internalAccounts || []),
          excludedAddresses: JSON.stringify(opts.excludedAddresses || [])
        }
      })
    )
  },

  getStableProfit(pair, filters) {
    return call(
      () => mock.getStableProfit(pair, filters),
      () => http.get('/stable-profit', { params: { pair, ...filters } })
    )
  },

  getTradeRisk(pair) {
    return call(
      () => mock.getTradeRisk(pair),
      () => http.get('/trade-risk', { params: { pair } })
    )
  },

  getUserProfile() {
    return call(
      () => mock.getUserProfile(),
      () => http.get('/user-profile')
    )
  },

  getPersonaProfile(type, pair) {
    return call(
      () => mock.getPersonaProfile(type, pair),
      () => http.get(`/user-profile/${type}`, { params: { pair } })
    )
  },

  saveUserRules(payload) {
    return call(
      () => mock.saveUserRules(payload),
      () => http.put('/user-rules', payload)
    )
  }
}

export default api
