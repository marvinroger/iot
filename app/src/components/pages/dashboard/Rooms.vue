<template>
  <div>
    <h4>{{ $t('dashboard.rooms.title') }}</h4>

    <grid-layout
      :layout="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
      <grid-item v-for="item in layout" :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
      >
        <v-card class="fill-height">
          <v-card-media
            class="white--text"
            height="100%"
            src="https://unsplash.it/458/354"
          >
            <v-container fill-height fluid class="pa-0">
              <v-layout fill-height class="ma-0">
                <v-flex xs12 align-end flexbox class="pa-0">
                  <div class="custom-headline custom-transparent-black fittext">{{ roomNames[item.i] }}</div>
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

  export default {
    components: { GridLayout, GridItem },
    data () {
      return {
        layout: [
          {"x":0,"y":0,"w":2,"h":2,"i":"0"},
    	    {"x":2,"y":0,"w":2,"h":4,"i":"1"},
    	    {"x":4,"y":0,"w":2,"h":5,"i":"2"},
    	    {"x":6,"y":0,"w":2,"h":3,"i":"3"},
    	    {"x":8,"y":0,"w":2,"h":3,"i":"4"},
    	    {"x":10,"y":0,"w":2,"h":3,"i":"5"},
    	    {"x":0,"y":5,"w":2,"h":5,"i":"6"},
    	    {"x":2,"y":5,"w":2,"h":5,"i":"7"},
        ],
        roomNames: {
          '0': 'Chambre #1',
          '1': 'Chambre #2',
          '2': 'Salle de bain',
          '3': 'Couloir',
          '4': 'Toilettes',
          '5': 'Cuisine',
          '6': 'Salon',
          '7': 'Jardin'
        }
      }
    },
    mounted () {
      setTimeout (() => {
        const elements = document.getElementsByClassName('fittext')
        for (const element of elements) {
          window.fitText(element, 0.8)
        }
      }, 3000)
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
