<template>
  <div class="tab-pane" id="activity">
    <div class="box-body">
      <h3>Activity</h3>
    </div>
    <FBDataTable ref="lhtable" :css="css.table" :fields="fields" dataPath="items" :data="materiaActivity"
                 :muti-sort="true" multi-sort-key="ctrl"
                 :methodName="'fetchMateriaActivity'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">
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
        <span v-if="props.rowData.action != 'delete'">
                <router-link v-if="props.rowData.object && props.rowData.type === 'formula'" :to="{ name: 'Formula', params: { id: props.rowData.obj_id }}">{{ props.rowData.object.name }}</router-link>
                <router-link v-if="props.rowData.object && props.rowData.type === 'herb'" :to="{ name: 'Herb', params: { id: props.rowData.obj_id }}">{{ props.rowData.object.name }}</router-link>
              </span>
        <span v-else>
          {{ props.rowData.object.name }}
        </span>
      </template>
      <template slot="user" slot-scope="props">
        <router-link v-if="props.rowData.user" :to="{ name: 'Profile', params: { id: props.rowData.created_by }}">{{props.rowData.user.firstname}} {{props.rowData.user.lastname}}</router-link>
      </template>
      <FBPagination slot="pagination":css="css.pagination"></FBPagination>
    </FBDataTable>
    <div class="box-footer clearfix">
      <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import datatableConfig from '../../../../config/datatable'

  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBPagination.vue')

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
            title: 'User',
            name: '__slot:user'
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
    created () {
      this.$store.dispatch('fetchMateriaActivity', { page: this.$route.query.page || 1 })
      this.$store.dispatch('setLoadingBar', 'block')
      this.$store.dispatch('setLoadingBarText', 'Loading...')
    },
    computed: {
      ...mapGetters({
        materiaActivity: 'getMateriaActivity'
      })
    },
    watch: {
      materiaActivity: {
        handler () {
          this.$store.dispatch('setLoadingBar', 'none')
          this.$store.dispatch('setLoadingBarText', 'Loading...')
        }
      }
    }
  }
</script>
