import {store} from 'quasar/wrappers';
import Vuex from 'vuex';

import {UserState} from "src/store/user/state";
import user from './user';
import system from './system';
import {API} from "src/api/client";

export interface StoreInterface {
  user: UserState;
  getters: any;
}

export default store(function ({Vue}) {
  Vue.use(Vuex);

  const Store = new Vuex.Store<StoreInterface>({
    modules: {
      user,
      system
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV
  });

  return Store;
});

