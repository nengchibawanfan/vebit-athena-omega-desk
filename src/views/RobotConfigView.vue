<template>
  <div class="page">
    <div class="card">
      <div class="card-header">
        <span>⚙️ 机器人配置</span>
        <div class="header-tools">
          <router-link class="inline-link" to="/robots">运行状态</router-link>
          <router-link class="inline-link" to="/ops/dump">做市账户</router-link>
          <span class="badge">{{ mmAccounts.length }} 个做市 UID · 当前交易对</span>
        </div>
      </div>
      <div class="monitor-status">
        <div class="status-item">
          <span class="status-dot" :class="draft.enabled ? 'green' : 'red'"></span>
          {{ draft.enabled ? '全局开' : '全局停' }} · 运行 {{ runningCount }}/{{ draft.bots.length }}
        </div>
        <div class="status-item">
          <span class="status-dot yellow"></span>
          {{ currentMeta.label }} 自成交间隔 {{ currentPack.wash.minIntervalMs }}ms
        </div>
        <div class="status-item">
          <span class="status-dot green"></span>
          挂单 bid {{ orderSideCount(currentPack.order.bid) }} / ask {{ orderSideCount(currentPack.order.ask) }} · {{ spreadTypeLabel(currentPack.quote.spreadType) }}
        </div>
      </div>
      <p class="blurb">
        五种策略各自有挂单、自成交、报价。做市 UID 选策略后用那一套参数。改完点保存，运行状态页会跟着变。
      </p>
      <div class="master-actions">
        <button type="button" class="btn-sm primary" @click="save">💾 保存</button>
        <span class="feedback">{{ feedback }}</span>
      </div>
    </div>

    <CollapsibleConfig class="filter-panel" title="⚙️ 做市账户" storage-key="robots-config-accounts">
      <template #extra>{{ mmAccounts.length }} 个 UID · 启停 / 策略</template>
      <div class="exclude-form">
        <div class="field">
          <label>UID</label>
          <input v-model.trim="accountDraft.uid" class="uid" type="text" placeholder="例如 88001" />
        </div>
        <div class="field">
          <label>备注</label>
          <input v-model.trim="accountDraft.remark" class="remark" type="text" placeholder="例如 做市主账户" />
        </div>
        <button class="btn-sm primary" type="button" @click="addAccount">➕ 添加</button>
        <span class="hint">{{ accountHint }}</span>
      </div>
      <div v-if="!mmAccounts.length" class="empty-hint">还没有做市 UID，上面添加。</div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>UID</th>
              <th>备注</th>
              <th>启停</th>
              <th>策略</th>
              <th>自成交</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in mmAccounts" :key="row.uid + index">
              <td>{{ row.uid }}</td>
              <td>
                <input
                  class="remark-input"
                  :value="row.remark"
                  @change="updateAccount(index, { remark: $event.target.value })"
                />
              </td>
              <td>
                <button
                  type="button"
                  class="btn-sm"
                  :class="{ primary: botOf(row.uid).running }"
                  :disabled="!draft.enabled"
                  @click="toggleBot(row.uid, 'running')"
                >{{ botOf(row.uid).running ? '运行中' : '已停' }}</button>
              </td>
              <td>
                <select :value="botOf(row.uid).strategy" @change="setBotStrategy(row.uid, $event.target.value)">
                  <option v-for="item in strategies" :key="item.value" :value="item.value">{{ item.label }}</option>
                </select>
                <div class="hint-line">{{ strategyHint(botOf(row.uid).strategy) }}</div>
              </td>
              <td>
                <button
                  type="button"
                  class="btn-sm"
                  :class="{ primary: botOf(row.uid).wash }"
                  @click="toggleBot(row.uid, 'wash')"
                >{{ botOf(row.uid).wash ? '开' : '关' }}</button>
              </td>
              <td><button class="btn-sm secondary" type="button" @click="removeAccount(index)">移除</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </CollapsibleConfig>

    <div class="strategy-section">
      <div class="strategy-head">
        <span>🎯 策略参数</span>
        <span class="badge">{{ currentMeta.label }}</span>
      </div>
      <div class="strategy-switch">
        <button
          v-for="item in strategies"
          :key="item.value"
          type="button"
          class="strategy-tab"
          :class="{ active: activeStrategy === item.value }"
          @click="activeStrategy = item.value"
        >{{ item.label }}</button>
      </div>
      <p class="strategy-hint">
        {{ currentMeta.hint }}
        <template v-if="usedUids.length"> · 使用 UID {{ usedUids.join('、') }}</template>
        <template v-else> · 还没有 UID 用这套</template>
      </p>

      <div v-for="section in sections" :key="section.key" class="quote-card">
        <div class="quote-card-head">
          <div class="quote-title">
            <span>{{ section.title }}</span>
            <span class="tag" :class="sectionBadge(section.key)">{{ sectionSummary(section.key) }}</span>
          </div>
        </div>
        <p v-if="section.hint" class="section-hint">{{ section.hint }}</p>
        <div v-if="section.type === 'order'" class="order-sides">
          <div v-for="side in orderSides" :key="side.key" class="side-block" :class="{ 'is-dirty': isSideDirty(side.key) }">
            <div class="side-head">
              <div class="quote-title">
                <span>{{ side.label }}</span>
                <span class="tag success">{{ currentPack.order[side.key].length }} 条 · {{ orderSideCount(currentPack.order[side.key]) }} 笔</span>
                <span v-if="isSideDirty(side.key)" class="tag warning">未更新</span>
              </div>
              <button type="button" class="btn-sm primary" @click="addOrderRule(side.key)">+ 添加规则</button>
            </div>
            <div v-if="!currentPack.order[side.key].length" class="empty-hint">还没有规则，点添加。</div>
            <div v-else class="table-wrap">
              <table class="rule-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>百分比</th>
                    <th>每单数量 (USDT)</th>
                    <th>挂单数量</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(rule, index) in currentPack.order[side.key]"
                    :key="rule.id"
                    :class="{
                      picked: isEditing(side.key, rule.id),
                      'is-added': rulePending(side.key, rule) === 'added',
                      'is-changed': rulePending(side.key, rule) === 'changed'
                    }"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ rulePct(rule.minPrice, rule.maxPrice) }}</td>
                    <td>{{ ruleRange(rule.minAmt, rule.maxAmt) }}</td>
                    <td>{{ rule.count }}</td>
                    <td class="rule-actions">
                      <button type="button" class="btn-sm" @click="openRuleEdit(side.key, rule.id)">编辑</button>
                      <button type="button" class="btn-sm secondary" @click="removeOrderRule(side.key, index)">移除</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="side-actions">
              <button
                type="button"
                class="btn-sm primary"
                :class="{ dirty: isSideDirty(side.key) }"
                @click="saveSide(side.key)"
              >更新</button>
            </div>
          </div>
        </div>
        <div v-else-if="section.key === 'wash'" class="side-block wash-block" :class="{ 'is-dirty': isWashDirty }">
          <div class="wash-row">
            <label for="wash-min-interval">最小成交时间间隔</label>
            <input
              id="wash-min-interval"
              v-model.number="currentPack.wash.minIntervalMs"
              type="number"
              step="1"
              min="1"
            />
            <span class="unit">ms</span>
            <div class="wash-update">
              <span v-if="isWashDirty" class="tag warning">未更新</span>
              <button
                type="button"
                class="btn-sm primary"
                :class="{ dirty: isWashDirty }"
                @click="saveSection('wash')"
              >更新</button>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="quote-grid">
            <div v-for="field in section.fields" :key="field.key" class="cfg-field">
              <label>{{ field.label }}</label>
              <select v-if="field.type === 'toggle'" v-model="currentPack[section.key][field.key]">
                <option :value="true">启用</option>
                <option :value="false">停用</option>
              </select>
              <select v-else-if="field.type === 'select'" v-model="currentPack[section.key][field.key]">
                <option v-for="opt in field.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <input
                v-else
                v-model.number="currentPack[section.key][field.key]"
                type="number"
                :step="field.step || 1"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="quote-actions">
        <button type="button" class="btn-sm primary" @click="save">💾 保存</button>
        <button type="button" class="btn-sm secondary" @click="cancelStrategy">取消</button>
      </div>
    </div>

    <SideDrawer :open="!!editingRule" @close="discardRuleEdit">
      <template #title>
        <span class="edit-side-tag" :class="editing?.side">{{ editSideLabel }}</span>
        <span>规则 {{ editRuleNo }}</span>
      </template>
      <template #sub>{{ currentMeta.label }} · 相对现价 · 改完点修改</template>
      <div v-if="editingRule" class="rule-editor">
        <div class="rule-preview">
          <div class="preview-kicker">这一档</div>
          <div class="preview-main">{{ editPreview.range }}</div>
          <div class="preview-sub">{{ editPreview.detail }}</div>
        </div>

        <section class="rule-group">
          <div class="rule-group-head">
            <h3>价位区间</h3>
            <p>相对现价的偏离。0.1 = 千分之一，0.3 = 千分之三。</p>
          </div>
          <div class="range-row">
            <label class="range-field">
              <span>最小 %</span>
              <input v-model.number="editingRule.minPrice" type="number" step="0.01" min="0" />
            </label>
            <span class="range-dash">–</span>
            <label class="range-field">
              <span>最大 %</span>
              <input v-model.number="editingRule.maxPrice" type="number" step="0.01" min="0" />
            </label>
          </div>
        </section>

        <section class="rule-group">
          <div class="rule-group-head">
            <h3>每单数量</h3>
            <p>单笔随机落在这个 USDT 区间。</p>
          </div>
          <div class="range-row">
            <label class="range-field">
              <span>最小 USDT</span>
              <input v-model.number="editingRule.minAmt" type="number" step="0.00000001" min="0" />
            </label>
            <span class="range-dash">–</span>
            <label class="range-field">
              <span>最大 USDT</span>
              <input v-model.number="editingRule.maxAmt" type="number" step="0.00000001" min="0" />
            </label>
          </div>
        </section>

        <section class="rule-group">
          <div class="rule-group-head">
            <h3>挂单数量</h3>
            <p>这一档同时挂几笔。</p>
          </div>
          <label class="count-field">
            <input v-model.number="editingRule.count" type="number" step="1" min="1" />
            <span>笔</span>
          </label>
        </section>
      </div>
      <template #footer>
        <button type="button" class="btn-sm secondary" @click="discardRuleEdit">关闭</button>
        <button type="button" class="btn-sm primary" @click="confirmRuleEdit">修改</button>
      </template>
    </SideDrawer>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ORDER_SIDES, ROBOT_STRATEGIES, STRATEGY_SECTIONS } from '@/config/constants'
import { appState, updateConfig } from '@/stores/app'
import {
  cloneOrderRule,
  cloneRobot,
  cloneStrategyPack,
  nextOrderRuleId,
  orderSideCount,
  sortOrderRules,
  spreadTypeLabel,
  strategyHint,
  syncRobotBots
} from '@/utils/robotConfig'
import { showToast } from '@/utils/clipboard'
import CollapsibleConfig from '@/components/CollapsibleConfig.vue'
import SideDrawer from '@/components/SideDrawer.vue'

const strategies = ROBOT_STRATEGIES
const sections = STRATEGY_SECTIONS
const orderSides = ORDER_SIDES
const feedback = ref('')
const accountHint = ref('')
const activeStrategy = ref('quote')
const draft = reactive(emptyDraft())
const accountDraft = reactive({ uid: '', remark: '' })
const inventoryLow = ref(20)
const inventoryHigh = ref(80)
const editing = ref(null)
const ruleSnapshot = ref(null)

const allAccounts = computed(() => appState.config.internalAccounts || [])
const mmAccounts = computed(() => allAccounts.value.filter((item) => item.type === 'mm'))
const runningCount = computed(() => draft.bots.filter((bot) => bot.running).length)
const currentPack = computed(() => draft.strategies[activeStrategy.value] || cloneStrategyPack(activeStrategy.value))
const currentMeta = computed(() => strategies.find((item) => item.value === activeStrategy.value) || strategies[0])
const usedUids = computed(() =>
  draft.bots.filter((bot) => bot.strategy === activeStrategy.value).map((bot) => bot.uid)
)
const editingRule = computed(() => {
  if (!editing.value) return null
  const list = draft.strategies[activeStrategy.value]?.order?.[editing.value.side] || []
  return list.find((rule) => rule.id === editing.value.id) || null
})
const editSideLabel = computed(() => {
  return orderSides.find((item) => item.key === editing.value?.side)?.label || '规则'
})
const editRuleNo = computed(() => {
  if (!editing.value) return ''
  const list = currentPack.value.order[editing.value.side] || []
  const index = list.findIndex((rule) => rule.id === editing.value.id)
  return index >= 0 ? index + 1 : ''
})
const editPreview = computed(() => {
  const rule = editingRule.value
  if (!rule) return { range: '—', detail: '' }
  return {
    range: `现价 ${rulePct(rule.minPrice, rule.maxPrice)}`,
    detail: `每单 ${ruleRange(rule.minAmt, rule.maxAmt)} USDT · 挂 ${fmtRuleNum(rule.count)} 笔`
  }
})
const savedPack = computed(() => {
  const saved = cloneRobot(appState.config.robot)
  return cloneStrategyPack(activeStrategy.value, saved.strategies?.[activeStrategy.value])
})
const savedOrder = computed(() => ({
  bid: savedPack.value.order.bid || [],
  ask: savedPack.value.order.ask || []
}))
const isWashDirty = computed(() => {
  return Number(currentPack.value.wash.minIntervalMs) !== Number(savedPack.value.wash.minIntervalMs)
})

function emptyDraft() {
  const robot = cloneRobot(null)
  return {
    enabled: robot.enabled,
    strategies: robot.strategies,
    bots: robot.bots
  }
}

function applyRobot(robot) {
  draft.enabled = robot.enabled
  draft.strategies = Object.fromEntries(
    strategies.map((item) => {
      const pack = cloneStrategyPack(item.value, robot.strategies?.[item.value])
      return [item.value, {
        order: {
          bid: pack.order.bid.map((rule) => ({ ...rule })),
          ask: pack.order.ask.map((rule) => ({ ...rule }))
        },
        wash: { ...pack.wash },
        quote: { ...pack.quote }
      }]
    })
  )
  draft.bots = robot.bots.map((bot) => ({ ...bot }))
}

function currentRobot() {
  return cloneRobot({
    enabled: draft.enabled,
    strategies: draft.strategies,
    bots: draft.bots
  })
}

function loadDraft() {
  closeRuleEdit()
  applyRobot(syncRobotBots(appState.config.robot, mmAccounts.value))
  inventoryLow.value = Number(appState.config.inventoryLow ?? 20)
  inventoryHigh.value = Number(appState.config.inventoryHigh ?? 80)
}

function sectionBadge(key) {
  return 'success'
}

function sectionSummary(key) {
  const pack = currentPack.value
  if (key === 'order') {
    return `bid ${orderSideCount(pack.order.bid)} · ask ${orderSideCount(pack.order.ask)}`
  }
  if (key === 'wash') return `${pack.wash.minIntervalMs}ms`
  return spreadTypeLabel(pack.quote.spreadType)
}

function addOrderRule(side) {
  const list = currentPack.value.order[side]
  const last = list[list.length - 1]
  const seed = cloneOrderRule(last, last, list.length)
  if (last) {
    seed.minPrice = roundPct(Number(last.minPrice) + 0.2)
    seed.maxPrice = roundPct(Number(last.maxPrice) + 0.2)
  }
  seed.id = nextOrderRuleId(list)
  list.push(seed)
  showToast('添加成功')
}

function roundPct(value) {
  return Math.round(Number(value) * 1e8) / 1e8
}

function removeOrderRule(side, index) {
  const list = currentPack.value.order[side]
  const removed = list[index]
  list.splice(index, 1)
  if (removed && editing.value?.side === side && editing.value.id === removed.id) closeRuleEdit()
}

function isEditing(side, id) {
  return editing.value?.side === side && editing.value.id === id
}

function ruleSig(rule) {
  if (!rule) return ''
  return [
    Number(rule.id),
    Number(rule.minPrice),
    Number(rule.maxPrice),
    Number(rule.minAmt),
    Number(rule.maxAmt),
    Number(rule.count)
  ].join('|')
}

function sideSig(list) {
  return (list || []).map(ruleSig).join(';;')
}

function isSideDirty(side) {
  return sideSig(currentPack.value.order[side]) !== sideSig(savedOrder.value[side])
}

function rulePending(side, rule) {
  const saved = (savedOrder.value[side] || []).find((item) => item.id === rule.id)
  if (!saved) return 'added'
  if (ruleSig(rule) !== ruleSig(saved)) return 'changed'
  return ''
}

function openRuleEdit(side, id) {
  const rule = (currentPack.value.order[side] || []).find((item) => item.id === id)
  if (!rule) return
  ruleSnapshot.value = { strategy: activeStrategy.value, side, id, rule: { ...rule } }
  editing.value = { side, id }
}

function closeRuleEdit() {
  editing.value = null
  ruleSnapshot.value = null
}

function discardRuleEdit() {
  if (ruleSnapshot.value) {
    const { strategy, side, id, rule } = ruleSnapshot.value
    const target = (draft.strategies[strategy]?.order?.[side] || []).find((item) => item.id === id)
    if (target) Object.assign(target, rule)
  }
  closeRuleEdit()
}

function sortDraftSide(strategy, side) {
  const list = draft.strategies[strategy]?.order?.[side]
  if (!list) return
  list.splice(0, list.length, ...sortOrderRules(list))
}

function confirmRuleEdit() {
  const side = editing.value?.side
  const strategy = activeStrategy.value
  closeRuleEdit()
  if (side) sortDraftSide(strategy, side)
  showToast('修改成功')
}

function saveSide(side) {
  if (!side) return
  const key = activeStrategy.value
  const next = cloneRobot(appState.config.robot)
  const pack = cloneStrategyPack(key, next.strategies?.[key])
  pack.order[side] = sortOrderRules(currentPack.value.order[side] || []).map((rule) => ({ ...rule }))
  next.strategies[key] = pack
  const synced = syncRobotBots(next, mmAccounts.value)
  updateConfig({ robot: synced })
  draft.strategies[key].order[side] = synced.strategies[key].order[side].map((rule) => ({ ...rule }))
  showToast('更新成功')
  if (editing.value?.side === side) closeRuleEdit()
}

function saveSection(part) {
  if (part !== 'wash' && part !== 'quote') return
  const key = activeStrategy.value
  const next = cloneRobot(appState.config.robot)
  const pack = cloneStrategyPack(key, next.strategies?.[key])
  pack[part] = { ...currentPack.value[part] }
  next.strategies[key] = pack
  const synced = syncRobotBots(next, mmAccounts.value)
  updateConfig({ robot: synced })
  draft.strategies[key][part] = { ...synced.strategies[key][part] }
  showToast('更新成功')
}

function ruleRange(min, max) {
  return `${fmtRuleNum(min)} – ${fmtRuleNum(max)}`
}

function rulePct(min, max) {
  return `${fmtRuleNum(min)} – ${fmtRuleNum(max)}%`
}

function fmtRuleNum(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 8 })
}

function botOf(uid) {
  return draft.bots.find((bot) => bot.uid === String(uid)) || {
    uid: String(uid),
    running: true,
    strategy: 'quote',
    wash: true
  }
}

function persistMm(nextMm, message) {
  const others = allAccounts.value.filter((item) => item.type !== 'mm')
  const robot = syncRobotBots(currentRobot(), nextMm)
  updateConfig({
    internalAccounts: [...others, ...nextMm].map((item) => ({ ...item })),
    robot
  })
  applyRobot(robot)
  if (message) accountHint.value = message
}

function addAccount() {
  const uid = accountDraft.uid.trim()
  if (!uid) {
    accountHint.value = '请填写 UID'
    return
  }
  if (allAccounts.value.some((item) => String(item.uid).trim() === uid)) {
    accountHint.value = '该 UID 已在做市或金库列表中'
    return
  }
  persistMm([...mmAccounts.value, { uid, type: 'mm', remark: accountDraft.remark }], '✅ 已加入做市账户')
  accountDraft.uid = ''
  accountDraft.remark = ''
}

function updateAccount(index, patch) {
  persistMm(mmAccounts.value.map((item, i) => (i === index ? { ...item, ...patch } : item)))
}

function removeAccount(index) {
  persistMm(mmAccounts.value.filter((_, i) => i !== index), '↩️ 已移出做市账户')
}

function toggleBot(uid, key) {
  const bot = draft.bots.find((item) => item.uid === String(uid))
  if (!bot) return
  bot[key] = !bot[key]
}

function setBotStrategy(uid, strategy) {
  const bot = draft.bots.find((item) => item.uid === String(uid))
  if (!bot) return
  bot.strategy = strategy
  activeStrategy.value = strategy
}

function save() {
  const low = Number(inventoryLow.value)
  const high = Number(inventoryHigh.value)
  if (!(low < high)) {
    feedback.value = '安全带下限要小于上限'
    return
  }
  closeRuleEdit()
  const synced = syncRobotBots(currentRobot(), mmAccounts.value)
  updateConfig({
    robot: synced,
    inventoryLow: low,
    inventoryHigh: high
  })
  applyRobot(synced)
  feedback.value = '✅ 已保存'
}

function cancelStrategy() {
  closeRuleEdit()
  const saved = cloneRobot(appState.config.robot)
  const key = activeStrategy.value
  const pack = cloneStrategyPack(key, saved.strategies?.[key])
  draft.strategies[key] = {
    order: {
      bid: pack.order.bid.map((rule) => ({ ...rule })),
      ask: pack.order.ask.map((rule) => ({ ...rule }))
    },
    wash: { ...pack.wash },
    quote: { ...pack.quote }
  }
  feedback.value = `已还原 ${currentMeta.value.label}`
}

watch(() => appState.currentPair, loadDraft, { immediate: true })
watch(activeStrategy, discardRuleEdit)
</script>

<style scoped>
.header-tools {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.blurb {
  margin-top: 10px;
  font-size: 11px;
  color: var(--text-soft);
  line-height: 1.5;
}
.inline-link {
  color: #6a9aff;
  text-decoration: none;
  margin-left: 6px;
}
.inline-link:hover {
  text-decoration: underline;
}
.master-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.feedback {
  font-size: 12px;
  color: var(--text-qty);
}
.empty-hint {
  padding: 16px;
  font-size: 12px;
  color: var(--text-soft);
}
.wash-block {
  margin-top: 16px;
  padding-top: 18px;
  padding-bottom: 18px;
}
.wash-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}
.wash-update {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}
.wash-row label {
  font-size: 12px;
  color: var(--text-soft);
  white-space: nowrap;
}
.wash-row input {
  width: 140px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 5px 8px;
  color: var(--text-title);
  font-size: 12px;
}
.wash-row .unit {
  font-size: 11px;
  color: var(--text-muted);
}
.cfg-field label {
  display: block;
  font-size: 11px;
  color: var(--text-soft);
  margin-bottom: 4px;
}
.cfg-field input,
.cfg-field select,
table select {
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 5px 8px;
  color: var(--text-title);
  font-size: 12px;
  width: 100%;
  box-sizing: border-box;
}
table select {
  width: 120px;
}
.strategy-section {
  margin-top: 2px;
}
.strategy-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 4px 2px 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-title);
}
.strategy-switch {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}
.strategy-tab {
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: 99px;
  background: transparent;
  font-size: 11px;
  color: var(--text-muted);
  cursor: pointer;
}
.strategy-tab.active,
.strategy-tab:hover {
  color: var(--text-title);
  border-color: var(--border-hover);
}
.strategy-hint,
.section-hint {
  margin: 0 0 10px;
  font-size: 11px;
  color: var(--text-soft);
  line-height: 1.5;
}
.quote-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px 14px;
  margin-bottom: 12px;
}
.quote-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.quote-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--text-title);
}
.quote-title .tag {
  font-size: 10px;
  padding: 2px 8px;
}
.order-sides {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.side-block {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.side-block.is-dirty {
  border-color: #ffb347;
  box-shadow: 0 0 0 1px rgba(255, 179, 71, 0.28);
}
.btn-sm.primary.dirty {
  background: #e8942a;
  box-shadow: 0 0 8px #ffb34766;
}
.btn-sm.primary.dirty:hover {
  background: #d4841f;
}
.side-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}
.side-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.rule-table {
  width: 100%;
}
.rule-actions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  white-space: nowrap;
}
tr.picked td {
  box-shadow: inset 0 0 0 1px var(--accent, #6a9aff);
}
tr.is-added td {
  background: rgba(255, 179, 71, 0.16);
}
tr.is-changed td {
  background: rgba(255, 179, 71, 0.08);
}
.quote-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px 14px;
}
.quote-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin: 4px 0 12px;
}
@media (max-width: 1100px) {
  .quote-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.edit-side-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 99px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.edit-side-tag.bid {
  color: #6a9aff;
  background: rgba(106, 154, 255, 0.14);
}
.edit-side-tag.ask {
  color: #ffb347;
  background: rgba(255, 179, 71, 0.16);
}
.rule-editor {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rule-preview {
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--bg-kpi);
  border: 1px solid var(--border);
}
.preview-kicker {
  font-size: 10px;
  color: var(--text-soft);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.preview-main {
  font-size: 18px;
  font-weight: 650;
  color: var(--text-title);
  letter-spacing: -0.02em;
}
.preview-sub {
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-qty);
}
.rule-group {
  padding: 14px 16px 16px;
  border-radius: 12px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
}
.rule-group-head h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 650;
  color: var(--text-title);
}
.rule-group-head p {
  margin: 4px 0 0;
  font-size: 11px;
  color: var(--text-soft);
  line-height: 1.45;
}
.range-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: 10px;
  margin-top: 12px;
}
.range-dash {
  padding-bottom: 10px;
  color: var(--text-muted);
  font-size: 14px;
}
.range-field,
.count-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.range-field span,
.count-field span {
  font-size: 11px;
  color: var(--text-soft);
}
.range-field input,
.count-field input {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 9px 10px;
  color: var(--text-title);
  font-size: 14px;
  box-sizing: border-box;
}
.range-field input:focus,
.count-field input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(106, 154, 255, 0.16);
}
.count-field {
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
  max-width: 180px;
}
.count-field input {
  width: 110px;
}
.count-field span {
  padding-top: 0;
}
.hint-line {
  margin-top: 4px;
  font-size: 11px;
  color: var(--text-soft);
  line-height: 1.45;
}
.exclude-form {
  padding: 8px 2px 12px;
}
.remark-input {
  width: 100%;
  min-width: 120px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 5px 8px;
  color: var(--text-title);
  font-size: 12px;
}
</style>
