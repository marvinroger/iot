<template>
  <div>
    <h4>Périphériques</h4>

    <v-layout wrap>
      <v-flex v-for="device in Object.values($store.state.devices)" xs4>
        <v-card>
          <v-card-row class="red accent-1">
            <v-card-title>{{ device.name }}</v-card-title>
          </v-card-row>

          <v-card-text>
            <v-data-table
              :headers="[{ text: 'Propriété', sortable: false, left: true }, { text: 'Valeur', sortable: false, left: true }]"
              :items="Object.values(device.properties)"
              hide-actions
              class="elevation-1"
            >
              <template slot="items" scope="props">
                <td>{{ props.item.name }}</td>
                <td>
                  <v-switch v-if="props.item.type === 'boolean'" v-model="props.item.value" disabled></v-switch>
                  <v-progress-linear v-else-if="props.item.type === 'range'" v-model="props.item.value"></v-progress-linear>
                  <v-icon v-else-if="props.item.type === 'color'" :style="{
                    color: `rgb(${props.item.value[0]}, ${props.item.value[1]}, ${props.item.value[2]})`
                  }">color_lens</v-icon>
                </td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    }
  }
</script>

<style>
</style>
