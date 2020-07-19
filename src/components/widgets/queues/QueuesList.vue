<template>
  <q-list>
    <q-item-section>
      <q-item-label header>
        <q-input v-model="filter" label="queue or lambda name">
          <template v-slot:before>
            <q-icon name="search" />
          </template>

          <template v-slot:after>
            <queues-add :default-name="filter">
              <q-btn round dense flat icon="add" />
            </queues-add>
          </template>
        </q-input>
      </q-item-label>
    </q-item-section>
    <q-item v-for="queue in filteredQueues" :key="queue.name">
      <q-item-section>
        <q-item-label overline>{{queue.name}}</q-item-label>
        <q-item-label caption>
          {{ queue.target }}
        </q-item-label>
      </q-item-section>
      <q-item-section top side>
        <div class="text-grey-8 q-gutter-xs">
          <queues-remove :name="queue.name">
            <q-btn class="gt-xs" size="12px" flat dense round icon="delete"/>
          </queues-remove>
          <q-btn class="gt-xs" size="12px" flat dense round icon="dashboard"
                 :to="{name:'app', params:{name:queue.target}}"/>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
  import {createNamespacedHelpers} from "vuex";
  import QueuesRemove from "./QueuesRemove";
  import QueuesAdd from "./QueuesAdd";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('queues')
  export default {
    name: "QueuesList",
    components: {QueuesAdd, QueuesRemove},
    data() {
      return {
        filter: '',
        removing: false,
      }
    },
    async beforeMount() {
      await this.load()
    },
    methods: {
      ...mapActions(['load']),
    },
    computed: {
      ...mapState(['loading', 'queues']),
      filteredQueues() {
        if (!this.filter) return this.queues;
        const f = this.filter.toLocaleLowerCase();
        return this.queues.filter((q) =>
          q.name.toLocaleLowerCase().indexOf(f) !== -1 ||
          q.target.toLocaleLowerCase().indexOf(f) !== -1)
      }
    }
  }
</script>

<style scoped>

</style>
