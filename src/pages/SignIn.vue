<template>
  <div class="login-box">
    <div class="login-logo">
      <router-link to="/" v-html="appName"></router-link>
    </div>
    <!-- /.login-logo -->
    <div class="login-box-body">
      <p class="login-box-msg">{{$route.name}}</p>
      <ClipLoader :loading="loading"></ClipLoader>
      <FBInput type="email" iconAfterClass="glyphicon-envelope" :iconAfter="true" name="email" validateRules="email"
               :isRequired="true" @emailChanged="email = $event" :email="email" placeholder="Email"></FBInput>
      <FBInput type="password" iconAfterClass="glyphicon-lock" :iconAfter="true" validateRules="min:6" name="password"
               :isRequired="true" :password="password" @passwordChanged="password = $event"
               placeholder="Password"></FBInput>
      <div class="row">
        <div class="col-xs-8">
          <div class="checkbox icheck">
            <FBICheck v-model="remember_me" :isMultiple="false" :selectList="selectList"></FBICheck>
          </div>
        </div>
        <!-- /.col -->
        <div class="col-xs-4">
          <FBButton :disabled="errors.any()" :onClick="signIn"
                    buttonClass="btn btn-success btn-block btn-flat" buttonText="Sign In">
          </FBButton>
        </div>
        <!-- /.col -->
      </div>
      <a href="#">I forgot my password</a><br>
      <a href="#" class="text-center">Register a new membership</a>

    </div>
    <!-- /.login-box-body -->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import validateInit from '../mixins/validateInitial'

  const FBInput = () => import(/* webpackChunkName: "UI Elements" */ '../components/FBInput.vue')
  const FBButton = () => import(/* webpackChunkName: "UI Elements" */ '../components/FBButton.vue')
  const FBICheck = () => import(/* webpackChunkName: "UI Elements" */ '../components/FBICheck.vue')
  const ClipLoader = () => import(/* webpackChunkName: "Layout" */ 'vue-spinner/src/ClipLoader.vue')

  export default {
    name: 'SignIn',
    inject: ['$validator'],
    mixins: [validateInit],
    data () {
      return {
        password: '',
        email: '',
        remember_me: '',
        selectList: [
          {text: 'Remember Me', value: '1'}
        ]
      }
    },
    components: {
      FBInput,
      FBButton,
      FBICheck,
      ClipLoader
    },
    methods: {
      signIn () {
        this.$store.dispatch('signIn', {
          'email': this.email,
          'password': this.password,
          'remember_me': this.remember_me
        }).then(() => {window.location.replace('/dashboard')})
      }
    },
    computed: {
      ...mapGetters({
        appName: 'getAppNameHeader',
        loading: 'getLoadingStatus'
      })
    },
    mounted () {
      this.$jQuery('body')
        .removeClass('hold-transition skin-black-light sidebar-mini fixed')
        .addClass('hold-transition login-page')
      this.$jQuery('div.content-wrapper')
        .first()
        .removeClass('content-wrapper')
    }
  }
</script>
