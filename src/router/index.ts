import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { isLoggedIn } from '@/utils/auth'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    meta: { requiresAuth: true },
    component: () => import('@/views/chats/index.vue')
  },
  {
    path: '/messages',
    name: 'MessageView',
    meta: { requiresAuth: true },
    component: () => import('@/views/chats/index.vue')
  },
  {
    path: '/contacts',
    name: 'ContactView',
    meta: { requiresAuth: true },
    component: () => import('@/views/contacts/index.vue')
  },
  {
    path: '/contacts/apply-list',
    name: 'ApplyListView',
    meta: { requiresAuth: true },
    component: () => import('@/views/contacts/apply-list.vue')
  },
  {
    path: '/settings',
    name: 'SettingView',
    meta: { requiresAuth: true },
    component: () => import('@/views/settings/index.vue')
  },
  {
    path: '/search',
    name: 'SearchView',
    meta: { requiresAuth: true },
    component: () => import('@/views/search/index.vue')
  },
  {
    path: '/terms',
    name: 'TermsView',
    meta: {},
    component: () => import('@/views/terms.vue')
  },
  {
    path: '/auth',
    name: 'AuthView',
    meta: { requiresAuth: false },
    component: () => import('@/views/auth.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFoundView',
    component: () => import('@/views/not-found.vue')
  }
]

const getHistoryMode = () => import.meta.env.VITE_ROUTER_MODE == 'hash'
  ? createWebHashHistory()
  : createWebHistory()

const router = createRouter({
  history: getHistoryMode(),
  routes
})

router.beforeEach(to => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return {
      path: '/auth'
      // query: { redirect: to.fullPath }
    }
  }
})

export default router
