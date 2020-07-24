<template>
  <q-page class="q-col-gutter-sm q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-md col-sm-12 col-xs-12">
        <q-linear-progress indeterminate v-if="appsLoading"/>
        <lambdas-list :filter="lambda" @click="(app) => openLambda( app.uid)">
          <template slot="head">
            <q-item-label header>
              <slot>
                <q-input v-model="lambda" label="lambda name or uid">
                  <template v-slot:before>
                    <q-icon name="search"/>
                  </template>
                </q-input>
              </slot>
            </q-item-label>
          </template>
        </lambdas-list>
      </div>
      <div class="col-md col-sm-12 col-xs-12">
        <new-lambda/>
      </div>
    </div>
  </q-page>
</template>

<script>
  import Vue from 'vue';
  import {createNamespacedHelpers} from "vuex";
  import {baseURL, projectAPI} from '../api'
  import MinuteHitsStats from "../components/MinuteHitsStats";
  import LambdasList from "../components/widgets/lambdas/LambdasList";
  import NewLambda from "../components/NewLambda";

  const userMod = createNamespacedHelpers('user')
  const systemMod = createNamespacedHelpers('system')


  export default Vue.extend({
    name: 'Dashboard',
    components: {NewLambda, LambdasList, MinuteHitsStats},
    data() {
      return {
        repo: '',
        lambda: ''
      }
    },
    beforeMount() {
      this.reload()
    },
    methods: {
      async reload(force = false) {
        this.$store.dispatch('user/loadApps')
      },
      openLambda(name) {
        this.$router.push({name: 'app', params: {name: name}})
      },
    },
    computed: {
      ...userMod.mapState(['appsLoading']),
      baseURL() {
        return baseURL
      }
    }
  });
</script>
