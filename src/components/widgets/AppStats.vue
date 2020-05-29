<template>
  <q-linear-progress indeterminate v-if="loading"/>
  <MinuteHitsStats :records="records" v-else/>
</template>

<script>
  import MinuteHitsStats from "../MinuteHitsStats";
  import {lambdaAPI} from '../../api';
  import {createNamespacedHelpers} from "vuex";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')


  export default {
    name: "AppStats",
    components: {MinuteHitsStats},
    data() {
      return {
        records: [],
        loading: false
      }
    },
    beforeMount() {
      this.reload();
    },
    methods: {
      async reload() {
        this.loading = true;
        this.records = [];
        try {
          this.records = await lambdaAPI.stats(this.token, this.selectedApp.uid, 200);
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false;
        }
      }
    },
    computed: {
      ...mapState([
        'selectedApp',
        'token'
      ]),
    },
    watch: {
      selectedApp() {
        if (this.selectedApp) {
          this.reload();
        }
      }
    }
  }
</script>

<style scoped>

</style>
