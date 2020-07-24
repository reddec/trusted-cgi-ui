<template>
  <div>
    <div v-if="loading">
      <q-linear-progress indeterminate/>
    </div>
    <div v-else-if="policy">
      <h6>applied policy
        <router-link :to="{name:'policy', params:{id:policy.id}}">{{policy.id}}</router-link>
      </h6>
      <q-btn-group push>
        <q-btn color="primary" label="change policy" icon="edit" @click="()=>dialog=true" :loading="assigning"/>
        <q-btn color="warning" label="clear" icon="clear" @click="unassign" :loading="assigning"/>
      </q-btn-group>
    </div>
    <p v-else>no applied policy,
      <q-btn color="primary" label="select one" @click="()=>dialog=true" :loading="assigning" flat/>
    </p>
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 450px">
        <q-card-section>
          <div class="text-h6">Select policy</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <policies-list readonly @click="doAssign"/>
          <br/>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup :loading="assigning"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import {createNamespacedHelpers} from "vuex";
  import PolicyEditor from "./policies/PolicyEditor";
  import PoliciesList from "./policies/PoliciesList";

  const policies = createNamespacedHelpers('policies')
  const user = createNamespacedHelpers('user')

  export default {
    name: "Security",
    components: {PoliciesList, PolicyEditor},
    beforeMount() {
      this.load()
    },
    methods: {
      ...policies.mapActions(['apply', 'clear', 'load']),
      async doAssign({id, definition, lambdas}) {
        this.assigning = true;
        try {
          await this.apply({name: id, lambda: this.selectedApp?.uid})
          this.dialog = false;
        } catch (e) {
          console.error(e)
        } finally {
          this.assigning = false
        }
      },
      async unassign() {
        this.assigning = true;
        try {
          await this.clear(this.selectedApp?.uid)
          this.dialog = false;
        } catch (e) {
          console.error(e)
        } finally {
          this.assigning = false
        }
      }
    },
    data() {
      return {
        dialog: false,
        assigning: false
      }
    },
    computed: {
      ...policies.mapState([
        'policies', 'loading'
      ]),
      ...user.mapState([
        'selectedApp'
      ]),
      policy() {
        return (this.policies || []).find((p) => p.lambdas.indexOf(this.selectedApp.uid) !== -1)
      }
    }
  }


</script>

<style scoped>

</style>
