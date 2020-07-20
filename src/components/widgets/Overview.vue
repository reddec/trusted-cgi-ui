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
          <q-card>
            <q-card-section>
              <Aliases/>
            </q-card-section>
          </q-card>
          <br/>
          <q-card>
            <q-card-section>
              <queues-list :lambda="selectedApp.uid" no-lambda-link>
                <template v-slot:default>
                  <queues-add target-locked :target="selectedApp.uid">
                    <q-btn flat icon="add">add queue</q-btn>
                  </queues-add>
                </template>
                <template v-slot:hint="props">
                  {{baseURL}}q/{{props.queue.name}}
                </template>
              </queues-list>
            </q-card-section>
          </q-card>
        </q-tab-panel>
        <q-tab-panel name="develop">
          <p class="text-h4">Using web UI</p>
          Open file editor (files tab)
          <h4>Using cgi-ctl command</h4>
          <p>
            cgi-ctl utility included in the <a target="_blank" href="https://trusted-cgi.reddec.net/cgi-ctl">distribution</a>
          </p>
          <p class="text-h5">Clone content</p>

          <code class="neat-code">cgi-ctl clone --uid {{selectedApp.uid}} --url {{baseURL}} -P</code>
          <p>will be save to {{selectedApp.uid}} directory</p>
          <p class="text-h5">Upload changes</p>
          <small>from cloned directory</small>
          <code class="neat-code">
            cgi-ctl upload
          </code>
          <with-actions>
            <template v-slot:default="props">
              <br/>
              <p class="text-h5">(optional) Invoke actions</p>
              <small>from cloned directory</small>
              <code class="neat-code" v-if="props.actions.length === 1">
                cgi-ctl do {{props.actions[0]}}
              </code>
              <code class="neat-code" v-else>
                cgi-ctl do [{{props.actions.join("|")}}]
              </code>
            </template>
          </with-actions>
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
  import WithActions from "./WithActions";
  import QueuesList from "./queues/QueuesList";
  import QueuesAdd from "./queues/QueuesAdd";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')


  export default {
    name: "Overview",
    components: {QueuesAdd, QueuesList, WithActions, Readme, Aliases},
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


