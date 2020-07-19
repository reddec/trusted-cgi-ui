<template>
  <q-list >
    <q-item-label v-if="appsLoading">
      <q-linear-progress indeterminate/>
    </q-item-label>
    <q-item clickable v-for="app in filteredApps" :key="app.uid" @click="()=>$emit('click', app)">
      <q-item-section>
        <q-item-label caption>{{app.manifest.name || app.uid}}</q-item-label>
        <q-item-label v-if="app.manifest.name">{{app.uid}}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
  import {createNamespacedHelpers} from "vuex";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')
  export default {
    name: "LambdasList",
    props: [
      'filter',
    ],
    beforeMount() {
      this.reLoadApps()
    },
    methods: {
      ...mapActions(['reLoadApps'])
    },
    computed: {
      ...mapState(['apps', 'appsLoading']),
      filteredApps() {
        if (!this.filter) return this.apps;
        return this.apps.filter((app) =>
          app.uid.toLocaleLowerCase().indexOf(this.filter) !== -1 ||
          (app.manifest.name || '').toLocaleLowerCase().indexOf(this.filter) !== -1
        )
      }
    }
  }
</script>

<style scoped>

</style>
