<template>
  <div>
    <h4>{{ $t('dashboard.devices.title') }}</h4>

    <v-layout wrap>
      <v-flex v-for="device in Object.values($store.state.devices)" :key="device.id" xs12 sm6 md4>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ device.name }}</h3>
            </div>
          </v-card-title>

          <v-card-text v-if="!device.online">
            <div class="text-xs-center">
              <v-chip class="red white--text">
                <v-icon left>cloud_off</v-icon>{{ $t('dashboard.devices.offline') }}
              </v-chip>
            </div>
          </v-card-text>

          <v-card-media
            :src="`/img/devices/${device.image ? device.image : 'device'}.svg`"
            height="150px"
            contain
          >
        </v-card-media>

          <v-card-text>
            <v-data-table
              :headers="[{ text: $t('dashboard.devices.property'), sortable: false, left: true }, { text: $t('dashboard.devices.value'), sortable: false, left: true }]"
              :items="Object.values(device.properties)"
              hide-actions
              class="elevation-1"
            >
              <template slot="items" scope="props">
                <td>{{ props.item.name }}</td>
                <td>
                  <v-checkbox v-if="props.item.type === 'boolean'" v-model="props.item.value" disabled />
                  <v-progress-linear v-else-if="props.item.type === 'range'" v-model="props.item.value"></v-progress-linear>
                  <v-icon v-else-if="props.item.type === 'color'" :style="{
                    color: `rgb(${props.item.value[0]}, ${props.item.value[1]}, ${props.item.value[2]})`
                  }">color_lens</v-icon>
                </td>
              </template>
            </v-data-table>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-text v-if="device.online">
            <v-layout wrap justify-space-around>
              <v-btn @click.native="handleAction(device.id, action[0], action[1])" v-for="action in Object.entries(device.actions)" :key="action[0]" flat class="red--text">{{ action[1].name }}</v-btn>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="action.paramsDialog" persistent>
      <v-card>
        <v-card-title>{{ action.action.name }}</v-card-title>

        <v-card-text>
          <div v-for="(parameter, index) in action.action.accepts" :key="index">
            <v-slider v-if="parameter.type === 'range'" :min="parameter.range[0]" :max="parameter.range[1]" thumb-label v-model="action.givenParams[index]"></v-slider>
            <chrome-picker v-else-if="parameter.type === 'color'" v-model="action.givenParams[index]"></chrome-picker>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn class="red--text" flat @click.native="action.paramsDialog = false">{{ $t('generic.cancel') }}</v-btn>
          <v-btn class="red--text" flat @click.native="handleActionSending">{{ $t('generic.ok') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Chrome as ChromePicker} from 'vue-color'

  export default {
    data () {
      return {
        action: {
          paramsDialog: false,
          deviceId: null,
          id: null,
          action: {},
          givenParams: {}
        }
      }
    },
    components: { ChromePicker },
    methods: {
      handleAction (deviceId, id, action) {
        this.action.deviceId = deviceId
        this.action.id = id
        this.action.action = action
        this.action.paramsDialog = true

        this.action.givenParams = {}
        for (const paramIndex in this.action.action.accepts) {
          const param = this.action.action.accepts[paramIndex]
          if (param.type === 'range') {
            Vue.set(this.action.givenParams, paramIndex, param.range[0])
          } else if (param.type === 'color') {
            Vue.set(this.action.givenParams, paramIndex, { hex: '#FFE975', rgba: { r: 255, g: 233, b: 117, a: 1 } })
          }
        }
      },
      handleActionSending () {
        const formattedParams = []
        for (const paramIndex in this.action.action.accepts) {
          const param = this.action.action.accepts[paramIndex]
          const givenParam = this.action.givenParams[paramIndex]
          let formatted
          if (param.type === 'range') {
            formatted = givenParam
          } else if (param.type === 'color') {
            formatted = [givenParam.rgba.r, givenParam.rgba.g, givenParam.rgba.b]
          }

          formattedParams.push(formatted)
        }

        this.$store.dispatch('triggerAction', { action: this.action.id, deviceId: this.action.deviceId, params: formattedParams })
        this.action.paramsDialog = false
      }
    }
  }
</script>
