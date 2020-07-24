<template>
  <v-chart autoresize :options="plotData"/>
</template>

<script>
  import ECharts from "vue-echarts";
  import 'echarts/lib/chart/bar'

  export default {
    name: "MinuteHitsStatsChart",
    props: ['records'],
    components: {
      'v-chart': ECharts
    },
    data() {
      return {

      }
    },
    filters: {
      from64(text) {
        return atob(text)
      }
    },
    computed: {
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
