<template>
  <q-list :bordered="bordered">
    <q-item-label header v-if="!noTitle">Environment variables</q-item-label>
    <q-item v-for="[name, value] in entries" :key="name">
      <q-item-section>
        <q-item-label>
          <code>{{name}}</code>
        </q-item-label>
        <q-item-label caption style="overflow-x: auto">{{value}}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn icon="delete" :loading="loading" @click="remove(name)" flat dense round/>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input filled label="name" v-model="name"/>
      </q-item-section>
      <q-item-section>
        <q-input filled label="value" v-model="env"/>
      </q-item-section>
      <q-item-section side>
        <q-btn icon="add" :loading="loading" @click="add" flat dense round/>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
  export default {
    name: "Environment",
    props: {
      value: {},
      loading: {
        type: Boolean
      },
      noTitle: {
        type: Boolean
      },
      bordered: {
        type: Boolean
      }
    },
    data() {
      return {
        name: '',
        env: ''
      }
    },
    methods: {
      remove(key) {
        let cp = Object.fromEntries(this.entries.filter(([tkey, value]) => tkey !== key))
        this.$emit('input', cp)
      },
      add() {
        this.$emit('input', Object.assign({}, this.value, {
          [this.name]: this.env,
        }))
        this.name = '';
        this.env = '';
      }
    },
    computed: {
      entries() {
        return Object.entries(this.value || {})
      }
    }
  }
</script>

<style scoped>

</style>
