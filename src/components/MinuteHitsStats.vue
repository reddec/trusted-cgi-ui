<template>
  <q-card flat :bordered="bordered" square>
    <q-card-section>
      <p class="text-h6">Hits per minute</p>
      <q-toggle v-model="tableView" label="table view"/>
    </q-card-section>
    <q-card-section>
      <minute-hits-stats-table :records="records" v-if="tableView"/>
      <minute-hits-stats-chart :records="records" v-else/>
    </q-card-section>
  </q-card>
</template>
<script>
  import 'echarts/lib/chart/bar'
  import MinuteHitsStatsChart from "./MinuteHitsStatsChart";
  import MinuteHitsStatsTable from "./MinuteHitsStatsTable";

  export default {
    name: "MinuteHitsStats",
    props: {'records': {}, 'bordered': {type: Boolean}, 'table': {type: Boolean}},
    components: {
      MinuteHitsStatsTable,
      MinuteHitsStatsChart,

    },
    data() {
      return {
        tableView: !!this.table,
      }
    },

  }
</script>

