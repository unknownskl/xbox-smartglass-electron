<template>
  <div id="WindowToolbar">

    <div class="actions">
      <a @click="refresh()" class="btn">
        <i class="fa fa-sync-alt"></i>
      </a>
    </div>

    <div class="profileInfo">
      <a @click="openProfileMenu()" class="btn">
        <i class="fa fa-users"></i>
      </a>
    </div>

  </div>
</template>

<script>
  // import FrameTop from './LandingPage/SystemInformation'

  export default {
    name: 'WindowToolbar',
    // components: { SystemInformation },
    methods: {
      refresh () {
        this.$root.$emit('UISidebar_Refresh_Consoles_Refreshing')

        var SGClient = global.SmartglassClient

        SGClient.discovery().then(function (consoles) {
          // console.log(consoles)
          this.$root.$emit('UISidebar_Refresh_Consoles')
        }.bind(this)).catch(function (error) {
          console.log(error)
        })
      },
      openProfileMenu () {
        console.log('Open user menu')
      }
    },
    mounted () {
      this.refresh()
    }
  }
</script>

<style>
 #WindowToolbar {
   background: #107c10;
   position: absolute;
   top: 20px;
   left: 0px;
   right: 0px;
   height: 50px;
   -webkit-app-region: drag;
   z-index: 100;
   padding-top: 5px;
   padding-left: 18px;
   padding-right: 18px;
 }

 #WindowToolbar .btn {
   background: #107c10;
   padding: 10px;
   font-size: 20px;
   border: 0px;
   outline: none;
   -webkit-app-region: no-drag;
 }

 #WindowToolbar a.btn:hover i {
   color: #dddddd;
 }

 #WindowToolbar div.actions {
   float: left;
 }

 #WindowToolbar div.profileInfo {
   float: right;
 }

</style>
