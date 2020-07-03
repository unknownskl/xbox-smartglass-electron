<template>
  <div id="WindowToolbar">

    <div class="actions">
      <a @click="refresh()" class="btn">
        <i class="fa fa-sync-alt"></i>
      </a>
    </div>

    <div class="profileInfo">
      <a @click="openAuthentication()" v-if="!isAuthenticated" class="btn">
        <span>Login</span> 
        <i class="fa fa-users"></i>
        <!-- <img class="avatar" src="https://images-eds-ssl.xboxlive.com/image?url=wHwbXKif8cus8csoZ03RW3apWESZjav65Yncai8aRmVbSlZ3zqRpg1sdxEje_JmFa22Nx4lq4eRvT2l.tSjwvnNyAJtubOw2ZQJwnjNptIy4M18xZQdwDKLtgQMt6SrdLNJYhz8lcDdzUtD4VWZEBK6K2QwWRlMdO.hBkC6XkA0-&format=png&h=100&w=100" /> -->
      </a>

      <a @click="openProfile()" v-if="isAuthenticated" class="btn">
        <span>{{ userData.gtg }}</span>
        <img class="avatar" src="https://images-eds-ssl.xboxlive.com/image?url=wHwbXKif8cus8csoZ03RW3apWESZjav65Yncai8aRmVbSlZ3zqRpg1sdxEje_JmFa22Nx4lq4eRvT2l.tSjwvnNyAJtubOw2ZQJwnjNptIy4M18xZQdwDKLtgQMt6SrdLNJYhz8lcDdzUtD4VWZEBK6K2QwWRlMdO.hBkC6XkA0-&format=png&h=100&w=100" />
      </a>
    </div>

  </div>
</template>

<script>
  // import FrameTop from './LandingPage/SystemInformation'

  export default {
    name: 'WindowToolbar',
    // components: { SystemInformation },
    data: function () {
      return {
        isAuthenticated: false,
        userData: false
      }
    },
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
      openAuthentication () {
        this.$router.push({ path: '/auth' })
      },
      openProfile () {
        this.$router.push({ path: '/myprofile' })
      }
    },
    mounted () {
      this.refresh()

      global.XboxApiClient.authenticate().then(function (userdata) {
        this.isAuthenticated = true
        this.userData = userdata
        console.log(userdata)
      }.bind(this)).catch(function (error) {
        this.isAuthenticated = false
        console.log(error)
      }.bind(this))
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

 #WindowToolbar div.profileInfo span {
   font-size: 15px;
 }

  #WindowToolbar div.profileInfo img.avatar {
   height: 40px;
   width: 40px;
   float: right;
   margin-top: -5px;
   border-radius: 20px;
 }

</style>
