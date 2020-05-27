<template>
  <div>
    <q-card flat>
      <q-checkbox v-model="clone.public" label="Public access without tokens"/>
      <br/>
      <q-list dense v-if="!clone.public" bordered>
        <q-item-label header>Access tokens</q-item-label>
        <q-item v-for="[token, label] in tokens" :key="token">
          <q-item-section>
            <q-item-label>
              <code>{{token}}</code>
            </q-item-label>
            <q-item-label caption>{{label}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn icon="delete" @click="()=>$delete(clone.tokens,token)" flat dense round/>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="openTokenDialog">
          <q-item-section avatar>
            <q-icon name="add"/>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">new token</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <br/>

      <q-list bordered>
        <q-item-label header>Allowed IP <span v-if="allowedIP.length === 0">(currently no restrictions)</span>
        </q-item-label>
        <q-item v-for="(ip, index) in allowedIP" :key="ip">
          <q-item-section>
            <q-item-label>
              <code>{{ip}}</code>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn icon="delete" @click="()=> clone.allowed_ip.splice(index, 1)" flat dense round/>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="newIP.dialog = true">
          <q-item-section avatar>
            <q-icon name="add"/>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">new IP</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <br/>
      <q-list bordered>
        <q-item-label header>Allowed origins <span v-if="origins.length === 0">(currently no restrictions)</span>
        </q-item-label>
        <q-item v-for="(origin, index) in origins" :key="origin">
          <q-item-section>
            <q-item-label>
              <code>{{origin}}</code>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn icon="delete" @click="()=> clone.allowed_origin.splice(index, 1)" flat dense round/>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="newOrigin.dialog = true">
          <q-item-section avatar>
            <q-icon name="add"/>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">new origin</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-card-actions align="right">
        <q-btn flat color="primary" icon="save" :loading="saving" @click="save()">Save</q-btn>
      </q-card-actions>
    </q-card>


    <q-dialog v-model="newToken.dialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Label</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="newToken.label" label="Label" autofocus/>
          <br/>
          <q-input dense v-model="newToken.token" label="Token"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Add" v-close-popup @click="addToken()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="newIP.dialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">IP address</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="newIP.ip" autofocus/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Add" v-close-popup @click="addIP"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="newOrigin.dialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Origin</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="newOrigin.origin" autofocus/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Add" v-close-popup @click="addOrigin"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import client from '../../api'

  import {createNamespacedHelpers} from "vuex";

  const {mapState, mapActions, mapGetters} = createNamespacedHelpers('user')


  export default {
    name: "Security",
    data() {
      return {
        saving: false,
        clone: {},
        newToken: {
          dialog: false,
          label: '',
          token: '',
        },
        newIP: {
          dialog: false,
          ip: ''
        },
        newOrigin: {
          dialog: false,
          origin: ''
        }
      }
    },
    beforeMount() {
      this.updateFields()
    },
    methods: {
      async save() {
        this.saving = true;
        let cp = Object.assign({}, this.selectedApp?.manifest, this.clone)
        try {
          let app = await client.update(this.token, this.selectedApp?.uid, cp);
          this.$store.commit('user/updatedApp', app);
          this.$store.commit('user/selectedApp', app);
        } catch (e) {
          this.console.error(e)
        } finally {
          this.saving = false
        }
      },
      openTokenDialog() {
        this.newToken.label = '';
        this.newToken.token = uuidv4()
        this.newToken.dialog = true;
      },
      addToken() {
        if (this.clone.tokens) {
          this.$set(this.clone.tokens, this.newToken.token || uuidv4(), this.newToken.label)
        } else {
          this.$set(this.clone, 'tokens', {
            [uuidv4()]: this.newToken.label,
          })
        }
        this.newToken.label = '';
      },
      addOrigin() {
        if (!this.clone.allowed_origin) {
          this.$set(this.clone, 'allowed_origin', [])
        }
        this.clone.allowed_origin.push(this.newOrigin.origin)
        this.newOrigin.origin = '';
      },
      addIP() {
        if (!this.clone.allowed_ip) {
          this.$set(this.clone, 'allowed_ip', [])
        }
        this.clone.allowed_ip.push(this.newIP.ip)
        this.newIP.ip = '';
      },
      updateFields() {
        this.$set(this, 'clone', JSON.parse(JSON.stringify(this.selectedApp?.manifest)))
      }
    },
    watch: {
      selectedApp() {
        this.updateFields()
      }
    },
    computed: {
      ...mapState([
        'selectedApp',
        'token'
      ]),
      tokens() {
        return Object.entries(this.clone.tokens || {})
      },
      allowedIP() {
        return (this.clone.allowed_ip || [])
      },
      origins() {
        return (this.clone.allowed_origin || [])
      }
    }
  }

  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
</script>

<style scoped>

</style>
