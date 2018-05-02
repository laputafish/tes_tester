import $ from 'jquery'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueFire from 'vuefire'
// import firebase from 'firebase'
import VueDraggable from 'vue-draggable'
import Datatable from 'vue2-datatable-component'
import customLocale from 'vue2-datatable-component/locale/custom'
import SortableTree from 'vue-sortable-tree'
import { store } from './store/store'
import 'bootstrap'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
import App from './App.vue'
import VTooltip from 'v-tooltip'
// import VuePusher from 'vue-pusher'

// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main'

// router setup
import routes from './routes/routes'
import * as VueGoogleMaps from 'vue2-google-maps'
import {API_KEY} from './components/Dashboard/Views/Maps/API_KEY'

window.$ = $
window.jQuery = $

// Firebase
// let firebaseApp = firebase.initializeApp({
//   apiKey: 'AIzaSyB1Wo22RZQa2znkct9izAfGphbfROZ1WoE',
//   authDomain: 'testester-39ed4.firebaseapp.com',
//   databaseURL: 'https://testester-39ed4.firebaseio.com',
//   projectId: 'testester-39ed4',
//   storageBucket: '',
//   messagingSenderId: '625932982944'
// })
// let db = firebaseApp.database()

// plugin setup
Vue.use(BootstrapVue)
Vue.use(VueFire)
Vue.use(VTooltip)
Vue.use(VueRouter)
Vue.use(LightBootstrap)
Vue.use(VueDraggable)
Vue.use(Datatable, {customLocale})
Vue.use(SortableTree.name, SortableTree)
Vue.use(VueGoogleMaps, {
  load: {
    key: API_KEY,
    libraries: ['places']
  }
})
// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  // firebase: {
  //   users: db.ref('users')
  // },
  store,
  router
})
