<template>
  <div class="page">
    <div class="card">
      <div class="card-header">
        <span>⚙️ 机器人配置</span>
        <div class="header-tools">
          <router-link class="inline-link" to="/robots">运行状态</router-link>
          <router-link class="inline-link" to="/desk/mm">做市账户</router-link>
          <span class="badge">{{ mmAccounts.length }} 个做市 UID · 当前交易对</span>
        </div>
      </div>
      <div class="monitor-status">
        <div class="status-item">
          <span class="status-dot" :class="draft.enabled ? 'green' : 'red'"></span>
          {{ draft.enabled ? '全局开' : '全局停' }} · 运行 {{ runningCount }}/{{ draft.bots.length }}
        </div>
        <div class="status-item">
          <span class="status-dot" :class="activeQuoteRow.washEnabled ? 'yellow' : 'green'"></span>
          自成交 {{ activeQuoteRow.washEnabled ? '启用' : '停用' }}
        </div>
        <div class="status-item">
          <span class="status-dot green"></span>
          挂单 {{ activeQuoteRow.bidDepth }} / {{ activeQuoteRow.askDepth }} · {{ activeQuoteRow.intervalMs }}ms · {{ activeQuoteRow.spreadType }}
        </div>
      </div>
      <p class="blurb">
        管做市 UID、挂单、自成交、启停和策略。改完点保存，运行状态页会跟着变。
      </p>
      <div class="master-actions">
        <button type="button" class="btn-sm" :class="{ primary: draft.enabled }" @click="setGlobal(true)">全部启动</button>
        <button type="button" class="btn-sm" :class="{ primary: !draft.enabled }" @click="setGlobal(false)">全部停止</button>
        <button type="button" class="btn-sm primary" @click="save">💾 保存</button>
        <button type="button" class="btn-sm secondary" @click="resetDefaults">↩️ 恢复默认</button>
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
                  :disabled="!activeQuoteRow.washEnabled"
                  @click="toggleBot(row.uid, 'wash')"
                >{{ botOf(row.uid).wash ? '开' : '关' }}</button>
              </td>
              <td><button class="btn-sm secondary" type="button" @click="removeAccount(index)">移除</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </CollapsibleConfig>

    <div class="quote-section">
      <div class="quote-head">
        <span>📌 挂单配置</span>
        <div class="header-tools">
          <span class="badge">{{ draft.quotes.length }}</span>
          <button type="button" class="btn-sm primary" @click="addQuote">+ 新增</button>
        </div>
      </div>

      <div v-for="(row, index) in draft.quotes" :key="row.id" class="quote-card">
        <div class="quote-card-head">
          <div class="quote-title">
            <span>配置 #{{ row.id }}</span>
            <span class="tag" :class="row.enabled ? 'success' : 'warning'">{{ row.enabled ? '启用' : '停用' }}</span>
          </div>
          <div class="header-tools">
            <button type="button" class="btn-sm secondary" @click="toggleQuoteOpen(row.id)">
              {{ isQuoteOpen(row.id) ? '收起' : '编辑' }}
            </button>
            <button type="button" class="btn-sm secondary" @click="removeQuote(index)">移除</button>
          </div>
        </div>
        <div class="quote-summary">
          <span>盘口深度 {{ row.bidDepth }} / {{ row.askDepth }}</span>
          <span>下单间隔 {{ row.intervalMs }}ms</span>
          <span>自成交 {{ row.washEnabled ? '启用' : '停用' }}</span>
          <span>价差类型 {{ row.spreadType }}</span>
        </div>
        <div v-show="isQuoteOpen(row.id)" class="quote-body">
          <div class="quote-grid">
            <div v-for="field in quoteFields" :key="field.key" class="cfg-field">
              <label>{{ field.label }}</label>
              <select v-if="field.type === 'toggle'" v-model="row[field.key]">
                <option :value="true">启用</option>
                <option :value="false">停用</option>
              </select>
              <select v-else-if="field.type === 'select'" v-model="row[field.key]">
                <option v-for="opt in field.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <input
                v-else
                v-model.number="row[field.key]"
                type="number"
                :step="field.step || 1"
                min="0"
              />
            </div>
          </div>
          <div class="quote-actions">
            <button type="button" class="btn-sm primary" @click="save">💾 保存</button>
            <button type="button" class="btn-sm secondary" @click="cancelQuote(index)">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { QUOTE_FIELDS, ROBOT_STRATEGIES } from '@/config/constants'
import { appState, updateConfig } from '@/stores/app'
import { cloneQuoteProfile, cloneRobot, nextQuoteId, strategyHint, syncRobotBots } from '@/utils/robotConfig'
import CollapsibleConfig from '@/components/CollapsibleConfig.vue'

const strategies = ROBOT_STRATEGIES
const quoteFields = QUOTE_FIELDS
const feedback = ref('')
const accountHint = ref('')
const draft = reactive(emptyDraft())
const accountDraft = reactive({ uid: '', remark: '' })
const inventoryLow = ref(20)
const inventoryHigh = ref(80)
const quoteOpen = reactive({})

const allAccounts = computed(() => appState.config.internalAccounts || [])
const mmAccounts = computed(() => allAccounts.value.filter((item) => item.type === 'mm'))
const runningCount = computed(() => draft.bots.filter((bot) => bot.running).length)
const activeQuoteRow = computed(() => draft.quotes.find((item) => item.enabled) || draft.quotes[0] || cloneQuoteProfile())

function emptyDraft() {
  return cloneRobot(null)
}

function applyRobot(robot) {
  draft.enabled = robot.enabled
  draft.quotes = robot.quotes.map((item) => ({ ...item }))
  draft.quote = { ...robot.quote }
  draft.wash = { ...robot.wash }
  draft.bots = robot.bots.map((bot) => ({ ...bot }))
}

function currentRobot() {
  return cloneRobot({
    enabled: draft.enabled,
    quotes: draft.quotes,
    bots: draft.bots
  })
}

function loadDraft() {
  applyRobot(syncRobotBots(appState.config.robot, mmAccounts.value))
  inventoryLow.value = Number(appState.config.inventoryLow ?? 20)
  inventoryHigh.value = Number(appState.config.inventoryHigh ?? 80)
}

function isQuoteOpen(id) {
  return quoteOpen[id] !== false
}

function toggleQuoteOpen(id) {
  quoteOpen[id] = !isQuoteOpen(id)
}

function addQuote() {
  const id = nextQuoteId(draft.quotes)
  draft.quotes.push(cloneQuoteProfile({ id, enabled: false }))
  quoteOpen[id] = true
}

function removeQuote(index) {
  if (draft.quotes.length <= 1) {
    feedback.value = '至少保留一套挂单'
    return
  }
  draft.quotes.splice(index, 1)
}

function cancelQuote(index) {
  const saved = cloneRobot(appState.config.robot)
  const current = draft.quotes[index]
  const found = saved.quotes.find((item) => item.id === current.id)
  if (found) draft.quotes[index] = { ...found }
  else draft.quotes.splice(index, 1)
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
}

function setGlobal(on) {
  draft.enabled = on
  if (on) draft.bots.forEach((bot) => { bot.running = true })
}

function save() {
  const low = Number(inventoryLow.value)
  const high = Number(inventoryHigh.value)
  if (!(low < high)) {
    feedback.value = '安全带下限要小于上限'
    return
  }
  const synced = syncRobotBots(currentRobot(), mmAccounts.value)
  updateConfig({
    robot: synced,
    inventoryLow: low,
    inventoryHigh: high
  })
  applyRobot(synced)
  feedback.value = '✅ 已保存'
}

function resetDefaults() {
  applyRobot(syncRobotBots(cloneRobot(null), mmAccounts.value))
  inventoryLow.value = 20
  inventoryHigh.value = 80
  feedback.value = '已恢复默认，点保存才会生效'
}

watch(() => appState.currentPair, loadDraft, { immediate: true })
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
.quote-section {
  margin-top: 2px;
}
.quote-head,
.quote-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.quote-head {
  padding: 4px 2px 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-title);
}
.quote-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px 10px;
  margin-bottom: 12px;
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
.quote-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-soft);
}
.quote-body {
  margin-top: 12px;
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
  margin-top: 14px;
}
@media (max-width: 1100px) {
  .quote-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.cfg-note {
  padding: 8px 2px 4px;
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
