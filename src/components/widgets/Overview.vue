<template>
  <div>
    <q-card flat>
      <div v-if="!edit">
        <q-card-section>
          <div class="text-h6">{{selectedApp.manifest.name || selectedApp.uid}}</div>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-markdown :src="selectedApp.manifest.description"/>
        </q-card-section>
      </div>
      <div v-else>
        <q-input label="Name" filled v-model="name"/>
        <br/>
        <q-input autogrow style="min-height: 300px" filled type="textarea" label="Description" hint="Markdown supported"
                 v-model="description"/>
      </div>
      <q-card-actions align="right">
        <q-btn flat color="green" icon="edit" v-if="!edit" @click="openEditor()">Edit</q-btn>
        <q-btn flat color="primary" icon="save" v-if="edit" :loading="saving" @click="save()">Save</q-btn>
        <q-btn flat icon="clear" v-if="edit && !saving" @click="closeEditor()">Cancel</q-btn>

        <q-space/>
        <q-btn flat color="red" icon="delete" @click="remove()" :loading="removing">Remove app</q-btn>
      </q-card-actions>
    </q-card>

  </div>
</template>

<script>
  import {baseURL, lambdaAPI} from '../../api'

  import {createNamespacedHelpers} from "vuex";
  import Aliases from "./Aliases";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')


  export default {
    name: "Overview",
    components: {Aliases},
    data() {
      return {
        saving: false,
        removing: false,
        edit: false,
        name: '',
        description: '',
      }
    },
    methods: {
      openEditor() {
        this.name = this.selectedApp?.manifest.name
        this.description = this.selectedApp?.manifest.description;
        this.edit = true;
      },
      closeEditor() {
        this.edit = false;
      },
      async remove() {
        this.removing = true;
        try {
          await lambdaAPI.remove(this.token, this.selectedApp?.uid)
          this.$router.push({name: 'dashboard'})
          this.$store.commit('user/removedApp', this.selectedApp);

        } catch (e) {
          console.error(e)
        } finally {
          this.removing = false;
        }
      },
      async save() {
        this.saving = true;
        let cp = Object.assign({}, this.selectedApp?.manifest, {
          name: this.name,
          description: this.description
        })
        try {
          let app = await lambdaAPI.update(this.token, this.selectedApp?.uid, cp);
          this.$store.commit('user/updatedApp', app);
          this.$store.commit('user/selectedApp', app);
          this.closeEditor();
        } catch (e) {
          console.error(e)
        } finally {
          this.saving = false
        }
      }
    },
    computed: {
      ...mapState([
        'selectedApp',
        'token'
      ])
    }
  }
</script>

<style scoped>

</style>
