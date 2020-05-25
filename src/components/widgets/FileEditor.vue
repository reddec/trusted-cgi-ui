<template>
  <div class="col-grow">

    <q-linear-progress indeterminate v-if="loading"/>
    <div v-else-if="downloaded" style="min-height: 200px;display: inline">
      <div>
        <q-btn icon="save" color="primary" flat @click="save()" :loading="saving">
          save {{file}}
        </q-btn>
      </div>
      <editor v-model="content" ref="myEditor"
              @init="editorInit" :lang="language" theme="chrome"
              height="100%"
      ></editor>

    </div>

  </div>
</template>

<script>
  import client from '../../api'

  import {createNamespacedHelpers} from "vuex";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')

  export default {
    name: "FileEditor",
    props: ['name', 'file'],
    components: {
      editor: require('vue2-ace-editor'),
    },
    data() {
      return {
        loading: false,
        content: '',
        saving: false,
        downloaded: false,
      }
    },
    beforeMount() {
      this.reload();
    },
    methods: {
      async save() {
        this.saving = true;
        try {
          await client.push(this.token, this.name, this.file, btoa(this.content))
        } catch (e) {
          console.error(e)
        } finally {
          this.saving = false;
        }
      },
      async reload() {
        if (this.file === "" || this.file === "/") {
          return
        }
        this.loading = true;
        this.downloaded = false;
        try {
          const binData = await client.pull(this.token, this.name, this.file);
          this.content = atob(binData)
          this.downloaded = true;
        } catch (e) {
          console.error(e);
          this.content = '';
        } finally {
          this.loading = false;
        }
      },
      editorInit(editor) {
        editor.resize();
        editor.renderer.updateFull();
        require('brace/ext/language_tools')
        require('brace/mode/html')
        require('brace/mode/python')
        require('brace/mode/sh')
        require('brace/mode/json')
        require('brace/mode/php')
        require('brace/mode/perl')
        require('brace/mode/javascript')    //language
      }
    },
    computed: {
      language() {
        const ext = this.file.substr(this.file.lastIndexOf('.') + 1);
        return {
          'py': 'python',
          'html': 'html',
          'sh': 'sh',
          'js': 'javascript',
          'json': 'json',
          'php': 'php',
          'pl': 'perl'
        }[ext] || 'text'
      },
      ...mapState([
        'token'
      ]),
    },
    watch: {
      file() {
        this.reload()
      }
    }
  }
</script>

<style scoped>

</style>
