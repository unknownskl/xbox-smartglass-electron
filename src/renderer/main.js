import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import SmartglassClient from './client'

global.SmartglassClient = SmartglassClient

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

console.log(SmartglassClient)
