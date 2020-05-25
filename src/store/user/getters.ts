import {GetterTree} from 'vuex';
import {StoreInterface} from '../index';
import {UserState} from './state';

const getters: GetterTree<UserState, StoreInterface> = {
  loggedIn(state) {
    return !!state.token;
  }
};

export default getters;
