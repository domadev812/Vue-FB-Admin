<template>
  <div class="modal fade" id="modalPrepMethodCreate" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 1">Add Prep Method</h4>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 2">Edit Prep Method</h4>
        </div>
        <div class="modal-body">
          <form role="form">
            <div class="form-group">
              <label>Name</label>
              <input type="text" class="form-control" placeholder="Enter English Name" v-model="prepMethod.name">
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
            <div class="form-group">
              <label>Prep Method</label>
              <input type="text" class="form-control" placeholder="Enter Chinese Name" v-model="prepMethod.method">
            </div>            
            <div class="modal-body" v-if = "this.modalType === 2">	  		
              <div class="description"><b>Modified by</b> <a class="pull-right"><span class="badge bg-blue">{{prepMethod.modified_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{prepMethod.modified_time}}</p></div>
              <div class="description"><b>Created by</b> <a class="pull-right"><span class="badge bg-blue">{{prepMethod.created_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="123">{{prepMethod.created_time}}</p></div>	  		
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-lg btn-danger pull-left" data-dismiss="modal" @click="deletePrepMethod()" v-if = "this.modalType === 2"><i class="fa fa-trash"></i> Delete</button>
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
        prepMethod: {
          id: '',
          name: '',
          method: '',
          category: 0,
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        prepMethodCategory: {
          prep_id: 0,
          category_id: 0
        },
        result: '',
        category_item: 0
      }
    },
    computed: {
      ...mapGetters({
        modalType: 'getModalType',
        selectedPrepMethod: 'getPrepMethod',
        tabName: 'getActiveTabName',
        categories: 'getFormulasCategories'
      })
    },
    created () {
      this.$store.dispatch('fetchFormulasCategories', {query: ''})
    },
    watch: {
      modalType: {
        handler () {
          this.prepMethod.id = this.selectedPrepMethod.id
          this.prepMethod.name = this.selectedPrepMethod.name
          this.prepMethod.method = this.selectedPrepMethod.method
          this.prepMethod.category = this.selectedPrepMethod.category
          this.prepMethod.modified_by_name = this.selectedPrepMethod.modified_by_name
          this.prepMethod.modified_time = this.selectedPrepMethod.modified_time
          this.prepMethod.created_by_name = this.selectedPrepMethod.created_by_name
          this.prepMethod.created_time = this.selectedPrepMethod.created_time
          this.result = ''
          this.category_item = this.selectedPrepMethod.category
        }
      }
    },
    methods: {
      save: function () {
        let self = this
        this.prepMethod.category = this.category_item
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Creating prep method...')
        this.$store.dispatch('createPrepMethod', this.prepMethod)
          .then((response) => {
            if (response.id) {
              self.prepMethodCategory.prep_id = response.id
              self.prepMethodCategory.category_id = self.category_item
              self.$store.dispatch('createPrepMethodCategory', self.prepMethodCategory)
                .then((response) => {
                  self.$store.dispatch('setLoadingBar', 'none')
                  if (response.id) {
                    const btn = self.$refs.dialogClose
                    self.$store.dispatch('setModalType', 0)
                    self.result = 'success'
                    btn.click()
                  }
                }).catch((error) => {
                  this.$store.dispatch('setLoadingBar', 'none')
                  console.log(error)
                })
            }
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            console.log(error)
          })
      },
      update: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Updating prep method...')
        this.$store.dispatch('updatePrepMethod', this.prepMethod)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (response.id) {
              const btn = this.$refs.dialogClose
              this.result = 'success'
              btn.click()
            }
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            console.log(error)
          })
      },
      deletePrepMethod: function () {
        let self = this
        this.$swal({
          title: 'Are you sure?',
          text: 'You will not be able to recover this prep method!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it!'
        }).then(function () {
          this.$store.dispatch('setLoadingBar', 'block')
          this.$store.dispatch('setLoadingBarText', 'Deleting...')
          this.$store.dispatch('deletePrepMethod', {id: this.prepMethod.id, type: this.prepMethod.type})
            .then((response) => {
              this.$store.dispatch('setLoadingBar', 'none')
              this.$swal(
                'Deleted!',
                response.message,
                'success'
              ).then(function () {
                const btn = self.$refs.dialogClose
                self.result = 'success'
                btn.click()
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
