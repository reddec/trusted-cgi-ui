<template>
  <q-card flat bordered square>
    <q-card-section>
      <div class="text-h6">Hello, {{login}}!</div>
    </q-card-section>
    <q-card-section>
      <q-form
              @submit="changePassword()"
              autocorrect="off"
              autocapitalize="off"
              autocomplete="off"
              spellcheck="false">
        <q-input type="password" v-model="password" label="New password"/>
      </q-form>
    </q-card-section>
    <q-card-actions>
      <q-btn label="change password" @click="changePassword()" :loading="changingPassword" icon="vpn_key" flat/>
    </q-card-actions>
  </q-card>
</template>

<script>

  import Vue from 'vue';
  import {createNamespacedHelpers} from "vuex";
  import client from '../../api'

  const userMod = createNamespacedHelpers('user')
  const systemMod = createNamespacedHelpers('system')

  export default {
    name: "UserSettings",
    data() {
      return {
        password: '',
        changingPassword: false,
      }
    },
    beforeMount() {
    },
    methods: {
      async changePassword() {
        this.changingPassword = true;
        try {
          await client.changePassword(this.token, this.password)
          this.password = ''
        } catch (e) {
          console.error(e)
          this.setSettings()
        } finally {
          this.changingPassword = false
        }
      }
    },
    computed: {
      ...userMod.mapState([
        'token',
      ]),
      login() {
        try {
          const payload = JSON.parse(atob(this.token.split('.')[1]))
          return payload.user
        } catch (e) {
          console.error(e)
          return 'User'
        }
      }
    }
  }
</script>

<style scoped>

</style>
