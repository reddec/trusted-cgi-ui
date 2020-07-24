<template>
  <q-page class="q-col-gutter-sm q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-md col-sm-12 col-xs-12">
        <div class="text-right text-primary">
          <span v-if="saving">
          <q-icon name="save"/>
          saving...
          <q-circular-progress indeterminate/>
            </span>
          <span v-else>
            &nbsp;
          </span>
        </div>
        <transition>
          <q-linear-progress indeterminate v-if="loading"/>
          <div v-else-if="policy">
            <policy-editor :value="policy.definition" @input="dpUpdate"/>
          </div>
          <p v-else>policy not found</p>
        </transition>
      </div>
      <div class="col-md col-sm-12 col-xs-12">
        <q-list>
          <q-item>
            <q-item-label header>Linked lambdas</q-item-label>
          </q-item>
          <q-item v-for="uid in policy.lambdas" :key="uid" clickable :to="{name:'app',params:{'name':uid}}">
            <q-item-section>
              <q-item-label overline v-if="appsByUID[uid].manifest.name">
                {{appsByUID[uid].manifest.name}}
              </q-item-label>
              <q-item-label caption>
                {{uid}}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
  import PolicyEditor from "../components/widgets/policies/PolicyEditor";
  import {createNamespacedHelpers} from "vuex";

  const user = createNamespacedHelpers('user')
  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('policies')
  export default {
    name: "Policy",
    components: {PolicyEditor},
    props: ['id'],
    data() {
      return {
        saving: false,
      }
    },
    methods: {
      ...mapActions(['update']),
      async dpUpdate(newValue) {
        this.saving = true;
        try {
          await this.update({name: this.id, policy: newValue})
        } catch (e) {
          this.error(e)
        } finally {
          this.saving = false;
        }
      }
    },
    computed: {
      ...mapState(['policies', 'loading']),
      ...user.mapGetters(['appsByUID']),
      policy() {
        return (this.policies || []).find((p) => p.id === this.id)
      }
    }
  }
</script>

<style scoped>

</style>
