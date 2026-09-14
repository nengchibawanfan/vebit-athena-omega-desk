<template>
  <nav class="sidebar">
    <div class="brand-block">
      <div class="brand">
        <span class="brand-mark">🎯</span>
        <span class="brand-copy">
          <span class="brand-name">Athena</span>
          <span class="brand-sub">Omega Desk</span>
        </span>
      </div>
      <div class="theme-switch" role="group" aria-label="显示模式">
        <button type="button" :class="{ active: appState.theme === 'light' }" @click="setTheme('light')">白天</button>
        <button type="button" :class="{ active: appState.theme === 'dark' }" @click="setTheme('dark')">夜间</button>
      </div>
    </div>

    <template v-for="(item, index) in NAV_ITEMS" :key="index">
      <div v-if="item.divider" class="nav-section">{{ item.label }}</div>

      <div
        v-else-if="item.children"
        class="nav-group"
      >
        <div
          v-if="item.to"
          class="nav-split"
          :class="{ active: isChildActive(item) || (isGroupActive(item) && !isGroupOpen(item)) }"
        >
          <router-link
            class="nav-item"
            :to="childTo(item)"
            active-class=""
            exact-active-class=""
          >
            <span class="icon">{{ item.icon }}</span>
            <span class="label">{{ item.label }}</span>
          </router-link>
          <button
            type="button"
            class="fold"
            :aria-expanded="isGroupOpen(item)"
            :aria-label="`展开${item.label}`"
            @click.stop="onParentClick(item)"
          >
            <svg class="chevron" :class="{ open: isGroupOpen(item) }" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.4 6.2 8 10.8 12.6 6.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <button
          v-else
          type="button"
          class="nav-item"
          :class="{ active: isGroupActive(item) && !isGroupOpen(item) }"
          :aria-expanded="isGroupOpen(item)"
          @click="onParentClick(item)"
        >
          <span class="icon">{{ item.icon }}</span>
          <span class="label">{{ item.label }}</span>
          <svg class="chevron" :class="{ open: isGroupOpen(item) }" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3.4 6.2 8 10.8 12.6 6.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <div v-if="isGroupOpen(item)" class="nav-children">
          <template v-for="child in item.children" :key="child.to || child.label">
            <div v-if="child.children && child.to">
              <div
                class="nav-split"
                :class="{ active: isChildActive(child) || (isGroupActive(child) && !isGroupOpen(child)) }"
              >
                <router-link
                  class="nav-item sub"
                  :to="childTo(child)"
                  active-class=""
                  exact-active-class=""
                >
                  <span class="icon">{{ child.icon }}</span>
                  <span class="label">{{ child.label }}</span>
                </router-link>
                <button
                  type="button"
                  class="fold"
                  :aria-expanded="isGroupOpen(child)"
                  :aria-label="`展开${child.label}`"
                  @click.stop="onParentClick(child)"
                >
                  <svg class="chevron" :class="{ open: isGroupOpen(child) }" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3.4 6.2 8 10.8 12.6 6.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
              <div v-if="isGroupOpen(child)" class="nav-children deep">
                <router-link
                  v-for="grand in child.children"
                  :key="grand.label"
                  class="nav-item sub leaf"
                  :class="{ active: isChildActive(grand) }"
                  :to="childTo(grand)"
                  active-class=""
                  exact-active-class=""
                >
                  <span class="icon">{{ grand.icon }}</span>
                  <span class="label">{{ grand.label }}</span>
                </router-link>
              </div>
            </div>

            <div v-else-if="child.children">
              <button
                type="button"
                class="nav-item sub"
                :class="{ active: isGroupActive(child) && !isGroupOpen(child) }"
                :aria-expanded="isGroupOpen(child)"
                @click="onParentClick(child)"
              >
                <span class="icon">{{ child.icon }}</span>
                <span class="label">{{ child.label }}</span>
                <svg class="chevron" :class="{ open: isGroupOpen(child) }" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3.4 6.2 8 10.8 12.6 6.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <div v-if="isGroupOpen(child)" class="nav-children deep">
                <router-link
                  v-for="grand in child.children"
                  :key="grand.to || grand.label"
                  class="nav-item sub leaf"
                  :class="{ active: isChildActive(grand) }"
                  :to="childTo(grand)"
                  active-class=""
                  exact-active-class=""
                >
                  <span class="icon">{{ grand.icon }}</span>
                  <span class="label">{{ grand.label }}</span>
                </router-link>
              </div>
            </div>

            <router-link
              v-else
              class="nav-item sub"
              :class="{ active: isChildActive(child) }"
              :to="childTo(child)"
              active-class=""
              exact-active-class=""
            >
              <span class="icon">{{ child.icon }}</span>
              <span class="label">{{ child.label }}</span>
            </router-link>
          </template>
        </div>
      </div>

      <router-link
        v-else
        class="nav-item"
        :class="{ active: isChildActive(item) }"
        :to="childTo(item)"
        active-class=""
        exact-active-class=""
      >
        <span class="icon">{{ item.icon }}</span>
        <span class="label">{{ item.label }}</span>
      </router-link>
    </template>
  </nav>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NAV_ITEMS } from '@/config/constants'
import { lastExternalAddressPath } from '@/utils/address'
import { lastDeskUserPath } from '@/utils/uid'
import { appState, setTheme } from '@/stores/app'

const route = useRoute()
const expanded = reactive({})

function childTo(item) {
  if (item.match === 'address') return lastExternalAddressPath()
  if (item.match === 'user') return lastDeskUserPath()
  return item.to
}

function matchesItem(item, path) {
  if (!path) return false
  if (item.match === 'address') return path.startsWith('/chips/external/address')
  if (item.match === 'user') return path === '/desk/user' || path.startsWith('/desk/user/')
  if (item.match === 'profile') return path === '/user-profile' || path.startsWith('/user-profile/')
  if (!item.to) return false
  return path === item.to
}

function collectItems(items, acc = []) {
  for (const item of items || []) {
    if (item.divider) continue
    acc.push(item)
    if (item.children) collectItems(item.children, acc)
  }
  return acc
}

function isChildActive(item) {
  return matchesItem(item, route.path)
}

function isGroupActive(item) {
  return collectItems(item.children).some((child) => matchesItem(child, route.path)) || matchesItem(item, route.path)
}

function isGroupOpen(item) {
  return !!expanded[item.label]
}

function onParentClick(item) {
  expanded[item.label] = !isGroupOpen(item)
}

function hasMatchingDescendant(item, path) {
  return collectItems(item.children).some((child) => matchesItem(child, path))
}

function walkGroups(items, fn) {
  for (const item of items || []) {
    if (item.divider) continue
    if (item.children) {
      fn(item)
      walkGroups(item.children, fn)
    }
  }
}

watch(
  () => route.path,
  (path, prev) => {
    walkGroups(NAV_ITEMS, (item) => {
      const onChild = hasMatchingDescendant(item, path)
      const wasOnChild = hasMatchingDescendant(item, prev)
      if (onChild && !wasOnChild) expanded[item.label] = true
    })
  },
  { immediate: true }
)
</script>

<style scoped>
.sidebar {
  width: 232px;
  height: 100vh;
  flex-shrink: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 1px;
  padding: 18px 12px 20px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--sidebar-border);
  user-select: none;
}
.sidebar > * {
  flex-shrink: 0;
}
.sidebar::-webkit-scrollbar {
  width: 6px;
}
.sidebar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 6px;
}

.brand-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 2px 6px 14px;
  margin-bottom: 6px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  font-size: 15px;
  background: linear-gradient(180deg, var(--brand-from) 0%, var(--brand-to) 100%);
  border: 1px solid var(--brand-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}
.sidebar .theme-switch {
  width: 100%;
}
.sidebar .theme-switch button {
  flex: 1;
}
.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.brand-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-title);
  letter-spacing: 0.04em;
  line-height: 1.15;
}
.brand-sub {
  font-size: 10px;
  color: var(--text-soft);
  letter-spacing: 0.06em;
}

.nav-section {
  margin: 14px 8px 6px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.16em;
  color: var(--nav-muted);
}
.brand-block + .nav-section {
  margin-top: 2px;
}

.nav-group,
.nav-split,
.nav-children {
  flex-shrink: 0;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 34px;
  min-height: 34px;
  flex-shrink: 0;
  padding: 0 8px 0 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--nav-text);
  font-family: inherit;
  font-size: 13px;
  line-height: 1.2;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.nav-item .icon {
  width: 18px;
  flex-shrink: 0;
  font-size: 14px;
  line-height: 1;
  text-align: center;
  opacity: 0.92;
}
.nav-item .label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
}
.nav-item:hover {
  background: var(--nav-hover);
  color: var(--nav-text-hover);
}
.nav-item.active {
  background: var(--nav-active);
  color: var(--nav-text-active);
}

.chevron {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  color: var(--text-soft);
  transition: transform 0.16s ease, color 0.16s ease;
}
.chevron.open {
  transform: rotate(180deg);
  color: var(--accent);
}

.nav-children {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 2px 0 6px 12px;
}
.nav-item.sub {
  height: 34px;
  min-height: 34px;
  padding-left: 10px;
  color: var(--nav-text);
  font-size: 13px;
}
.nav-item.sub:hover,
.nav-item.sub.active {
  color: var(--nav-text-hover);
}
.nav-item.sub.active {
  background: var(--nav-active);
  color: var(--nav-text-active);
}
.nav-item.sub .icon {
  font-size: 14px;
  opacity: 0.8;
}
.nav-item.leaf {
  height: 34px;
  min-height: 34px;
  padding-left: 22px;
  color: var(--nav-text);
  font-size: 13px;
}

.nav-split {
  display: flex;
  align-items: center;
  border-radius: 8px;
}
.nav-split .nav-item {
  flex: 1;
  min-width: 0;
  padding-right: 2px;
}
.nav-split .nav-item:hover,
.nav-split.active .nav-item {
  background: transparent;
  color: inherit;
}
.nav-split:hover {
  background: var(--nav-hover);
  color: var(--nav-text-hover);
}
.nav-split.active {
  background: var(--nav-active);
  color: var(--nav-text-active);
}
.fold {
  width: 28px;
  height: 28px;
  margin-right: 2px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.fold:hover {
  background: var(--nav-hover);
}

@media (max-width: 1024px) {
  .sidebar {
    width: 212px;
    padding: 14px 10px 16px;
  }
}
@media (max-width: 600px) {
  .sidebar {
    width: 176px;
    padding: 12px 8px 14px;
  }
  .nav-item {
    gap: 8px;
  }
  .brand-sub {
    display: none;
  }
}
</style>
