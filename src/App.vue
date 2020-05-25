<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Notify} from 'quasar'

  export default {
    name: 'App',
    computed: {
      ...mapGetters({'loggedIn': 'user/loggedIn'}),
    },
    data() {
      return {
        originalConsole: null
      }
    },
    beforeCreate() {

      let orig = console.error
      this.originalConsole = orig
      let notify = this.$q.notify.bind(this.$q)

      console.error = function () {
        orig.apply(console, arguments)

        let lines = []
        for (let i = 0; i < arguments.length; i++) {
          lines.push(arguments[i])
        }
        //console.log(lines.join("\n"))
        notify({
          message: lines.join("\n"),
          multiLine: true,
          color: "red",
          position: "bottom-right"
        })

      }
    },
    beforeDestroy() {
      if (this.originalConsole) {
        console.error = this.originalConsole
      }
    },
    watch: {
      loggedIn(loggedIn) {
        if (loggedIn) {
          this.$router.push({name: 'dashboard'})
          this.$store.dispatch('user/loadApps')
        } else {
          this.$router.push('/')
        }
      }
    }
  }
</script>
