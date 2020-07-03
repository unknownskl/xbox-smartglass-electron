<template>
  <div id="app">
    <div id="appHeader">
      <WindowTop></WindowTop>
      <WindowToolbar></WindowToolbar>
    </div>
    <div id="appSidebar">
      <UISidebar></UISidebar>
    </div>
    <div id="appView">
      <router-view></router-view>
    </div>
    <div id="appFooter">
      <UIConsoleStatus></UIConsoleStatus>
    </div>
  </div>
</template>

<script>
  import WindowTop from './components/Window/WindowTop'
  import WindowToolbar from './components/Window/WindowToolbar'

  import UISidebar from './components/UI/UISidebar'
  import UIConsoleStatus from './components/UI/UIConsoleStatus'

  export default {
    name: 'xbox-smartglass-electron',
    components: {
      WindowTop,
      WindowToolbar,
      UISidebar,
      UIConsoleStatus
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
    bottom: 200px;
    left: 0px;
    width: 300px;
    overflow-y: scroll;
  }

  #appView {
    position: absolute;
    top: 70px;
    bottom: 200px;
    left: 300px;
    right: 0px;
    padding-left: 20px;
    overflow-y: scroll;
  }

  #appFooter {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 200px;
    overflow-y: hidden;
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
      background: #282828; 
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
      background: #555; 
  }

  #appView .btn {
    display: inline-block;
    padding: 3px 8px;
    margin-bottom: 0;
    font-size: 12px;
    line-height: 1.4;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    cursor: default;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.06);
    -webkit-app-region: no-drag;
  }
  #appView .btn:focus {
    outline: none;
    box-shadow: none;
  }

  #appView h1 {
    padding-top: 20px;
    font-weight: normal;
    font-size: 20px;
    padding-bottom: 10px;
  }

  #appView p {
    padding-bottom: 10px;
  }

  #appView textarea {
    background-color: #323232;
    color: #ffffff;
    border: 0px;
    padding: 10px;
  }

  #appView button.btn {
    margin-bottom: 10px;
  }

  #appView input[type=text] {
    background-color: #323232;
    color: #ffffff;
    font-size: 14px;
    border: 0px;
    padding: 10px;
    margin-bottom: 10px;
  }
</style>
