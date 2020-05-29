<template>
  <q-page class="q-col-gutter-sm q-pa-md">
    <q-linear-progress indeterminate v-if="configLoading"/>
    <div class="row q-col-gutter-md" v-else>
      <div class="col-md col-sm-6 col-xs-12">
        <ProjectSettings/>
      </div>
      <div class="col-md col-sm-6 col-xs-12">
        <UserSettings/>
      </div>
      <div class="col-md col-sm-12 col-xs-12">
        <q-card bordered flat square>
          <q-card-section>
            <div class="text-h6">Public SSH key</div>
          </q-card-section>
          <q-card-section>
            <pre style="overflow-x: auto">{{config.public_key}}</pre>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
  import {createNamespacedHelpers} from "vuex";

  const userMod = createNamespacedHelpers('user')
  const systemMod = createNamespacedHelpers('system')
  import ProjectSettings from "../components/widgets/ProjectSettings";
  import UserSettings from "../components/widgets/UserSettings";
  import {projectAPI} from "../api";

  export default {
    name: "Settings",
    components: {UserSettings, ProjectSettings},
    beforeMount() {
      this.reload()
    },
    methods: {
      async reload() {
        this.$store.dispatch('system/config')
      },
    },
    computed: {
      ...userMod.mapState([
        'token'
      ]),
      ...systemMod.mapState([
        'configLoading',
        'config'
      ])
    }
  }
</script>

<style scoped>

</style>
