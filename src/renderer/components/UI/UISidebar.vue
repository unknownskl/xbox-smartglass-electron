<template>
  <div id="UISidebar">
    <ul class="uisidebar-ul">
      <li class="uisidebar-ul-header">Consoles</li>

      <li class="uisidebar-ul-item-searching" v-if="isRefreshing">
        <i class="fas fa-sync fa-spin fa-fw"></i> <span>Searching...</span>
      </li>

      <UISidebarConsoleItem
        v-for="console in this.consoles"
        :console="console"
        :key="console.address"></UISidebarConsoleItem>

      <li class="uisidebar-ul-item-searching" v-if="(consolesFound == 0)">
        <i class="fas fa-sync fa-spin fa-fw"></i> <span>No consoles found on network</span>
      </li>
    </ul>

    <ul class="uisidebar-ul" v-if="friendsLoaded">
      <li class="uisidebar-ul-header">Online Friends</li>

      <UISidebarUserItem
        v-for="friend in this.onlineFriends"
        :friend="friend"
        :key="friend.Gamertag"></UISidebarUserItem>
    </ul>

    <ul class="uisidebar-ul" v-if="friendsLoaded">
      <li class="uisidebar-ul-header">Offline Friends</li>

      <UISidebarUserItem
        v-for="friend in this.offlineFriends"
        :friend="friend"
        :key="friend.Gamertag"></UISidebarUserItem>
    </ul>
  </div>
</template>

<script>
  import UISidebarConsoleItem from './UISidebarConsoleItem'
  import UISidebarUserItem from './UISidebarUserItem'

  export default {
    name: 'UISidebar',
    components: { UISidebarConsoleItem, UISidebarUserItem },
    data: function () {
      return {
        consoles: [],
        isRefreshing: true,
        consolesFound: -1,

        allFriends: {},
        onlineFriends: [],
        offlineFriends: [],
        friendsLoaded: false
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      updateFriendStatus () {
        global.XboxApiClient.authenticate().then(function () {
          // Authenticated
          global.XboxApiClient.provider('profile').get_friends_by_xuid(global.XboxApiClient.auth_manager.xsts_token.DisplayClaims.xui[0].xid).then(function (friends) {
            console.log('friends', friends)

            this.allFriends = {}

            for (let friend in friends.profileUsers) {
              this.allFriends[friends.profileUsers[friend].id] = {}

              for (let setting in friends.profileUsers[friend].settings) {
                this.allFriends[friends.profileUsers[friend].id][friends.profileUsers[friend].settings[setting].id] = friends.profileUsers[friend].settings[setting].value
              }
            }

            // Load presence...

            var xuidList = []
            for (let xuid in this.allFriends) {
              xuidList.push(xuid)
            }

            global.XboxApiClient.provider('userpresence').get_presence_batch(xuidList).then(function (data) {
              console.log('presence: ', data)

              for (let entry in data) {
                if (this.allFriends[data[entry].xuid] !== undefined) {
                  this.allFriends[data[entry].xuid].Presence = data[entry].state
                  this.allFriends[data[entry].xuid].lastSeen = data[entry].lastSeen
                  this.allFriends[data[entry].xuid].Devices = data[entry].devices

                  if (this.allFriends[data[entry].xuid].Presence === 'Online') {
                    this.onlineFriends.push(this.allFriends[data[entry].xuid])
                  } else {
                    this.offlineFriends.push(this.allFriends[data[entry].xuid])
                  }
                }
              }

              this.friendsLoaded = true
              this.$forceUpdate()
              console.log('All loaded', this.onlineFriends)
            }.bind(this))
          }.bind(this))
        }.bind(this)).catch(function (error) {
          // Not authenticated
          console.log('error', error)
        })
      }
    },
    mounted () {
      this.$root.$on('UISidebar_Refresh_Consoles', () => {
        var SGClient = global.SmartglassClient
        this.consoles = SGClient.devicesFound

        this.consolesFound = this.consoles.length
        this.isRefreshing = false
      })

      this.$root.$on('UISidebar_Refresh_Consoles_Refreshing', () => {
        this.isRefreshing = true
      })

      this.updateFriendStatus()
    }
  }
</script>

<style>
 #UISidebar {
   
 }

 #UISidebar ul.uisidebar-ul {
   margin-top: 10px;
   list-style: none;
   padding-bottom: 10px;
 }

 #UISidebar ul li.uisidebar-ul-header {
   margin-left: 10px;
   margin-right: 10px;
   margin-bottom: 10px;
   font-weight: bold;
   text-transform: uppercase;
   font-size: 12px;
   color: #777777;
   clear: both;
 }

 #UISidebar ul li.uisidebar-ul-item-searching {
   padding-top: 10px;
   padding-left: 10px;
   padding-right: 10px;
   padding-bottom: 10px;
   font-size: 14px;
   color: #999999;
 }

 /* #UISidebar ul li.UISidebarUserItem {
   padding-top: 10px;
   padding-left: 10px;
   padding-right: 10px;
   padding-bottom: 10px;
   font-size: 14px;
   min-height: 60px;
 }

 #UISidebar ul li.uisidebar-item-user:hover {
   background-color: #333333;
 } */
</style>
