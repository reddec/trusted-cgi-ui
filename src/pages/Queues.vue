<template>
  <q-page class="q-col-gutter-sm q-pa-md">
    <queues-list/>
  </q-page>
</template>

<script>
  import QueuesList from "../components/widgets/queues/QueuesList";
  import QueuesAdd from "../components/widgets/queues/QueuesAdd";

  export default {
    name: "Queues",
    components: {QueuesAdd, QueuesList}
  }
</script>

<style scoped>

</style>
