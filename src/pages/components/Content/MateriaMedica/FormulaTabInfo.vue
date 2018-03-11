<template>
  <div class="tab-pane active" id="info">
    <div class="box-body">
      <h3>Basic Information
        <span data-toggle="tooltip" title="" class="badge bg-green">{{ selectedCategories.length }}</span>
      </h3>
    </div>
    <div class="row no-margin">
      <div class="col-md-12">
        <div class="box box-default box-solid">
          <div class="box-header with-border">
            <h3 class="box-title">Categories</h3>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-toggle="modal" data-target="#modalFormulaCategories" @click="addCategory()"><i class="fa fa-plus-circle"></i> Category</button>
              <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
              </button>
            </div>
            <!-- /.box-tools -->
          </div>
          <!-- /.box-header -->
          <div class="box-body no-padding" style="display: block;">
            <table class="table table-hover">
              <tbody v-if="selectedCategories.length > 0">
              <tr v-for="(item, key) in selectedCategories">
                <td style="padding-top:12px;">                  
                  <span class="badge" style="font-size: 12pt; font-weight:400" v-bind:style="{background: item.color}">{{item.name}}</span>              
                </td>
                <td>
                  <div class="pull-right">
                    <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="Remove"  @click="removeCategory(key)"><i class="fa fa-times"></i></button>
                  </div>
                </td>
              </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="2" style="text-align:center;">
                    No Categories
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.box-body -->
          <div class="box-footer clearfix" style="display: block;">
            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalFormulaCategories" @click="addCategory()"><i class="fa fa-plus"></i> Add</button>
          </div>
        </div>
      </div>
    </div>
    <CreateCategoryModal></CreateCategoryModal>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  const CreateCategoryModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/CreateCategory.vue')
  export default {
    name: 'FormulaTabInfo',
    components: {
      CreateCategoryModal
    },
    data () {
      return {
        selectedCategories: []
      }
    },
    computed: {
      ...mapGetters({
        formulaCategories: 'getFormulaCategories'
      })
    },
    watch: {
      formulaCategories: {
        handler () {
          this.selectedCategories = Object.assign([], this.formulaCategories)
        }
      }
    },
    methods: {
      addCategory: function () {
        this.switchTabs('Info')
        this.$store.dispatch('setModalType', 5)
      },
      removeCategory: function (index) {
        this.selectedCategories.splice(index, 1)
        this.$store.dispatch('setFormulaCategories', this.selectedCategories)
      },
      switchTabs (tabName) {
        this.$store.dispatch('setTabName', tabName)
      }
    }
  }
</script>
