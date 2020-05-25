import {MutationTree} from 'vuex';
import {UserState} from './state';
import {Vue} from "vue-property-decorator";

const mutation: MutationTree<UserState> = {
  token(state, token) {
    state.token = token
  },
  logging(state, pending) {
    state.logging = pending
  },
  loadingApps(state, pending) {
    state.appsLoading = pending;
  },
  apps(state, list) {
    state.apps = list;
  },
  selectedApp(state, app) {
    state.selectedApp = app
  },
  loadingApp(state, pending) {
    state.loadingApp = pending;
  },
  updatedApp(state, app) {
    let idx = state.apps.findIndex((x) => x.uid == app.uid);
    if (idx !== -1) {
      Vue.set(state.apps, idx, app)
    } else {
      state.apps.push(app)
    }
  },
  removedApp(state, app) {
    let idx = state.apps.findIndex((x) => x.uid == app.uid);
    if (idx !== -1) {
      state.apps.splice(idx, 1)
    }
  }
};

export default mutation;
