<template>
  <div>
    <q-form @submit="login()"
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
    >
      <h3>Login</h3>
      <q-input label="User name" v-model="loginName" autocorrect="off"
               autofocus
               autocapitalize="off"
               autocomplete="off"
               spellcheck="false"/>
      <q-input label="Password" v-model="password" type="password" autocorrect="off"
               autocapitalize="off"
               autocomplete="off"
               spellcheck="false"/>
      <br/>
      <q-btn type="submit" :loading="logging">
        enter
      </q-btn>
    </q-form>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from 'vue-property-decorator';

  import {createNamespacedHelpers} from "vuex";

  const {mapState, mapActions} = createNamespacedHelpers('user')

  @Component({
    computed: mapState(['logging']),
  })
  export default class ClassComponent extends Vue {
    loginName: string = "";
    password: string = "";
    oldToken: string | null = sessionStorage.getItem("token");

    async login() {
      const loggedIn: boolean = await this.$store.dispatch('user/login', {
        login: this.loginName, password:
        this.password
      })
    }
  }
</script>
