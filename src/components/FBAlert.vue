<template>
  <transition name="slide-fade">
    <div class="alert" :class="classObject">
      <button type="button" data-dismiss="alert" aria-hidden="true" class="close" v-if="dismissible">×</button>
      <slot name="header"></slot>
      <slot name="body"></slot>
    </div>
  </transition>
</template>
<script>
  const AlertTypes = ['success', 'info', 'warning', 'danger']
  export default {
    name: 'FBAlert',
    props: {
      type: {
        default: 'success',
        validator: function (value) {
          return AlertTypes.includes(value)
        }
      },
      dismissible: {
        default: false
      }
    },
    computed: {
      classObject () {
        return {
          'alert-success': this.type === 'success',
          'alert-info': this.type === 'info',
          'alert-warning': this.type === 'warning',
          'alert-danger': this.type === 'danger',
          'alert-dissmissible': this.dismissible
        }
      }
    }
  }
</script>
<style scoped>
  .slide-fade-enter-active {
    transition: all .8s ease;
  }

  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */
  {
    transform: translateX(10px);
    opacity: 0;
  }

  .alert {
    position: absolute;
    z-index: 999999;
    width: 20%;
    top: 7%;
    right: 0;
    background: #fde073;
    overflow: hidden;
    -webkit-box-shadow: 0 0 5px black;
    -moz-box-shadow: 0 0 5px black;
    box-shadow: 0 0 5px black;
  }

  .cssanimations.csstransforms .alert {
    -webkit-transform: translateY(-50px);
    -webkit-animation: slideDown 2.5s 1.0s 1 ease forwards;
    -moz-transform: translateY(-50px);
    -moz-animation: slideDown 2.5s 1.0s 1 ease forwards;
  }

  @-webkit-keyframes slideDown {
    0%, 100% {
      -webkit-transform: translateY(-50px);
    }
    10%, 90% {
      -webkit-transform: translateY(0px);
    }
  }

  @-moz-keyframes slideDown {
    0%, 100% {
      -moz-transform: translateY(-50px);
    }
    10%, 90% {
      -moz-transform: translateY(0px);
    }
  }
</style>
