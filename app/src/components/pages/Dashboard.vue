<template>
  <v-app>
    <v-navigation-drawer persistent light :mini-variant.sync="mini" v-model="drawer">
      <v-list class="pa-0">
        <v-list-item>
          <v-list-tile avatar tag="div">
            <v-list-tile-avatar>
              <img :src="`${HTTP_API_URL}/user-avatar/${$store.state.user.id}`" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $store.state.user.name }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon @click.native.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-item>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-item v-for="item in items" :key="item" v-if="!item.requiresRole || item.requiresRole.includes($store.state.user.role)">
          <v-list-tile router :to="item.url" exact>
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed class="red accent-2" light>
      <v-toolbar-side-icon light @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>IoT</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn light icon :ripple="false" v-tooltip:bottom="{ html: $store.state.websocket.connected ? $t('dashboard.connection.ok') : $t('dashboard.connection.none') }">
        <v-icon>{{ $store.state.websocket.connected ? 'network_wifi' : 'wifi_off' }}</v-icon>
      </v-btn>
      <v-btn light icon @click.native="logout" v-tooltip:bottom="{ html: $t('dashboard.logout') }">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
    <main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>
  </v-app>
</template>

<script>
  import {HTTP_API_URL} from '../../constants'
  import * as api from '../../services/api'

  export default {
    data () {
      return {
        HTTP_API_URL,
        drawer: true,
        items: [
          { title: this.$i18n.t('dashboard.devices.title'), icon: 'dashboard', url: '/dashboard' },
          { title: this.$i18n.t('dashboard.settings.title'), icon: 'settings', url: '/dashboard/settings', requiresRole: ['admin'] }
        ],
        mini: false
      }
    },
    created () {
      this.$store.dispatch('connectToWebsocket')
    },
    methods: {
      async logout () {
        await api.logout()
        this.$store.commit('setLoggedIn', false)
        this.$router.replace('/login')
      }
    }
  }
</script>

<style>
</style>
