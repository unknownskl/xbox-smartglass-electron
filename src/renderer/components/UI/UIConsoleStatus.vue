<template>
  <div id="UIConsoleStatus">
    ConsoleStatus
  </div>
</template>

<script>
//   import UISidebarConsoleItem from './UISidebarConsoleItem'

export default {
  name: 'UIConsoleStatus',
  // components: { UISidebarConsoleItem },
  data: function () {
    return {
      consoles: [],
      isRefreshing: true
    }
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    }
  }
// mounted () {
//   this.$root.$on('UISidebar_Refresh_Consoles', () => {
//     var SGClient = global.SmartglassClient
//     this.consoles = SGClient.devicesFound

//     this.isRefreshing = false
//   })

//   this.$root.$on('UISidebar_Refresh_Consoles_Refreshing', () => {
//     this.isRefreshing = true
//   })
// }
}
</script>

<style>
 #UIConsoleStatus {
   
 }
</style>
