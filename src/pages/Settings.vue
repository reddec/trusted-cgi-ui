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

      <div class="col-md col-sm-6 col-xs-12">
        <q-card bordered flat square>
          <q-card-section>
            <div class="text-h6">Global environment variables</div>
          </q-card-section>
          <q-card-section>
            <Environment
              no-title
              :loading="configLoading || savingEnv"
              :value="config.environment || {}"
              @input="setEnv"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-md col-sm-6 col-xs-12">
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
  import Environment from "../components/Environment";

  export default {
    name: "Settings",
    components: {Environment, UserSettings, ProjectSettings},
    beforeMount() {
      this.reload()
    },
    data() {
      return {
        savingEnv: false,
      }
    },
    methods: {
      async reload() {
        this.$store.dispatch('system/config')
      },
      async setEnv(env) {
        this.savingEnv = true;
        try {
          let config = await projectAPI.setEnvironment(this.token, {
            environment: env
          })
          this.$store.commit('system/config', config)
        } catch (e) {
          console.error(e)
        } finally {
          this.savingEnv = false;
        }
      }
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
