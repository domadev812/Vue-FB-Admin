<template>
  <header class="main-header">

    <router-link :to="'dashboard'" class="logo">
      <span class="logo-mini" v-html="smallName"></span>
      <span class="logo-lg" v-html="appName"></span>
    </router-link>

    <nav class="navbar navbar-static-top">
      <a class="sidebar-toggle" data-toggle="offcanvas" role="button">
        <span class="sr-only">Toggle navigation</span>
      </a>

      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <li class="dropdown user user-menu">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
              <img src="../assets/img/user2-160x160.jpg" class="user-image" alt="User Image">
              <span class="hidden-xs">{{authUserFullName}}</span>
            </a>
            <ul class="dropdown-menu">
              <li class="user-header">
                <img src="../assets/img/user2-160x160.jpg" class="img-circle" alt="User Image">

                <p>
                  {{authUserFullName}}
                  <small>Administrators</small>
                </p>
              </li>
              <li class="user-footer">
                <div class="pull-left">
                  <router-link :to="'/profile'" class="btn btn-default btn-flat" exact>Profile</router-link>
                </div>
                <div class="pull-right">
                  <FBButton :onClick="signOut"
                            buttonClass="btn btn-default btn-flat" buttonText="Sign Out">
                  </FBButton>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>

    </nav>
  </header>
</template>
<script>
  import { mapGetters } from 'vuex'

  const FBButton = () => import(/* webpackChunkName: "UI Elements" */ '../components/FBButton.vue')
  export default {
    name: 'Header',
    methods: {
      signOut () {
        this.$store.dispatch('signOut')
          .then((response) => {
            this.$router.push({name: 'Sign In'})
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    components: {
      FBButton
    },
    computed: {
      ...mapGetters({
        authUserFullName: 'getUserFullName',
        appName: 'getAppNameHeader',
        smallName: 'getAppSmallName'
      })
    }
  }
</script>
