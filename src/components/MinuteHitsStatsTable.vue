<template>
  <div>
    <q-table flat title="Requests" :columns="columns" :data="timedData">
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
  </div>
</template>
<script>
  import RequestView from "./RequestView";
  import RecordView from "./RecordView";

  export default {
    name: "MinuteHitsStatsTable",
    props: {'records': {}},
    components: {
      RecordView,
      RequestView,
    },
    data() {
      return {
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
      }
    }
  }
</script>

