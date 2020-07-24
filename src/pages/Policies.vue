<template>
  <q-page class="q-col-gutter-sm q-pa-md">
    <policies-list/>
  </q-page>
</template>

<script>
  import {createNamespacedHelpers} from "vuex";
  import PoliciesList from "../components/widgets/policies/PoliciesList";

  export default {
    name: "Policies",
    components: {PoliciesList},
  }
</script>

<style scoped>

</style>
