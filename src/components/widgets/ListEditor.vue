<template>
  <q-list :bordered="bordered">
    <q-item-section v-if="title">
      <q-item-label header>{{title}}</q-item-label>
    </q-item-section>
    <q-item v-if="local.length === 0">
      {{empty}}
    </q-item>
    <q-item v-for="(value, index) in local" :key="index">
      <q-item-section>
        <q-item-label style="overflow-x: auto">{{value}}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn icon="delete" :loading="loading" @click="remove(index)" flat dense round/>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input filled :label="label" v-model="entryName" @keydown.enter.prevent="add"/>
      </q-item-section>
      <q-item-section side>
        <q-btn icon="add" :loading="loading" @click="add" flat dense round/>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
  export default {
    name: "ListEditor",
    props: {
      value: {},
      empty: {},
      loading: {
        type: Boolean
      },
      bordered: {
        type: Boolean
      },
      title: {
        type: String
      },
      label: {
        type: String
      }
    },
    data() {
      return {
        entryName: '',
      }
    },
    methods: {
      remove(idx) {
        let cp = [...this.local.slice(0, idx), ...this.local.slice(idx + 1)]
        this.$emit('input', cp)
      },
      add() {
        let cp = [...this.local, this.entryName]
        this.$emit('input', cp)
        this.entryName = '';
      }
    },
    computed: {
      local() {
        return this.value || []
      }
    }
  }
</script>

<style scoped>

</style>
