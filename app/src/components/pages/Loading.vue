<template>
  <v-app>
    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-text>
          <p class="text-xs-center">
            <v-progress-circular indeterminate :size="50" class="primary--text"></v-progress-circular><br>
            {{ $t('loading.pleaseWait') }}
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  import * as api from '../../services/api'

  export default {
    data () {
      return {
        dialog: false
      }
    },
    async created () {
      const handshake = await api.getHandshake()
      this.$store.dispatch('setLanguage', handshake.language)

      this.$store.commit('setServerVersion', handshake.version)
      this.$store.commit('setLoggedIn', handshake.loggedIn)
      if (handshake.loggedIn) {
        this.$store.commit('setUserId', handshake.user.id)
        this.$store.commit('setUserName', handshake.user.name)
        this.$store.commit('setUserRole', handshake.user.role)
      }

      this.$store.commit('setLoading', false)
      this.dialog = false

      this.$router.replace(this.$route.query.redirect)
    },
    mounted () {
      this.dialog = true // needed here otherwise no overlay
    }
  }
</script>

<style>
</style>
