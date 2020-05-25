<template>
  <div>
    <q-card flat>
      <q-input label="Executable" :value="command" @input="setCommand"/>
      <q-list dense>
        <q-item-label header>Args</q-item-label>
        <q-item v-for="(value, index) in args" :key="index">
          <q-item-section>
            <q-item-label>
              <q-input v-model="clone.run[index + 1]"/>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn icon="delete" @click="()=> clone.run.splice(index + 1, 1)" flat dense round/>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="addArg">
          <q-item-section avatar>
            <q-icon name="add"/>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">add arg</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <br/>

      <q-list>
        <q-item-label header>Environment variables</q-item-label>
        <q-item v-for="[name, value] in environment" :key="name">
          <q-item-section>
            <q-item-label>
              <code>{{name}}</code>
            </q-item-label>
            <q-item-label caption>{{value}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn icon="delete" @click="()=>$delete(clone.environment, name)" flat dense round/>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="newEnv.dialog = true">
          <q-item-section avatar>
            <q-icon name="add"/>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">add environment variable</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-card-actions align="right">
        <q-btn flat color="primary" icon="save" :loading="saving" @click="save()">Save</q-btn>
      </q-card-actions>
    </q-card>


    <q-dialog v-model="newEnv.dialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Environment variable</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="newEnv.name" autofocus label="name"/>
          <br/>
          <q-input dense v-model="newEnv.value" label="value"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Add" v-close-popup @click="addEnv()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import client from '../../api'

  import {createNamespacedHelpers} from "vuex";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')


  export default {
    name: "Launcher",
    data() {
      return {
        saving: false,
        clone: {},
        newEnv: {
          dialog: false,
          name: '',
          value: ''
        }
      }
    },
    beforeMount() {
      this.updateFields()
    },
    methods: {
      async save() {
        this.saving = true;
        let cp = Object.assign({}, this.selectedApp?.manifest, this.clone)
        try {
          let app = await client.update(this.token, this.selectedApp?.uid, cp);
          this.$store.commit('user/updatedApp', app);
          this.$store.commit('user/selectedApp', app);
        } catch (e) {
          this.console.error(e)
        } finally {
          this.saving = false
        }
      },
      addEnv() {
        if (!this.clone.environment) {
          this.$set(this.clone, 'environment', {})
        }
        this.$set(this.clone.environment, this.newEnv.name, this.newEnv.value)

        this.newEnv.name = '';
        this.newEnv.value = '';
      },
      setCommand(v) {
        if (!this.clone.run || this.clone.run.length === 0) {
          this.$set(this.clone, 'run', [])
          this.clone.run.push(v);
        } else {
          this.$set(this.clone.run, 0, v);
        }
      },
      addArg() {
        if (!this.clone.run || this.clone.run.length === 0) {
          this.$set(this.clone, 'run', [])
        }
        this.clone.run.push('');
      },
      updateFields() {
        this.$set(this, 'clone', JSON.parse(JSON.stringify(this.selectedApp?.manifest)))
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
      environment() {
        return Object.entries(this.clone.environment || {})
      },
      command() {
        return (this.clone.run || [])[0] || ''
      },
      args() {
        return (this.clone.run || []).slice(1) || [];
      }
    }
  }

  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
</script>

<style scoped>

</style>
