<template>
  <q-list :bordered="bordered">
    <q-item-label header v-if="label">{{label}}</q-item-label>
    <q-item v-for="[name, value] in entries" :key="name">
      <q-item-section>
        <q-item-label>
          <code>{{name}}</code>
        </q-item-label>
        <q-item-label caption style="overflow-x: auto">{{value}}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
  export default {
    name: "MapView",
    props: {'value': {}, 'bordered': {type: Boolean}, label: {}},
    computed: {
      entries() {
        return Object.entries(this.value || {})
      }
    }
  }
</script>

<style scoped>

</style>
