<template>
  <div class="form-group row">
    <div :class="labelColClass">
      <label class="col-form-label" for="passengerCount">Passenger(s)</label>
    </div>
    <div :class="inputColClass" class="btn-group">
      <button v-for="option in options"
              class="btn"
              :class="{'btn-primary':option===selectedOption,'btn-default':option!=selectedOption}"
              @click="onClicked(option)">
        {{option}}
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      labelColClass: {
        type: String,
        default: 'col-sm-5'
      },
      inputColClass: {
        type: String,
        default: 'col-sm-7'
      },
      label: {
        type: String,
        default: 'Label'
      },
      options: {
        type: Array,
        default () {
          return []
        }
      },
      optionType: {
        type: String,
        default: 'string'
      },
      selectedOption: null
    },
    model: {
      prop: 'selectedOption',
      event: 'input'
    },
    methods: {
      onClicked (option) {
        let vm = this
        switch (vm.optionType) {
          case 'string':
            vm.$emit('input', option.toString())
            break
          case 'integer':
            vm.$emit('input', parseInt(option))
            break
          case 'number':
            vm.$emit('input', parseFloat(option))
            break
        }
      }
    }
  }
</script>