<template>
  <li class="nav-item">
    <div class="btn-group">
      <button
          v-for="option in options"
          role="group"
          class="btn"
          @click="onButtonClicked(option)"
          :class="{'btn-primary':activeOption==option, 'btn-highlight':activeOption!=option}">
        {{ option }}
      </button>
    </div>
  </li>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    props: {
      options: {
        type: Array,
        default () {
          return []
        }
      },
      activeOption: {
        type: String,
        default: 'Local'
      }
    },
    model: {
      prop: 'activeOption',
      event: 'input'
    },
    methods: {
      onButtonClicked (option) {
        this.$emit('input', option)
      }
    }

  }
</script>