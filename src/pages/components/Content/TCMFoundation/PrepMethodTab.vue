<template>
  <div class="">
    <div class="box-body"><h3>{{tabName}}&nbsp;<span data-toggle="tooltip" title="" class="badge bg-green" data-original-title="">{{allPrepMethods.total}}</span> <button type="button" class="btn btn-success pull-right" data-toggle="modal" data-target="#modalPrepMethodCreate" @click="addPrepMethod()"><i class="fa fa-plus"></i> Add New</button></h3></div>
    <FBDataTable ref="prepTable" :css="css.table" :fields="fields" dataPath="items" :data="prepMethods"
                 :muti-sort="true" multi-sort-key="ctrl" :refreshTable="refreshTable" 
                 :methodName="'fetchPrepMethods'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">  
                 
      <template slot="name" slot-scope="props">
        {{props.rowData.name}}
      </template>
      <template slot="category" slot-scope="props">
          <span v-if="props.rowData.categories.length > 0">{{props.rowData.categories[0].name}}</span>
          <span v-else></span>
      </template>  
      <template slot="method" slot-scope="props">
        {{props.rowData.method}}
      </template>
      <template slot="created" slot-scope="props">
        <router-link v-if="props.rowData.createdBy" :to="{ name: 'Profile', params: { id: props.rowData.created_by }}">{{props.rowData.createdBy.firstname}} {{props.rowData.createdBy.lastname}}</router-link>
      </template> 
      <template slot="date" slot-scope="props">
        {{props.rowData.created_time | moment("D MMMM YYYY [at] hh:mmA")}}
      </template> 
      <template slot="control" slot-scope="props">
        <div class="btn-group pull-right">
            <button type="button" class="btn btn-sm btn-default" data-toggle="modal" data-target="#modalPrepMethodCreate" @click="editPrepMethod(props.rowData)"><i class="fa fa-pencil"></i></button>
            <button type="button" class="btn btn-sm btn-default" @click.prevent="deletePrepMethod(props.rowData.id)"><i class="fa fa-trash"></i></button>
        </div>
      </template>   
      <FBPagination slot="pagination":css="css.pagination"></FBPagination>
    </FBDataTable>
    <div class="box-footer clearfix">
      <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
    </div>    
    <CreatePrepMethodModal></CreatePrepMethodModal>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import datatableConfig from '../../../../config/datatable'

  const CreatePrepMethodModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/CreatePrepMethodModal.vue')
  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBPagination.vue')

  export default {
    name: 'PrepMethodTab',
    components: {
      CreatePrepMethodModal,
      FBDataTable,
      FBPagination
    },
    data () {
      return {
        css: datatableConfig,
        fields: [
          {
            title: 'Name',
            name: '__slot:name'
          },
          {
            title: 'Category',
            name: '__slot:category'
          },
          {
            title: 'Method',
            name: '__slot:method'
          },
          {
            title: 'Associated',
            name: '__slot:associated'
          },
          {
            title: 'Created',
            name: '__slot:created'
          },
          {
            title: 'Date',
            name: '__slot:date'
          },
          {
            title: '',
            name: '__slot:control'
          }
        ],
        pagination: {
          page: 1
        },
        prepMethod: {
          id: '',
          name: '',
          method: '',
          category: 0,
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        prepMethods: {
          items: {}
        }
      }
    },
    created () {
      // this.getPreparations()
    },
    watch: {
      pagination: {
        handler () {
          this.$store.dispatch('fetchFormulas', { page: this.pagination.page })
        },
        deep: true
      },
      modalType: {
        handler () {
          if (this.modalType === 0 && this.type === 2) {
            this.$refs.prepTable.reload()
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        refreshTable: 'getRefreshTable',
        allPrepMethods: 'getPrepMethods',
        type: 'getTcmTabType'
      })
    },
    methods: {
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
      },
      onChangePage (page) {
        this.$refs.prepTable.changePage(page)
      },
      formatDate (value, fmt = 'D MMMM Y') {
        return (value === null)
          ? ''
          : this.$moment(value, 'YYYY-MM-DD').format(fmt)
      },
      nextPage: function (p) {
        this.pagination.page = this.pagination.page + p
      },
      prevPage: function (p) {
        this.pagination.page = this.pagination.page - p
      },
      getPreparations () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.$store.dispatch('fetchPrepMethods', { type: this.activeTab, page: this.pagination.page })
          .then((response) => {
            this.prepMethods = response
            this.$store.dispatch('setLoadingBar', 'none')
          })
          .catch((error) => {
            this.$swal(
              'Error!',
              error.message,
              'error'
            )
          })
      },
      addPrepMethod: function () {
        this.prepMethod.name = ''
        this.prepMethod.method = ''
        this.prepMethod.category = 0
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setPrepMethodValue', this.prepMethod)
      },
      deletePrepMethod: function (id) {
        let self = this
        this.$swal({
          title: 'Are you sure?',
          text: 'You will not be able to recover this prep method!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it!'
        }).then(function () {
          this.$store.dispatch('setLoadingBar', 'block')
          this.$store.dispatch('setLoadingBarText', 'Deleting...')
          this.$store.dispatch('deletePrepMethod', {id: id, type: this.prepMethod.type})
            .then((response) => {
              this.$store.dispatch('setLoadingBar', 'none')
              this.$swal(
                'Deleted!',
                response.message,
                'success'
              ).then(function () {
                self.$refs.prepTable.reload()
              })
            })
            .catch((error) => {
              this.$store.dispatch('setLoadingBar', 'none')
              this.$swal(
                'Error!',
                error.message,
                'error'
              )
            })
        }.bind(this), function (dismiss) {
          if (dismiss === 'cancel') {
            this.$swal(
              'Cancelled',
              'Cancelled',
              'error'
            )
          }
        }.bind(this))
      },
      editPrepMethod: function (item) {
        this.prepMethod.name = item.name
        this.prepMethod.method = item.method
        if (item.categories.length > 0) this.prepMethod.category = item.categories[0].id
        else this.prepMethod.category = 0
        this.prepMethod.modified_time = item.modified_time
        this.prepMethod.created_time = item.created_time
        if (item.modifiedBy === null || item.modifiedBy === undefined) this.prepMethod.modified_by_name = ''
        else this.prepMethod.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        if (item.createdBy === null || item.createdBy === undefined) this.prepMethod.created_by_name = ''
        else this.prepMethod.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.prepMethod.id = item.id
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setPrepMethodValue', this.prepMethod)
      }
    }
  }
</script>
