import {Module} from 'vuex';
import {Settings, Record, Template} from "src/api/project_api";
import {StoreInterface} from "src/store";
import {lambdaAPI, projectAPI} from '../../api'

interface State {
  templatesLoading: boolean
  templates: Array<Template>
  configLoading: boolean
  config: Settings | undefined
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
    config(state, config: Settings) {
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
        const list = (await projectAPI.allTemplates(token) || []).sort((a, b) => a.name.localeCompare(b.name));
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
        const cfg = await projectAPI.config(token)
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
        const cfg = await projectAPI.stats(token, 1000)
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
