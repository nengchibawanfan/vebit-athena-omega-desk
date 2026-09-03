import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'dashboard', meta: { page: 'dashboard' }, component: () => import('@/views/DashboardView.vue') },
  { path: '/ops/dump', name: 'ops-dump', meta: { page: 'ops-dump', opsKind: 'dump' }, component: () => import('@/views/OpsDeskView.vue') },
  { path: '/ops/dump/history', name: 'ops-dump-history', meta: { page: 'ops-dump-history' }, component: () => import('@/views/TradeHistoryView.vue') },
  { path: '/ops/absorb', name: 'ops-absorb', meta: { page: 'ops-absorb', opsKind: 'absorb' }, component: () => import('@/views/OpsDeskView.vue') },
  { path: '/ops/absorb/history', name: 'ops-absorb-history', meta: { page: 'ops-absorb-history' }, component: () => import('@/views/UsersAssetsHistoryView.vue') },
  { path: '/ops/ladder', name: 'ops-ladder', meta: { page: 'ops-ladder', opsKind: 'ladder' }, component: () => import('@/views/OpsDeskView.vue') },
  { path: '/ops/stance', name: 'stance-combo', meta: { page: 'stance-combo' }, component: () => import('@/views/StanceComboView.vue') },
  { path: '/circ/exchange', name: 'circ-exchange', meta: { page: 'circ-exchange', circKind: 'exchange' }, component: () => import('@/views/CircSupplyView.vue') },
  { path: '/circ/onchain', name: 'circ-onchain', meta: { page: 'circ-onchain', circKind: 'onchain' }, component: () => import('@/views/CircSupplyView.vue') },
  { path: '/desk/mm', name: 'desk-mm', meta: { page: 'desk-mm' }, component: () => import('@/views/MmTodayView.vue') },
  { path: '/desk/mm/history', name: 'desk-mm-history', meta: { page: 'desk-mm-history' }, component: () => import('@/views/MmHistoryView.vue') },
  { path: '/desk/users', name: 'desk-users', meta: { page: 'desk-users' }, component: () => import('@/views/UsersTodayView.vue') },
  { path: '/desk/users/history', name: 'desk-users-history', meta: { page: 'desk-users-history' }, component: () => import('@/views/UsersHistoryView.vue') },
  { path: '/orderbook', name: 'orderbook', meta: { page: 'orderbook' }, component: () => import('@/views/OrderbookView.vue') },
  { path: '/orderbook/obi', redirect: '/ops/stance' },
  { path: '/position', redirect: '/ops/stance' },
  { path: '/position/cost-dev', redirect: '/ops/stance' },
  { path: '/risk', redirect: '/robots' },
  { path: '/robots', name: 'robots', meta: { page: 'robots' }, component: () => import('@/views/RobotStatusView.vue') },
  { path: '/robots/config', name: 'robots-config', meta: { page: 'robots-config' }, component: () => import('@/views/RobotConfigView.vue') },
  { path: '/macro', redirect: '/circ/onchain' },
  { path: '/alerts', name: 'alerts', meta: { page: 'alerts' }, component: () => import('@/views/AlertSummaryView.vue') },
  { path: '/detail-orders', name: 'detail-orders', meta: { page: 'detail-orders' }, component: () => import('@/views/DetailOrdersView.vue') },
  { path: '/chips/user', name: 'chips-user', meta: { page: 'chips-user' }, component: () => import('@/views/DetailHoldersView.vue') },
  { path: '/chips/float', redirect: '/' },
  { path: '/chips/active', redirect: '/circ/exchange' },
  { path: '/detail-holders', redirect: '/chips/user' },
  { path: '/whales/exchange', name: 'whales-exchange', meta: { page: 'whales-exchange' }, component: () => import('@/views/WhaleExchangeView.vue') },
  { path: '/whales/exchange/history', name: 'whales-exchange-history', meta: { page: 'whales-exchange-history' }, component: () => import('@/views/TransferHistoryView.vue') },
  { path: '/orderbook/blocks', name: 'orderbook-blocks', meta: { page: 'orderbook-blocks' }, component: () => import('@/views/BlockTradesView.vue') },
  { path: '/whales/onchain', redirect: '/circ/onchain' },
  { path: '/detail-whales', redirect: '/whales/exchange' },
  { path: '/chips/internal', name: 'chips-internal', meta: { page: 'chips-internal' }, component: () => import('@/views/InternalChipsView.vue') },
  { path: '/chips/external', name: 'chips-external', meta: { page: 'chips-external' }, component: () => import('@/views/DetailExternalView.vue') },
  { path: '/chips/external/address/:address?', name: 'chips-address', meta: { page: 'chips-address' }, component: () => import('@/views/AddressDetailView.vue') },
  { path: '/desk/user/:uid?', name: 'desk-user', meta: { page: 'desk-user' }, component: () => import('@/views/ExchangeUserView.vue') },
  { path: '/detail-external', redirect: '/chips/external' },
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
  history: createWebHistory(),
  routes
})

export default router
