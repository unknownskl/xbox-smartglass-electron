<template>
  <div id="app">
    <div id="appHeader">
      <WindowTop></WindowTop>
      <WindowToolbar></WindowToolbar>
    </div>
    <div id="appSidebar">
      <UISidebar @refreshConsoleList="refreshConsoles()"></UISidebar>
    </div>
    <div id="appView">
      <router-view></router-view>
    </div>
    <div id="appFooter">
      Footer
    </div>
  </div>
</template>

<script>
  import WindowTop from './components/Window/WindowTop'
  import WindowToolbar from './components/Window/WindowToolbar'

  import UISidebar from './components/UI/UISidebar'

  export default {
    name: 'xbox-smartglass-electron',
    components: {
      WindowTop,
      WindowToolbar,
      UISidebar
    }
  }
</script>

<style>
  @import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';

  body {
    background: #222222;
    -webkit-user-select: none;
    color: #ffffff;
  }

  * {
    font-family: "Segoe UI", SegoeUI, "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 400px;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  #appHeader {
    position: absolute;
    top: 0px;
    height: 70px;
    left: 0px;
    right: 0px;
  }

  #appSidebar {
    position: absolute;
    top: 70px;
    bottom: 0px;
    left: 0px;
    width: 300px;
    overflow-y: scroll;
  }

  #appView {
    position: absolute;
    top: 70px;
    bottom: 0px;
    left: 300px;
    right: 0px;
    overflow-y: scroll;
  }

  #appFooter {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
  }

  /* width */
  ::-webkit-scrollbar {
      width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
      background: #222; 
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
      background: #444; 
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
      background: #555; 
  }
</style>
