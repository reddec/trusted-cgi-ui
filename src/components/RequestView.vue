<template>
  <div>
    <p class="text-h6">Method</p>
    <p>{{local.method}}</p>
    <p class="text-h6">URL</p>
    <p>{{local.url}}</p>
    <p class="text-h6">Path</p>
    <p>{{local.path}}</p>
    <p class="text-h6">Remote</p>
    <p>{{local.remote_address}}</p>
    <p class="text-h6">Path</p>
    <p>{{local.path}}</p>
    <div v-if="!basic">
      <p class="text-h6">Headers</p>
      <MapView :value="local.headers"/>
      <p class="text-h6">Form</p>
      <MapView :value="local.form"/>
    </div>
  </div>
</template>

<script>
  import MapView from "./MapView";

  export default {
    name: "RequestView",
    components: {MapView},
    props: {'value': {}, 'basic': {type: Boolean}},
    computed: {
      local() {
        return this.value || {}
      }
    }
  }
</script>

<style scoped>

</style>
