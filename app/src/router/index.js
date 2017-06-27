import Vue from 'vue'
import VueRouter from 'vue-router'

import {store} from '../store'

import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(VueRouter)

export const router = new VueRouter({
  routes: [
    { path: '/', component: Home, meta: { requiresAuth: true } },
    { path: '/login', component: Login, meta: { requiresAuth: false } },
    { path: '*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.loggedIn) {
    next('/login')
  } else {
    next()
  }
})
