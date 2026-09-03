<template>
  <div class="collapsible-config" :class="{ 'is-collapsed': !open }">
    <button type="button" class="collapsible-header" @click="toggle">
      <span class="collapsible-title">{{ title }}</span>
      <span v-if="$slots.extra" class="collapsible-extra">
        <slot name="extra" />
      </span>
      <span class="collapsible-action">
        {{ open ? '收起' : '展开' }}
        <span class="collapsible-chevron" :class="{ open }">▾</span>
      </span>
    </button>
    <div v-show="open" class="collapsible-body">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  storageKey: { type: String, default: '' },
  defaultOpen: { type: Boolean, default: false }
})

const open = ref(props.defaultOpen)

function toggle() {
  open.value = !open.value
}
</script>
