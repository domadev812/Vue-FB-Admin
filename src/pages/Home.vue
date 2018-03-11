<template>
  <div v-if="$route.name === 'Dashboard'">
    <!-- Main content -->
    <section class="content">

      <div class="row">
        <div class="col-md-4">

          <!-- small box -->
          <div class="small-box bg-green">
            <div class="inner">
              <h3>{{formulas.total}}<sup style="font-size: 20px"></sup></h3>

              <p>Formulas</p>
            </div>
            <div class="icon">
              <i class="fa fa-flask"></i>
            </div>
            <a href="#" class="small-box-footer">
              <i class="fa fa-plus-circle"></i> Add New
            </a>
          </div>

          <!-- small box -->
          <div class="small-box bg-green">
            <div class="inner">
              <h3>{{herbs.total}}<sup style="font-size: 20px"></sup></h3>

              <p>Herbs</p>
            </div>
            <div class="icon">
              <i class="fa fa-leaf"></i>
            </div>
            <a href="#" class="small-box-footer">
              <i class="fa fa-plus-circle"></i> Add New
            </a>
          </div>
        </div>

        <div class="col-md-8">

          <div class="box">
            <div class="box-body">
              <!-- search form -->
              <form action="#" method="get" class="sidebar-form">
                <div class="input-group">
                  <input type="text" name="q" class="form-control" placeholder="Search...">
                  <span class="input-group-btn">
                <button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i>
                </button>
              </span>
                </div>
              </form>
              <!-- /.search form -->
              <!-- /input-group -->
            </div>
            <!-- /.box-body -->
          </div>

          <!-- TABLE: LATEST ORDERS -->
          <div class="box box-default">
            <div class="box-header with-border">
              <h3 class="box-title">Latest actions</h3>
              <div class="box-tools pull-right">
                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
              </div>
            </div>
            <!-- /.box-header -->
            <div class="box-body no-padding">
              <div class="table-responsive">
                <table class="table no-margin">
                  <thead>
                  <tr>
                    <th width="30"></th>
                    <th>Activity  <i class="fa fa-caret-down"></i></th>
                    <th>User <i class="fa fa-caret-down"></i></th>
                    <th>Date <i class="fa fa-caret-down"></i></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in activity.items" :key="item.id">
                    <td>
                      <i class="fa text-muted" v-if="item.action !== null"
                         :class="{
                          'fa-pencil': (item.action === 'update'),
                          'fa-plus-circle': (item.action === 'create'),
                          'fa-trash': (item.action === 'delete')
                        }">
                      </i>
                    </td>
                    <td><span>{{item.message}}</span></td>
                    <td>
                      <router-link :to="{path: '/users/profile/'+item.user.id}" v-if="item.user !== null">
                        {{item.user | fullUserName}}
                      </router-link>
                    </td>
                    <td>
                      <div class="text-muted" data-toggle="tooltip"
                           data-original-title="Server Time 1:00PM (GMT +7)">{{item.relative_date}}
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <!-- /.table-responsive -->
            </div>
            <!-- /.box-body -->
            <div class="box-footer text-center">
              <a href="javascript:void(0)" class="uppercase">View All</a>
            </div>
            <!-- /.box-footer -->
          </div>
          <!-- /.box -->
        </div>
        <!-- /.col -->
      </div>

    </section>
    <!-- /.content -->
  </div>
  <div v-else>
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Dashboard',
    created () {
      this.$store.dispatch('fetchFormulas', {page: 1})
      this.$store.dispatch('fetchHerbs', {page: 1})
      this.$store.dispatch('fetchCountries')
      this.$store.dispatch('fetchLanguages')
    },
    mounted () {
      this.$store.dispatch('fetchRoles')
      this.$store.dispatch('fetchAllActivity')
      this.$jQuery('body')
        .removeClass('hold-transition login-page')
        .addClass('skin-black-light sidebar-mini fixed')
    },
    computed: {
      ...mapGetters({
        activity: 'getAllActivity',
        formulas: 'getFormulas',
        herbs: 'getHerbs'
      })
    }
  }
</script>
