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
          <q-tr :props="props" :class="Math.trunc(props.row.code / 100) === 2 ? '':'bg-warning'"
                @click="showPopup(null, props.row)">
            <q-td key="uid" :props="props"> {{ props.row.uid }}</q-td>
            <q-td key="time" :props="props"> {{ props.row.time }}</q-td>
            <q-td key="method" :props="props"> {{ props.row.method }}</q-td>
            <q-td key="remote" :props="props"> {{ props.row.remote }}</q-td>
            <q-td key="origin" :props="props"> {{ props.row.origin }}</q-td>
            <q-td key="begin" :props="props"> {{ props.row.begin }}</q-td>
            <q-td key="code" :props="props"> {{ props.row.code }}</q-td>
          </q-tr>
        </template>
      </q-table>

    </q-card-section>
    <q-dialog v-model="showInfo">
      <q-card style="min-width: 350px">

        <q-card-section class="q-pt-none" v-if="selectedItem.input">
          <p class="text-h6">Input</p>
          <pre style="overflow-y: auto; overflow-x: auto; word-wrap: break-word; white-space: pre-line">{{selectedItem.input | from64}}</pre>
        </q-card-section>
        <q-card-section class="q-pt-none" v-if="selectedItem.output">
          <p class="text-h6">Output</p>
          <pre style="overflow-y: auto; overflow-x: auto; word-wrap: break-word; white-space: pre-line">{{selectedItem.output | from64}}</pre>
        </q-card-section>
        <q-card-section class="q-pt-none" v-if="selectedItem.error">
          <p class="text-h6">Error</p>
          <pre style="overflow-y: auto; overflow-x: auto; word-wrap: break-word; white-space: pre-line">{{selectedItem.error}}</pre>
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

  export default {
    name: "MinuteHitsStats",
    props: ['records', 'bordered'],
    components: {
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
          {label: "UID", field: "uid", name: "uid"},
          {label: "Time (ms)", field: "time", name: "time"},
          {label: "Method", field: "method", name: "method"},
          {label: "Remote", field: "remote", name: "remote"},
          {label: "Origin", field: "origin", name: "origin"},
          {label: "At", field: "begin", name: "begin"},
          {label: "Code", field: "code", name: "code"},
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
