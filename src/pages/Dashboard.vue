<template>
  <q-page class="q-col-gutter-sm q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-md col-sm-12 col-xs-12">
        <q-linear-progress indeterminate v-if="globalStatsLoading"/>
        <minute-hits-stats-chart :records="globalStats"/>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-md col-sm-12 col-xs-12">
       <minute-hits-stats-table :records="globalStats"/>
      </div>
    </div>
  </q-page>
</template>

<script>
  import Vue from 'vue';
  import {createNamespacedHelpers} from "vuex";
  import {baseURL, projectAPI} from '../api'
  import MinuteHitsStats from "../components/MinuteHitsStats";
  import LambdasList from "../components/widgets/lambdas/LambdasList";
  import MinuteHitsStatsChart from "../components/MinuteHitsStatsChart";
  import MinuteHitsStatsTable from "../components/MinuteHitsStatsTable";

  const userMod = createNamespacedHelpers('user')
  const systemMod = createNamespacedHelpers('system')


  export default Vue.extend({
    name: 'Dashboard',
    components: {MinuteHitsStatsTable, MinuteHitsStatsChart, LambdasList, MinuteHitsStats},
    data() {
      return {
        repo: '',
        creating: false,
        lambda: ''
      }
    },
    beforeMount() {
      this.reload()
    },
    methods: {
      async reload(force = false) {
        this.$store.dispatch('system/globalStats')
      },
      openLambda(name) {
        this.$router.push({name: 'app', params: {name: name}})
      },
    },
    computed: {
      ...userMod.mapState([
        'token'
      ]),
      ...systemMod.mapState([
        'globalStats',
        'globalStatsLoading'
      ]),
      baseURL() {
        return baseURL
      }
    }
  });
</script>
