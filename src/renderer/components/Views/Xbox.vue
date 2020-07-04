<template>
  <div id="XboxView">
      <h1>
        {{ name }}
      </h1>

      <button href="#" @click="disconnect()" class="btn">
        Disconnect
      </button>
      <br /><br />

      <div class="app-actions">

        <div class="app-image" v-if="currentAppImage">
          <img v-bind:src="currentAppImage" />
        </div>

        <div class="app-details">
          <h2>{{ currentAppName }}</h2>

          <button class="play"></button> 
          <button class="pause"></button>
        </div>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'xbox',
    data: function () {
      return {
        currentAppName: '',
        currentAppImage: false
      }
    },
    computed: {
      name: function () {
        var SGClient = global.SmartglassClient.getConnection(this.$route.params.address)

        if (SGClient === undefined) {
          return ''
        }

        return SGClient.name
      }
    },
    methods: {
      disconnect () {
        console.log('Disconnect console!', this.$route.params.address)

        var SGClient = global.SmartglassClient
        var app = this

        SGClient.disconnect(this.$route.params.address, app).then(function (status) {
          console.log(status)

          // this.$root.$emit('Smartglass_Console_Disconnect', { address: this.$route.params.address })
          this.$router.push({ path: '/' })
        }.bind(this)).catch(function (error) {
          console.log(error)
        })
      },
      getCurrentAppName: function () {
        var SGClient = global.SmartglassClient.getConnection(this.$route.params.address)
        if (SGClient === undefined || SGClient.console_status.app_profile === undefined) {
          return 'Not Available'
        }

        console.log('appDetails', SGClient.console_status)
        return SGClient.console_status.app_profile.titles[0].name
      },
      getCurrentAppImage: function () {
        var SGClient = global.SmartglassClient.getConnection(this.$route.params.address)
        if (SGClient === undefined || SGClient.console_status.app_profile === undefined) {
          return false
        }

        console.log('appDetails', SGClient.console_status)
        return SGClient.console_status.app_profile.titles[0].displayImage
      }
    },
    mounted () {
      var sgClient = global.SmartglassClient.getConnection(this.$route.params.address)

      if (sgClient === undefined) {
        this.$router.push({ path: '/' })
      }

      this.currentAppName = this.getCurrentAppName()
      this.currentAppImage = this.getCurrentAppImage()

      this.$forceUpdate()

      // global.XboxApiClient.authenticate().then(function () {
      //   global.XboxApiClient.provider('titlehub').get_title(payload.apps[0].title_id).then(function (data) {
      //     this.consoles[address.address].app_profile = data

      //     this.$forceUpdate()
      //   }.bind(this))
      // }.bind(this)).catch(function (error) {
      //   console.log('error', error)
      //   this.$forceUpdate()
      // }.bind(this))

      this.$root.$on('Smartglass_Console_Status_Details_Ready', function (address, payload) {
        console.log('XboxView got console update', payload)
        this.currentAppName = this.getCurrentAppName()
        this.currentAppImage = this.getCurrentAppImage()
        this.$forceUpdate()
      }.bind(this))
    }
  }
</script>

<style>

  #XboxView {

  }

  #XboxView div.app-actions {
    padding-bottom: 20px;
    clear: both;
  }

  #XboxView div.app-actions div.app-image {
    float: left;
    padding-right: 20px;
  }

  #XboxView div.app-actions div.app-image img {
    width: 200px;
    height: 200px;
  }

  #XboxView div.app-actions button.play {
    border: 0;
    background: transparent;
    box-sizing: border-box;
    width: 0;
    height: 20px;

    border-color: transparent transparent transparent #ffffff;
    transition: 100ms all ease;
    cursor: pointer;
    margin: 5px;

    border-style: solid;
    border-width: 10px 0 10px 20px;
  }

  #XboxView div.app-actions button.pause {
    border: 0;
    background: transparent;
    box-sizing: border-box;
    width: 0;
    height: 20px;

    border-color: transparent transparent transparent #ffffff;
    transition: 100ms all ease;
    cursor: pointer;
    margin: 5px;

    border-style: double;
    border-width: 0px 0 0px 20px;
  }


</style>
