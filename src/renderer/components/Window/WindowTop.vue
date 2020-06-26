<template>
  <div id="WindowTop">
    <span>Xbox One Smartglass</span>
  </div>
</template>

<script>
  // import FrameTop from './LandingPage/SystemInformation'

  export default {
    name: 'WindowTop',
    // components: { SystemInformation },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>
 #WindowTop {
  background: #107c10;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  height: 22px;
  -webkit-app-region: drag;
  z-index: 100;
  text-align: center;
 }

 #WindowTop span {
   color: #222222;
   font-size: 14px;
 }
</style>
