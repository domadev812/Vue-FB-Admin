<template>
  <i :class="[iconClass]">{{iconText}}</i>
</template>
<script>
  export default {
    name: 'FBIcon',
    props: {
      iconClass: {
        type: String,
        default: 'fa'
      },
      iconText: {
        type: String,
        default: ''
      }
    }
  }
</script>
