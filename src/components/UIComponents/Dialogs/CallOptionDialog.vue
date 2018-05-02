<template>
  <modal id="callOptionDialog" class="selection-box">
    <div slot="header">
      <h3 class="dialog-title">
        Call Car
      </h3>
    </div>
    <div slot="body">
      <div class="row">
        <div class="col-sm-3">
          <label class="form-label" for="serviceType">Service Type</label>
          <input type="text" readonly class="form-control-plaintext" id="serviceType" :value="newOrder.serviceType"/>
        </div>

        <form-group-stack-toggle
          class="col-sm-4"
          :options="[1,2,3,4,5,6,7,8]"
          v-model="newOrder.passengerCount"
          optionType="integer"
          label="Passenger(s)"></form-group-stack-toggle>

        <div class="col-sm-4">
          <label class="form-label" for="card">Card</label>
          <select v-if="user"
                 class="form-control"
                 v-model="newOrder.cardId">
            <option value="0" selected disabled>Please select card</option>
            <option v-for="card in user.cards" :value="card.id">{{ card.card_name }}</option>
          </select>
        </div>
        <div class="col-sm-1">

        </div>
      </div>
      <hr/>
      <div class="form-group row">
        <form-group-map
            label="Starting Point"
            id="fromLocation"
            class="col-sm-6"
            v-model="newOrder.from">
        </form-group-map>
        <form-group-map
            label="Destination"
            id="toLocation"
            class="col-sm-6"
            v-model="newOrder.to">
      </form-group-map>

      </div>

    </div>
    <div slot="footer">
      <button class="btn btn-default"
              @click="$emit('ok', newOrder)">
        OK
      </button>
      <button class="btn btn-default"
              @click="$emit('close')">
        Cancel
      </button>
    </div>
  </modal>
</template>

<script>
  import Modal from '../Modal.vue'
  import FormGroupStackToggle from '../Inputs/FormGroupStackToggle.vue'
  import FormGroupMap from '../Inputs/FormGroupMap.vue'
  
  export default {
    data () {
      return {
        newOrder: {
          serviceType: 'call_now',
          passengerCount: 1,
          from: {
            lat: 0,
            lng: 0,
            description: '',
            placeId: 0
          },
          to: {
            lat: 0,
            lng: 0,
            description: '',
            placeId: 0
          },
          cardId: 0
        }
      }
    },
    components: {
      Modal,
      FormGroupStackToggle,
      FormGroupMap
    },
    mounted () {

    },
    props: {
      message: {
        type: String,
        default: ''
      },
      user: {
        type: Object,
        default () {
          return {
            cards: []
          }
        }
      }
    },
    watch: {
      user (newValue, oldValue) {
        console.log('watch :: user: ', newValue)
        let vm = this
        vm.newOrder.from.lat = vm.newOrder.to.lat = newValue.extra.center.lat
        vm.newOrder.from.lng = vm.newOrder.to.lng = newValue.extra.center.lng
      }
    }
  }
</script>

<style>
  #callOptionDialog .modal-wrapper .modal-container {
    width: 90%;
    max-width:1050px;
  }
</style>