<template>
  <div :class="{'btn-group': !isVerticalButtonGroup,'btn-group-vertical': isVerticalButtonGroup}" v-if="isButtonGroup">
    <slot name="button"></slot>
  </div>
</template>

<script>
  export default {
    name: 'FBButtonGroup',
    props: {
      isButtonGroup: {
        type: Boolean,
        default: false
      },
      isVerticalButtonGroup: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
