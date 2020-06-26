<template>
  <li class="UISidebarConsoleItem">
    <i class="fab fa-xbox"></i> {{ $attrs.console.name }}<br />
    {{ $attrs.console.address }}
  </li>
</template>

<script>
  // import FrameTop from './LandingPage/SystemInformation'

  export default {
    name: 'UISidebarConsoleItem',
    // components: { SystemInformation },
    props: [ 'name', 'address' ],
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
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
