<template>
  <div>

    <q-linear-progress indeterminate v-if="loading"/>
    <p class="q-pl-md q-pr-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el :label="bread.name" v-for="bread in breadcrumbs" :key="bread.path" @click="goto(bread.path)"/>
      </q-breadcrumbs>
    </p>
    <q-list>
      <q-item-label header>Folders</q-item-label>
      <q-item v-for="folder in folders"
              :key="folder.name"
              :disable="loading"
              clickable
              @click="goto(dir + '/' + folder.name)"
      >
        <q-item-section avatar top>
          <q-avatar icon="folder" color="grey" text-color="white"/>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{folder.name}}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn icon="delete" @click="remove(dir + '/' + folder.name)" flat dense round/>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="()=>newDir.dialog = true">
        <q-item-section avatar top>
          <q-avatar icon="add" color="primary" text-color="white"/>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">new folder</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced/>
      <q-item-label header>Files</q-item-label>

      <q-item clickable v-ripple v-for="file in files"
              :key="file.name" :disable="loading"
              @click="$emit('openFile', {dir: dir, name: file.name})"
      >
        <q-item-section avatar top>
          <q-avatar icon="assignment" color="grey" text-color="white"/>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{file.name}}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn icon="delete" @click="remove(dir + '/' + file.name)" flat dense round/>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple @click="()=>newFile.dialog= true">
        <q-item-section avatar top>
          <q-avatar icon="add" color="primary" text-color="white"/>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">new file</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-dialog v-model="newDir.dialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Folder name</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="newDir.name" autofocus/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Create folder" v-close-popup @click="createItem(newDir.name, true)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="newFile.dialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">File name</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="newFile.name" autofocus/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Create file" v-close-popup @click="createItem(newFile.name, false)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

  import {createNamespacedHelpers} from "vuex";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')
  import {lambdaAPI} from '../../api'

  export default {
    name: "FileBrowser",
    props: ['name'],
    data() {
      return {
        loading: false,
        newDir: {
          dialog: false,
          name: ''
        },
        newFile: {
          dialog: false,
          name: ''
        },
        items: [],
        dir: '/'
      }
    },
    beforeMount() {
      this.reload();
    },
    methods: {
      async goto(folder) {
        const ok = await this.reload(folder)
        if (ok) {
          this.dir = folder;
        }
      },
      async reload(dir) {
        this.loading = true;
        try {
          this.items = await lambdaAPI.files(this.token, this.name, dir || this.dir)
          return true;
        } catch (e) {
          console.error(e);
        } finally {
          this.loading = false
        }
        return false;
      },
      async remove(path) {
        this.loading = true;
        try {
          await lambdaAPI.removeFile(this.token, this.name, path);
        } catch (e) {
          console.error(e);
          this.loading = false
          return false;
        }

        return (await this.reload());
      },
      async createItem(path, dir) {
        this.loading = true;
        this.newDir.name = '';
        this.newFile.name = '';
        try {
          await lambdaAPI.createFile(this.token, this.name, this.dir + '/' + path, !!dir);
        } catch (e) {
          console.error(e);
          this.loading = false
          return false;
        }

        return (await this.reload());
      }
    },
    computed: {
      folders() {
        return this.items.filter((item) => item.is_dir)
      },
      files() {
        return this.items.filter((item) => !item.is_dir)
      },
      breadcrumbs() {
        const items = this.dir.split('/').filter((chop) => chop.length > 0);
        const crumbs = items.map((chop, index) => {
          return {name: chop, path: items.slice(0, index + 1).join("/")}
        })

        return [{name: this.name, path: '/'}, ...crumbs]
      },
      ...mapState(['token']),
    },
    watch: {
      name() {
        this.reload();
      }
    }
  }
</script>

<style scoped>

</style>
