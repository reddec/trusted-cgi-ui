<template>
  <q-list>
    <q-item-section>
      <q-item-label header>
        <slot>
          <q-input v-model="filter" label="policy or target lambda">
            <template v-slot:before>
              <q-icon name="search"/>
            </template>
            <template v-slot:after v-if="!readonly">
              <policies-add :default-name="filter"/>
            </template>
          </q-input>
        </slot>
      </q-item-label>
    </q-item-section>
    <div v-if="readonly">
      <q-item v-for="policy in filteredPolicies" :key="policy.id" clickable @click="$emit('click', policy)">
        <q-item-section>
          <q-item-label overline>
            <slot name="item" v-bind:policy="policy">
              {{policy.id}}
            </slot>
          </q-item-label>
          <q-item-label caption>
            <slot name="hint" v-bind:policy="policy">
           <span v-if="policy.lambdas && policy.lambdas.length > 0">
            -> {{ policy.lambdas.length }} lambdas
            </span>
            </slot>
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div v-else>
      <q-item v-for="policy in filteredPolicies" :key="policy.id">
        <q-item-section>
          <router-link :to="{'name':'policy', params:{'id':policy.id}}">
            <q-item-label overline>
              <slot name="item" v-bind:policy="policy">
                {{policy.id}}
              </slot>
            </q-item-label>
          </router-link>
          <q-item-label caption>
            <slot name="hint" v-bind:policy="policy">
            <span v-if="policy.lambdas && policy.lambdas.length > 0">
            -> {{ policy.lambdas.length }} lambdas
            </span>
            </slot>
          </q-item-label>
        </q-item-section>
        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <policy-remove :name="policy.id"/>
          </div>
        </q-item-section>
      </q-item>
    </div>

  </q-list>
</template>

<script>
  import {createNamespacedHelpers} from "vuex";
  import PoliciesAdd from "./PoliciesAdd";
  import PolicyRemove from "./PolicyRemove";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('policies')
  export default {
    name: "PoliciesList",
    components: {PolicyRemove, PoliciesAdd},
    props: {
      'lambda': {},
      readonly: {
        type: Boolean
      }
    },
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
      ...mapState(['loading', 'policies']),
      filteredPolicies() {
        if (this.lambda) {
          return this.policies.filter((q) => q.lambdas.indexOf(this.lambda) !== -1);
        }
        if (!this.filter) return this.policies;
        const f = this.filter.toLocaleLowerCase();
        return this.policies.filter((q) =>
          q.id.toLocaleLowerCase().indexOf(f) !== -1 ||
          q.lambdas.indexOf(this.filter) !== -1)
      }
    }
  }
</script>

<style scoped>

</style>
