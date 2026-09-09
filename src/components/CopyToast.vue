<template>
  <Teleport to="body">
    <div v-if="toast" class="copy-toast">{{ toast }}</div>
  </Teleport>
</template>

<script setup>
import { copyToast } from '@/utils/clipboard'

const toast = copyToast()
</script>

<style scoped>
.copy-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 120;
  padding: 12px 22px;
  border-radius: 8px;
  background: rgba(20, 40, 28, 0.96);
  border: 1px solid rgba(76, 217, 160, 0.45);
  color: #4cd9a0;
  font-size: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  pointer-events: none;
}
</style>
