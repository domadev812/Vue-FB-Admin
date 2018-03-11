<template>
  <button tabindex="0" @click.stop.prevent="onClick" :class="[buttonClass]" :disabled="disabled">
    <slot name="icon"></slot>
    {{buttonText}}
  </button>
</template>
<script>
  const FBIcon = () => import(/* webpackChunkName: "UI Elements" */ './FBIcon.vue')
  export default {
    name: 'FBButton',
    components: {
      FBIcon
    },
    props: {
      onClick: {
        type: [Function, Promise],
        required: true
      },
      buttonClass: {
        type: String,
        default: 'btn btn-default'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      buttonText: {
        type: String,
        default: ''
      }
    }
  }
</script>
