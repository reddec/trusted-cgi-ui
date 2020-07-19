<template>
  <transition>
    <q-circular-progress indeterminate v-if="removing"/>
    <div style="display: inline-block" @click="doRemove" v-else>
      <slot>
        <q-icon name="delete"></q-icon>
      </slot>
    </div>

  </transition>
</template>

<script>
  import {createNamespacedHelpers} from "vuex";

  const {mapActions} = createNamespacedHelpers('queues')
  export default {
    name: "QueuesRemove",
    props: ['name'],
    data() {
      return {
        removing: false,
      }
    },
    methods: {
      ...mapActions(['remove']),
      async doRemove() {
        try {
          this.removing = true;
          await this.remove(this.name);
        } catch (e) {
          console.error(e)
        } finally {
          this.removing = false;
        }
      }
    }
  }
</script>

<style scoped>

</style>
