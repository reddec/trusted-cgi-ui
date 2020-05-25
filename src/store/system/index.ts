import {Module} from 'vuex';
import {ProjectConfig, Record, Template} from "src/api/client";
import {StoreInterface} from "src/store";
import client from '../../api'

interface State {
  templatesLoading: boolean
  templates: Array<Template>
  configLoading: boolean
  config: ProjectConfig | undefined
  globalStats: Array<Record>
  globalStatsLoading: boolean
}

const mod: Module<State, StoreInterface> = {
  namespaced: true,
  state: {
    templatesLoading: false,
    templates: [],
    configLoading: false,
    config: undefined,
    globalStats: [],
    globalStatsLoading: false
  },
  mutations: {
    templates(state, templates: Array<Template>) {
      state.templates = templates
    },
    templatesLoading(state, pending: boolean) {
      state.templatesLoading = pending
    },
    config(state, config: ProjectConfig) {
      state.config = config
    },
    configLoading(state, pending: boolean) {
      state.configLoading = pending
    },
    globalStats(state, stats: Array<Record>) {
      state.globalStats = stats
    },
    globalStatsLoading(state, pending: boolean) {
      state.globalStatsLoading = pending
    }
  },
  actions: {
    async templates({state, rootState, commit}, force: boolean = false) {
      if (!force && state.templates && state.templates.length > 0) {
        return true
      }
      let token = rootState.user.token
      commit('templatesLoading', true)
      try {
        const list = (await client.allTemplates(token) || []).sort((a, b) => a.name.localeCompare(b.name));
        commit('templates', list)
        return true;
      } catch (e) {
        console.error(e)
        return false
      } finally {
        commit('templatesLoading', false)
      }
    },
    async config({state, rootState, commit}, force: boolean = false) {
      if (!force && state.config) {
        return true
      }
      let token = rootState.user.token
      commit('configLoading', true)
      try {
        const cfg = await client.config(token)
        commit('config', cfg)
        return true;
      } catch (e) {
        console.error(e)
        return false
      } finally {
        commit('configLoading', false)
      }
    },
    async globalStats({rootState, commit}) {
      let token = rootState.user.token
      commit('globalStatsLoading', true)
      try {
        const cfg = await client.globalStats(token, 1000)
        commit('globalStats', cfg)
        return true;
      } catch (e) {
        console.error(e)
        return false
      } finally {
        commit('globalStatsLoading', false)
      }
    }
  }
}
export default mod;
