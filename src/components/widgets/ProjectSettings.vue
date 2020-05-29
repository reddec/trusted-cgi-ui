<template>
  <q-card flat bordered square>
    <q-card-section>
      <div class="text-h6">Project settings</div>
    </q-card-section>
    <q-card-section v-if="configLoading">
      <q-linear-progress indeterminate/>
    </q-card-section>
    <q-card-section v-if="config">
      <q-form autocorrect="off"
              autocapitalize="off"
              autocomplete="off"
              spellcheck="false">
        <q-input label="Effective user" hint="user that will be used for CGI (empty is current)"
                 v-model="clone.user" autocorrect="off"
                 autocapitalize="off"
                 autocomplete="off"
                 spellcheck="false"/>
      </q-form>
    </q-card-section>
    <q-card-actions v-if="config">
      <q-btn label="save" @click="save()" :loading="saving" icon="save" flat/>
    </q-card-actions>
  </q-card>
</template>

<script>

  import Vue from 'vue';
  import {createNamespacedHelpers} from "vuex";
  import {projectAPI} from '../../api'

  const userMod = createNamespacedHelpers('user')
  const systemMod = createNamespacedHelpers('system')

  export default {
    name: "ProjectSettings",
    data() {
      return {
        saving: false,
        clone: {}
      }
    },
    beforeMount() {
      this.$store.dispatch('system/config')
    },
    methods: {
      async save() {
        this.saving = true;
        try {
          await projectAPI.setUser(this.token, this.clone.user)
          this.$store.commit('system/config', this.clone)
        } catch (e) {
          console.error(e)
          this.setSettings()
        } finally {
          this.saving = false
        }
      },
      setSettings() {
        this.clone = Object.assign({}, this.config)
      }
    },
    watch: {
      config() {
        this.setSettings()
      }
    },
    computed: {
      ...userMod.mapState([
        'token'
      ]),
      ...systemMod.mapState([
        'config',
        'configLoading'
      ])
    }
  }
</script>

<style scoped>

</style>
