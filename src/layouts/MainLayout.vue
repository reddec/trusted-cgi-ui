<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          v-if="loggedIn"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-avatar>
          <img src="../assets/logo.svg">
        </q-avatar>
        <q-toolbar-title>
          Trusted CGI
        </q-toolbar-title>

        <div v-if="loggedIn">
          <q-btn flat @click="logout()">
            logout
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      v-if="loggedIn"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item clickable :to="{name:'dashboard'}">
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Dashboard
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable :to="{name:'lambdas'}">
          <q-item-section avatar>
            <q-icon name="device_hub"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Lambdas
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable :to="{name:'queues'}">
          <q-item-section avatar>
            <q-icon name="queue"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Queues
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable :to="{name:'policies'}">
          <q-item-section avatar>
            <q-icon name="policy"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Policies
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable :to="{name:'settings'}">
          <q-item-section avatar>
            <q-icon name="settings"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Settings
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>

  import {createNamespacedHelpers} from "vuex";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')

  export default {
    name: 'MainLayout',

    components: {},

    data() {
      return {
        leftDrawerOpen: false,
      }
    },
    computed: {
      ...mapState(['loadingApps', 'apps']),
      ...mapGetters(['loggedIn'])
    },
    methods: {
      ...mapActions(['loadApps', 'logout', 'loadApp']),
    }
  }
</script>
