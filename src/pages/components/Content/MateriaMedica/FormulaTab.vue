<template>
  <div class="tab-pane active" id="formulas">
    <div class="box-body">
      <h3>Formulas <span data-toggle="tooltip" title="" class="badge bg-green" data-original-title="">{{formulas.total}}</span> <button type="button" class="btn btn-success pull-right" data-toggle="modal" data-target="#modalFormulaCreate" @click="addFormula()"><i class="fa fa-plus"></i> Add Formula</button></h3>
    </div>
    <FBDataTable ref="formulaTable" :css="css.table" :fields="fields" dataPath="items" :data="formulas"
                 :muti-sort="true" multi-sort-key="ctrl" :query="formulaFilterQuery"
                 :methodName="'searchFormulas'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">
      <template slot="name" slot-scope="props">
        <router-link :to="{ name: 'Formula', params: { id: props.rowData.id }}">{{props.rowData.pinyin}}</router-link>
        <br />
        <span class="text-muted">
              {{props.rowData.simplified_chinese}}({{props.rowData.traditional_chinese}})
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
            <button type="button" class="btn btn-sm btn-default" data-toggle="modal" data-target="#modalFormulaCreate" @click="editFormula(props.rowData)"><i class="fa fa-pencil"></i></button>
            <button type="button" class="btn btn-sm btn-default" @click="deleteFormula(props.rowData.id)"><i class="fa fa-trash"></i></button>
        </div>
      </template>
      <FBPagination slot="pagination":css="css.pagination"></FBPagination>
    </FBDataTable>
    <div class="box-footer clearfix">
      <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
    </div>
    <FormulaModal></FormulaModal>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import datatableConfig from '../../../../config/datatable'

  const FormulaModal = () => import(/* webpackChunkName: "Modals" */ './../Modals/CreateFormula.vue')
  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBPagination.vue')

  export default {
    name: 'FormulaTab',
    components: {
      FBDataTable,
      FBPagination,
      FormulaModal
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
        loadDataFlag: false,
        formula: {
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
        this.$refs.formulaTable.changePage(page)
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
      filterFormulas: function () {
        this.pagination.page = 1
      },
      addFormula: function () {
        this.formula.pinyin = ''
        this.formula.english_name = ''
        this.formula.latin_name = ''
        this.formula.traditional_chinese = ''
        this.formula.simplified_chinese = ''
        this.formula.pinyin_ton = ''
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setFormulaValue', this.formula)
      },
      editFormula: function (item) {
        this.formula.id = item.id
        this.formula.pinyin = item.pinyin
        this.formula.english_name = item.english_name
        this.formula.latin_name = item.latin_name
        this.formula.traditional_chinese = item.traditional_chinese
        this.formula.simplified_chinese = item.simplified_chinese
        this.formula.pinyin_ton = item.pinyin_ton
        if (item.modifiedBy === null || item.modifiedBy === undefined) this.formula.modified_by_name = ''
        else this.formula.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        this.formula.modified_time = item.modified_time
        if (item.createdBy === null || item.createdBy === undefined) this.formula.created_by_name = ''
        else this.formula.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.formula.created_time = item.created_time
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setFormulaValue', this.formula)
      },
      deleteFormula: function (id) {
        let self = this
        this.$swal({
          title: 'Are you sure?',
          text: 'You will not be able to recover this formula!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it!'
        }).then(function () {
          this.$store.dispatch('setLoadingBar', 'block')
          this.$store.dispatch('setLoadingBarText', 'Deleting...')
          this.$store.dispatch('deleteFormula', {id: id})
            .then((response) => {
              this.$store.dispatch('setLoadingBar', 'none')
              this.$swal(
                'Deleted!',
                response.message,
                'success'
              ).then(function () {
                self.$refs.formulaTable.reload()
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
        formulas: 'getFormulas',
        modalType: 'getModalType',
        filterFlag: 'getFilterFlag',
        formulaFilterQuery: 'getFormulaFilterQuery'
      })
    },
    created () {
      // this.$store.dispatch('fetchFormulas', { page: this.pagination.page })
    },
    watch: {
      formulaFilterQuery: {
        handler () {
          this.filterFormulas()
        }
      },
      modalType: {
        handler () {
          if (this.modalType === 0) {
            this.$refs.formulaTable.reload()
          }
        }
      }
    }
  }
</script>
