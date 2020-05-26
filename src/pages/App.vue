<template>
  <q-page class="q-pa-md content-stretch">
    <q-linear-progress indeterminate v-if="loadingApp"/>
    <div v-else-if="selectedApp">
      <q-tabs
        dense
        v-model="tab"
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
      >
        <q-tab name="overview" label="Overview" icon="web_asset"/>
        <q-tab name="files" label="Files" icon="folder"/>
        <q-tab name="stats" label="Stats" icon="bar_chart"/>
        <q-tab name="launcher" label="Launcher" icon="launch"/>
        <q-tab name="playground" label="Playground" icon="play_arrow"/>
        <q-tab name="limits" label="Limits" icon="speed"/>
        <q-tab name="mapping" label="Mapping" icon="shuffle"/>
        <q-tab name="security" label="Security" icon="security"/>
      </q-tabs>

      <q-separator/>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="overview">
          <div>
            <q-chip :icon="selectedApp.manifest.public ? 'public' : 'security'">{{ api }}</q-chip>
          </div>
          <Overview/>
        </q-tab-panel>
        <q-tab-panel name="stats">
          <AppStats/>
        </q-tab-panel>
        <q-tab-panel name="launcher">
          <Launcher/>
        </q-tab-panel>
        <q-tab-panel name="playground">
          <Playground/>
        </q-tab-panel>
        <q-tab-panel name="files">
          <div class="row">
            <FileBrowser :name="name" @openFile="(info)=> selectedItem = info"/>
            <FileEditor :name="name" :file="filepath"/>
          </div>
        </q-tab-panel>
        <q-tab-panel name="limits">
          <div class="text-h6">Limits</div>
          <Limits/>
        </q-tab-panel>
        <q-tab-panel name="mapping">
          <Mapping/>
        </q-tab-panel>
        <q-tab-panel name="security">
          <Security/>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
  import client from '../api'
  import {baseURL} from "../api";
  import FileBrowser from "../components/widgets/FileBrowser";
  import FileEditor from "../components/widgets/FileEditor";
  import Overview from "../components/widgets/Overview";

  import {createNamespacedHelpers} from "vuex";
  import Limits from "../components/widgets/Limits";
  import Security from "../components/widgets/Security";
  import Mapping from "../components/widgets/Mapping";
  import Launcher from "../components/widgets/Launcher";
  import Playground from "../components/widgets/Playground";
  import AppStats from "../components/widgets/AppStats";

  // TODO: add upload/download tarball
  // TODO: make CLI?
  // TODO: shared/namespaced storage?
  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')


  export default {
    name: "App",
    components: {AppStats, Playground, Launcher, Mapping, Security, Limits, Overview, FileEditor, FileBrowser},
    props: {
      name: {
        required: true,
      }
    },
    data() {
      return {
        loading: false,
        tab: 'overview',
        selectedItem: {name: '', dir: ''},
      }
    },
    beforeMount() {
      this.loadApp(this.name)
    },
    computed: {
      ...mapState(['loadingApp', 'selectedApp']),
      filepath() {
        return this.selectedItem.dir + '/' + this.selectedItem.name;
      },
      api() {
        return baseURL + 'a/' + this.name
      }
    },
    methods: {
      ...mapActions(['loadApp'])
    },
    watch: {
      name() {
        this.loadApp(this.name)
      },
      selectedApp(ng, prev) {
        if (!this.selectedApp || !prev || ng.uid !== prev.uid) {
          this.selectedItem = {dir: '', name: ''}
          this.tab = 'overview';
        }
      }
    }
  }
</script>

<style scoped>

</style>
