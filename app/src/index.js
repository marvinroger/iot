import Vue from 'vue'

import {store} from './store'
import {router} from './router'
import VuexRouterSync from 'vuex-router-sync'

import './plugins'

import App from './components/App'

VuexRouterSync.sync(store, router)

export const vue = new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
