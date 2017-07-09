<template>
  <v-layout wrap>
    <v-flex v-for="device in devices" :key="device.id" xs12 sm6 md4>
      <device :device="device" />
    </v-flex>
  </v-layout>
</template>

<script>
  import Vue from 'vue'
  import Device from './Device'

  export default {
    props: ['devices', 'filter'],
    components: { Device }
  }
</script>
