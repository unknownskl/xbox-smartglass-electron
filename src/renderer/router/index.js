import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/xbox/:address',
      name: 'xbox',
      component: require('@/components/Views/Xbox').default
    },
    {
      path: '/auth',
      name: 'auth',
      component: require('@/components/Views/Auth').default
    },
    {
      path: '/myprofile',
      name: 'profile',
      component: require('@/components/Views/Profile').default
    },
    {
      path: '/',
      name: 'home',
      component: require('@/components/Home').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
