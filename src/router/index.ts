import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { isLoggedIn } from '@/utils/auth'
import DevLayout from '@/layouts/DevLayout.vue'

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
    path: '/contacts/requests',
    name: 'ContactRequestView',
    meta: { requiresAuth: true },
    component: () => import('@/views/contacts/requests.vue')
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
    path: '/search/groups',
    name: 'SearchGroupView',
    meta: { requiresAuth: true },
    component: () => import('@/views/search/group.vue')
  },
  {
    path: '/terms',
    name: 'TermsView',
    meta: {},
    component: () => import('@/views/terms.vue')
  },
  {
    path: '/dev/',
    component: DevLayout,
    children: [
      {
        path: '',
        name: 'DevView',
        component: () => import('@/views/dev/index.vue')
      },
      {
        path: 'bots',
        name: 'DevBotView',
        component: () => import('@/views/dev/bot.vue'),
        meta: { requiresAuth: true }
      }
    ]
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

router.beforeEach((to: any) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return {
      path: '/auth'
      // query: { redirect: to.fullPath }
    }
  }
})

export default router
