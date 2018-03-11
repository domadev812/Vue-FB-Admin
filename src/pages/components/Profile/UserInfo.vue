<template>
  <div class="col-md-3">
    <!-- Profile Image -->
    <div class="box box-primary">
      <div class="box-body box-profile">
        <img class="profile-user-img img-responsive img-circle"
             src="http://fabrika.agency/fb/dist/img/user4-128x128.jpg" :alt="userProfile | fullName">
        <h3 class="profile-username text-center" v-if="userProfile.createdBy != null">{{userProfile.createdBy | fullName}}</h3>
        <p class="text-muted text-center" v-if="userProfile.role != null">{{userProfile.role}}</p>
        <div class="description">
          <b>Created by</b>
          <router-link v-if="(userProfile.created_by !== null)" class="pull-right" :to="{path: '/profile'}">
            <span
              class="badge bg-aqua"
              v-if="(userProfile.created_by !== null)">{{(userProfile.createdBy != null) ? userProfile.createdBy.role : 'Administrator'}}</span>
          </router-link>
          <p class="text-muted" v-if="userProfile.created_time != null">
            {{userProfile.created_time | moment("D MMMM YYYY [at] hh:mm A")}}
          </p>
        </div>
        <div class="description" v-if="userProfile.modified_by !== null || userProfile.modified_time !== null">
          <div>
            <b>Modified by</b>
            <router-link v-if="userProfile.modified_by != null" :to="{path: '/profile'}" class="pull-right"><span
              class="badge bg-blue">{{userProfile.modifiedBy | fullName}}</span>
            </router-link>
          </div>
          <p class="text-muted" v-if="userProfile.modified_time != null">
            {{userProfile.modified_time | moment("D MMMM YYYY [at] hh:mm A")}}
          </p>
        </div>
      </div>
      <!-- /.box-body -->
    </div>
    <!-- /.box -->
    <!-- About Me Box -->
    <div class="box box-primary" v-if="userProfile.email !== null || userProfile.phone !== null">
      <div class="box-header with-border">
        <h3 class="box-title">Contacts</h3>
      </div>
      <!-- /.box-header -->
      <div class="box-body">
        <strong v-if="userProfile.email !== null"><i class="fa fa-envelope margin-r-5"></i> Email</strong>
        <p v-if="userProfile.email !== null" class="text-muted">{{userProfile.email}}</p>
      </div>
      <!-- /.box-body -->
    </div>
    <!-- /.box -->
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'UserInfo',
    filters: {
      fullName (value) {
        return value.firstname + ' ' + value.lastname
      }
    },
    mounted () {
      this.$store.dispatch('setLoadingBar', 'block')
      this.$store.dispatch('setLoadingBarText', 'Loading...')
      if (this.$route.params.hasOwnProperty('id')) {
        this.$store.dispatch('fetchUserProfile', this.$route.params.id)
          .then((response) => {
            this.updateProfile = this.$lodash.clone(response)
            this.$store.dispatch('setLoadingBar', 'none')
          })
      } else {
        this.$store.dispatch('fetchUserProfile', this.$store.getters.getUserID)
          .then((response) => {
            this.updateProfile = this.$lodash.clone(response)
            this.$store.dispatch('setLoadingBar', 'none')
          })
      }
    },
    computed: {
      ...mapGetters({
        userProfile: 'getUserProfile'
      })
    }
  }
</script>
