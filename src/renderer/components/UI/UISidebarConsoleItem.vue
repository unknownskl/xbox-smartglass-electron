<template>
  <li class="UISidebarConsoleItem" @click="connect($attrs.console.address)">
    <i class="fab fa-xbox"></i> {{ $attrs.console.name }}<br />
    {{ $attrs.console.address }}
  </li>
</template>

<script>
  // import FrameTop from './LandingPage/SystemInformation'

  export default {
    name: 'UISidebarConsoleItem',
    // components: { SystemInformation },
    data: function () {
      return {
        // isConnected: false
      }
    },
    // computed: {
    //   isConnected: function () {
    //     var SGClient = global.SmartglassClient

    //     console.log(SGClient.clients)

    //     if (SGClient.clients[ this.$attrs.console.address ] !== undefined) {
    //       return true
    //     } else {
    //       return false
    //     }
    //   }
    // },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      connect (address) {
        console.log('Connect to ', address)

        var SGClient = global.SmartglassClient
        var app = this

        SGClient.connect(address, app).then(function (sgInstance) {
          // console.log(consoles)
          // this.isConnected = true
          this.$root.$emit('Smartglass_Connect_Console_Successful', { address: address })

          // this.$router.push({ path: '/' })
          this.$router.push({ path: '/xbox/' + address })
        }.bind(this)).catch(function (error) {
          console.log(error)
          this.$root.$emit('Smartglass_Connect_Console_Error', { address: address, error: error })
        })

        this.$root.$emit('Smartglass_Connect_Console', { address: address })
      }
      // mounted () {
      //   this.$root.$on('Smartglass_Console_Disconnect', (address) => {
      //     console.log('Smartglass_Console_Disconnect @@@@@@@@@@@@@', address)
      //     this.isConnected = false
      //     this.$root.$emit('UISidebar_Refresh_Consoles')
      //     this.$forceUpdate()
      //   })
      // }
    }
  }
</script>

<style>
  #UISidebar ul li.UISidebarConsoleItem {
   padding-top: 10px;
   padding-left: 10px;
   padding-right: 10px;
   padding-bottom: 10px;
   font-size: 14px;
 }

 #UISidebar ul li.UISidebarConsoleItem:hover {
   background-color: #333333;
 }
</style>
