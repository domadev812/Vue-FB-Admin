<template>
  <div class="col-md-12">    
    <div class="box-body">
      <h3>Books <span data-toggle="tooltip" title="" class="badge bg-green" data-original-title="3 New Messages" aria-describedby="tooltip394092">{{allBooks.total}}</span> <button type="button" class="btn btn-success pull-right" data-toggle="modal" data-target="#modalBookCreate" @click="addBook()"><i class="fa fa-plus"></i> Add book</button></h3>
    </div>
    <FBDataTable ref="tableBook" :css="css.table" :fields="fields" dataPath="items" :data="books"
                 :muti-sort="true" multi-sort-key="ctrl" :refreshTable="refreshTable"
                 :methodName="'fetchBooks'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">  
      <template slot="english" slot-scope="props" style = "width: 30%">
        <router-link :to="{ name: 'Book', params: { id: props.rowData.id }}">{{props.rowData.english_name}}</router-link>
      </template>
      <template slot="created" slot-scope="props">
        <router-link v-if="props.rowData.createdBy" :to="{ name: 'Profile', params: { id: props.rowData.created_by }}">{{props.rowData.createdBy.firstname}} {{props.rowData.createdBy.lastname}}</router-link>
      </template>    
      <template slot="chinese" slot-scope="props">
        {{props.rowData.chinese_name}}
      </template>
      <template slot="author" slot-scope="props">
        {{props.rowData.author}}/{{props.rowData.chinese_author}}
      </template>
      <template slot="year" slot-scope="props">
        {{props.rowData.year}}
      </template>
      <template slot="date" slot-scope="props">
        {{props.rowData.created_time | moment("D MMMM YYYY [at] hh:mmA")}}
      </template>
      <template slot="control" slot-scope="props">
        <div class="btn-group pull-right">
            <button type="button" class="btn btn-sm btn-default" data-toggle="modal" data-target="#modalBookCreate" @click="editBook(props.rowData)"><i class="fa fa-pencil"></i></button>
            <button type="button" class="btn btn-sm btn-default" @click="deleteBook(props.rowData.id)"><i class="fa fa-trash"></i></button>
        </div>
      </template>
      <FBPagination slot="pagination":css="css.pagination"></FBPagination>
    </FBDataTable>
    <div class="box-footer clearfix">
      <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
    </div>    
    <CreateBookModal></CreateBookModal>      
  </div>
</template>
<style>
  .fbdatatable-th-slot-english {
    width: 30% !important;
  }
</style>
<script>
  import { mapGetters } from 'vuex'
  import datatableConfig from '../../../../config/datatable'

  const CreateBookModal = () => import(/* webpackChunkName: "Modals" */ './../TextsModal/CreateBookModal.vue')
  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBPagination.vue')

  export default {
    name: 'BooksView',
    components: {
      CreateBookModal,
      FBDataTable,
      FBPagination
    },
    data () {
      return {
        css: datatableConfig,
        fields: [
          {
            title: 'English',
            name: '__slot:english'
          },
          {
            title: 'Chinese',
            name: '__slot:chinese'
          },
          {
            title: 'Author',
            name: '__slot:author'
          },
          {
            title: 'Year',
            name: '__slot:year'
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
        books: {
          items: {}
        },
        book: {
          id: 0,
          english_name: '',
          chinese_name: '',
          year: 2013,
          author: '',
          chinese_author: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        }
      }
    },
    created () {
      this.getBooks()
    },
    watch: {
      modalType: {
        handler () {
          if (this.modalType === 0) {
            this.$refs.tableBook.reload()
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        modalType: 'getModalType',
        refreshTable: 'getRefreshTable',
        allBooks: 'getBooks'
      })
    },
    methods: {
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
      },
      onChangePage (page) {
        this.$refs.tableBook.changePage(page)
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
      addBook: function () {
        this.book.english_name = ''
        this.book.chinese_name = ''
        this.book.year = 2013
        this.book.author = ''
        this.book.chinese_author = ''
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setBookValue', this.book)
      },
      editBook: function (item) {
        this.book.english_name = item.english_name
        this.book.chinese_name = item.chinese_name
        this.book.year = item.year
        this.book.author = item.author
        this.book.chinese_author = item.chinese_author
        this.book.modified_time = item.modified_time
        this.book.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        this.book.created_time = item.created_time
        this.book.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.book.id = item.id
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setBookValue', this.book)
      },
      getBooks () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.$store.dispatch('fetchBooks', { page: this.pagination.page })
          .then((response) => {
            this.books = response
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
      deleteBook (id) {
        this.$swal({
          title: 'Are you sure?',
          text: 'You will not be able to recover this book!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it!'
        }).then(function () {
          this.$store.dispatch('setLoadingBar', 'block')
          this.$store.dispatch('setLoadingBarText', 'Deleting book...')
          this.$store.dispatch('deleteBook', id)
            .then((response) => {
              this.$store.dispatch('setLoadingBar', 'none')
              this.$refs.tableBook.reload()
              this.$swal(
                'Deleted!',
                response.message,
                'success'
              )
              this.getBooks()
            })
            .catch((error) => {
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
