<template>
  <div id="UISidebar">
    <ul class="uisidebar-ul">
      <li class="uisidebar-ul-header">Consoles</li>

      <UISidebarConsoleItem
        v-show="!isRefreshing"
        v-for="console in this.consoles"
        :console="console"
        :key="console.address"></UISidebarConsoleItem>

      <li class="uisidebar-ul-item-searching" v-show="isRefreshing">
        <i class="fas fa-sync fa-spin fa-fw"></i> <span>Searching...</span>
      </li>
    </ul>

    <ul class="uisidebar-ul">
      <li class="uisidebar-ul-header">Online Friends</li>

      <li class="uisidebar-item-user">
        <i class="fa fa-profiles"></i> Gamertag
      </li>
    </ul>
  </div>
</template>

<script>
  import UISidebarConsoleItem from './UISidebarConsoleItem'

  export default {
    name: 'UISidebar',
    components: { UISidebarConsoleItem },
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
    },
    mounted () {
      this.$root.$on('UISidebar_Refresh_Consoles', () => {
        var SGClient = global.SmartglassClient
        this.consoles = SGClient.devicesFound

        this.isRefreshing = false
      })

      this.$root.$on('UISidebar_Refresh_Consoles_Refreshing', () => {
        this.isRefreshing = true
      })
    }
  }
</script>

<style>
 #UISidebar {
   
 }

 #UISidebar ul.uisidebar-ul {
   margin-top: 10px;
   list-style: none;
 }

 #UISidebar ul li.uisidebar-ul-header {
   margin-left: 10px;
   margin-right: 10px;
   margin-bottom: 10px;
   font-weight: bold;
   text-transform: uppercase;
   font-size: 12px;
   color: #777777;
 }

 #UISidebar ul li.uisidebar-ul-item-searching {
   padding-top: 10px;
   padding-left: 10px;
   padding-right: 10px;
   padding-bottom: 10px;
   font-size: 14px;
   color: #999999;
 }

 #UISidebar ul li.uisidebar-item-user {
   padding-top: 10px;
   padding-left: 10px;
   padding-right: 10px;
   padding-bottom: 10px;
   font-size: 14px;
 }

 #UISidebar ul li.uisidebar-item-user:hover {
   background-color: #333333;
 }
</style>
