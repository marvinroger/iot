<template>
  <v-app class="app">
    <router-view></router-view>
  </v-app>
</template>

<script>
  import 'vuetify/dist/vuetify.min.css'

  export default {
    data () {
      return {

      }
    }
  }
</script>

<style scoped>
  .app {
    background: none;
  }
</style>

<style>
  body {
    background: url(../assets/bg.jpg) no-repeat center center fixed;
    background-size: cover;
  }
</style>
