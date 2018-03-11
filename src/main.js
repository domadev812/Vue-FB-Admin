import Vue from 'vue'
import lodash from 'lodash'
import store from './store'
import App from './App'
import swal from 'sweetalert2'
import router from './router'
import momentjs from 'moment'
import VeeValidate from 'vee-validate'
import jQuery from 'jquery'
import validate from './config/validate'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import VueMoment from 'vue-moment'
import './assets/files'

const EventBus = new Vue()
let auth = false

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: () => {
      return EventBus
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title(to) + '\xa0 - \xa0' + store.getters.getAppName
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth) {
      next({
        path: '/signin',
        query: {redirect: to.fullPath}
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
window.jQuery = jQuery
Vue.use(VeeValidate, validate)
Vue.use(VueMoment)
Vue.config.productionTip = false
Vue.prototype.$lodash = lodash
Vue.prototype.$momentjs = momentjs
Vue.prototype.$swal = swal
Vue.component('ClipLoader', ClipLoader)
if (store.getters.getIsLoggedIn) {
  auth = true
} else {
  auth = false
}
Vue.prototype.$jQuery = jQuery
Vue.filter('fullUserName', (value) => {
  return value.firstname + ' ' + value.lastname
})
Vue.filter('toNumber', (value) => {
  return lodash.toNumber(value)
})
/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
global.vm = vm
/* TODO
  1. Fix datatables +
  2. Make good pagination +
  3. Make universal modal and alert
  4. Optimize memory
  DeadLine: 1 Nov
 */
