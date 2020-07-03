<template>
  <div>
      <h1>
        User profile!
      </h1>

      
  </div>
</template>

<script>
  export default {
    name: 'profile',
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>

</style>
