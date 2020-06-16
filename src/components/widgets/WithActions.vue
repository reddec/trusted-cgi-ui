<template>
  <div>
    <slot name="loading" v-if="loading">
      <q-linear-progress indeterminate/>
    </slot>
    <slot name="notFound" v-else-if="!actions || actions.length === 0">
      <h5>
        actions not found
      </h5>
    </slot>
    <slot name="default" v-bind:actions="actions" v-else>

    </slot>
  </div>
</template>

<script>
  import {lambdaAPI} from "../../api";

  import {createNamespacedHelpers} from "vuex";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')
  export default {
    name: "WithActions",
    data() {
      return {
        loading: false,
        result: '',
        actions: []
      }
    },
    beforeMount() {
      this.reload()
    },
    methods: {
      async reload() {
        this.loading = true;
        try {
          this.actions = await lambdaAPI.actions(this.token, this.selectedApp?.uid)
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false;
        }
      }
    },
    watch: {
      selectedApp() {
        this.reload();
      }
    },
    computed: {
      ...mapState([
        'selectedApp',
        'token'
      ]),
    }
  }
</script>

<style scoped>

</style>
