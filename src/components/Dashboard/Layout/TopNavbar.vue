<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Dashboard</a>
      <button type="button"
              class="navbar-toggler navbar-toggler-right"
              :class="{toggled: $sidebar.showSidebar}"
              aria-controls="navigation-index"
              aria-expanded="false"
              aria-label="Toggle navigation"
              @click="toggleSidebar">
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end">

        <ul class="nav navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link" href="#" data-toggle="dropdown">
              <i class="nc-icon nc-palette"></i>
            </a>
          </li>
          <drop-down tag="li">
            <template slot="title">
              <i class="nc-icon nc-planet"></i>
              <b class="caret"></b>
              <span class="notification">5</span>
            </template>
            <a class="dropdown-item" href="#">Notification 1</a>
            <a class="dropdown-item" href="#">Notification 2</a>
            <a class="dropdown-item" href="#">Notification 3</a>
            <a class="dropdown-item" href="#">Notification 4</a>
            <a class="dropdown-item" href="#">Another notification</a>
          </drop-down>
          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="nc-icon nc-zoom-split"></i>
              <span class="d-lg-block">&nbsp;Search</span>
            </a>
          </li>
        </ul>

        <ul class="navbar-nav ml-auto">
          <nav-item-toggle
            :options="serverModes"
            :activeOption="serverMode"
            @input="setServerMode"></nav-item-toggle>

          <!-- Account -->
          <li class="nav-item">
            <a class="nav-link" href="#">
              Account
            </a>
          </li>

          <li class="nav-item yoov-dropdown">
            <div class="dropdown">
              <button type="button" class="no-border dropdown-toggle" data-toggle="dropdown">
                Dropdown
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="#">Link 1</a>
                <a class="dropdown-item" href="#">Link 2</a>
                <a class="dropdown-item" href="#">Link 3</a>
              </div>
            </div>
          </li>

          <!--<li data-v-3999dbc3="" aria-haspopup="true" class="dropdown nav-item" aria-expanded="true">-->
            <!--<a data-v-3999dbc3="" data-toggle="dropdown" class="nav-link dropdown-toggle" aria-expanded="false">-->
              <!--<i data-v-3999dbc3=""></i>-->
              <!--<span data-v-3999dbc3="" class="no-icon">Dropdown</span>-->
              <!--<b data-v-3999dbc3="" class="caret"></b>-->
            <!--</a>-->
            <!--<div data-v-3999dbc3="" class="dropdown-menu" style=""><a data-v-3999dbc3="" href="#" class="dropdown-item">Action</a>-->
              <!--<a data-v-3999dbc3="" href="#" class="dropdown-item">Another action</a> <a data-v-3999dbc3="" href="#"-->
                                                                                         <!--class="dropdown-item">Something</a>-->
              <!--<a data-v-3999dbc3="" href="#" class="dropdown-item">Another action</a> <a data-v-3999dbc3="" href="#"-->
                                                                                         <!--class="dropdown-item">Something</a>-->
              <!--<div data-v-3999dbc3="" class="divider"></div>-->
              <!--<a data-v-3999dbc3="" href="#" class="dropdown-item">Separated link</a></div>-->
          <!--</li>-->

          <!--<drop-down title="Dropdown">-->
            <!--<a class="dropdown-item" href="#">Action</a>-->
            <!--<a class="dropdown-item" href="#">Another action</a>-->
            <!--<a class="dropdown-item" href="#">Something</a>-->
            <!--<a class="dropdown-item" href="#">Another action</a>-->
            <!--<a class="dropdown-item" href="#">Something</a>-->
            <!--<div class="divider"></div>-->
            <!--<a class="dropdown-item" href="#">Separated link</a>-->
          <!--</drop-down>-->

          <li class="nav-item">
            <a href="#" class="nav-link">
              Log out
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
  import NavItemToggle from '../../UIComponents/NavItems/NavItemToggle'

  export default {
    components: {
      'nav-item-toggle': NavItemToggle
    },
    computed: {
      routeName () {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      },
      serverMode () {
        console.log('serverMode() :: this.store.getters.serverMode = ' + this.$store.getters.serverMode)
        return this.$store.getters.serverMode
      }

    },
    data () {
      return {
        activeNotifications: false,
        serverModes: ['Local', 'Online'],
        activeServerMode: 'Local'
      }
    },
    methods: {
      capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      toggleNotificationDropDown () {
        this.activeNotifications = !this.activeNotifications
      },
      closeDropDown () {
        this.activeNotifications = false
      },
      toggleSidebar () {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      },
      hideSidebar () {
        this.$sidebar.displaySidebar(false)
      },
      setServerMode (mode) {
        console.log('setServerMode :: mode = ' + mode)
        this.$store.commit('SET_SERVER_MODE', mode)
      }
    }
  }

</script>
<style>
  .dropdown-toggle {
    margin: 0 !important;
  }

  .yoov-dropdown button,
  .yoov-dropdown button:focus,
  .yoov-dropdown button:active {
    background-color: transparent;
    border-color: transparent;
    outline: none;
  }

  .navbar .nav-item .dropdown .dropdown-toggle {
    color: #888888;
  }
  .navbar .nav-item .dropdown .dropdown-toggle:hover {
    color: #1DC7EA;
  }
  .navbar .nav-item .dropdown .dropdown-toggle:after {
    margin-top: 0;
  }

  .navbar .nav-item .btn-group button {
    margin:0;
  }
</style>
