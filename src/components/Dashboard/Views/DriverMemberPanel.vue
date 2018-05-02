<template>
  <div style="padding:5px;">
    <!--<gmap-map-->
        <!--id="map"-->
        <!--:center="center"-->
        <!--:zoom="13"-->
        <!--:options="options"-->
        <!--map-type-id="terrain"-->
    <!--&gt;-->
      <!--<gmap-marker :position="center">-->
      <!--</gmap-marker>-->
    <!--</gmap-map>-->
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
            <div class="row">
              <div v-for="user in users">
                <yoov-user
                  :user="user"
                  @onCommand="onCommandHandler">
                </yoov-user>
              </div>
            </div>
        </div>
      </div>
    </div>

    <message-dialog
        :message="message"
        v-show="isModalVisible"
        @close="closeModal"></message-dialog>

    <call-option-dialog
      :user="activeUser"
      v-show="showingCallOptionDialog"
      @ok="okHandler"
      @close="showingCallOptionDialog=false"></call-option-dialog>
  </div>
</template>

<script>
  import ChartCard from 'src/components/UIComponents/Cards/ChartCard.vue'
  import StatsCard from 'src/components/UIComponents/Cards/StatsCard.vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import LTable from 'src/components/UIComponents/Table.vue'
  import Checkbox from 'src/components/UIComponents/Inputs/Checkbox.vue'
  import YoovUser from 'src/components/AppComponents/YoovUser.vue'
  import MessageDialog from 'src/components/UIComponents/Dialogs/MessageDialog.vue'
  import CallOptionDialog from 'src/components/UIComponents/Dialogs/CallOptionDialog.vue'

  import {API_KEY} from '../Views/Maps/API_KEY'
  import Vue from 'vue'
  import * as VueGoogleMaps from 'vue2-google-maps'
  import { mapMutations } from 'vuex'

  Vue.use(VueGoogleMaps, {
    load: {
      key: API_KEY
    }
  })

  export default {
    data () {
      return {
        newOrder: {
          serviceType: 'call_now',
          passengerCount: 1,
          fromLat: 0,
          fromLng: 0,
          toLat: 0,
          toLng: 0,
          cardId: 0
        },
        showingCallOptionDialog: false,
        isModalVisible: false,
        center: {
          lat: 40.748817,
          lng: -73.985428
        },
        activeUser: null,
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
    mounted () {
      console.log('mounted :: users: ', this.users)
    },
    computed: {
      users () {
        return this.$store.getters.users
      },
      showingMessageDialog () {
        return this.$store.getters.showingMessageDialog
      },
      message () {
        return this.$store.getters.message
      }
    },
    created () {
      this.$store.dispatch('setFbUsersRef')
      this.$store.dispatch('init', {
        serverMode: 'Local'
      })
    },
    watch: {
      showingMessageDialog: function (newVal) {
        this.isModalVisible = newVal
      }
    },
    components: {
      chartCard: ChartCard,
      statsCard: StatsCard,
      card: Card,
      lTable: LTable,
      checkbox: Checkbox,
      yoovUser: YoovUser,
      messageDialog: MessageDialog,
      callOptionDialog: CallOptionDialog
    },
    methods: {
      ...mapMutations([
        'hideModal'
      ]),
      closeModal () {
        this.hideModal()
//        this.$store.commit('CLOSE_MESSAGE_DIALOG')
      },
      okHandler (newOrder) {
        let vm = this
        // new call
        console.log('okHandler :: newOrder: ', newOrder)
        vm.showingCallOptionDialog = false
      },
      onCommandHandler (commandSet) {
        console.log('onCommandHandler :: commandSet: ', commandSet)
        let vm = this
        let user = commandSet.user
        let command = commandSet.command
        switch (command) {
          case 'call':
            console.log('onCommandHandler :: call')
            vm.activeUser = user
            vm.showingCallOptionDialog = true
            command = ''
            break
        }
      }
    }
  }
</script>

<style>
  #map {
    min-height: calc(60vh - 123px);
  }
</style>
