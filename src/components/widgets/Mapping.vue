<template>
  <div>
    <q-card flat>
      <q-card-section>
        <q-select :value="clone.static"
                  label="Directory for static files"
                  use-input
                  fill-input
                  hide-selected
                  input-debounce="0"
                  :options="staticDirs"
                  @filter="filterFolder"
                  @input-value="(v) => clone.static = v"
                  hide-hint
                  hint="GET and HEAD methods will be disabled for manual processing; leave it empty to disable"
        />
      </q-card-section>
    </q-card>
    <br/>
    <q-card flat>
      <q-list bordered>
        <q-item-label header>Input headers mapping</q-item-label>
        <q-item v-for="[header, env] in inputHeaders" :key="header">
          <q-item-section>
            <q-item-label>
              <code>{{header}}</code>
            </q-item-label>
            <q-item-label caption>{{env}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn icon="delete" @click="()=>$delete(clone.input_headers, header)" flat dense round/>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="newInput.dialog = true">
          <q-item-section avatar>
            <q-icon name="add"/>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">map input header</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <br/>
      <q-list bordered>
        <q-item-label header>Query params mapping</q-item-label>
        <q-item v-for="[param, env] in query" :key="param">
          <q-item-section>
            <q-item-label>
              <code>{{param}}</code>
            </q-item-label>
            <q-item-label caption>{{env}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn icon="delete" @click="()=>$delete(clone.query, header)" flat dense round/>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="newQuery.dialog = true">
          <q-item-section avatar>
            <q-icon name="add"/>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">map query to env</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <br/>

      <q-list bordered>
        <q-item-label header>Output headers values</q-item-label>
        <q-item v-for="[header, value] in outputHeaders" :key="header">
          <q-item-section>
            <q-item-label>
              <code>{{header}}</code>
            </q-item-label>
            <q-item-label caption>{{value}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn icon="delete" @click="()=>$delete(clone.output_headers, header)" flat dense round/>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="newOutput.dialog = true">
          <q-item-section avatar>
            <q-icon name="add"/>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">add output header</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-card-actions align="right">
        <q-btn flat color="primary" icon="save" :loading="saving" @click="save()">Save</q-btn>
      </q-card-actions>
    </q-card>


    <q-dialog v-model="newInput.dialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Input header</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select :value="newInput.header"
                    use-input
                    fill-input
                    hide-selected
                    input-debounce="0"
                    :options="availableHeaders"
                    @filter="filterHeader"
                    @input-value="(v) => newInput.header = v"
                    hint="request header (ex: Content-Type)"
          />
          <br/>
          <q-input dense v-model="newInput.env" autofocus hint="environment variable (ex: CONTENT_TYPE)"/>
          <q-btn flat size="sm" dense @click="()=>newInput.env = (to_upper_snake(newInput.header) )">
            suggested: {{to_upper_snake(newInput.header)}}
          </q-btn>
          <br/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Add" v-close-popup @click="addInputHeader"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="newQuery.dialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Input header</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="newQuery.param" autofocus hint="request query or form param"/>
          <br/>
          <q-input dense v-model="newQuery.env" hint="environment variable"/>
          <q-btn flat size="sm" dense @click="()=>newQuery.env = (to_upper_snake(newQuery.param) )">
            suggested: {{to_upper_snake(newQuery.param)}}
          </q-btn>
          <br/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Add" v-close-popup @click="addQuery"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="newOutput.dialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Output header</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select :value="newOutput.header"
                    use-input
                    fill-input
                    hide-selected
                    input-debounce="0"
                    :options="availableHeaders"
                    @filter="filterHeader"
                    @input-value="(v) => newOutput.header = v"
                    hint="response header (ex: Content-Type)"
          />
          <br/>
          <q-input dense v-model="newOutput.value" autofocus hint="static value"/>
          <br/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Add" v-close-popup @click="addOutputHeader"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import {lambdaAPI} from '../../api'

  import {createNamespacedHelpers} from "vuex";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')

  const knownHeaders = [
    "Content-Type",
    "Authorization",
    "Origin"
  ]

  export default {
    name: "Mapping",
    data() {
      return {
        saving: false,
        clone: {},
        availableHeaders: knownHeaders,
        availableFolders: [],
        staticDirs: [],
        newInput: {
          dialog: false,
          header: '',
          env: ''
        },
        newOutput: {
          dialog: false,
          header: '',
          value: ''
        },
        newQuery: {
          dialog: false,
          param: '',
          env: ''
        },
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
          let app = await lambdaAPI.update(this.token, this.selectedApp?.uid, cp);
          this.$store.commit('user/updatedApp', app);
          this.$store.commit('user/selectedApp', app);
        } catch (e) {
          console.error(e)
        } finally {
          this.saving = false
        }
      },

      addInputHeader() {
        if (!this.clone.input_headers) {
          this.$set(this.clone, 'input_headers', {})
        }
        this.$set(this.clone.input_headers, this.newInput.header, this.newInput.env)

        this.newInput.header = '';
        this.newInput.env = '';
      },

      addOutputHeader() {
        if (!this.clone.output_headers) {
          this.$set(this.clone, 'output_headers', {})
        }
        this.$set(this.clone.output_headers, this.newOutput.header, this.newOutput.value)

        this.newOutput.header = '';
        this.newOutput.value = '';
      },

      addQuery() {
        if (!this.clone.query) {
          this.$set(this.clone, 'query', {})
        }
        this.$set(this.clone.query, this.newQuery.param, this.newQuery.env)

        this.newQuery.param = '';
        this.newQuery.env = '';
      },

      async updateFields() {
        this.$set(this, 'clone', JSON.parse(JSON.stringify(this.selectedApp?.manifest)))
        const list = await lambdaAPI.files(this.token, this.selectedApp?.uid, "");
        this.availableFolders = list.filter(x => x.is_dir).map(x => x.name)
      },
      to_upper_snake(text) {
        return text.split('-').join("_").toUpperCase()
      },
      filterHeader(val, update, abort) {
        update(() => {
          const nd = val.toLocaleLowerCase();
          this.availableHeaders = knownHeaders.filter(v => v.toLocaleLowerCase().indexOf(nd) !== -1)
        })
      },
      filterFolder(val, update, abort) {
        update(() => {
          const nd = val.toLocaleLowerCase();
          this.staticDirs = this.availableFolders.filter(v => v.toLocaleLowerCase().indexOf(nd) !== -1)
        })
      },
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
      inputHeaders() {
        return Object.entries(this.clone.input_headers || {})
      },

      outputHeaders() {
        return Object.entries(this.clone.output_headers || {})
      },
      query() {
        return Object.entries(this.clone.query || {})
      }
    },

  }
</script>

<style scoped>

</style>
