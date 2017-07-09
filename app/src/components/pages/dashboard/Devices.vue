<template>
  <div>
    <h4>{{ $t('dashboard.devices.title') }}</h4>

    <devices-list :devices="Object.values($store.state.devices)" />
  </div>
</template>

<script>
  import Vue from 'vue'
  import DevicesList from './components/DevicesList'

  export default {
    components: { DevicesList }
  }
</script>
