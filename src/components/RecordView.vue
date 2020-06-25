<template>
  <div>
    <q-tabs
      dense
      v-model="tab"
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
    >
      <q-tab name="overview" label="Overview" icon="web_asset"/>
      <q-tab name="request" label="Request" icon="input"/>
      <q-tab name="headers" label="Headers" icon="view_headline"/>
      <q-tab name="form" label="Form" icon="view_list"/>
    </q-tabs>

    <q-separator/>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="overview">
        <div v-if="local.time">
          <p class="text-h6">Execution time</p>
          <p>{{local.time}} ms</p>
        </div>
        <p class="text-h6">Started</p>
        <p>{{local.begin}}</p>
        <p class="text-h6">Ended</p>
        <p>{{local.end}}</p>
        <div v-if="local.error">
          <p class="text-h6">Error</p>
          <pre
            style="overflow-y: auto; overflow-x: auto; word-wrap: break-word; white-space: pre-line">{{local.error}}</pre>
        </div>
      </q-tab-panel>
      <q-tab-panel name="request">
        <RequestView basic :value="local.request"/>
      </q-tab-panel>
      <q-tab-panel name="headers">
        <MapView :value="request.headers"/>
      </q-tab-panel>
      <q-tab-panel name="form">
        <MapView :value="request.form"/>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
  import RequestView from "./RequestView";
  import MapView from "./MapView";

  export default {
    name: "RecordView",
    components: {MapView, RequestView},
    props: ['value'],
    data() {
      return {
        tab: 'overview'
      }
    },
    computed: {
      local() {
        return this.value || {}
      },
      request() {
        return this.local.request || {}
      }
    }
  }
</script>

<style scoped>

</style>
