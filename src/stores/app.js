import { reactive, computed } from 'vue'
import { PAIRS } from '@/config/constants'
import { loadPairConfig, savePairConfig } from '@/utils/storage'
import { applyTheme, readTheme } from '@/utils/theme'

const savedPair = localStorage.getItem('currentPair')

export const appState = reactive({
  theme: readTheme(),
  currentPair: PAIRS.includes(savedPair) ? savedPair : PAIRS[0],
  pairs: [...PAIRS],
  config: loadPairConfig(savedPair || PAIRS[0])
})

export const currentPair = computed(() => appState.currentPair)
export const currentConfig = computed(() => appState.config)

export function setPair(pair) {
  if (!pair || pair === appState.currentPair) return
  savePairConfig(appState.currentPair, appState.config)
  appState.currentPair = pair
  localStorage.setItem('currentPair', pair)
  appState.config = loadPairConfig(pair)
}

export function updateConfig(patch) {
  Object.assign(appState.config, patch)
  savePairConfig(appState.currentPair, appState.config)
}

export function replaceConfig(cfg) {
  appState.config = { ...cfg }
  savePairConfig(appState.currentPair, appState.config)
}

export function setTheme(theme) {
  appState.theme = applyTheme(theme)
}
