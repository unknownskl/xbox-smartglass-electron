<template>
  <div>
      <p>
        Xbox view: {{ $route.params.address }}
      </p>

      <button href="#" @click="disconnect()" class="btn">
        Disconnect
      </button>
  </div>
</template>

<script>
  export default {
    name: 'xbox',
    methods: {
      disconnect () {
        console.log('Disconnect console!', this.$route.params.address)

        var SGClient = global.SmartglassClient
        var app = this

        SGClient.disconnect(this.$route.params.address, app).then(function (status) {
          console.log(status)

          // this.$root.$emit('Smartglass_Console_Disconnect', { address: this.$route.params.address })
          this.$router.push({ path: '/' })
        }.bind(this)).catch(function (error) {
          console.log(error)
        })
      }
    }
  }
</script>

<style>

</style>
