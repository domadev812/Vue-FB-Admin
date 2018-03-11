<template>
  <div class="">
    <div class="box-body"><h3>{{tabName}}&nbsp;<span data-toggle="tooltip" title="" class="badge bg-green" data-original-title="">10</span> <button type="button" class="btn btn-success pull-right" data-toggle="modal" data-target="#modalGeneralCreate" @click="addCategory()"><i class="fa fa-plus"></i> Add New</button></h3></div>
    <!-- Post -->
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
        <tr>
          <th>Name<i class="fa fa-caret-down"></i></th>
          <th>Chinese (Simplified) <i class="fa fa-caret-down"></i></th>
          <th>Chinese (Traditional) <i class="fa fa-caret-down"></i></th>
          <th v-if="type === 0">PinYin <i class="fa fa-caret-down"></i></th>
          <th v-if="type === 1">Description</i></th>
          <th v-if="type === 1">Associated <i class="fa fa-caret-down"></i></th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in formulas.items" :key="item.id">
          <td>{{tabName}}</td>
          <td>心证</td>
          <td>心气虚证</td>
          <td v-if="type === 0">xqxz</td>
          <td v-if="type === 1">This is description</td>
          <td v-if="type === 1">3</td>
          <td>
            <div class="btn-group pull-right">
              <button type="button" class="btn btn-sm btn-default" data-toggle="modal" data-target="#modalFlavourEdit" @click="editCategory(1)"><i class="fa fa-pencil"></i></button>
              <button type="button" class="btn btn-sm btn-default" @click="deleteDiagnosis(1)"><i class="fa fa-trash"></i></button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <FormulaModal></FormulaModal>
      <div class="box-footer clearfix">
        <ul class="pagination pagination no-margin pull-right">
          <li><a href="#" @click="prevPage(1)">«</a></li>
          <li><a href="#" @click="nextPage(1)">»</a></li>
        </ul>
      </div>
    </div>
    <!-- /.table-responsive -->
    <!-- /.post -->
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  const FormulaModal = () => import(/* webpackChunkName: "Modals" */ './../Modals/CreateFormula.vue')

  export default {
    name: 'DiagnosisTab',
    components: {
      FormulaModal
    },
    data () {
      return {
        pagination: {
          page: 1
        }
      }
    },
    created () {
      this.$store.dispatch('fetchFormulas', { page: this.pagination.page })
    },
    watch: {
      pagination: {
        handler () {
          this.$store.dispatch('fetchFormulas', { page: this.pagination.page })
        },
        deep: true
      }
    },
    computed: {
      ...mapGetters({
        formulas: 'getFormulas',
        tabName: 'getActiveTabName',
        type: 'getTcmTabType'
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
        this.$store.dispatch('setModalType', 0)
      },
      deleteCategory: function (id) {
      },
      editCategory: function (id) {
        this.$store.dispatch('setModalType', 1)
      }
    }
  }
</script>
