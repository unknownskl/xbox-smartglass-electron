import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import SmartglassClient from './client'
import XboxApiClient from 'xbox-webapi'
import TokenStore from 'xbox-webapi/src/tokenstore'

global.SmartglassClient = SmartglassClient
var appTokenStore = TokenStore()
global.XboxApiClient = XboxApiClient(appTokenStore)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
var SmartGlassApp = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
})

SmartGlassApp.$mount('#app')
