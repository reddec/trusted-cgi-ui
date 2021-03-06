<template>
  <div>
    <p class="text-h6">From template</p>
    <q-list bordered>
      <q-item>
        <q-item-section>
          <q-item-label header>
            Templates
          </q-item-label>

        </q-item-section>
        <q-item-section side>
          <q-btn icon="refresh" :loading="templatesLoading" @click="reloadTemplates(true)" flat dense round/>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>
            Default
          </q-item-label>
          <q-item-label caption>Bare minimal default template</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn icon="file_copy"
                 flat dense round
                 :loading="creating"
                 @click="create()"/>
        </q-item-section>
      </q-item>
      <q-item v-for="(template, index) in templates" :key="index">
        <q-item-section>
          <q-item-label>
            {{template.name}}
          </q-item-label>
          <q-item-label caption>{{template.description}}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn :icon="template.available ? 'file_copy' : 'warning'"
                 flat dense round
                 :loading="creating"
                 @click="create(template)"
                 :color="template.available?'default':'warning'"
                 :disable="!template.available"/>
        </q-item-section>
      </q-item>
    </q-list>
    <br/>
    <p class="text-h6">From CLI</p>
    <p>
      Using cgi-ctl utility included in the <a target="_blank" href="https://trusted-cgi.reddec.net/cgi-ctl">distribution</a>
    </p>
    <code class="neat-code">cgi-ctl create --url {{baseURL}} &lt;name&gt;</code>
    <br/>
    <p class="text-h6">From GIT repository</p>
    <q-card bordered square flat>
      <q-card-section>
        <q-input v-model="repo" label="Git repository"/>
      </q-card-section>
      <q-card-actions>
        <q-btn @click="createFromGit" flat label="Create from Git" :loading="creating"/>
      </q-card-actions>
    </q-card>
    <br/>
  </div>
</template>

<script>
  import {createNamespacedHelpers} from "vuex";
  import {baseURL, projectAPI} from '../api'

  const userMod = createNamespacedHelpers('user')
  const systemMod = createNamespacedHelpers('system')

  export default {
    name: "NewLambda",
    data() {
      return {
        repo: '',
        creating: false
      }
    },
    beforeMount() {
      this.reload()
    },
    methods: {
      async create(template) {
        this.creating = true;
        try {
          let app;
          if (template) {
            app = await projectAPI.createFromTemplate(this.token, template.name)
          } else {
            app = await projectAPI.create(this.token)
          }
          this.$store.commit('user/updatedApp', app)
          this.$router.push({name: 'app', params: {'name': app.uid}})
        } catch (e) {
          console.error(e)
        } finally {
          this.creating = false
        }
      },
      async createFromGit() {
        this.creating = true;
        try {
          const app = await projectAPI.createFromGit(this.token, this.repo)
          this.$store.commit('user/updatedApp', app)
          this.$router.push({name: 'app', params: {'name': app.uid}})
        } catch (e) {
          console.error(e)
        } finally {
          this.creating = false
        }
      },
      async reload(force = false) {
        this.$store.dispatch('system/templates', force)
      },
      openLambda(name) {
        this.$router.push({name: 'app', params: {name: name}})
      },
      ...systemMod.mapActions({"reloadTemplates": "templates"})
    },
    computed: {
      ...userMod.mapState([
        'token'
      ]),
      ...systemMod.mapState([
        'templatesLoading',
        'templates',
      ]),
      baseURL() {
        return baseURL
      }
    }
  }
</script>

<style scoped>

</style>
