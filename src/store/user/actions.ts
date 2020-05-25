import {ActionTree} from 'vuex';
import {StoreInterface} from '../index';
import {UserState} from './state';
import client from '../../api'

const actions: ActionTree<UserState, StoreInterface> = {
  async login({commit}, {login, password}) {
    commit('logging', true)
    try {
      let token = await client.login(login, password)
      commit('token', token);
      return true;
    } catch (e) {
      console.error(e);
    } finally {
      commit('logging', false)
    }
    return false;
  },

  async loadApps({commit, state}) {
    commit('loadingApps', true);
    try {
      const list = await client.list(state.token)
      commit('apps', list)
      return true;
    } catch (e) {
      console.error(e)
    } finally {
      commit('loadingApps', false)
    }
    return false;
  },

  async logout({commit}) {
    commit('token', '')
  },


  async loadApp({commit, state}, uid) {
    commit('loadingApp', true);
    commit('selectedApp', undefined)
    try {
      let item = (state.apps || []).find((item) => item.uid === uid);
      if (!item) {
        item = await client.info(state.token, uid);
      }
      commit('selectedApp', item);
    } catch (e) {
      console.error(e)
    } finally {
      commit('loadingApp', false);
    }
  }
};

export default actions;
