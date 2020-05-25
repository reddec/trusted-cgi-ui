import {route} from 'quasar/wrappers';
import VueRouter from 'vue-router';
import {StoreInterface} from '../store';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default route<StoreInterface>(function ({Vue, store}) {
  Vue.use(VueRouter);

  const Router = new VueRouter({
    scrollBehavior: () => ({x: 0, y: 0}),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });


  Router.beforeEach(function (to, from, next) {
    const loggedIn = store.getters['user/loggedIn'];
    if (loggedIn) {
      next()
      return;
    }
    if (to.path != "/") {
      Router.push("/")
      return;
    }
    next();
  })


  return Router;
})
