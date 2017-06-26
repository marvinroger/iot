import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'

import App from './components/App'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(Vuetify)

export const vue = new Vue({
  el: '#app',
  render: h => h(App)
})
