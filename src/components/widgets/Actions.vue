<template>
  <transition>
    <q-linear-progress indeterminate v-if="loading"/>
    <h5 v-else-if="!actions || actions.length === 0">actions not found</h5>
    <q-list bordered v-else>
      <q-item-label header>Detected actions</q-item-label>
      <q-item v-for="name in actions" :key="name">
        <q-item-section>
          <q-item-label caption>{{name}}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn icon="play_arrow" :loading="invoking" @click="invoke(name)" flat dense round/>
        </q-item-section>
      </q-item>
    </q-list>
  </transition>
</template>

<script>
  import client from '../../api'

  import {createNamespacedHelpers} from "vuex";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')
  export default {
    name: "Actions",
    data() {
      return {
        loading: false,
        invoking: false,
        actions: []
      }
    },
    beforeMount() {
      this.reload()
    },
    methods: {
      async invoke(name) {
        this.invoking = true;
        try {
          await client.invoke(this.token, this.selectedApp?.uid, name)
        } catch (e) {
          console.error(e)
        } finally {
          this.invoking = false;
        }
      },
      async reload() {
        this.loading = true;
        try {
          this.actions = await client.actions(this.token, this.selectedApp?.uid)
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false;
        }
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
    }
  }
</script>

<style scoped>

</style>
