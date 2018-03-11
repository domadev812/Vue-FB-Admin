<template>
  <div class="">
    <div class="box-body"><h3>{{tabName}}&nbsp;<span data-toggle="tooltip" title="" class="badge bg-green" data-original-title="">{{categories.items.length}}</span> <button type="button" class="btn btn-success pull-right" data-toggle="modal" data-target="#modalCategoryCreate" @click="addCategory()"><i class="fa fa-plus"></i> Add New</button></h3></div>    <!-- Post -->
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
        <tr>
          <th>Name<i class="fa fa-caret-down"></i></th>       
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in categories.items" :key="item.id">
          <td>
            <span class="badge" style="font-size: 12pt; font-weight:400" v-bind:style="{background: item
            .color}">{{item.name}}</span>            
          </td>
          <td>          
            <div class="btn-group pull-right">
              <button type="button" class="btn btn-sm btn-default" data-toggle="modal" data-target="#modalCategoryCreate" @click="editCategory(index)"><i class="fa fa-pencil"></i></button>
              <button type="button" class="btn btn-sm btn-default" @click.prevent="deleteCategory(item.id)"><i class="fa fa-trash"></i></button>
            </div>							          
          </td>          
        </tr>
        </tbody>
      </table>      
      <div class="box-footer clearfix">
        <ul class="pagination pagination no-margin pull-right">
          <li><a href="#" @click="prevPage(1)">«</a></li>
          <li><a href="#" @click="nextPage(1)">»</a></li>
        </ul>
      </div>
    </div>
    <!-- /.table-responsive -->
    <!-- /.post -->              
    <CreateCategoryModal></CreateCategoryModal> 
  </div>
</template>
<script>
  const CreateCategoryModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/CreateCategory.vue')
  import { mapGetters } from 'vuex'
  export default {
    name: 'CategoriesTab',
    components: {
      CreateCategoryModal
    },
    data () {
      return {
        pagination: {
          page: 0
        },
        category: {
          id: '',
          name: '',
          type: '',
          color: '#498a40',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        categories: {
          items: {}
        }
      }
    },
    created () {
      // this.$store.dispatch('fetchCategories', { type: 'formula', page: this.pagination.page })
      this.getCategories()
    },
    watch: {
      pagination: {
        handler () {
          this.$store.dispatch('fetchCategories', { type: this.activeTab, page: this.pagination.page })
        },
        deep: true
      },
      activeTab: {
        handler () {
          this.getCategories()
        }
      },
      modalType: {
        handler () {
          if (this.modalType === 0) {
            this.getCategories()
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        tabName: 'getActiveTabName',
        type: 'getTcmTabType',
        modalType: 'getModalType',
        activeTab: 'getActiveTab',
        loading: 'getLoadingBar'
      })
    },
    methods: {
      nextPage: function (p) {
        this.pagination.page = this.pagination.page + p
      },
      prevPage: function (p) {
        this.pagination.page = this.pagination.page - p
      },
      addCategory: function () {
        this.category.name = ''
        this.category.type = this.activeTab
        this.category.color = '#498a40'
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setCategoryValue', this.category)
      },
      editCategory: function (index) {
        let item = this.categories.items[index]
        this.category.name = item.name
        this.category.type = this.activeTab
        this.category.color = item.color
        this.category.modified_time = item.modified_time
        this.category.created_time = item.created_time
        if (item.modifiedBy === null || item.modifiedBy === undefined) this.category.modified_by_name = ''
        else this.category.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        if (item.createdBy === null || item.createdBy === undefined) this.category.created_by_name = ''
        else this.category.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.category.id = item.id
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setCategoryValue', this.category)
      },
      getCategories () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.$store.dispatch('fetchCategories', { type: this.activeTab, page: this.pagination.page })
          .then((response) => {
            this.categories = response
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
      deleteCategory (id) {
        let self = this
        this.$swal({
          title: 'Are you sure?',
          text: 'You will not be able to recover this category!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it!'
        }).then(function () {
          this.$store.dispatch('setLoadingBar', 'block')
          this.$store.dispatch('setLoadingBarText', 'Deleting...')
          this.$store.dispatch('deleteCategory', id)
            .then((response) => {
              this.$swal(
                'Deleted!',
                response.message,
                'success'
              ).then(function () {
                self.getCategories()
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
