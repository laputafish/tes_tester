<template>
  <modal id="callOptionDialog" class="selection-box">
    <div slot="header">
      <h3 class="dialog-title">
        Call Car
      </h3>
    </div>
    <div slot="body">
      <div class="row">
        <div class="col-sm-7">
          <div class="form-group row">
            <div class="col-sm-4">
              <label class="col-form-label" for="serviceType">Service Type</label>
            </div>
            <div class="col-sm-8">
              <input type="text" readonly class="form-control-plaintext" id="serviceType" :value="newOrder.serviceType"/>
            </div>
          </div>
          <form-group-row-toggle
              labelColClass="col-sm-4"
              inputColClass="col-sm-8"
              :options="[1,2,3,4,5,6,7,8]"
              v-model="newOrder.passengerCount"
              optionType="integer"
              label="Passenger(s)"></form-group-row-toggle>
        </div>
        <div class="col-sm-5">
          <label class="form-label" for="card">Card</label>
          <ul class="list-group">
            <li v-if="!user">(no card)</li>
            <li v-else v-for="card in user.cards" class="list-group-item">{{ card.name }}</li>
          </ul>
        </div>
      </div>

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
              @click="$emit('ok')">
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
  import FormGroupRowToggle from '../Inputs/FormGroupRowToggle.vue'
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
      FormGroupRowToggle,
      FormGroupMap
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
    }
  }
</script>

<style>
  #callOptionDialog .modal-wrapper .modal-container {
    width: 90%;
    max-width:1050px;
  }
</style>