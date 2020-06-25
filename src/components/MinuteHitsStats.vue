<template>
  <q-card flat :bordered="bordered" square>
    <q-card-section>
      <p class="text-h6">Hits per minute</p>
      <q-toggle v-model="tableView" label="table view"/>
    </q-card-section>
    <q-card-section>

      <v-chart autoresize :options="plotData" v-if="!tableView"/>
      <q-table flat title="Requests" :columns="columns" :data="timedData"
               v-else>
        <template v-slot:body="props">
          <q-tr :props="props" :class="props.row.error ?'bg-warning':''"
                @click="showPopup(null, props.row)">
            <q-td key="uid" :props="props"> {{ props.row.uid }}</q-td>
            <q-td key="time" :props="props"> {{ props.row.time }}</q-td>
            <q-td key="method" :props="props"> {{ props.row.request.method }}</q-td>
            <q-td key="remote" :props="props"> {{ props.row.request.remote_address }}</q-td>
            <q-td key="begin" :props="props"> {{ props.row.begin }}</q-td>
            <q-td key="error" :props="props"> {{ props.row.error }}</q-td>
          </q-tr>
        </template>
      </q-table>

    </q-card-section>
    <q-dialog v-model="showInfo">
      <q-card style="min-width: 450px">
        <q-card-section class="q-pt-none">
          <RecordView :value="selectedItem"/>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Dismiss" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>
<script>
  import ECharts from 'vue-echarts'
  import 'echarts/lib/chart/bar'
  import RequestView from "./RequestView";
  import RecordView from "./RecordView";

  export default {
    name: "MinuteHitsStats",
    props: ['records', 'bordered'],
    components: {
      RecordView,
      RequestView,
      'v-chart': ECharts
    },
    data() {
      return {
        tableView: false,
        selectedItem: {},
        showInfo: false,
      }
    },
    methods: {
      showPopup(evt, row) {
        this.selectedItem = row
        this.showInfo = true;
      }
    },
    filters: {
      from64(text) {
        return atob(text)
      }
    },
    computed: {
      columns() {
        return [
          {label: "UID/Alias", field: "uid", name: "uid"},
          {label: "Time (ms)", field: "time", name: "time"},
          {label: "Method", field: "method", name: "method"},
          {label: "Remote", field: "remote", name: "remote"},
          {label: "At", field: "begin", name: "begin"},
          {label: "Error", field: "error", name: "error"},
        ]
      },
      timedData() {
        return (this.records || []).map((x) => {
          let a = Date.parse(x.begin)
          let b = Date.parse(x.end)
          return Object.assign({}, x, {time: b - a})
        })
      },
      plotData() {
        return {
          grid: {
            left: '24px',
            top: '15px',
            right: '24px',
            bottom: '32px',
          },
          xAxis: [{
            type: 'time',
            boundaryGap: false,
            minInterval: 60 * 1000,
          }],
          yAxis: [{
            type: 'value'
          }],
          tooltip: {
            axisPointer: {
              type: 'cross'
            },

          },
          calculable: true,
          series: [
            {
              name: 'hits',
              type: 'bar',
              data: this.data.merged
            }
          ]
        }
      },
      data() {
        if (this.records.length === 0) return [];
        let x = [];
        let y = [];
        let merged = []
        let last = Date.parse(this.records[0].begin);
        let lastDt = this.records[0].begin;
        let num = 0;
        this.records.forEach((record) => {
          let begin = Date.parse(record.begin);
          if (last - begin > 60 * 1000) {
            x.push(lastDt)
            y.push(num)
            merged.push([new Date(last).toISOString(), num])

            last = begin
            lastDt = record.begin;
            num = 1;
          } else {
            num++;
          }
        })
        if (num > 0) {
          x.push(lastDt)
          y.push(num)
          merged.push([new Date(last).toISOString(), num])
        }
        let res = {x: x.reverse(), y: y.reverse(), merged: merged.reverse()};
        return res;
      }
    }
  }
</script>

<style scoped>
  .echarts {
    width: 100%;
    height: 300px;
  }
</style>
