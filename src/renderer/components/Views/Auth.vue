<template>
  <div>
      <h1>
        Authentication
      </h1>

      <input type="text" style="width: 100%" name="url" value="https://login.live.com/oauth20_authorize.srf?client_id=0000000048093EE3&redirect_uri=https%3A%2F%2Flogin.live.com%2Foauth20_desktop.srf&response_type=token&display=touch&scope=service%3A%3Auser.auth.xboxlive.com%3A%3AMBI_SSL&locale=en"/>

      <button href="#" @click="open('https://login.live.com/oauth20_authorize.srf?client_id=0000000048093EE3&redirect_uri=https%3A%2F%2Flogin.live.com%2Foauth20_desktop.srf&response_type=token&display=touch&scope=service%3A%3Auser.auth.xboxlive.com%3A%3AMBI_SSL&locale=en')" class="btn">
        Open in external browser
      </button>

      <p>
        Open the above url in your browser and login with your account. After loggin in you will get an empty page. Copy the new url from the browser and paste it in the box below and click the button to authenticate.
      </p>

      <textarea v-model="responseUrl" style="width: 100%" rows="3"></textarea> <br />

      <button href="#" @click="authenticate()" class="btn">
        Authenticate
      </button>
  </div>
</template>

<script>
  import querystring from 'querystring'
  import TokenStore from 'xbox-webapi/src/tokenstore'
  import XboxApiClient from 'xbox-webapi'

  export default {
    name: 'auth',
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      authenticate () {
        console.log('authenticate User url callback!', this.responseUrl)

        var formatQuerystring = this.responseUrl.split('#')
        var results = querystring.parse(formatQuerystring[1])

        // console.log(results.access_token, results.refresh_token)
        var tokenStore = TokenStore()
        console.log(tokenStore)
        tokenStore.set('access_token', results.access_token)
        tokenStore.set('refresh_token', results.refresh_token)
        tokenStore.delete('user_token')
        tokenStore.delete('xsts_token')
        tokenStore.save()
        console.log('token_store saved', tokenStore)

        global.XboxApiClient = XboxApiClient(tokenStore)
        console.log('Attempting to login...')

        // Check auth
        global.XboxApiClient.authenticate().then(function (UserInfo) {
          console.log('Logged in as:', UserInfo)

          tokenStore.save()
        }).catch(function (error) {
          console.log('Authentication failed:', error)
        })
      }
    }
  }
</script>

<style>

</style>
