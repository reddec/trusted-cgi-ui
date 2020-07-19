<template>
  <transition>
    <q-circular-progress indeterminate v-if="assigning"/>
    <div style="display: inline-block" @click="()=>dialog=true" v-else>
      <q-dialog v-model="dialog" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Link to another lambda</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="newLambda" label="Target lambda"/>
            <q-scroll-area style="height: 200px">
              <lambdas-list :filter="newLambda" @click="(app) => newLambda = app.uid"/>
            </q-scroll-area>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup/>
            <q-btn flat label="Assign" :loading="assigning" @click="doAssign"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <slot>
        <q-icon name="forward"></q-icon>
      </slot>
    </div>

  </transition>
</template>

<script>
  import {createNamespacedHelpers} from "vuex";
  import LambdasList from "../lambdas/LambdasList";

  const {mapActions} = createNamespacedHelpers('queues')
  export default {
    name: "QueuesAssign",
    components: {LambdasList},
    props: ['name', 'lambda'],
    data() {
      return {
        assigning: false,
        newLambda: this.lambda,
        dialog: false,
      }
    },
    methods: {
      ...mapActions(['assign']),
      async doAssign() {
        try {
          this.assigning = true;
          await this.assign({name: this.name, lambda: this.newLambda});
          this.dialog = false;
        } catch (e) {
          console.error(e)
        } finally {
          this.assigning = false;
        }
      }
    },
    watch: {
      lambda() {
        this.newLambda = this.lambda;
      }
    }
  }
</script>

<style scoped>

</style>
