import {Module} from 'vuex';
import {StoreInterface} from "src/store";
import {policiesAPI} from 'src/api'
import {Policy, PolicyDefinition} from "src/api/policies_api";

interface State {
  loading: boolean
  policies: Array<Policy>
}

interface NewPolicy {
  policy: PolicyDefinition
  name: string
}

const mod: Module<State, StoreInterface> = {
  namespaced: true,
  state: {
    loading: false,
    policies: []
  },
  mutations: {
    policies(state, list?: Array<Policy>) {
      state.policies = list || [];
    },
    loading(state, status: boolean) {
      state.loading = status
    },
    created(state, policy: Policy) {
      state.policies = ([...state.policies, policy]).sort((a, b) => a.id.localeCompare(b.id))
    },
    removed(state, name: string) {
      state.policies = [...state.policies.filter((q) => q.id !== name)]
    },
    updated(state, policy: NewPolicy) {
      state.policies = state.policies.map((x) => {
        if (x.id === policy.name) {
          return Object.assign({}, x, {definition: policy.policy})
        }
        return x
      })
    },
    lambdaRemoved(state, lambda: string) {
      state.policies = [...state.policies.map((p) => {
        let arr = (p.lambdas as Array<string>);
        let idx = arr.indexOf(lambda);
        if (idx !== -1) arr.splice(idx, 1)
        p.lambdas = arr
        return p
      })]
    }
  },
  actions: {
    async load({state, rootState, commit}, force: boolean = false) {
      if (!force && state.policies && state.policies.length > 0) {
        return true
      }
      let token = rootState.user.token
      commit('loading', true)
      try {
        const list = (await policiesAPI.list(token) || []).sort((a, b) => a.id.localeCompare(b.id));
        commit('policies', list)
        return true;
      } catch (e) {
        console.error(e)
        return false
      } finally {
        commit('loading', false)
      }
    },
    async create({state, rootState, commit}, {name, policy}: NewPolicy) {
      let token = rootState.user.token
      const q = await policiesAPI.create(token, name, policy)
      commit('created', q);
      return q;
    },
    async update({state, rootState, commit}, {name, policy}: NewPolicy) {
      let token = rootState.user.token
      const q = await policiesAPI.update(token, name, policy)
      commit('updated', {name: name, policy: policy});
      return q;
    },
    async remove({state, rootState, commit}, name: string) {
      let token = rootState.user.token
      await policiesAPI.remove(token, name)
      commit('removed', name);
    },
    async apply({state, rootState, commit, dispatch}, {name, lambda}) {
      let token = rootState.user.token
      await policiesAPI.apply(token, name, lambda)
      return dispatch('load', true)
    },
  }
}
export default mod;
