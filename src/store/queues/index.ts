import {Module} from 'vuex';
import {StoreInterface} from "src/store";
import {queuesAPI} from 'src/api'
import {Queue} from "src/api/queues_api";

interface State {
  loading: boolean
  queues: Array<Queue>

}

const mod: Module<State, StoreInterface> = {
  namespaced: true,
  state: {
    loading: false,
    queues: []
  },
  mutations: {
    queues(state, list?: Array<Queue>) {
      state.queues = list || [];
    },
    loading(state, status: boolean) {
      state.loading = status
    },
    created(state, queue: Queue) {
      state.queues = ([...state.queues, queue]).sort((a, b) => a.name.localeCompare(b.name))
    },
    removed(state, name: string) {
      state.queues = [...state.queues.filter((q) => q.name !== name)]
    }
  },
  actions: {
    async load({state, rootState, commit}, force: boolean = false) {
      if (!force && state.queues && state.queues.length > 0) {
        return true
      }
      let token = rootState.user.token
      commit('loading', true)
      try {
        const list = (await queuesAPI.list(token) || []).sort((a, b) => a.name.localeCompare(b.name));
        commit('queues', list)
        return true;
      } catch (e) {
        console.error(e)
        return false
      } finally {
        commit('loading', false)
      }
    },

    async create({state, rootState, commit}, {name, lambda}) {
      let token = rootState.user.token
      const q = await queuesAPI.create(token, name, lambda)
      commit('created', q);
      return q;
    },
    async remove({state, rootState, commit}, name: string) {
      let token = rootState.user.token
      await queuesAPI.remove(token, name)
      commit('removed', name);
    },
  }
}
export default mod;
