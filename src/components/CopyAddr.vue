<template>
  <span class="copy-addr">
    <router-link
      v-if="canDrill"
      class="copy-addr-text is-link"
      :to="detailTo"
      :title="`${address} · 查看地址详情`"
    >{{ displayText }}</router-link>
    <span v-else class="copy-addr-text" :title="address">{{ displayText }}</span>
    <button
      type="button"
      class="copy-addr-btn"
      :class="{ copied }"
      :title="copied ? '已复制完整地址' : '复制完整地址'"
      @click.stop="onCopy"
    >
      <svg v-if="copied" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <svg v-else viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </button>
  </span>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { copyText } from '@/utils/clipboard'
import { addressDetailPath, maskAddr } from '@/utils/address'

const props = defineProps({
  address: { type: String, default: '' },
  link: { type: Boolean, default: false }
})

const route = useRoute()
const copied = ref(false)
let timer = null

const displayText = computed(() => maskAddr(props.address))
const detailTo = computed(() => addressDetailPath(props.address))
const canDrill = computed(() => {
  if (!props.link || !props.address) return false
  const current = decodeURIComponent(String(route.params.address || ''))
  return current.toLowerCase() !== props.address.trim().toLowerCase()
})

async function onCopy() {
  const ok = await copyText(props.address)
  if (!ok) return
  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => {
    copied.value = false
  }, 1200)
}
</script>

<style scoped>
.copy-addr {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
}
.copy-addr-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: inherit;
  text-decoration: none;
}
.copy-addr-text.is-link {
  color: #8eb6ff;
  cursor: pointer;
}
.copy-addr-text.is-link:hover {
  text-decoration: underline;
}
.copy-addr-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-soft);
  cursor: pointer;
  flex-shrink: 0;
}
.copy-addr-btn:hover {
  background: rgba(60, 120, 255, 0.14);
  color: var(--accent);
}
.copy-addr-btn.copied {
  color: #4cd9a0;
  background: rgba(76, 217, 160, 0.12);
}
</style>
