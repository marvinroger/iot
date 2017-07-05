import Vue from 'vue'
import Vuex from 'vuex'

import {i18n} from '../i18n'
import {WebSocket} from '../lib/websocket'
import {WS_API_URL} from '../constants'
import {parseMessage, MESSAGE_TYPES} from '../../../common/ws-messages'
import {EVENT_TYPES} from '../../../common/event-types'
import {DEVICE_UPDATE_TYPES} from '../../../common/device-update-types'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loading: true,
    serverVersion: null,
    language: null,
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
    setLanguage (state, language) {
      state.language = language
    },
    setServerVersion (state, version) {
      state.serverVersion = version
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
    handleDeviceUpdate (state, update) {
      // devices
      if (update.type === DEVICE_UPDATE_TYPES.DEVICE_ADDED) {
        Vue.set(state.devices, update.id, update.value)
      } else if (update.type === DEVICE_UPDATE_TYPES.DEVICE_REMOVED) {
        delete state.devices[update.id]
      } else if (update.type === DEVICE_UPDATE_TYPES.ONLINE_SET) {
        state.devices[update.id].online = update.value
      // properties
      } else if (update.type === DEVICE_UPDATE_TYPES.PROPERTIES_CLEARED) {
        state.devices[update.id].properties = {}
      } else if (update.type === DEVICE_UPDATE_TYPES.PROPERTIES_SET) {
        state.devices[update.id].properties = Object.assign({}, state.devices[update.id].properties, update.value)
      } else if (update.type === DEVICE_UPDATE_TYPES.PROPERTIES_REMOVED) {
        for (const property of update.value) {
          delete state.devices[update.id].properties[property]
        }
      // actions
      } else if (update.type === DEVICE_UPDATE_TYPES.ACTIONS_CLEARED) {
        state.devices[update.id].actions = {}
      } else if (update.type === DEVICE_UPDATE_TYPES.ACTIONS_SET) {
        state.devices[update.id].actions = Object.assign({}, state.devices[update.id].actions, update.value)
      } else if (update.type === DEVICE_UPDATE_TYPES.ACTIONS_REMOVED) {
        for (const action of update.value) {
          delete state.devices[update.id].actions[action]
        }
      }
    }
  },
  actions: {
    setLanguage ({ commit }, language) {
      commit('setLanguage', language)
      i18n.locale = language
    },
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
    case EVENT_TYPES.DEVICE_UPDATE:
      store.commit('handleDeviceUpdate', parsed.value)
      break
  }
}
