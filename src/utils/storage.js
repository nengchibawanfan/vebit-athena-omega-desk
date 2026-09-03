import { DEFAULT_CONFIG, DEFAULT_RULE_CONFIG, PAIR_STORAGE_PREFIX } from '@/config/constants'
import { cloneRobot } from '@/utils/robotConfig'

function pairKey(pair, key) {
  return `${PAIR_STORAGE_PREFIX}${pair.replace('/', '_')}_${key}`
}

export function loadPairConfig(pair) {
  const stored = localStorage.getItem(pairKey(pair, 'config'))
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        excludedAddresses: Array.isArray(parsed.excludedAddresses)
          ? parsed.excludedAddresses
          : DEFAULT_CONFIG.excludedAddresses.map((item) => ({ ...item })),
        internalAccounts: Array.isArray(parsed.internalAccounts)
          ? parsed.internalAccounts
          : DEFAULT_CONFIG.internalAccounts.map((item) => ({ ...item })),
        robot: cloneRobot(parsed.robot || DEFAULT_CONFIG.robot)
      }
    } catch {
      /* ignore */
    }
  }
  return {
    ...DEFAULT_CONFIG,
    excludedAddresses: DEFAULT_CONFIG.excludedAddresses.map((item) => ({ ...item })),
    internalAccounts: DEFAULT_CONFIG.internalAccounts.map((item) => ({ ...item })),
    robot: cloneRobot(DEFAULT_CONFIG.robot)
  }
}

export function savePairConfig(pair, cfg) {
  localStorage.setItem(pairKey(pair, 'config'), JSON.stringify(cfg))
}

export function loadRuleConfig() {
  const stored = localStorage.getItem('userRuleConfig')
  if (stored) {
    try {
      return { ...DEFAULT_RULE_CONFIG, ...JSON.parse(stored) }
    } catch {
      /* ignore */
    }
  }
  return { ...DEFAULT_RULE_CONFIG }
}

export function saveRuleConfig(cfg) {
  localStorage.setItem('userRuleConfig', JSON.stringify(cfg))
}

export function clearRuleConfig() {
  localStorage.removeItem('userRuleConfig')
}
