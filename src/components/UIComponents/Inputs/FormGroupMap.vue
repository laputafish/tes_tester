<template>
  <div class="form-group-map">
    <label>{{ label }}</label>
    <gmap-autocomplete
        class="pull-right"
        @place_changed="setPlace">
    </gmap-autocomplete>

    <div class="form-group-map-wrapper">
      <gmap-map
          ref="mapRef"
          :id="id"
          class="yoov-user-map"
          :center="center"
          :zoom="13"
          :options="options"
          @center_changed="onCenterChanged"
          map-type-id="terrain">
        <!--<gmap-marker :position="center">-->
        <!--</gmap-marker>-->
      </gmap-map>
      <img src="static/img/map_pushpin.png" class="map_pushpin"/>
    </div>
  </div>
</template>

<script>
  //  import {API_KEY} from '../../Dashboard/Views/Maps/API_KEY'
  //  import Vue from 'vue'
  import {loaded, gmapApi} from 'vue2-google-maps'
  // Vue.use(VueGoogleMaps, {
  //   load: {
  //     key: API_KEY
  //   }
  // })

  export default {
    data () {
      return {
        loading: false,
        mapLoaded: false,
        center: {
          lat: 40.748817,
          lng: -73.985428
        },
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
      label: {
        type: String,
        default: 'Location'
      },
      id: {
        type: String,
        default: 'unknown'
      },
      location: {
        type: Object,
        default () {
          return null
        }
      }
    },
    mounted () {
      let vm = this
      loaded.then(() => {
        vm.mapLoaded = true
        // var map = vm.$refs.mapRef
        // var input = document.getElementById('placeInput_' + vm.id)
        // console.log('loaded :: vm.google: ', vm.google)
        // var autocomplete = new vm.google.maps.places.Autocomplete(input)
        // autocomplete.bindTo('bounds', map)
        // map.controls[vm.google.maps.ControlPosition.TOP_LEFT].push(input)
        //
        // autocomplete.addListener('place_changed', () => {
        //   var place = autocomplete.getPlace()
        //   if (!place.geometry) {
        //     return
        //   }
        //   if (place.geometry.viewport) {
        //     map.fitBounds(place.geometry.viewport)
        //   } else {
        //     map.setCenter(place.geometry.location)
        //     map.setZoom(17)
        //   }
        //
        //   // Set the position of the marker using the place ID and location.
        //   // marker.setPlace({
        //   //   placeId: place.place_id,
        //   //   location: place.geometry.location
        //   // });
        //   // marker.setVisible(true);
        //
        //   vm.$emit('input', {
        //     lat: vm.location.lat,
        //     lng: vm.location.lng,
        //     description: place.name,
        //     placeId: place.place_id
        //   })
        //   // document.getElementById('place-name').textContent = place.name;
        //   // document.getElementById('place-id').textContent = place.place_id;
        //   // document.getElementById('place-address').textContent = place.formatted_address;
        //   // infowindow.setContent(document.getElementById('infowindow-content'));
        //   // infowindow.open(map, marker);
        // })
      })
    },
    computed: {
      google: gmapApi
    },
    watch: {
      mapLoaded (value, oldValue) {
        let vm = this
        console.log('mapLoaded : ' + (value ? 'yes' : 'no'))
        console.log('mapLoaded : places: ', vm.google.maps.places)
      }
    },
    methods: {
      setPlace (place) {
        console.log('setPlace :: place: ', place)
//        this.place = place
      },
      emitDescription (value) {
        let vm = this
        this.$emit('input', {
          lat: vm.location.lat,
          lng: vm.location.lng,
          description: value,
          placeId: location.placeId
        })
      },
      onCenterChanged (centerObj) {
        this.$emit('input', {
          lat: centerObj.lat(),
          lng: centerObj.lng(),
          description: location.description,
          placeId: location.placeId
        })
      }
    }
  }
</script>

<style scoped>
  .form-group-map-wrapper {
    height: 320px;
    width: 100%;
    position: relative;
  }

  .map_pushpin {
    position: absolute;
    left: 235px;
    top: 119px;
  }

</style>