import {RouteConfig} from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/Index.vue')},
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('pages/Dashboard.vue')
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('pages/Settings.vue')
      },
      {
        path: '/app/:name',
        props: true,
        name: 'app',
        component: () => import('pages/App.vue')
      },
      {
        path: '/lambdas',
        props: true,
        name: 'lambdas',
        component: () => import('pages/Lambdas.vue')
      },
      {
        path: '/queues',
        props: true,
        name: 'queues',
        component: () => import('pages/Queues.vue')
      },
      {
        path: '/policies',
        props: true,
        name: 'policies',
        component: () => import('pages/Policies.vue')
      },
      {
        path: '/policy/:id',
        props: true,
        name: 'policy',
        component: () => import('pages/Policy.vue')
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  });
}

export default routes;
