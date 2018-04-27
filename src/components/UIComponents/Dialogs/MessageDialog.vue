<template>
  <modal id="emailTemplateSelectionDialog" class="selection-box">
    <div slot="header">
      <h3 class="dialog-title">
        Information
      </h3>
    </div>
    <div slot="body">
      <div class="row">
        <div class="col-sm-12">
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button class="btn btn-default"
              @click="$emit('close')">
        OK
      </button>
    </div>
  </modal>
</template>

<script>
  import Modal from '../Modal.vue'

  export default {
    components: {
      Modal
    },
    props: {
      message: {
        type: String,
        default: ''
      }
    }
  }
</script>