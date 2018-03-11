<template>
  <div class="tab-pane" id="herbs">
    <div class="box-body">
      <h3>Herbs <span data-toggle="tooltip" title="" class="badge bg-green" data-original-title="">{{herbs.total}}</span> <button type="button" class="btn btn-success pull-right" data-toggle="modal" data-target="#modalHerbCreate" @click="addHerb()"><i class="fa fa-plus"></i> Add Herb</button></h3>
    </div>
    <FBDataTable ref="herbTable" :css="css.table" :fields="fields" dataPath="items" :data="herbs"
                 :muti-sort="true" multi-sort-key="ctrl" :query="herbFilterQuery"
                 :methodName="'searchHerbs'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">
      <template slot="name" slot-scope="props">
        <router-link :to="{ name: 'Herb', params: { id: props.rowData.id }}">{{props.rowData.name}}</router-link>
        <br />
        <span class="text-muted">
              {{props.rowData.simplified_chinese}} ({{props.rowData.traditional_chinese}})
        </span>
        <br />
        <span class="text-muted">
              {{props.rowData.latin_name}} / {{props.rowData.english_name}}
        </span>
      </template>
      <template slot="created" slot-scope="props">
        <router-link v-if="props.rowData.createdBy" :to="{ name: 'Profile', params: { id: props.rowData.created_by }}">{{props.rowData.createdBy.firstname}} {{props.rowData.createdBy.lastname}}</router-link>
      </template>
      <template slot="date" slot-scope="props">
        {{props.rowData.created_time | moment("D MMMM YYYY [at] hh:mmA")}}
      </template>
      <template slot="categories" slot-scope="props">
        <span v-for="(category, index) in props.rowData.categories">
          <strong>{{ category.name }}</strong><br />
        </span>
      </template>
       <template slot="control" slot-scope="props">
        <div class="btn-group pull-right">
            <button type="button" class="btn btn-sm btn-default" data-toggle="modal" data-target="#modalHerbCreate" @click="editHerb(props.rowData)"><i class="fa fa-pencil"></i></button>
            <button type="button" class="btn btn-sm btn-default" @click="deleteHerb(props.rowData.id)"><i class="fa fa-trash"></i></button>
        </div>
      </template>
      <FBPagination slot="pagination":css="css.pagination"></FBPagination>
    </FBDataTable>
    <div class="box-footer clearfix">
      <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
    </div>
    <HerbModal></HerbModal>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import datatableConfig from '../../../../config/datatable'

  const HerbModal = () => import(/* webpackChunkName: "Modals" */ './../Modals/CreateHerb.vue')
  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBPagination.vue')
  
  export default {
    name: 'HerbTab',
    components: {
      FBDataTable,
      FBPagination,
      HerbModal
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
            name: '__slot:categories'
          },
          {
            title: 'Source Texts',
            name: '__slot:texts'
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
        herb: {
          id: '',
          pinyin: '',
          english_name: '',
          latin_name: '',
          traditional_chinese: '',
          simplified_chinese: '',
          pinyin_ton: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        }
      }
    },
    methods: {
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
      },
      onChangePage (page) {
        this.$refs.herbTable.changePage(page)
      },
      formatDate (value, fmt = 'D MMMM Y') {
        return (value === null)
          ? ''
          : this.$moment(value, 'YYYY-MM-DD').format(fmt)
      },
      filterHerbs: function () {
        this.pagination.page = 1
      },
      addHerb: function () {
        this.herb.pinyin = ''
        this.herb.english_name = ''
        this.herb.latin_name = ''
        this.herb.traditional_chinese = ''
        this.herb.simplified_chinese = ''
        this.herb.pinyin_ton = ''
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setHerbValue', this.herb)
      },
      editHerb: function (item) {
        this.herb.id = item.id
        this.herb.pinyin = item.pinyin
        this.herb.english_name = item.english_name
        this.herb.latin_name = item.latin_name
        this.herb.traditional_chinese = item.traditional_chinese
        this.herb.simplified_chinese = item.simplified_chinese
        this.herb.pinyin_ton = item.pinyin_ton
        if (item.modifiedBy === null || item.modifiedBy === undefined) this.herb.modified_by_name = ''
        else this.herb.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        if (item.createdBy === null || item.createdBy === undefined) this.herb.created_by_name = ''
        else this.herb.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.herb.modified_time = item.modified_time
        this.herb.created_time = item.created_time
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setHerbValue', this.herb)
      },
      deleteHerb: function (id) {
        let self = this
        this.$swal({
          title: 'Are you sure?',
          text: 'You will not be able to recover this herb!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it!'
        }).then(function () {
          this.$store.dispatch('setLoadingBar', 'block')
          this.$store.dispatch('setLoadingBarText', 'Deleting...')
          this.$store.dispatch('deleteHerb', {id: id})
            .then((response) => {
              this.$store.dispatch('setLoadingBar', 'none')
              this.$swal(
                'Deleted!',
                response.message,
                'success'
              ).then(function () {
                self.$refs.herbTable.reload()
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
    },
    computed: {
      ...mapGetters({
        herbs: 'getHerbs',
        modalType: 'getModalType',
        herbFilterQuery: 'getHerbFilterQuery'
      })
    },
    watch: {
      herbFilterQuery: {
        handler () {
          this.filterHerbs()
        }
      },
      modalType: {
        handler () {
          if (this.modalType === 0) this.$refs.herbTable.reload()
        }
      }
    }
  }
</script>
