<template>
  <div class="modal fade" id="modalFormulaCategories" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <h4 class="modal-title" id="myModalLabel">Formulas Categories</h4>
        </div>
        <div class="modal-header no-padding">
          <form action="#" method="get" class="sidebar-form" @submit="search">
            <div class="input-group">
              <input type="text" name="q" class="form-control" placeholder="Search..." v-model="query">
              <span class="input-group-btn">
                <button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i>
                </button>
              </span>
            </div>
          </form>
        </div>
        <div class="modal-body no-padding" style="overflow: auto; position:relative; height:460px;">
          <table class="table table-hover">
            <tbody v-if="categories && categories.length > 0">
            <tr v-for="(item, key) in categories" :key="key">
              <td style="padding-top:12px;">
              <span class="badge" style="font-size: 12pt; font-weight:400" v-bind:style="{background: item.color}">{{item.name}}</span>              
              <td>
                <div class="btn-group pull-right">                  
                  <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalCategoryCreate" @click="editCategory(key)"><i class="fa fa-pencil"></i></button>
                  <button type="button" :class="selectedCategoriesIds.indexOf(item.id) > -1 ? 'btn btn-success' : 'btn btn-default'" @click="toggleCategory(item.id)"><i :class="selectedCategoriesIds.indexOf(item.id) > -1 ? 'fa fa-check' : 'fa fa-plus'"></i></button>
                </div>
              </td>
            </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="2">
                  No categories
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default pull-left" data-toggle="modal" data-target="#modalCategoryCreate" @click="addCategory()"><i class="fa fa-plus-circle"></i> Create new</button>          
          <button type="button" class="btn btn-default" data-dismiss="modal" ref="dialogClose" @click="close">Close</button>
          <button type="button" class="btn btn-primary" @click="save">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'FormulaCategories',
    computed: {
      ...mapGetters({
        categories: 'getFormulasCategories',
        currentCategoriesIds: 'getFormulaCategoryIds',
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        loading: 'getLoadingBar'
      })
    },
    data () {
      return {
        query: '',
        selectedCategoriesIds: [],
        selectedCategories: [],
        result: '',
        category: {
          id: '',
          name: '',
          type: '',
          color: '#498a40',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        }
      }
    },
    created () {
      this.$store.dispatch('fetchFormulasCategories', {query: this.query})
    },
    watch: {
      currentCategoriesIds: {
        handler () {
          this.selectedCategoriesIds = Object.assign([], this.currentCategoriesIds)
        }
      },
      modalType: {
        handler () {
          this.result = ''
          if (this.modalType === 5) this.selectedCategoriesIds = Object.assign([], this.currentCategoriesIds)
          if (this.modalType === 0 && this.tabName === 'Info') {
            this.result = 'success'
            // this.fetchFormulasCategories()
          }
        }
      }
    },
    methods: {
      fetchFormulasCategories: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.$store.dispatch('fetchFormulasCategories', {query: this.query})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
          })
      },
      toggleCategory (id) {
        let index = this.selectedCategoriesIds.indexOf(id)
        if (index > -1) {
          this.selectedCategoriesIds.splice(index, 1)
        } else {
          this.selectedCategoriesIds.push(id)
        }
      },
      save: function () {
        this.selectedCategories = []
        this.categories.map((item, ind) => {
          let index = this.selectedCategoriesIds.indexOf(item.id)
          if (index > -1) {
            this.selectedCategories.push(item)
          }
        })
        this.$store.dispatch('setFormulaCategories', this.selectedCategories)
        this.result = 'success'
        const btn = this.$refs.dialogClose
        btn.click()
      },
      search: function (evt) {
        evt.preventDefault()
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Searching...')
        this.$store.dispatch('fetchFormulasCategories', {query: this.query})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
          }).catch((error) => {
            console.log(error)
          })
      },
      addCategory: function () {
        this.category.name = ''
        this.category.type = 'formula'
        this.category.color = '#498a40'
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setCategoryValue', this.category)
      },
      editCategory: function (index) {
        let item = this.categories[index]
        this.category.name = item.name
        this.category.type = 'formula'
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
      close: function () {
        if (this.result === 'success') {
          this.$store.dispatch('setModalType', 4)
        } else {
          this.$store.dispatch('setModalType', 6)
        }
      }
    }
  }
</script>
