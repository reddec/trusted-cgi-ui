<template>
  <div>
    <q-card flat>
      <div class="row q-col-gutter-sm">

        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <editor v-model="payload" @init="editorInit" lang="json" theme="chrome" height="300px"/>
        </div>

        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div v-if="!isPublic">
            <q-select label="Token" :loading="policies_loading" v-model='token'
                      :options="tokens"/>
            <br/>
          </div>

          <q-list bordered>
            <q-item-label header>Headers</q-item-label>
            <q-item v-for="(value, index) in headers" :key="index">
              <q-item-section>
                <q-item-label>
                  <code>{{ value.header }}</code>
                </q-item-label>
                <q-item-label caption>{{ value.value }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn icon="delete" @click="()=>headers.splice(index, 1)" flat dense round/>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="newInput.dialog = true">
              <q-item-section avatar>
                <q-icon name="add"/>
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1">add header</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

        </div>
      </div>
      <br/>
      <div class="row">
        <div class="col">
          <q-btn icon="send" flat :loading="running" @click="run()">run</q-btn>
        </div>
      </div>
      <div class="row q-col-gutter-sm" v-if="response.code">
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <q-card flat bordered square>

            <q-item-label header>Body</q-item-label>
            <q-card-section>
              <p class="response">{{ response.body }}</p>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <q-list bordered>
            <q-item-label header>Status</q-item-label>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <code>Code</code>
                </q-item-label>
                <q-item-label caption>{{ response.code }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <code>Description</code>
                </q-item-label>
                <q-item-label caption>{{ response.status }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <code>Time</code>
                </q-item-label>
                <q-item-label caption>{{ response.time_fb }} ms [Headers] + {{ response.time_pd }} ms [Payload] =
                  {{ response.time }} ms
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <br/>
          <q-list bordered>
            <q-item-label header>Headers</q-item-label>
            <q-item v-for="[header, value] in response.headers" :key="header">
              <q-item-section>
                <q-item-label>
                  <code>{{ header }}</code>
                </q-item-label>
                <q-item-label caption>{{ value }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

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
            <q-input dense v-model="newInput.value" autofocus label="value"/>
            <br/>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup/>
            <q-btn flat label="Add" v-close-popup @click="addHeader"/>
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-card>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import {baseURL} from "../../api";

const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')
const policies = createNamespacedHelpers('policies')

export default {
  name: "Playground",
  components: {
    editor: require('vue2-ace-editor'),
  },
  data() {
    return {
      running: false,
      payload: '{}',
      token: '',
      headers: [],
      availableHeaders: [],
      newInput: {
        dialog: false,
        header: '',
        value: ''
      },
      response: {
        code: 0,
        time: 0,
        time_fb: 0,
        time_pd: 0,
        status: '',
        headers: [],
        body: ''
      }
    }
  },

  methods: {
    async run() {
      this.running = true;
      this.$set(this, 'response', {
        code: 0,
        status: '',
        headers: [],
        body: '',
        time: 0,
        time_fb: 0,
        time_pd: 0,
      })
      try {
        const begin = Date.now()
        const res = await fetch(baseURL + 'a/' + this.selectedApp?.uid, {
          method: "POST",
          headers: Object.assign({},
            Object.fromEntries(this.headers.map(kv => [kv.header, kv.value])),
            {'Authorization': this.token}),
          body: this.payload
        })
        const middle = Date.now()
        this.response.time_fb = middle - begin
        this.response.code = res.status
        this.response.status = res.statusText
        this.response.headers = Object.entries(Object.fromEntries(res.headers.entries()))
        this.response.body = await res.text()

        const end = Date.now()
        this.response.time = end - begin
        this.response.time_pd = end - middle
      } catch (e) {
        console.error(e)
      } finally {
        this.running = false;
      }
    },
    beforeMount() {
      this.load_policies()
    },
    addHeader() {
      this.headers.push({
        header: this.newInput.header,
        value: this.newInput.value,
      })
      this.newInput.header = '';
      this.newInput.value = '';
    },
    filterHeader(val, update, abort) {
      update(() => {
        const nd = val.toLocaleLowerCase();
        this.availableHeaders = Object.keys(this.selectedApp.manifest.input_headers || {}).filter(v => v.toLocaleLowerCase().indexOf(nd) !== -1)
      })
    },
    editorInit(editor) {
      editor.resize();
      editor.renderer.updateFull();
      require('brace/ext/language_tools')
      require('brace/mode/json')
    },
    ...policies.mapActions({'load_policies': 'load'}),
  },
  computed: {
    ...mapState([
      'selectedApp',
    ]),
    ...policies.mapState({
      'policies': 'policies', 'policies_loading': 'loading'
    }),
    tokens() {
      return (this.policies || []).flatMap((policy) => Object.keys(policy.definition.tokens || {}))
    },
    isPublic() {
      return this.selectedApp.manifest.public
    }
  }
}
</script>

<style scoped>
.response {
  font-family: monospace;
  word-wrap: break-word;
  white-space: pre;

  overflow-x: auto;
}
</style>
