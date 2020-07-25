<template>
  <q-card flat>
    <q-checkbox :value="local.public" @input="update('public', $event)" label="Public access without tokens"/>
    <br/>
    <map-editor :def-key="uuid4"
                :value="local.tokens"
                :disabled="local.public"
                @input="update('tokens', $event)"
                title="Access tokens"
                key-label="Token"
                value-label="Label"/>

    <br/>
    <list-editor
      :value="local.allowed_ip"
      @input="update('allowed_ip', $event)"
      title="Allowed IP"
      label="IP address"
      empty="(currently no restrictions)"
    />

    <br/>
    <list-editor
      :value="local.allowed_origin"
      @input="update('allowed_origin',$event)"
      title="Allowed origins"
      label="Origin"
      empty="(currently no restrictions)"
      />
  </q-card>
</template>

<script>
  import MapEditor from "../MapEditor";
  import ListEditor from "../ListEditor";

  export default {
    name: "PolicyEditor",
    components: {ListEditor, MapEditor},
    props: ['value'],
    data() {
      return {
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
    methods: {
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
      },
      cloneValue() {
        this.clone = JSON.parse(JSON.stringify(this.value || {tokens: {}, public: false, allowedIP: [], origins: []}))
      },
      removeItem(field) {
        return (idx) => this.$emit('input', [...this.local[field].slice(0, idx), ...this.local[field].slice(idx + 1)])
      },
      addItem(field, defValue) {
        return () => this.$emit('input', [...this.local[field], defValue])
      },
      update(field, value) {
        let cp = Object.assign(
          {},

          this.local
        )
        this.$set(cp, field, value)
        console.log(field, "=", value, '=>', cp)

        this.$emit('input', cp)
      }
    },
    computed: {
      allowedIP() {
        return (this.clone.allowed_ip || [])
      },
      origins() {
        return (this.clone.allowed_origin || [])
      },
      local() {
        return (this.value || {})
      },
      uuid4() {
        return uuidv4
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
