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
    </div>
  </q-page>
</template>

<script>
  import PolicyEditor from "../components/widgets/policies/PolicyEditor";
  import {createNamespacedHelpers} from "vuex";

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
      policy() {
        return (this.policies || []).find((p) => p.id === this.id)
      }
    }
  }
</script>

<style scoped>

</style>
