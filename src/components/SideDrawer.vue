<template>
  <Teleport to="body">
    <div v-if="open" class="side-drawer">
      <div class="side-drawer-mask" @click="$emit('close')"></div>
      <aside class="side-drawer-panel" role="dialog" aria-modal="true">
        <header class="side-drawer-header">
          <div class="side-drawer-title">
            <slot name="title" />
          </div>
          <button type="button" class="btn-sm secondary" @click="$emit('close')">关闭</button>
        </header>
        <div class="side-drawer-body">
          <slot />
        </div>
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
}
.side-drawer-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: min(640px, 92vw);
  height: 100%;
  background: var(--bg-main);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  box-shadow: -12px 0 32px rgba(0, 0, 0, 0.35);
}
.side-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.side-drawer-title {
  font-size: 14px;
  color: var(--text-title);
  font-weight: 600;
}
.side-drawer-body {
  flex: 1;
  overflow: auto;
  padding: 14px 16px 20px;
}
</style>
