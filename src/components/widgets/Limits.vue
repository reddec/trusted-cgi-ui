<template>
  <div>
    <q-card flat>
      <q-input v-model="executionTime" label="Maximum execution time" hint="suffixes: us, ns, ms, s, m, h"/>
      <br/>
      <q-input v-model="payloadLimit" label="Payload limit" hint="bytes, empty means unlimited"/>
      <q-card-actions align="right">
        <q-btn flat color="primary" icon="save" :loading="saving" @click="save()">Save</q-btn>
      </q-card-actions>
    </q-card>

  </div>
</template>

<script>
  import client from '../../api'

  import {createNamespacedHelpers} from "vuex";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')


  export default {
    name: "Limits",
    data() {
      return {
        saving: false,
        description: '',
        executionTime: 0,
        payloadLimit: 0,
      }
    },
    beforeMount() {
      this.updateFields()
    },
    methods: {
      async save() {
        this.saving = true;
        let cp = Object.assign({}, this.selectedApp?.manifest, {
          time_limit: this.executionTime,
          maximum_payload: parseInt(this.payloadLimit || '0')
        })
        try {
          let app = await client.update(this.token, this.selectedApp?.uid, cp);
          this.$store.commit('user/updatedApp', app);
          this.$store.commit('user/selectedApp', app);
          //this.$store.commit('user/selectedApp', app);
        } catch (e) {
          console.error(e)
        } finally {
          this.saving = false
        }
      },
      updateFields() {
        this.executionTime = this.selectedApp?.manifest.time_limit;
        this.payloadLimit = this.selectedApp?.manifest.maximum_payload;
      }
    },
    watch: {
      selectedApp() {
        this.updateFields()
      }
    },
    computed: {
      ...mapState([
        'selectedApp',
        'token'
      ]),
    }
  }
</script>

<style scoped>

</style>
