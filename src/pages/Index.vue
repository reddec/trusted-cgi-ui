<template>
  <q-page class="row items-center justify-evenly">
    <Login/>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue';

import Login from 'components/Login.vue';

export default Vue.extend({
  name: 'PageIndex',
  components: { Login },
  data() {
    return {}
  }
});
</script>
