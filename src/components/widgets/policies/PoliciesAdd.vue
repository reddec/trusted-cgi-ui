<template>
  <div style="display: inline">
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 450px">
        <q-card-section>
          <div class="text-h6">New policy</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input label="Name" autofocus v-model="name" @keydown.enter.prevent="doCreate"/>
          <br/>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Add" :loading="creating" @click="doCreate"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-circular-progress indeterminate v-if="creating"/>
    <slot v-else>
      <q-btn icon="add" flat round @click="()=> dialog = true"></q-btn>
    </slot>
  </div>
</template>

<script>
  import {createNamespacedHelpers} from "vuex";
  import PolicyEditor from "./PolicyEditor";

  const {mapActions, mapMutations} = createNamespacedHelpers('policies')
  export default {
    name: "PoliciesAdd",
    components: {PolicyEditor},
    props: ['defaultName'],
    data() {
      return {
        creating: false,
        dialog: false,
        name: '',
        newPolicy: {
          public: false,
        }
      }
    },
    methods: {
      async doCreate() {
        this.creating = true;
        try {
          await this.create({
            name: this.name, policy: {public: false}
          })
          this.$router.push({name: 'policy', params: {id: this.name}})
        } catch (e) {
          console.error(e)
        } finally {
          this.creating = false;
        }
      },
      ...mapActions(['create'])
    },
    watch: {
      defaultName() {
        this.name = this.defaultName;
      }
    }
  }

</script>

<style scoped>

</style>
