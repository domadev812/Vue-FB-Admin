<template>
  <div id="app">
    <FBAlert :dismissible="false" :type="alertClasses" v-show="alertShowing">
      <h4 slot="header"><i :class="alertIconClasses"></i> {{alertHeaderText}}</h4>
      <div slot="body" v-html="alertContent">
        {{alertContent}}
      </div>
    </FBAlert>
    <router-view class="formula-header" name="header"></router-view>
    <router-view class="formula-sidebar" name="sidebar"></router-view>
    <router-view class="formula-wrapper content-wrapper" style="min-height: 324px"></router-view>
    <router-view class="formula-footer" name="footer"></router-view>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  const FBAlert = () => import(/* webpackChunkName: "UI Elements" */ './components/FBAlert.vue')
  export default {
    name: 'app',
    computed: {
      ...mapGetters({
        alertShowing: 'getAlertShowing',
        alertClasses: 'getAlertClasses',
        alertIconClasses: 'getAlertIconClasses',
        alertHeaderText: 'getAlertHeaderText',
        alertContent: 'getAlertContent'
      }),
      isSignIn: function () {
        if (this.$route.name === 'Sign In') return false
        else return true
      }
    },
    components: {
      FBAlert
    }
  }
</script>
