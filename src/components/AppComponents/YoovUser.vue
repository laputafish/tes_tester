<template>
  <div class="yoov-user-wrapper d-flex flex-column mb-1 mr-1 align-items-stretch"
    :class="{'bkgd-logged-in':user.loggedIn}">
    <div class="yoov-user-spinner" v-show="!user.loggedIn && loading">
      <img src="static/img/loading.gif"/>
    </div>
    <div class="d-flex flex-row flex-grow-1">
      <div class="d-flex flex-column px-3 flex-grow-1">
        <div class="yoov-user-photo pt-3 pb-1">
          <img :src="getUserPhotoUrl()" class="img-circle"/>
        </div>
        <div v-if="user.loggedIn" class="yoov-user-name">
          {{ user.name }}
        </div>
        <div v-else class="yoov-user-name text-default">
          ({{ user.default_name }})
        </div>
      </div>
      <div class="d-flex flex-column flex-grow-0 p-2 button-column">
        <button v-if="!user.loggedIn"
                class="btn btn-primary mb-1"
                @click="login(user)">
          <i class="fa fa-fw fa-sign-in"></i>
        </button>
        <button v-if="user.loggedIn"
                class="btn btn-primary mb-1"
                @click="logout(user)">
          <i class="fa fa-fw fa-sign-out"></i>
        </button>
        <button v-show="user.type==='member'"
          class="btn btn-success mb-1"
          @click="call(user)"
          :disabled="!user.loggedIn">
          <i class="fa fa-fw fa-bullhorn"></i>
        </button>
      </div>
    </div>
    <div class="d-flex flex-row flex-grow-0">
      <div class="flex-grow-1">zoom: {{ zoom }}</div>
      <button v-if="user.type=='driver'"
        class="flex-grow-0 btn btn-xs"
        :class="{'btn-danger':user.online,'btn-default':!user.online}"
        @click="toggleOnline(user)">
        <i class="fa fa-fw fa-circle"></i>
      </button>
      <button v-if="user.type==='member'"
        class="flex-grow-0 btn btn-xs btn-primary"
        @click="addCard(user)">
        <i class="fa fa-fw fa-cc-visa"></i>
      </button>
    </div>
    <div
        class="flex-grow-0 d-flex flex-column yoov-map-container" style="width:100%;height:246px;">
      <gmap-map
          ref="mapRef"
          class="yoov-user-map"
          :center="center"
          :zoom="zoom"
          :options="options"
          @center_changed="onCenterChanged"
          @zoom_changed="onZoomChanged"
          map-type-id="terrain">
      </gmap-map>
      <img src="static/img/map_pushpin.png" class="map_pushpin"/>
      <div v-show="!user.loggedIn" class="yoov-map-mask"></div>
    </div>
  </div>
</template>
mapRef
<script>
//  import {API_KEY} from '../Dashboard/Views/Maps/API_KEY'
//  import Vue from 'vue'
// import GoogleMapsLoader from 'google-maps'
  import {loaded, gmapApi} from 'vue2-google-maps'
  import constants from '../../store/modules/constants.json'

  export default {
    created () {
      let vm = this
      loaded.then(() => {
        this.mapLoaded = true
        console.log('created :: google: ', vm.google)
      })
//      const bounds = new vm.google.maps.LatLngBounds()
//      console.log('created :: bounds: ', bounds)
      // vm.$refs.mapRef.center_changed((center) => {
      //   console.log('center_changed :; cneter: ', center)
      // })
    },
    mounted () {
      let vm = this
      // console.log('API_KEY: ' + API_KEY)
      vm.map = vm.$refs.mapRef.$mapObject
      // this.$refs.mapRef.$mapCreated.then(() => {
      //   this.mapLoaded = true
      // })
    },
    computed: {
      google: gmapApi,
      zoom () {
        let vm = this
        let result = 13
        if (vm.user) {
          if (vm.user.extra) {
            result = vm.user.extra.zoom
          }
        }
        return result
      },
      center () {
        let vm = this
        let result = constants.hkLatLng
        if (vm.user) {
          if (vm.user.extra) {
            result = vm.user.extra.center
          }
        }
        return result
      }
    },
    data () {
      return {
        updateCenterTimeout: null,
        updateZoomTimeout: null,
        loading: false,
        // center: {
        //   lat: 40.748817,
        //   lng: -73.985428
        // },
        // zoom: 13,
        mapLoaded: false,
        map: null,
        options: {
          styles: [{
            'featureType': 'water',
            'stylers': [{'saturation': 43}, {'lightness': -11}, {'hue': '#0088ff'}]
          }, {
            'featureType': 'road',
            'elementType': 'geometry.fill',
            'stylers': [{'hue': '#ff0000'}, {'saturation': -100}, {'lightness': 99}]
          }, {
            'featureType': 'road',
            'elementType': 'geometry.stroke',
            'stylers': [{'color': '#808080'}, {'lightness': 54}]
          }, {
            'featureType': 'landscape.man_made',
            'elementType': 'geometry.fill',
            'stylers': [{'color': '#ece2d9'}]
          }, {
            'featureType': 'poi.park',
            'elementType': 'geometry.fill',
            'stylers': [{'color': '#ccdca1'}]
          }, {
            'featureType': 'road',
            'elementType': 'labels.text.fill',
            'stylers': [{'color': '#767676'}]
          }, {
            'featureType': 'road',
            'elementType': 'labels.text.stroke',
            'stylers': [{'color': '#ffffff'}]
          }, {'featureType': 'poi', 'stylers': [{'visibility': 'off'}]}, {
            'featureType': 'landscape.natural',
            'elementType': 'geometry.fill',
            'stylers': [{'visibility': 'on'}, {'color': '#b8cb93'}]
          }, {'featureType': 'poi.park', 'stylers': [{'visibility': 'on'}]}, {
            'featureType': 'poi.sports_complex',
            'stylers': [{'visibility': 'on'}]
          }, {'featureType': 'poi.medical', 'stylers': [{'visibility': 'on'}]}, {
            'featureType': 'poi.business',
            'stylers': [{'visibility': 'simplified'}]
          }]
        }
      }
    },
    props: {
      user: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    methods: {
      getUserPhotoUrl () {
        let vm = this
        let photoId = vm.user.loggedIn ? vm.user.photo_id : 0
        let url = 'http://tes_api/' + vm.user.type + '/api/v1/media/' + photoId
        return url
      },
      login (user) {
        let vm = this
        this.loading = true
        this.$store.dispatch('login', {
          slotNo: user.slot_no,
          callback: (extra) => {
            vm.loading = false
            console.log('mapRef: ', vm.$refs.mapRef)
            console.log('extra: ', extra)
            vm.$refs.mapRef.panTo(extra.center)
            // if (vm.mapLoaded) {
            //   // console.log('YoovUser :: VueGoogleMaps: ', VueGoogleMaps)
            //   // VueGoogleMaps.Map.event.trigger(vm.$refs.mapRef.$mapObject, 'resize')
            //   // gmap.event.trigger(vm.$refs.mapRef.$mapObject, 'resize')
            //   vm.google.maps.Map.event.trigger(vm.$refs.mapRef.$mapObject, 'resize')
            //   // VueGoogleMaps.gmapApi.event.trigger(vm.$refs.mapRef.$mapObject, 'resize')
            // }
            // console.log('callback :: center: ', vm.center)
            // console.log('callback :: user: ', vm.user)
          }
        })
        console.log('YoovUser :: login')
      },
      logout (user) {
        let vm = this
        this.$store.dispatch('logout', {
          slotNo: user.slot_no,
          callback: () => {
            vm.loading = false
          }
        })
      },
      call (user) {
        this.$emit('onCommand', {
          command: 'call',
          user: user
        })
      },
      toggleOnline (user) {
        this.$store.commit('TOGGLE_ONLINE', user)
      },
      addCard (user) {
        alert('user name: ' + user.name)
      },
      // updateCenter (center) {
      //   let vm = this
      //   vm.updateCenterTimeout = setTimeout(() => {
      //     vm.center = center
      //   }, 1000)
      // },
      onZoomChanged (zoom) {
        let vm = this
        if (vm.updateZoomTimeout) {
          clearTimeout(vm.updateZoomTimeout)
        }
        vm.updateZoomTimeout = setTimeout(() => {
          vm.$store.commit('UPDATE_MAP_ZOOM', {
            user: vm.user,
            zoom: zoom
          })
          console.log('center updated')
        }, 1000)
      },

      onCenterChanged (location) {
        let vm = this
        let center = {
          lat: location.lat(),
          lng: location.lng()
        }
        console.log('updateCenter :; center: ', center)
        if (vm.updateCenterTimeout) {
          clearTimeout(vm.updateCenterTimeout)
          console.log('clearTiemout :: updateCenterTimeout: ', vm.updateCenterTimeout)
        }
        vm.updateCenterTimeout = setTimeout(() => {
          vm.$store.dispatch('updateMapCenter', {
            user: vm.user,
            center: center,
            callback: function () {
            }
          })
          console.log('center updated')
        }, 1000)
      }
    }
  }
</script>

<style>
  .yoov-user-wrapper {
    width: 320px;
    height: 400px;
    background-color: antiquewhite;
  }

  .yoov-user-wrapper.yoov-logged-in {
    background-color: #afeefe;
  }

  .img-circle {
    border-radius: 50%;
  }

  .yoov-user-wrapper .yoov-user-photo img {
    width: 64px;
    height: 64px;
    object-fit: cover;
  }

  .yoov-user-map {
    width: 100%;
    height: 128px;
  }
  .button-column button {
    width: 80px;
  }
  .button-column button:disabled {
    background-color: transparent;
    border-color: #888888;
  }
  .yoov-user-map {
    width: 100%;
    height: 100%;
  }
  .yoov-user-wrapper .yoov-user-spinner {
    margin-top:20px;
    width: 320px;
    height: 48px;
    text-align: center;
    font-size: 24px;
    position: absolute;
    z-index: 2000;
  }
  .yoov-user-wrapper .yoov-user-spinner img {
    height: 48px;
    width: auto;
    object-fit: contain;
  }

  .yoov-user-wrapper .yoov-map-container {
    position: relative;
    width: 100%;
    height: 246px;
  }

  .yoov-user-wrapper .yoov-map-mask {
    width: 100%;
    height: 246px;
    bottom: 0;
    position: absolute;
    background-color: rgba(128,128,128,.8);
  }
  .map_pushpin {
    position: absolute;
    left: 148px;
    top: 84px;
  }
</style>