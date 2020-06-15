<template>
  <div v-if="!edit">
    <div class="text-h6">{{selectedApp.manifest.name || selectedApp.uid}}</div>
    <q-markdown :src="selectedApp.manifest.description"/>
    <q-btn flat color="green" icon="edit" v-if="!edit" @click="openEditor()">Edit</q-btn>
  </div>
  <div v-else>
    <q-input label="Name" filled v-model="name"/>
    <br/>
    <q-input autogrow style="min-height: 300px" filled type="textarea" label="Description"
             hint="Markdown supported"
             v-model="description"/>
    <q-btn flat color="primary" icon="save" v-if="edit" :loading="saving" @click="save()">Save</q-btn>
    <q-btn flat icon="clear" v-if="edit && !saving" @click="closeEditor()">Cancel</q-btn>
  </div>
</template>

<script>
  import {lambdaAPI} from "../../api";
  import {createNamespacedHelpers} from "vuex";
  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')


  export default {
    name: "Readme",
    data() {
      return {
        selection: 'doc',
        splitter: 0,
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
