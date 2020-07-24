<template>

  <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="doRemove" :loading="removing">
    <slot/>
  </q-btn>

</template>

<script>
  import {createNamespacedHelpers} from "vuex";

  const {mapActions} = createNamespacedHelpers('policies')
  export default {
    name: "PolicyRemove",
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
