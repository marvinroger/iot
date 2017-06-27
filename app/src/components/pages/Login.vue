<template>
  <v-container>
    <v-layout>
      <v-flex
        xs10 offset-xs1
        md4 offset-md4
      >
        <v-card class="elevation-4">
          <v-card-text>
            <v-select
              label="Sélectionnez un utilisateur"
              :items="users"
              item-value="id"
              item-text="name"
              v-model="selectedUserId"
              dark
              autocomplete
            >
              <template slot="selection" scope="data">
                <div :key="data.item">
                  <v-chip class="primary white--text">
                    <v-avatar><img :src="`${HTTP_API_URL}/user-avatar/${data.item.id}`" /></v-avatar>
                    {{ data.item.name }}
                  </v-chip>
                </div>
              </template>
              <template slot="item" scope="data">
                <v-list-tile-avatar>
                  <img :src="`${HTTP_API_URL}/user-avatar/${data.item.id}`"/>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ data.item.name }}</v-list-tile-title>
                </v-list-tile-content>
              </template>
            </v-select>

            <form v-if="selectedUserId !== null" @submit.prevent="handleLogin">
              <v-text-field
                v-model="password"
                :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                :append-icon-cb="() => (showPassword = !showPassword)"
                :type="showPassword ? 'text' : 'password'"
                :errors="loginFailed ? 'Mot de passe invalide' : ''"
                label="Mot de passe"
              />
            </form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {HTTP_API_URL} from '../../constants'
  import * as api from '../../services/api'

  export default {
    data () {
      return {
        HTTP_API_URL,
        loginFailed: false,
        selectedUserId: null,
        password: '',
        showPassword: false,
        users: []
      }
    },
    async created () {
      if (this.$store.state.loggedIn) {
        return this.$router.replace('/')
      }

      this.users = await api.getUsers()
    },
    methods: {
      async handleLogin () {
        const success = await api.login({ userId: this.selectedUserId, password: this.password })
        if (success) {
          this.$store.commit('setLoggedIn', true)
          this.$router.replace('/')
        } else this.loginFailed = true
      }
    }
  }
</script>

<style>
</style>
