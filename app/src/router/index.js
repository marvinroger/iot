import Vue from 'vue'
import VueRouter from 'vue-router'

import {store} from '../store'

import Loading from '../components/pages/Loading'
import Login from '../components/pages/Login'
import Dashboard from '../components/pages/Dashboard'

import DashboardDevices from '../components/pages/dashboard/Devices'

Vue.use(VueRouter)

export const router = new VueRouter({
  routes: [
    { path: '/loading', component: Loading, meta: { title: '🔥 Chargement', requiresAuth: false } },
    {
      path: '/dashboard',
      component: Dashboard,
      meta: { title: '🏠 Panneau de contrôle', requiresAuth: true },
      children: [
        { path: '/', component: DashboardDevices, meta: { title: 'Périphériques' } }
      ]
    },
    { path: '/login', component: Login, meta: { title: '🔑 Connexion', requiresAuth: false } },
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

  if (to.meta.requiresAuth && !store.state.loggedIn) {
    next('/login')
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  let title = ''
  for (const route of to.matched) {
    title += route.meta.title + ' > '
  }
  document.title = `${title.slice(0, -3)} - IoT`
})
