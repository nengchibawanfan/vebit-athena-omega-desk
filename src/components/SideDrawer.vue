<template>
  <Teleport to="body">
    <div v-if="open" class="side-drawer">
      <div class="side-drawer-mask" @click="$emit('close')"></div>
      <aside class="side-drawer-panel" role="dialog" aria-modal="true">
        <header class="side-drawer-header">
          <div class="side-drawer-heading">
            <div class="side-drawer-title">
              <slot name="title" />
            </div>
            <div v-if="$slots.sub" class="side-drawer-sub">
              <slot name="sub" />
            </div>
          </div>
          <button type="button" class="drawer-close" aria-label="关闭" @click="$emit('close')">✕</button>
        </header>
        <div class="side-drawer-body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="side-drawer-footer">
          <slot name="footer" />
        </footer>
      </aside>
    </div>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

function onKeydown(event) {
  if (event.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  }
)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.side-drawer {
  position: fixed;
  inset: 0;
  z-index: 80;
}
.side-drawer-mask {
  position: absolute;
  inset: 0;
  background: var(--mask);
  backdrop-filter: blur(2px);
}
.side-drawer-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: min(420px, 94vw);
  height: 100%;
  background: var(--bg-elevated);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  box-shadow: -18px 0 48px rgba(0, 0, 0, 0.42);
}
.side-drawer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.side-drawer-heading {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.side-drawer-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 15px;
  color: var(--text-title);
  font-weight: 650;
  letter-spacing: 0.01em;
}
.side-drawer-sub {
  font-size: 11px;
  color: var(--text-soft);
  line-height: 1.45;
}
.drawer-close {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text-soft);
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
}
.drawer-close:hover {
  color: var(--text-title);
  border-color: var(--border-hover);
  background: var(--bg-kpi-hover);
}
.side-drawer-body {
  flex: 1;
  overflow: auto;
  padding: 18px 20px 24px;
}
.side-drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px;
  border-top: 1px solid var(--border);
  background: var(--bg-elevated);
  flex-shrink: 0;
}
</style>
