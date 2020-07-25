<template>
  <q-list :bordered="bordered" :class="disabled?'bg-grey-4':''">
    <q-item-label header v-if="title">{{title}}</q-item-label>
    <q-item v-for="[name, value] in entries" :key="name">
      <q-item-section>
        <q-item-label overline style="overflow-x: auto">{{value}}</q-item-label>
        <q-item-label caption>
          <code>{{name}}</code>
        </q-item-label>
      </q-item-section>
      <q-item-section side v-if="!disabled" >
        <q-btn icon="delete" :loading="loading" @click="remove(name)" flat dense round/>
      </q-item-section>
    </q-item>
    <q-item v-if="!disabled">
      <q-item-section>
        <q-input filled :label="valueLabel" v-model="entryName" @keydown.enter.prevent="add"/>
      </q-item-section>
      <q-item-section side>
        <q-btn icon="add" :loading="loading" @click="add" flat dense round/>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
  export default {
    name: "MapEditor",
    props: {
      value: {},
      disabled: {
        type: Boolean
      },
      loading: {
        type: Boolean
      },
      bordered: {
        type: Boolean
      },
      title: {
        type: String
      },
      keyLabel: {
        type: String
      },
      valueLabel: {
        type: String
      },
      defValue: {},
      defKey:{}
    },
    data() {
      return {
        entryName: '',
      }
    },
    methods: {
      remove(key) {
        let cp = Object.fromEntries(this.entries.filter(([tkey, value]) => tkey !== key))
        this.$emit('input', cp)
      },
      add() {
        let key = (typeof this.defKey == 'function') ? this.defKey() : '';
        this.$emit('input', Object.assign({}, this.value, {
          [key]: this.entryName,
        }))
        this.entryName = '';
      }
    },
    computed: {
      entries() {
        console.log("!!", this.value)
        return Object.entries(this.value || {})
      }
    }
  }
</script>

<style scoped>

</style>
