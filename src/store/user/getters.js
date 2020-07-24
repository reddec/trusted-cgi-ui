const getters = {
  loggedIn(state) {
    return !!state.token;
  },
  appsByUID(state) {
    return Object.fromEntries(state.apps.map((app) => [app.uid, app]))
  }
};

export default getters;
