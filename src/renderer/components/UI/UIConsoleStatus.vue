<template>
  <div id="UIConsoleStatus">
    <ul class="tab-list">
      <li v-for="(console, index) in this.consoles" v-bind:key="index">
        {{ index }}
      </li>
    </ul>

    <div class="tab-content" v-for="(console, index) in this.consoles" v-bind:key="index">
      {{ JSON.stringify(console) }}<br />
      Application: {{ console.apps[0].aum_id }}
    </div>

  </div>
</template>

<script>
//   import UISidebarConsoleItem from './UISidebarConsoleItem'

export default {
  name: 'UIConsoleStatus',
  // components: { UISidebarConsoleItem },
  data: function () {
    return {
      consoles: {}
    }
  },
  computed: {
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    }
  },
  mounted () {
    this.$root.$on('Smartglass_Console_Status', (address, payload) => {
      console.log('Smartglass_Console_Status event@2', address.address, payload)
      this.consoles[address.address] = payload
      console.log('this.consoles', this.consoles)
      this.$forceUpdate()
    })

    this.$root.$on('Smartglass_Console_Disconnect', (address) => {
      console.log('Smartglass_Console_Disconnect event@2', address)
      delete this.consoles[address.address]
      console.log('this.consoles', this.consoles)
      this.$forceUpdate()
    })
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
   background-color: #111111;
   position: absolute;
   bottom: 0px;
   left: 0px;
   right: 0px;
   height: 200px;
 }
</style>
