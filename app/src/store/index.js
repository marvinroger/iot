import Vue from 'vue'
import Vuex from 'vuex'

import {WebSocket} from '../lib/websocket'
import {WS_API_URL} from '../constants'
import {parseMessage, MESSAGE_TYPES, EVENTS} from '../../../common/ws-messages'

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
    },
    devices: {}
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
    },
    addDevice (state, device) {
      state.devices[device.id] = device
      state.devices = JSON.parse(JSON.stringify(state.devices))
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

      ws.on('message', wsMessageHandler)

      ws.on('close', () => {
        commit('setWebsocketConnected', false)
      })
      ws.start()
    },
    disconnectFromWebsocket ({ state, commit }) {
      if (!state.websocket.instance) return
      state.websocket.instance.stop()
      state.websocket.instance = null
    }
  }
})

const wsMessageHandler = (message) => {
  const parsed = parseMessage(message)

  if (parsed.type !== MESSAGE_TYPES.EVENT) return

  switch (parsed.event) {
    case EVENTS.DEVICE:
      store.commit('addDevice', parsed.value)
      break
  }
}
