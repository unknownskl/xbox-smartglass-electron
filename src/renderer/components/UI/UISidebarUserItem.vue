<template>
  <li class="UISidebarUserItem" @click="connect($attrs.friend.Gamertag)">
    <div class="user-image">
      <img v-bind:src="$attrs.friend.PublicGamerpic" class="avatar" />
    </div>
    <div class="user-details">
      <span class="title">{{ $attrs.friend.Gamertag }}</span> <br />
      <small>{{ richStatus }}</small>
    </div>
  </li>
</template>

<script>
  // import FrameTop from './LandingPage/SystemInformation'

  export default {
    name: 'UISidebarUserItem',
    // components: { SystemInformation },
    data: function () {
      return {
        // isConnected: false
      }
    },
    computed: {
      richStatus: function () {
        var status = ''

        if (this.$attrs.friend.lastSeen !== undefined) {
          var lastseen = new Date(this.$attrs.friend.lastSeen.timestamp)
          var now = new Date()

          status = this.$attrs.friend.Presence + ' - Last seen: ' + this.$attrs.friend.lastSeen.titleName + ' on ' + this.$attrs.friend.lastSeen.deviceType

          var diffHours = (((now - lastseen) / 1000) / 60 / 60)
          if (diffHours < 1) {
            var minutes = diffHours * 60
            status += ' - ' + Math.floor(minutes) + ' minutes ago'
          } else if (diffHours > 24) {
            var days = diffHours / 24
            status += ' - ' + Math.floor(days) + ' days ago'
          } else {
            status += ' - ' + Math.floor(diffHours) + ' hours ago'
          }
        } else {
          status = this.$attrs.friend.Presence
        }

        if (this.$attrs.friend.Devices !== undefined) {
          for (var title in this.$attrs.friend.Devices[0].titles) {
            console.log(this.$attrs.friend.Devices[0].titles[title])
            if (this.$attrs.friend.Devices[0].titles[title].placement === 'Full') {
              if (this.$attrs.friend.Devices[0].type === 'WindowsOneCore') {
                status = 'PC - ' + this.$attrs.friend.Devices[0].titles[title].name
              } else {
                status = this.$attrs.friend.Devices[0].type + ' - ' + this.$attrs.friend.Devices[0].titles[title].name
              }

              if (this.$attrs.friend.Devices[0].titles[title].activity !== undefined && this.$attrs.friend.Devices[0].titles[title].activity.richPresence !== undefined) {
                status += ': ' + this.$attrs.friend.Devices[0].titles[title].activity.richPresence
              }
            }
          }
        }

        return status
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      connect (address) {
      }
    }
  }
</script>

<style>
  #UISidebar ul li.UISidebarUserItem {
   padding-top: 10px;
   padding-left: 10px;
   padding-right: 10px;
   padding-bottom: 10px;
   font-size: 14px;
   clear: both;
   min-height: 60px;
 }

 #UISidebar ul li.UISidebarUserItem:hover {
   background-color: #333333;
 }

 li.UISidebarUserItem div.user-image img.avatar {
    width: 40px;
    height: 40px;
 }

 li.UISidebarUserItem div.user-image {
    width: 40px;
    height: 40px;
    float: left;
    padding-right: 10px;
    height: 100%;
 }

 li.UISidebarUserItem div.user-details {
   padding-left: 50px;
   color: #777777;
 }

 li.UISidebarUserItem div.user-details span.title {
   padding-bottom: 5px;
   color: #ffffff;
 }

</style>
