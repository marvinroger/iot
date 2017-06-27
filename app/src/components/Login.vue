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
                    <v-avatar><img :src="data.item.avatar"></v-avatar>
                    {{ data.item.name }}
                  </v-chip>
                </div>
              </template>
              <template slot="item" scope="data">
                <v-list-tile-avatar>
                  <img :src="data.item.avatar"/>
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
  export default {
    data () {
      return {
        selectedUserId: null,
        password: '',
        showPassword: false,
        users: [
          { id: 0, name: 'Sandra Adams', avatar: 'https://vuetifyjs.com/static/doc-images/lists/1.jpg' },
          { id: 1, name: 'Ali Connors', avatar: 'https://vuetifyjs.com/static/doc-images/lists/2.jpg' },
          { id: 2, name: 'Trevor Hansen', avatar: 'https://vuetifyjs.com/static/doc-images/lists/3.jpg' },
          { id: 3, name: 'Tucker Smith', avatar: 'https://vuetifyjs.com/static/doc-images/lists/4.jpg' }
        ]
      }
    },
    methods: {
      handleLogin () {
        console.log(this.selectedUserId)
      }
    }
  }
</script>

<style>
</style>
