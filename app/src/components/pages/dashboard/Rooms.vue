<template>
  <div>
    <h4>{{ $t('dashboard.rooms.title') }}</h4>

    <v-container fluid>
      <v-layout row>
        <v-flex xs8>
          <form @submit.prevent="addRoom">
            <v-text-field
              name="input-1"
              :label="$t('dashboard.rooms.addRoom')"
              v-model="roomName"
            />
          </form>
        </v-flex>

        <v-flex xs4>
          <v-switch :label="$t('dashboard.rooms.rearrange')" v-model="rearrange" />
        </v-flex>
      </v-layout>
    </v-container>

    <grid-layout
      :layout="$store.state.roomsPositions"
      :col-num="12"
      :row-height="30"
      :is-draggable="rearrange"
      :is-resizable="rearrange"
      :vertical-compact="false"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
      <grid-item v-for="item in $store.state.roomsPositions" :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :minW="2"
        :minH="2"
        @resized="onLayoutChange"
        @moved="onLayoutChange"
      >
        <v-card class="fill-height">
          <v-card-media
            class="white--text"
            height="100%"
            :src="`${HTTP_API_URL}/room-picture/${item.i}`"
          >
            <v-container fill-height fluid class="pa-0">
              <v-layout fill-height class="ma-0">
                <v-flex xs12 align-end flexbox class="pa-0">
                  <div class="custom-headline custom-transparent-black fittext">{{ $store.state.rooms[item.i] }}</div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-media>
        </v-card>
      </grid-item>
   </grid-layout>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {GridLayout, GridItem} from 'vue-grid-layout'
  import textfit from 'textfit'

  import {HTTP_API_URL} from '../../../constants'

  export default {
    components: { GridLayout, GridItem },
    data () {
      return {
        HTTP_API_URL,
        rearrange: false,
        roomName: ''
      }
    },
    methods: {
      addRoom () {
        this.$store.dispatch('addRoom', { name: this.roomName })
        this.roomName = ''
      },
      onLayoutChange () {
        this.$store.dispatch('updateRoomsPositions', { positions: this.$store.state.roomsPositions })
      }
    }
  }
</script>

<style scoped>
  .custom-headline {
    width: 100%;
  }

  .fill-height {
    height: 100% !important;
  }

  div.custom-transparent-black {
    padding: 5px;

    background-color: rgba(0, 0, 0, .5);
  }
</style>
