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
              <td style="padding-top:12px;"><span class="badge bg-green" style="font-size: 12pt; font-weight:400">{{ item.name }}</span></td>
              <td>
                <div class="btn-group pull-right">
                  <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalCategoryName"><i class="fa fa-pencil"></i></button>
                  <button type="button" :class="currentCategories.indexOf(item.id) > -1 ? 'btn btn-success' : 'btn btn-default'" @click="toggleCategory(item.id)"><i :class="currentCategories.indexOf(item.id) > -1 ? 'fa fa-check' : 'fa fa-plus'"></i></button>
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
          <button type="button" disabled class="btn btn-default pull-left" data-toggle="modal" data-target="#modalCategoryName"><i class="fa fa-plus-circle"></i> Create new</button>
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
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
        formula: 'getFormula',
        categories: 'getFormulasCategories',
        currentCategories: 'getFormulaCategories'
      })
    },
    data () {
      return {
        query: '',
        createdCategories: [],
        deletedCategories: []
      }
    },
    created () {
      this.$store.dispatch('fetchFormulasCategories', {query: this.query})
    },
    methods: {
      toggleCategory (id) {
        let index = this.currentCategories.indexOf(id)
        let deleted = this.deletedCategories.indexOf(id)
        if (index > -1) {
          this.currentCategories.splice(index, 1)
          this.deletedCategories.push(id)
        } else {
          this.currentCategories.push(id)
          this.deletedCategories.splice(deleted, 1)
        }
        console.log(this.currentCategories, this.deletedCategories, id)
      },
      save: function () {
        this.currentCategories.map((id, item) => {
          this.$store.dispatch('createFormulaCategory', {formula_id: this.formula.id, category_id: id})
        })
      },
      search: function (evt) {
        evt.preventDefault()
        this.$store.dispatch('fetchFormulasCategories', {query: this.query})
      }
    }
  }
</script>
