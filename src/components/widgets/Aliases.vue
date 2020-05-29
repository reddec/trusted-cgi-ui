<template>
  <q-list dense>
    <q-item>
      <q-item-section>
        <q-item-label overline>default</q-item-label>
        <q-item-label caption>{{ api }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-for="name in selectedApp.manifest.aliases" :key="name">
      <q-item-section>
        <q-item-label overline>{{name}}</q-item-label>
        <q-item-label caption>{{baseURL}}l/{{name}}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn icon="delete" :loading="deleting" @click="unlink(name)" flat dense round/>
      </q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="newAlias.dialog = true">
      <q-item-section avatar>
        <q-icon name="add"/>
      </q-item-section>
      <q-item-section>
        <q-linear-progress indeterminate v-if="newAlias.adding"/>
        <q-item-label  v-else>add alias</q-item-label>
      </q-item-section>
      <q-dialog v-model="newAlias.dialog" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">New alias</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input v-model="newAlias.alias" autofocus label="Unique path" :hint="baseURL + 'l/'+newAlias.alias"/>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup/>
            <q-btn flat label="Link" v-close-popup @click="link"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-item>
  </q-list>
</template>

<script>
  import {baseURL, lambdaAPI} from '../../api'

  import {createNamespacedHelpers} from "vuex";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')
  export default {
    name: "Aliases",
    data() {
      return {
        deleting: false,
        newAlias: {
          dialog: false,
          adding: false,
          alias: '',
        }
      }
    },
    methods: {
      async link() {
        this.newAlias.adding = true;
        try {
          let app = await lambdaAPI.link(this.token, this.selectedApp?.uid, this.newAlias.alias);
          this.$store.commit('user/updatedApp', app)
          this.$store.commit('user/selectedApp', app)
          this.newAlias.alias = '';
        } catch (e) {
          console.error(e)
        } finally {
          this.newAlias.adding = false;
        }
      },
      async unlink(alias) {
        this.deleting = true;
        try {
          let app = await lambdaAPI.unlink(this.token, alias);
          this.$store.commit('user/updatedApp', app)
          this.$store.commit('user/selectedApp', app)
        } catch (e) {
          console.error(e)
        } finally {
          this.deleting = false;
        }
      },
    },
    computed: {
      ...mapState([
        'selectedApp',
        'token'
      ]),
      baseURL() {
        return baseURL
      },
      api() {
        return baseURL + 'a/' + this.selectedApp?.uid
      }
    }
  }
</script>

<style scoped>

</style>
