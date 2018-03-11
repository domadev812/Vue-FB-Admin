<template>
  <div class="">  
    <div class="box-body"><h3>{{tabName}}&nbsp;<span data-toggle="tooltip" title="" class="badge bg-green" data-original-title="">{{generals.total}}</span> <button type="button" class="btn btn-success pull-right" data-toggle="modal" data-target="#modalGeneralCreate" @click="addGeneral()"><i class="fa fa-plus"></i> Add New</button></h3></div>
    <FBDataTable ref="generalTable" :css="css.table" :fields="fields" dataPath="items"
                 :muti-sort="true" multi-sort-key="ctrl" :tcmType = "activeTab"
                 :methodName="'fetchGenerals'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">    
      <template slot="name" slot-scope="props">
        <i class="fa fa-circle-o" v-bind:style="{color: props.rowData.color}" v-if="type === 2"></i>&nbsp;&nbsp;{{props.rowData.name}}</i>
      </template> 
      <template slot="traditional" slot-scope="props">
        {{props.rowData.traditional_chinese}}
      </template>  
      <template slot="simplified" slot-scope="props">
        {{props.rowData.simplified_chinese}}
      </template>  
      <template slot="category" slot-scope="props" v-if = "type > 0">          
          <span v-if="props.rowData.categories.length > 0">{{props.rowData.categories[props.rowData.categories.length - 1].name}}</span>
          <span v-if="props.rowData.categories.length === 0 "></span>
      </template>  
      <template slot="created" slot-scope="props">
        <router-link v-if="props.rowData.createdBy" :to="{ name: 'Profile', params: { id: props.rowData.created_by }}">{{props.rowData.createdBy.firstname}} {{props.rowData.createdBy.lastname}}</router-link>
      </template> 
      <template slot="date" slot-scope="props">
        {{props.rowData.created_time | moment("D MMMM YYYY [at] hh:mmA")}}
      </template>    
      <template slot="control" slot-scope="props">
        <div class="btn-group pull-right">
            <button type="button" class="btn btn-sm btn-default" data-toggle="modal" data-target="#modalGeneralCreate" @click="editGeneral(props.rowData)"><i class="fa fa-pencil"></i></button>
            <button type="button" class="btn btn-sm btn-default" @click.prevent="deleteGeneral(props.rowData.id)"><i class="fa fa-trash"></i></button>
        </div>
      </template>
      <FBPagination slot="pagination":css="css.pagination"></FBPagination>
    </FBDataTable>
    <div class="box-footer clearfix">
      <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
    </div>   
    <CreateGeneralModal></CreateGeneralModal>    
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import datatableConfig from '../../../../config/datatable'

  const CreateGeneralModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/CreateGeneralModal.vue')
  const CreateCautionModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/CreateCautionModal.vue')
  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBPagination.vue')

  export default {
    name: 'GeneralTab',
    components: {
      CreateGeneralModal,
      CreateCautionModal,
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
            title: 'Traditional',
            name: '__slot:traditional'
          },
          {
            title: 'Simplified',
            name: '__slot:simplified'
          },
          {
            title: 'Category',
            name: '__slot:category'
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
        general: {
          id: '',
          name: '',
          traditional_chinese: '',
          simplified_chinese: '',
          type: '',
          color: '#498a40',
          category: '',
          associated: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        selectedGeneral: {
          id: 0,
          caution_id: 0,
          herb_id: 0,
          symptom_id: 0,
          action_id: 0,
          type: ''
        }
      }
    },
    created () {
    },
    watch: {
      activeTab: {
        handler () {
          if (this.type !== 0) this.$refs.generalTable.reload()
        }
      },
      modalType: {
        handler () {
          if (this.modalType === 0 && this.type !== 0) {
            this.$refs.generalTable.reload()
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        activeTab: 'getActiveTab',
        generals: 'getGenerals',
        type: 'getTcmTabType'
      })
    },
    methods: {
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
      },
      onChangePage (page) {
        this.$refs.generalTable.changePage(page)
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
      addGeneral: function () {
        this.general.name = ''
        this.general.type = this.activeTab
        this.general.traditional_chinese = ''
        this.general.simplified_chinese = ''
        this.general.color = '#498a40'
        this.general.category = 0
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setGeneralValue', this.general)
      },
      editGeneral: function (item) {
        this.general.id = item.id
        this.general.name = item.name
        this.general.type = this.activeTab
        this.general.traditional_chinese = item.traditional_chinese
        this.general.simplified_chinese = item.simplified_chinese
        this.general.color = item.color
        if (item.categories.length > 0) this.general.category = item.categories[item.categories.length - 1].id
        else this.general.category = 0

        if (item.modifiedBy !== null) {
          this.general.modified_time = item.modified_time
          this.general.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        } else {
          this.general.modified_time = ''
          this.general.modified_by_name = ''
        }

        if (item.createdBy !== null) {
          this.general.created_time = item.created_time
          this.general.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        } else {
          this.general.created_time = ''
          this.general.created_by_name = ''
        }

        this.selectedGeneral.id = item.id
        this.selectedGeneral.type = this.activeTab
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setGeneralValue', this.general)
      },
      deleteGeneral: function (id) {
        let self = this
        let tabName = this.tabName.toLowerCase()
        tabName = tabName.substring(0, tabName.length - 1)
        this.$swal({
          title: 'Are you sure?',
          text: 'You will not be able to recover this ' + tabName + '!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it!'
        }).then(function () {
          this.$store.dispatch('setLoadingBar', 'block')
          this.$store.dispatch('setLoadingBarText', 'Deleting...')
          this.$store.dispatch('deleteGeneral', {id: id, type: this.activeTab})
            .then((response) => {
              this.$store.dispatch('setLoadingBar', 'none')
              this.$swal(
                'Deleted!',
                response.message,
                'success'
              ).then(function () {
                self.$refs.generalTable.reload()
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
      }
    }
  }
</script>