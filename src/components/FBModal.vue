<template>
  <div ref="modal" class="modal fade" :style="{ display: showModal ? 'block' : 'none' }" :class="classes" :id="modalId">
    <div class="modal-dialog">
      <div class="modal-content">
        <div v-if="this.$slots.modalHeader || closeAction" class="modal-header">
          <button class="close" @click="hideModal">x</button>
          <slot name="modalHeader"></slot>
        </div>
        <div v-if="this.$slots.modalBody" class="modal-body">
          <slot name="modalBody"></slot>
        </div>
        <div v-if="this.$slots.modalFooter" class="modal-footer">
          <slot name="modalFooter"></slot>
        </div>
      </div>
      <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
  </div>
</template>
<script>
  export default {
    name: 'FBModal',
    data () {
      return {
        showModal: false
      }
    },
    props: {
      disabled: Boolean,
      modalId: {
        type: String,
        required: true
      },
      modalInfo: {
        type: Boolean,
        default: false
      },
      modalDanger: {
        type: Boolean,
        default: false
      },
      modalWarning: {
        type: Boolean,
        default: false
      },
      modalSuccess: {
        type: Boolean,
        default: false
      },
      modalDefault: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      hideModal () {
        this.showModal = false
      }
    },
    computed: {
      classes () {
        return {
          'modal-info': this.modalInfo,
          'modal-success': this.modalSuccess,
          'modal-primary': this.modalPrimary,
          'modal-warning': this.modalWarning,
          'modal-danger': this.modalDanger,
          'in': this.showModal
        }
      }
    }
  }
</script>
<style scoped>
  .modal {
    overflow-y: scroll;
  }
</style>
