import $ from 'jquery'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueDraggable from 'vue-draggable'
import Datatable from 'vue2-datatable-component'
import customLocale from 'vue2-datatable-component/locale/custom'
import SortableTree from 'vue-sortable-tree'
import { store } from './store/store'
import 'bootstrap'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
import App from './App.vue'
import VTooltip from 'v-tooltip'

// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main'

// router setup
import routes from './routes/routes'

window.$ = $
window.jQuery = $

// plugin setup

// Vue.use(LightBootstrap)
Vue.use(BootstrapVue)
Vue.use(VTooltip)
Vue.use(VueRouter)
Vue.use(LightBootstrap)
Vue.use(VueDraggable)
Vue.use(Datatable, {customLocale})
Vue.use(SortableTree.name, SortableTree)
// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
