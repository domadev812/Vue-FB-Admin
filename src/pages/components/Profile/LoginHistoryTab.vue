<template>
  <div class="tab-pane no-padding no-margin" id="loginhistory">
    <div class="box-body table-responsive no-padding no-margin">
      <FBDataTable ref="lhtable" :css="css.table" :fields="fields" dataPath="items" :data="userLoginHistory"
                   :methodParams="$route.params.id" :muti-sort="true" multi-sort-key="ctrl"
                   :methodName="'fetchUserLoginHistory'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">
        <template slot="actions" slot-scope="props">
          {{props.rowData.browser || 'Unknown'}}<p class="text-muted">{{props.rowData.os || 'Unknown'}}</p>
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
    name: 'LoginHistoryTab',
    components: {
      FBDataTable,
      FBPagination
    },
    // r61326
    data () {
      return {
        css: datatableConfig,
        fields: [
          {
            title: 'Location',
            name: 'location',
            sortField: 'location'
          },
          {
            title: 'Browser / OS',
            name: '__slot:actions',
            sortField: 'browser'
          },
          {
            title: 'IP Address',
            name: 'ip_address'
          },
          {
            title: 'Time',
            name: 'created_time',
            callback: 'formatDate|D MMMM Y, hh:mm A',
            sortField: 'created_time',
            direction: 'asc'
          },
          {
            title: 'Action',
            name: 'action',
            sortField: 'action',
            callback: 'iconAction'
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
        userLoginHistory: 'getUserLoginHistory'
      })
    }
  }
</script>
<style scoped>
  .fa {
    margin-right: 10px !important;
  }
</style>
