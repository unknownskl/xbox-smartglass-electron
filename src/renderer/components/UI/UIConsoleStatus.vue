<template>
  <div id="UIConsoleStatus">
    <ul class="tab-list">
      <li v-for="(console, index) in this.consoles" v-bind:key="index">
        <a href="#">{{ getConnectionName(index) }}</a>
      </li>
    </ul>

    <div class="tab-content" v-for="(console, index) in this.consoles" v-bind:key="index">

      <div class="app-details" v-if="!console.app_profile">
        <div class="app-text">
          <p>
            Application: {{ console.apps[0].aum_id }} 
            <small>(Login to get more app details)</small>
          </p>
        </div>
      </div>

      <div class="app-details" v-if="console.app_profile">
        <div class="app-image">
          <img v-bind:src="console.app_profile.titles[0].displayImage" style="background: #222222;" />
        </div>

        <div class="app-text">
          <h2>{{ console.app_profile.titles[0].name }}<br /></h2>
          Publisher: {{ console.app_profile.titles[0].detail.publisherName }}<br />
          Developer: {{ console.app_profile.titles[0].detail.developerName }}<br />
          Type: {{ console.app_profile.titles[0].type }}<br />
        </div>
      </div>
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
    },
    getConnectionName (address) {
      var sgClient = global.SmartglassClient.getConnection(address)
      return sgClient.name
    }
  },
  mounted () {
    this.$root.$on('Smartglass_Console_Status', (address, payload) => {
      console.log('Smartglass_Console_Status event@2', address.address, payload)
      this.consoles[address.address] = payload

      global.XboxApiClient.authenticate().then(function () {
        global.XboxApiClient.provider('titlehub').get_title(payload.apps[0].title_id).then(function (data) {
          this.consoles[address.address].app_profile = data
          console.log('this.consoles[address.address].app_profile', this.consoles[address.address].app_profile)
          this.$root.$emit('Smartglass_Console_Status_Details_Ready', address, this.consoles[address.address].app_profile)
          this.$forceUpdate()
        }.bind(this))
      }.bind(this)).catch(function (error) {
        console.log('error', error)
        this.$forceUpdate()
      }.bind(this))
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

 #UIConsoleStatus ul.tab-list {
   list-style: none;
   max-height: 40px;
   padding-left: 15px;
 }

 #UIConsoleStatus ul.tab-list li a {
   display: inline-block;
   height: 38px;
   border-bottom: 2px solid #107c10;
   text-decoration: none;
   color: #ffffff;
   padding-top: 10px;
   padding-left: 5px;
   padding-right: 5px;
   margin-left: 5px;
   margin-right: 5px;
   font-size: 13px;
 }

 #UIConsoleStatus .app-image {
   float: left;
   max-width: 300px;
   padding-top: 15px;
   padding-left: 15px;
   padding-right: 15px;
 }

 #UIConsoleStatus .app-image img {
   width: 130px;
   height: 130px;
 }

 #UIConsoleStatus .app-text {
   padding-top: 15px;
   padding-left: 15px;
   padding-right: 15px;
 }

 #UIConsoleStatus .app-text h2 {
   padding-bottom: 15px;
 }
</style>
