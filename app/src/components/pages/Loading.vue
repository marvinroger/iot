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
      const language = await api.getLanguage()
      this.$store.dispatch('setLanguage', language)

      const res = await api.isLoggedIn()
      this.$store.commit('setLoggedIn', res.loggedIn)
      if (res.loggedIn) {
        this.$store.commit('setUserId', res.user.id)
        this.$store.commit('setUserName', res.user.name)
        this.$store.commit('setUserRole', res.user.role)
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
