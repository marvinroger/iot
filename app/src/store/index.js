import Vue from 'vue'
import Vuex from 'vuex'

import {WebSocket} from '../lib/websocket'
import {WS_API_URL} from '../constants'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loading: true,
    loggedIn: false,
    user: {
      id: null,
      name: null,
      role: null
    },
    websocket: {
      connected: false,
      instance: null
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
    },
    setUserRole (state, role) {
      state.user.role = role
    },
    setWebsocketConnected (state, connected) {
      state.websocket.connected = connected
    },
    setWebsocketInstance (state, instance) {
      state.websocket.instance = instance
    }
  },
  actions: {
    connectToWebsocket ({ state, commit }) {
      if (!state.websocket.instance) {
        const ws = new WebSocket(WS_API_URL)
        commit('setWebsocketInstance', ws)
      }

      const ws = state.websocket.instance
      ws.on('open', () => {
        commit('setWebsocketConnected', true)
      })

      ws.on('close', () => {
        commit('setWebsocketConnected', false)
      })
      ws.start()
    }
  }
})
