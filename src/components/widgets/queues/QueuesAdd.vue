<template>
  <div style="display: inline" @click="()=> dialog = true">
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">New queue</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="name" autofocus label="Queue name"/>
          <br/>
          <q-input dense v-model="retry" type="number" label="Retry attempts"/>
          <br/>
          <q-input dense v-model="interval" label="Delay between attempts"/>
          <br/>
          <q-input dense v-model="itemSize" type="number" label="Maximum request size" :hint="toSize(itemSize)"/>
          <br/>
          <div v-if="!targetLocked">
            <q-input dense v-model="lambda" :disable="targetLocked" label="Target lambda"/>
            <q-scroll-area style="height: 200px">
              <lambdas-list :filter="lambda" @click="(app) => lambda = app.uid"/>
            </q-scroll-area>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Add" v-if="lambda" :loading="creating" @click="doCreate"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-circular-progress indeterminate v-if="creating"/>
    <slot v-else>
      <q-icon name="add"></q-icon>
    </slot>
  </div>
</template>

<script>
  import {createNamespacedHelpers} from "vuex";
  import LambdasList from "../lambdas/LambdasList";

  const {mapState} = createNamespacedHelpers('user')
  const {mapActions, mapMutations} = createNamespacedHelpers('queues')
  export default {
    name: "QueuesAdd",
    components: {LambdasList},
    props: {
      target: {
        type: String,
      },
      defaultName: {
        type: String,
      },
      targetLocked: {
        type: Boolean
      }
    },
    data() {
      return {
        dialog: false,
        name: this.defaultName,
        lambda: this.target,
        creating: false,
        retry: 3,
        interval: '5s',
        lambdas: [],
        itemSize: 1024 * 1024,
      }
    },
    methods: {
      toSize(value) {
        if (value <= 0) return '∞'
        if (value < 1024) return value + ' B'
        if (value < 1024 * 1024) return (value / 1024).toPrecision(2) + ' KiB'
        if (value < 1024 * 1024 * 1024) return (value / (1024 * 1024)).toPrecision(2) + ' MiB'
        return value / (1024 * 1024 * 1024).toPrecision(2) + ' GiB'
      },
      async doCreate() {
        this.creating = true;
        try {
          await this.create(
            {
              name: this.name,
              target: this.lambda,
              retry: parseInt(this.retry),
              interval: this.interval,
              max_element_size: parseInt(this.itemSize)
            })
          this.name = '';
          if (!this.targetLocked) {
            this.lambda = '';
          }
          this.dialog = false;
        } catch (e) {
          console.error(e)
        } finally {
          this.creating = false;
        }
      },
      ...mapActions(['create'])
    },
    computed: {
      ...mapState(['apps', 'appsLoading'])
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
