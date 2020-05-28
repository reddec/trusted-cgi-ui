<template>
  <q-list>
    <q-item v-for="(plan, index) in plans" :key="index">
      <q-item-section>
        <q-input label="crontab expression" v-model="clone.cron[index].cron"
                 hint="[second] [minute] [hour] [day] [month] [week]"/>
      </q-item-section>
      <q-item-section>
        <q-select v-model="clone.cron[index].action"
                  label="action to invoke"
                  hint="defined in Makefile"
                  fill-input
                  input-debounce="0"
                  :options="actions"
        />
      </q-item-section>
      <q-item-section>
        <q-input v-model="clone.cron[index].time_limit" label="maximum execution time"
                 hint="suffixes: us, ns, ms, s, m, h"
        />
      </q-item-section>
      <q-item-section side>
        <q-btn icon="delete" @click="clone.cron.splice(index,1)" flat dense round/>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section side>
        <q-btn label="add schedule" icon="add" @click="add" flat dense v-if="(actions || []).length > 0 || loading"
               :loading="loading"/>
        <span v-else>no actions defined, define it in Makefile first</span>
      </q-item-section>
      <q-item-section>
        <q-item-label caption>
          <a target="_blank" href="https://crontab.guru/">crontab helper</a>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn label="save" color="primary" icon="save" @click="save" flat dense :loading="saving"/>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
  import client, {baseURL} from '../../api'

  import {createNamespacedHelpers} from "vuex";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')

  export default {
    name: "Scheduler",
    data() {
      return {
        loading: false,
        saving: false,
        actions: [],
        clone: {}
      }
    },
    beforeMount() {
      this.reload();
    },
    methods: {
      async reload() {
        this.$set(this, 'clone', JSON.parse(JSON.stringify(this.selectedApp?.manifest)))
        this.loading = true;
        try {
          this.actions = await client.actions(this.token, this.selectedApp?.uid)
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false;
        }
      },
      async save() {
        this.saving = true;
        let cp = Object.assign({}, this.selectedApp?.manifest, this.clone)
        try {
          let app = await client.update(this.token, this.selectedApp?.uid, cp);
          this.$store.commit('user/updatedApp', app);
          this.$store.commit('user/selectedApp', app);
        } catch (e) {
          console.error(e)
        } finally {
          this.saving = false
        }
      },
      add() {

        if (!this.clone.cron) {
          this.$set(this.clone, 'cron', [])
        }
        this.clone.cron.push({
          action: this.actions[0],
          cron: '@daily',
          time_limit: '10s'
        })
      }
    },
    watch: {
      selectedApp() {
        this.reload();
      }
    },
    computed: {
      ...mapState([
        'selectedApp',
        'token'
      ]),
      plans() {
        return this.clone?.cron || []
      }
    }
  }
</script>

<style scoped>

</style>
