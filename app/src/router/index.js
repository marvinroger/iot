import Vue from 'vue'
import VueRouter from 'vue-router'

import {store} from '../store'
import {i18n} from '../i18n'

import Loading from '../components/pages/Loading'
import Login from '../components/pages/Login'
import Dashboard from '../components/pages/Dashboard'

import DashboardDevices from '../components/pages/dashboard/Devices'
import DashboardRooms from '../components/pages/dashboard/Rooms'
import DashboardSettings from '../components/pages/dashboard/Settings'

Vue.use(VueRouter)

export const router = new VueRouter({
  routes: [
    { path: '/loading', component: Loading, meta: { title: `🔥 ${i18n.t('loading.title')}`, requiresAuth: false } },
    {
      path: '/dashboard',
      component: Dashboard,
      meta: { title: `🏠 ${i18n.t('dashboard.title')}`, requiresAuth: true },
      children: [
        { path: '/', component: DashboardDevices, meta: { title: i18n.t('dashboard.devices.title') } },
        { path: 'rooms', component: DashboardRooms, meta: { title: i18n.t('dashboard.rooms.title') } },
        { path: 'settings', component: DashboardSettings, meta: { title: i18n.t('dashboard.settings.title'), requiresRole: ['admin'] } }
      ]
    },
    { path: '/login', component: Login, meta: { title: `🔑 ${i18n.t('login.title')}`, requiresAuth: false } },
    { path: '*', redirect: '/dashboard' }
  ]
})

router.beforeEach((to, from, next) => {
  if (store.state.loading && to.path !== '/loading') {
    return next({
      path: '/loading',
      query: { redirect: to.fullPath }
    })
  }

  if (to.matched.some(route => route.meta.requiresAuth) && !store.state.loggedIn) {
    return next('/login')
  }

  if (to.matched.some(route => route.meta.requiresRole && !route.meta.requiresRole.includes(store.state.user.role))) {
    return next('/')
  }

  next()
})

router.afterEach((to, from) => {
  let title = ''
  for (const route of to.matched) {
    title += route.meta.title + ' > '
  }
  document.title = `${title.slice(0, -3)} - IoT`
})
