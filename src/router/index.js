import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'dashboard', meta: { page: 'dashboard' }, component: () => import('@/views/DashboardView.vue') },
  { path: '/ops/dump', name: 'ops-dump', meta: { page: 'ops-dump' }, component: () => import('@/views/OpsDeskView.vue') },
  { path: '/ops/dump/history', name: 'ops-dump-history', meta: { page: 'ops-dump-history' }, component: () => import('@/views/TradeHistoryView.vue') },
  { path: '/ops/absorb', redirect: to => ({ path: '/desk/users', query: to.query }) },
  { path: '/ops/absorb/history', redirect: '/desk/users/history' },
  { path: '/ops/ladder', name: 'ops-ladder', meta: { page: 'ops-ladder' }, component: () => import('@/views/StanceComboView.vue') },
  { path: '/ops/stance', redirect: '/ops/ladder' },
  { path: '/circ/exchange', redirect: '/' },
  { path: '/circ/onchain', redirect: '/' },
  { path: '/desk/mm', redirect: '/ops/dump' },
  { path: '/desk/mm/history', redirect: '/ops/dump/history' },
  { path: '/desk/users', name: 'desk-users', meta: { page: 'desk-users' }, component: () => import('@/views/UsersTodayView.vue') },
  { path: '/desk/users/history', name: 'desk-users-history', meta: { page: 'desk-users-history' }, component: () => import('@/views/UsersHistoryView.vue') },
  { path: '/desk/users/chips', name: 'desk-users-chips', meta: { page: 'desk-users-chips' }, component: () => import('@/views/UsersChipsView.vue') },
  { path: '/orderbook', redirect: '/ops/ladder' },
  { path: '/orderbook/obi', redirect: '/ops/ladder' },
  { path: '/position', redirect: '/ops/ladder' },
  { path: '/position/cost-dev', redirect: '/ops/ladder' },
  { path: '/risk', redirect: '/robots' },
  { path: '/robots', name: 'robots', meta: { page: 'robots' }, component: () => import('@/views/RobotStatusView.vue') },
  { path: '/robots/config', name: 'robots-config', meta: { page: 'robots-config' }, component: () => import('@/views/RobotConfigView.vue') },
  { path: '/macro', redirect: '/' },
  { path: '/alerts', name: 'alerts', meta: { page: 'alerts' }, component: () => import('@/views/AlertSummaryView.vue') },
  { path: '/detail-orders', redirect: '/ops/ladder' },
  { path: '/chips/user', redirect: '/desk/users/chips' },
  { path: '/chips/float', redirect: '/' },
  { path: '/chips/active', redirect: '/' },
  { path: '/detail-holders', redirect: '/desk/users/chips' },
  { path: '/whales/exchange', name: 'whales-exchange', meta: { page: 'whales-exchange' }, component: () => import('@/views/WhaleExchangeView.vue') },
  { path: '/whales/exchange/history', name: 'whales-exchange-history', meta: { page: 'whales-exchange-history' }, component: () => import('@/views/TransferHistoryView.vue') },
  { path: '/orderbook/blocks', redirect: '/ops/ladder' },
  { path: '/whales/onchain', redirect: '/' },
  { path: '/detail-whales', redirect: '/whales/exchange' },
  { path: '/chips/internal', name: 'chips-internal', meta: { page: 'chips-internal' }, component: () => import('@/views/InternalChipsView.vue') },
  { path: '/chips/external', redirect: '/' },
  { path: '/chips/external/address/:address?', redirect: '/' },
  { path: '/desk/user/:uid?', name: 'desk-user', meta: { page: 'desk-user' }, component: () => import('@/views/ExchangeUserView.vue') },
  { path: '/detail-external', redirect: '/' },
  { path: '/stable-profit', redirect: '/user-profile/smart' },
  { path: '/trade-risk', redirect: '/alerts' },
  { path: '/user-profile', name: 'user-profile', meta: { page: 'user-profile' }, component: () => import('@/views/UserProfileView.vue') },
  { path: '/user-profile/smart', name: 'persona-smart', meta: { page: 'persona-smart', persona: 'smart' }, component: () => import('@/views/PersonaDetailView.vue') },
  { path: '/user-profile/retail', name: 'persona-retail', meta: { page: 'persona-retail', persona: 'retail' }, component: () => import('@/views/PersonaDetailView.vue') },
  { path: '/user-profile/wool', name: 'persona-wool', meta: { page: 'persona-wool', persona: 'wool' }, component: () => import('@/views/PersonaDetailView.vue') },
  { path: '/user-profile/kol', name: 'persona-kol', meta: { page: 'persona-kol', persona: 'kol' }, component: () => import('@/views/PersonaDetailView.vue') },
  { path: '/user-profile/prog', name: 'persona-prog', meta: { page: 'persona-prog', persona: 'prog' }, component: () => import('@/views/PersonaDetailView.vue') }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
