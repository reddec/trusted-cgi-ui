<template>
  <q-list>
    <q-item-section>
      <slot name="head"></slot>
    </q-item-section>
    <q-item-label v-if="appsLoading">
      <q-linear-progress indeterminate/>
    </q-item-label>
    <q-item clickable v-for="app in filteredApps" :key="app.uid" @click="()=>$emit('click', app)">
      <q-item-section>
        <q-item-label overline>{{app.manifest.name || app.uid}}</q-item-label>
        <q-item-label caption v-if="app.manifest.name">{{app.uid}}</q-item-label>
      </q-item-section>
      <q-item-section top side>
        <div class="text-grey-8 q-gutter-xs">
          <q-icon size="large" name="security" v-if="policyByLambda[app.uid]"/>
        </div>
      </q-item-section>
    </q-item>
    <q-item v-if="filteredApps.length===0">
      <slot name="empty">no lambdas</slot>
    </q-item>
  </q-list>
</template>

<script>
  import {createNamespacedHelpers} from "vuex";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')
  const policies = createNamespacedHelpers('policies');
  export default {
    name: "LambdasList",
    props: [
      'filter',
    ],
    beforeMount() {
      this.reLoadApps()
      this.$store.dispatch('policies/load')
    },
    methods: {
      ...mapActions(['reLoadApps']),
    },
    computed: {
      ...mapState(['apps', 'appsLoading']),
      ...policies.mapGetters(['policyByLambda']),
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
