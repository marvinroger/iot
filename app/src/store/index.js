import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loading: true,
    loggedIn: false,
    user: {
      id: null,
      name: null
    }
  },
  mutations: {
    setLoading (state, loading) {
      state.loading = loading
    },
    setLoggedIn (state, loggedIn) {
      state.loggedIn = loggedIn
    },
    setUserId (state, userId) {
      state.user.id = userId
    },
    setUserName (state, userName) {
      state.user.name = userName
    }
  }
})
