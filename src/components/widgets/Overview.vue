<template>
  <div class="row">
    <div class="xl-hide lg-hide md-hide col-sm-12 col-xs-12">
      <q-tabs
        v-model="selection"
        class="text-primary"
      >
        <q-tab name="doc" icon="help" label="Readme"/>
        <q-tab name="endpoint" icon="input" label="Endpoint"/>
        <q-tab name="develop" icon="code" label="Develop"/>
        <q-tab name="danger" icon="warning" label="Danger" class="text-red-4"/>
      </q-tabs>
    </div>
    <div class="col-md-shrink sm-hide xs-hide">
      <q-tabs
        v-model="selection"
        vertical
        class="text-primary"
      >
        <q-tab name="doc" icon="help" label="Readme"/>
        <q-tab name="endpoint" icon="input" label="Endpoint"/>
        <q-tab name="develop" icon="code" label="Develop"/>
        <q-tab name="danger" icon="warning" label="Danger" class="text-red-4"/>
      </q-tabs>
    </div>
    <div class="col-md-grow col-sm-12 col-xs-12">
      <q-tab-panels
        v-model="selection"
        animated
        swipeable
        vertical
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel name="doc">
          <Readme/>
        </q-tab-panel>
        <q-tab-panel name="endpoint">
          <Aliases/>
        </q-tab-panel>
        <q-tab-panel name="develop">
          <h4>Using web UI</h4>
          Open file editor (files tab)
          <h4>Using cgi-ctl command</h4>
          <p>
            cgi-ctl utility included in the <a href="https://trusted-cgi.reddec.net/installation">distribution</a>
          </p>
          <h5>Download project (choose suitable method)</h5>
          <ul>
            <li>
              as archive<br/>
              <code>cgi-ctl download -i {{selectedApp.uid}} --url {{baseURL}} -P</code>
              will be save to {{selectedApp.uid}}.tar.gz
            </li>
            <li>
              as unpacked archive<br/>
              <code>
                cgi-ctl download -i {{selectedApp.uid}} --url {{baseURL}} -P -o - | tar zxf -
              </code>
              content of lambda will be unpacked to the current directory
            </li>
          </ul>
          <h5>Upload changes (choose suitable method)</h5>
          <p>TBD</p>
        </q-tab-panel>
        <q-tab-panel name="danger">
          <q-btn flat color="red" icon="delete" @click="remove()" :loading="removing">Remove app</q-btn>
        </q-tab-panel>

      </q-tab-panels>
    </div>

  </div>

</template>

<script>
  import {baseURL, lambdaAPI} from '../../api'

  import {createNamespacedHelpers} from "vuex";
  import Aliases from "./Aliases";
  import Readme from "./Readme";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')


  export default {
    name: "Overview",
    components: {Readme, Aliases},
    data() {
      return {
        selection: 'doc',
        removing: false,
      }
    },
    methods: {
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
    },
    computed: {
      baseURL() {
        return baseURL
      },
      ...mapState([
        'selectedApp',
        'token'
      ])
    }
  }
</script>

<style scoped>
  code {
    overflow-x: auto;
    display: block;
    padding: 1em;
    font-family: monospace;
    border: darkgrey 1px solid;
    border-radius: 0.3em;
    background-color: black;
    color: white;
  }
</style>
