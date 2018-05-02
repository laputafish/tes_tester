<template>
  <div class="form-group">
    <label class="control-label" for="passengerCount">Passenger(s)</label>
    <div class="btn-group p-0">
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