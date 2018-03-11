<template>
  <div class="tab-pane no-padding no-margin" id="devices">
    <div class="box-body table-responsive no-padding no-margin">
      <FBDataTable ref="lhtable" :css="css.table" :fields="fields" dataPath="items" :data="userDevices"
                   :methodParams="$route.params.id" :muti-sort="true" multi-sort-key="ctrl"
                   :methodName="'fetchUserDevices'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">
        <template slot="platform" slot-scope="props">
          <span v-if="props.rowData.platform_id == 1" class="label label-default">
            iOS
          </span>
          <span class="label label-success" v-else>
            Android
          </span>
        </template>
        <FBPagination slot="pagination":css="css.pagination"></FBPagination>
      </FBDataTable>
    </div>
    <div class="box-footer clearfix">
      <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import datatableConfig from '../../../config/datatable'

  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../../../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../../../components/FBPagination.vue')
  export default {
    name: 'DeviceTab',
    components: {
      FBDataTable,
      FBPagination
    },
    data () {
      return {
        css: datatableConfig,
        fields: [
          {
            title: 'Model',
            name: 'model'
          },
          {
            title: 'Manufacturer',
            name: 'vendor'
          },
          {
            title: 'Device Platform',
            name: '__slot:platform'
          },
          {
            title: 'OS Version',
            name: 'os_version'
          },
          {
            title: 'App Version',
            name: 'app_version'
          },
          {
            title: 'Registered',
            name: 'created_time',
            callback: 'formatDate|D MMMM Y, hh:mm A',
            sortField: 'created_time',
            direction: 'asc'
          }
        ]
      }
    },
    methods: {
      iconAction (value) {
        if (value === 'login') {
          return '<span class="label label-success">Log In</span>'
        } else if (value === 'logout') {
          return '<span class="label label-danger"">Sign Out</span>'
        }
      },
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
      },
      onChangePage (page) {
        this.$refs.lhtable.changePage(page)
      },
      formatDate (value, fmt = 'D MMMM Y') {
        return (value === null)
          ? ''
          : this.$moment(value, 'YYYY-MM-DD').format(fmt)
      }
    },
    computed: {
      ...mapGetters({
        userDevices: 'getUserDevices'
      })
    }
  }
</script>
<style scoped>
  .fa {
    margin-right: 10px !important;
  }
</style>
