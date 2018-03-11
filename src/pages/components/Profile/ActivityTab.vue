<template>
  <div class="tab-pane no-padding no-margin" id="activity">
    <div class="box-body table-responsive no-padding no-margin">
      <FBDataTable ref="lhtable" :css="css.table" :fields="fields" dataPath="items" :data="userActivity"
                   :methodParams="$route.params.id" :muti-sort="true" multi-sort-key="ctrl"
                   :methodName="'fetchUserActivity'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">
        <template slot="icon" slot-scope="props">
          <i class="fa text-muted" v-if="props.rowData.action !== null"
             :class="{
                          'fa-pencil': (props.rowData.action === 'update'),
                          'fa-plus-circle': (props.rowData.action === 'create'),
                          'fa-trash': (props.rowData.action === 'delete')
                        }">
          </i>
        </template>
        <template slot="action" slot-scope="props">
         {{ props.rowData.message }}
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
    name: 'ActivityTab',
    components: {
      FBDataTable,
      FBPagination
    },
    data () {
      return {
        css: datatableConfig,
        fields: [
          {
            title: '',
            name: '__slot:icon'
          },
          {
            title: 'Action',
            name: '__slot:action'
          },
          {
            title: 'Date',
            name: 'relative_date'
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
        userActivity: 'getUserActivity'
      })
    }
  }
</script>
