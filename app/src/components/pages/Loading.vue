<template>
  <v-app>
    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-row>
          <v-card-text>
            <p class="text-xs-center">
              <v-progress-circular indeterminate :size="50" class="primary--text"></v-progress-circular><br>
              Veuillez patienter...
            </p>
          </v-card-text>
        </v-card-row>
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
      const res = await api.isLoggedIn()
      this.$store.commit('setLoggedIn', res.loggedIn)
      if (res.loggedIn) {
        this.$store.commit('setUserId', res.user.id)
        this.$store.commit('setUserName', res.user.name)
      }
      this.$store.commit('setLoading', false)
      this.dialog = false

      /*
      TODO: remove the underlying code when Vuetify 0.12.7+ is released
      */

      const overlays = document.getElementsByClassName('overlay')
      while (overlays.length > 0) {
        overlays[0].parentNode.removeChild(overlays[0])
      }

      this.$router.replace(this.$route.query.redirect)
    },
    mounted () {
      this.dialog = true // needed here otherwise no overlay
    }
  }
</script>

<style>
</style>
