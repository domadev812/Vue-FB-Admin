<template>
  <div class="">
    <div class="box-body">
      <h3>{{tabName}}&nbsp;<span data-toggle="tooltip" title="" class="badge bg-green" data-original-title="">{{allHerbologies.total}}</span> <button type="button" class="btn btn-success pull-right" data-toggle="modal" data-target="#modalHerbologyGeneranCreate" @click="addHerbology()"><i class="fa fa-plus"></i> Add New</button></h3>
    </div>    
    <FBDataTable ref="herbologyTable" :css="css.table" :fields="fields" dataPath="items" :data="herbologies"
                 :muti-sort="true" multi-sort-key="ctrl" :refreshTable="refreshTable"
                 :methodName="'fetchHerbologies'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">  
      <template slot="name" slot-scope="props">
        {{props.rowData.name}}
      </template>
      <template slot="linked" slot-scope="props" v-if="type === 1">
        3
      </template>  
      <template slot="created" slot-scope="props">
        <router-link v-if="props.rowData.createdBy" :to="{ name: 'Profile', params: { id: props.rowData.created_by }}">{{props.rowData.createdBy.firstname}} {{props.rowData.createdBy.lastname}}</router-link>
      </template> 
      <template slot="date" slot-scope="props">
        {{props.rowData.created_time | moment("D MMMM YYYY [at] hh:mmA")}}
      </template> 
      <template slot="control" slot-scope="props">
        <div class="btn-group pull-right">
            <button type="button" class="btn btn-sm btn-default" data-toggle="modal" data-target="#modalHerbologyGeneranCreate" @click="editHerbology(props.rowData)"><i class="fa fa-pencil"></i></button>
            <button type="button" class="btn btn-sm btn-default" @click.prevent="deleteHerbology(props.rowData.id)"><i class="fa fa-trash"></i></button>
        </div>
      </template>    
      <FBPagination slot="pagination":css="css.pagination"></FBPagination>
    </FBDataTable>
    <div class="box-footer clearfix">
      <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
    </div>
    <!-- Post -->   
    <!-- /.table-responsive -->
    <!-- /.post -->
    <CreateHerbologyModal></CreateHerbologyModal>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import datatableConfig from '../../../../config/datatable'

  const CreateHerbologyModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/CreateHerbologyModal.vue')
  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBPagination.vue')

  export default {
    name: 'HerbologyGeneralTab',
    components: {
      CreateHerbologyModal,
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
            title: 'Linked',
            name: '__slot:linked'
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
        herbology: {
          id: '',
          name: '',
          type: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        herbologies: {
          items: {}
        }
      }
    },
    created () {
      // if (this.type === 0) this.getHerbologies()
    },
    watch: {
      activeTab: {
        handler () {
          if (this.type !== 2) this.$refs.herbologyTable.reload()
        }
      },
      modalType: {
        handler () {
          if (this.modalType === 0 && this.type !== 2) {
            this.$refs.herbologyTable.reload()
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        activeTab: 'getActiveTab',
        refreshTable: 'getRefreshTable',
        allHerbologies: 'getHerbologies',
        type: 'getTcmTabType'
      })
    },
    methods: {
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
      },
      onChangePage (page) {
        this.$refs.herbologyTable.changePage(page)
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
      getHerbologies () {
        if (this.type !== 0) return
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.$store.dispatch('fetchHerbologies', { type: this.activeTab, page: this.pagination.page })
          .then((response) => {
            this.herbologies = response
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
      addHerbology: function () {
        this.herbology.name = ''
        this.herbology.type = this.activeTab
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setHerbologyValue', this.herbology)
      },
      deleteHerbology: function (id) {
        let self = this
        this.$swal({
          title: 'Are you sure?',
          text: 'You will not be able to recover this ' + this.tabName.toLowerCase() + '!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it!'
        }).then(function () {
          this.$store.dispatch('setLoadingBar', 'block')
          this.$store.dispatch('setLoadingBarText', 'Deleting...')
          this.$store.dispatch('deleteHerbology', {id: id, type: this.activeTab})
            .then((response) => {
              this.$store.dispatch('setLoadingBar', 'none')
              this.$swal(
                'Deleted!',
                response.message,
                'success'
              ).then(function () {
                self.$refs.herbologyTable.reload()
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
      editHerbology: function (item) {
        this.herbology.name = item.name
        this.herbology.type = this.activeTab
        this.herbology.modified_time = item.modified_time
        if (item.modifiedBy === null) this.herbology.modified_by_name = ''
        else this.herbology.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        this.herbology.created_time = item.created_time
        if (item.createddBy === null) this.herbology.created_by_name = ''
        else this.herbology.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.herbology.id = item.id
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setHerbologyValue', this.herbology)
      }
    }
  }
</script>
