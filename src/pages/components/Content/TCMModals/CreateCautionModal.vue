<template>
  <div class="modal fade" id="modalCautionCreate" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 1">Add Caution</h4>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 2">Edit Caution</h4>
        </div>
        <div class="modal-body">
          <form role="form">
            <div class="form-group">
              <label>Name</label>
              <input type="text" class="form-control" placeholder="Enter English Name" v-model="caution.name">
            </div>
            <div class="form-group">
              <label>Traditional</label>
              <input type="text" class="form-control" placeholder="Enter Chinese Name" v-model="caution.traditional_chinese">
            </div>
            <div class="form-group">
              <label>Simplified</label>
              <input type="text" class="form-control" placeholder="Enter Chinese Name" v-model="caution.simplified_chinese">
            </div>
            <div class="form-group">
                <FBSelect
                    @select2="category_item = $event"
                    :selectVal="category_item"
                    :selectId="'categorySelect'"
                    :defaultClass = "'select-full-width'"
                    :options="categories">
                    <label for="categorySelect" class="control-label" slot="before">Category</label>
                </FBSelect>        
            </div>                        
            <div class="modal-body" v-if = "this.modalType === 2">	  		
              <div class="description"><b>Modified by</b> <a class="pull-right"><span class="badge bg-blue">{{caution.modified_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{caution.modified_time}}</p></div>
              <div class="description"><b>Created by</b> <a class="pull-right"><span class="badge bg-blue">{{caution.created_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="123">{{caution.created_time}}</p></div>	  		
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-lg btn-danger pull-left" data-dismiss="modal" @click="deleteCaution()" v-if = "this.modalType === 2"><i class="fa fa-trash"></i> Delete</button>
              <button type="button" class="btn btn-lg btn-default" data-dismiss="modal" ref="dialogClose" @click="close()">Cancel</button>
              <button type="button" class="btn btn-lg btn-success" @click="save()" v-if = "this.modalType === 1">Create</button>
              <button type="button" class="btn btn-lg btn-success" @click="update()" v-if = "this.modalType === 2">Update</button>
            </div>                        
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .select2-container {
    width: 100% !important;
  }
  .select2-dropdown {
    z-index: 9999 !important;
  }
</style>
<script>
  import { mapGetters } from 'vuex'
  const FBSelect = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBSelect.vue')
  export default {
    name: 'CreatePrepMethod',
    components: {
      FBSelect
    },
    data () {
      return {
        caution: {
          id: '',
          name: '',
          type: '',
          traditional_chinese: '',
          simplified_chinese: '',
          category: 0,
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        cautionCategory: {
          caution_id: 0,
          category_id: 0
        },
        result: '',
        category_item: 0
      }
    },
    computed: {
      ...mapGetters({
        modalType: 'getModalType',
        selectedCaution: 'getCaution',
        tabName: 'getActiveTabName',
        type: 'getTcmTabType',
        categories: 'getFormulasCategories'
      })
    },
    created () {
      this.$store.dispatch('fetchFormulasCategories', {query: ''})
    },
    watch: {
      modalType: {
        handler () {
          if (this.type !== 1) return
          this.caution.id = this.selectedCaution.id
          this.caution.name = this.selectedCaution.name
          this.caution.traditional_chinese = this.selectedCaution.traditional_chinese
          this.caution.simplified_chinese = this.selectedCaution.simplified_chinese
          this.caution.category = this.selectedCaution.category
          this.caution.modified_by_name = this.selectedCaution.modified_by_name
          this.caution.modified_time = this.selectedCaution.modified_time
          this.caution.created_by_name = this.selectedCaution.created_by_name
          this.caution.created_time = this.selectedCaution.created_time
          this.result = ''
          this.category_item = this.selectedCaution.category
        }
      }
    },
    methods: {
      save: function () {
      },
      update: function () {
      },
      deletePrepMethod: function () {
      },
      close: function () {
        if (this.result === 'success') {
          this.$store.dispatch('setModalType', 0)
        } else {
          this.$store.dispatch('setModalType', 3)
        }
        this.result = ''
      }
    }
  }
</script>
