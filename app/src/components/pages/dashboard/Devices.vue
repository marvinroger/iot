<template>
  <div>
    <h4>Périphériques</h4>

    <v-layout wrap>
      <v-flex v-for="device in Object.values($store.state.devices)" :key="device.id" xs4>
        <v-card>
          <v-card-row class="red accent-1">
            <v-card-title>{{ device.name }}</v-card-title>
          </v-card-row>

          <v-card-row>
            <v-card-text>
              <img src="/img/devices/lamp.svg" class="device-image" />
            </v-card-text>
          </v-card-row>

          <v-card-row>
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
          </v-card-row>
          <v-divider></v-divider>
          <v-card-row>
            <v-card-text>
              <v-layout wrap justify-space-around>
                <v-btn @click.native="handleAction(action[0], action[1])" v-for="action in Object.entries(device.actions)" :key="action[0]" flat class="red--text">{{ action[1].name }}</v-btn>
              </v-layout>
            </v-card-text>
          </v-card-row>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="action.paramsDialog" persistent>
      <v-card>
        <v-card-row>
          <v-card-title>{{ action.action.name }}</v-card-title>
        </v-card-row>
        <v-card-row>
          <v-card-text>
            <div v-for="(parameter, index) in action.action.accepts" :key="index">
              <v-slider v-if="parameter.type === 'range'" :min="parameter.range[0]" :max="parameter.range[1]" thumb-label v-model="action.givenParams[index]"></v-slider>
            </div>
          </v-card-text>
        </v-card-row>
        <v-card-row actions>
          <v-btn class="red--text" flat @click.native="action.paramsDialog = false">Annuler</v-btn>
          <v-btn class="red--text" flat @click.native="action.paramsDialog = false">OK</v-btn>
        </v-card-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        action: {
          paramsDialog: false,
          id: null,
          action: {},
          givenParams: {}
        }
      }
    },
    methods: {
      handleAction (id, action) {
        this.action.id = id
        this.action.action = action
        this.action.paramsDialog = true

        for (const paramIndex in this.action.action.accepts) {
          this.action.givenParams[paramIndex] = 0
          this.action.givenParams = JSON.parse(JSON.stringify(this.action.givenParams))
        }
      }
    }
  }
</script>

<style scoped>
  .device-image {
    display: block;
    margin: 0 auto;

    height: 100px;
  }
</style>
