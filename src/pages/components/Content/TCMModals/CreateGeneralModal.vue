<template>
  <div class="modal fade" id="modalGeneralCreate" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 1">Add {{tabName}}</h4>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 2">Edit {{tabName}}</h4>
        </div>
        <div class="modal-body">
          <form role="form">
            <div class = "row">
              <div v-bind:class="[rowClass]">              
                <div class="form-group">
                  <label>Name</label>
                  <input type="text" class="form-control" placeholder="Enter Name" v-model="general.name" v-bind:style="{color:general.color}">
                </div>
                <div class="form-group">
                  <label>Traditional</label>
                  <input type="text" class="form-control" placeholder="Enter Traditional" v-model="general.traditional_chinese">
                </div>
                <div class="form-group">
                  <label>Simplified</label>
                  <input type="text" class="form-control" placeholder="Enter Simplified" v-model="general.simplified_chinese">
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
              </div>
              <div class="col-sm-6" v-if = "type === 2">
                <div>
                  <label>Color</label>                  
                </div>
                <div class = "row" v-for = "index_row in rowLength">
                  <div class = "color-picker" v-for = "index_col in 9" v-bind:style="{background:colorList[(index_row - 1) * 9 + index_col - 1]}" @click="setColor(index_row - 1, index_col)"></div>
                </div>  
                <div class = "row">
                  <div class = "color-picker" v-for = "index_col in remainder" v-bind:style="{background:colorList[rowLength * 9 + index_col - 1]}" @click="setColor(rowLength, index_col)"></div>
                </div>              
              </div>
            </div>
          </form>
        </div>
        <div class="modal-body" v-if = "this.modalType === 2">	  		
          <div class="description"><b>Modified by</b> <a class="pull-right"><span class="badge bg-blue">{{general.modified_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{general.modified_time}}</p></div>
          <div class="description"><b>Created by</b> <a class="pull-right"><span class="badge bg-blue">{{general.created_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="123">{{general.created_time}}</p></div>	  		
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-lg btn-danger pull-left" data-dismiss="modal" @click="deleteGeneral()" v-if = "this.modalType === 2"><i class="fa fa-trash"></i> Delete</button>
          <button type="button" class="btn btn-lg btn-default" data-dismiss="modal" ref="dialogClose" @click="close()">Cancel</button>
          <button type="button" class="btn btn-lg btn-success" @click="save()" v-if = "this.modalType === 1">Create</button>
          <button type="button" class="btn btn-lg btn-success" @click="update()" v-if = "this.modalType === 2">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .color-picker{
    width: 27px;
    height: 27px;
    float: left;
    margin-right: 5px;
    margin-top: 5px;
    border-radius: 7px;
  }
  .general-name {
    color: #000;
    font-size:12pt;    
  }
</style>
<script>
  import { mapGetters } from 'vuex'
  const FBSelect = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBSelect.vue')

  export default {
    name: 'CreateGeneral',
    components: {
      FBSelect
    },
    created () {
      this.rowLength = Math.floor(this.colorList.length / 9)
      this.remainder = this.colorList.length % 9
    },
    data () {
      return {
        general: {
          id: '',
          name: '',
          type: '',
          color: '#498a40',
          categories: [],
          traditional_chinese: '',
          simplified_chinese: '',
          category: 0,
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        generalCategory: {
          id: 0,
          action_id: 0,
          category_id: 0,
          symptom_id: 0,
          herb_id: 0,
          caution_id: 0,
          type: 0
        },
        // colorList: [{color: '#F00'}, {color: '#0F0'}, {color: '#00F'}],
        colorList: ['#498a40', '#6baa4d', '#45a168', '#6ec496', '#88cca8', '#1a4f63', '#265a97', '#508bc8', '#9bc0e4',
          '#efe36e', '#ffd144', '#eeb41e', '#d77b00', '#d45c00', '#E12A0B', '#545ba8', '#939BF4', '#B3B9FF', '#575757',
          '#99999a', '#75a460', '#8fbd65', '#74b683', '#93d2a9', '#a6d7b9', '#507587', '#587db1', '#79a3d8', '#b3cdec',
          '#f2ea7a', '#fedd38', '#f0c638', '#dd9a38', '#da8138', '#e45d38', '#bd5338', '#825a51', '#523b6e', '#7a7dc0',
          '#abaffc', '#c4c8ff', '#fdcff8', '#fb91ed', '#996493', '#7c7c7c', '#afafb0'],
        rowLength: 0,
        remainder: 0,
        result: '',
        category_item: 0,
        rowClass: 'col-sm-6'
      }
    },
    computed: {
      ...mapGetters({
        activeTab: 'getActiveTab',
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        selectedGeneral: 'getGeneral',
        type: 'getTcmTabType',
        categories: 'getFormulasCategories',
        lastCategory: 'getGeneralCategories'
      })
    },
    watch: {
      modalType: {
        handler () {
          if (this.type === 0) return
          this.general.id = this.selectedGeneral.id
          this.general.name = this.selectedGeneral.name
          this.general.traditional_chinese = this.selectedGeneral.traditional_chinese
          this.general.simplified_chinese = this.selectedGeneral.simplified_chinese
          this.general.color = this.selectedGeneral.color
          this.general.category = this.selectedGeneral.category
          this.general.modified_by_name = this.selectedGeneral.modified_by_name
          this.general.modified_time = this.selectedGeneral.modified_time
          this.general.created_by_name = this.selectedGeneral.created_by_name
          this.general.created_time = this.selectedGeneral.created_time
          this.general.type = this.selectedGeneral.type
          this.result = ''
          this.category_item = this.selectedGeneral.category
          if (this.type === 1) this.rowClass = 'col-sm-12'
          else this.rowClass = 'col-sm-6'
        }
      }
    },
    methods: {
      save: function () {
        let self = this
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Creating...')
        this.$store.dispatch('createGeneral', this.general)
          .then((response) => {
            if (response.id) {
              self.generalCategory.category_id = self.category_item
              if (self.general.type === 'actions') {
                self.generalCategory.type = 'action-categories'
                self.generalCategory.action_id = response.id
              } else if (self.general.type === 'symptoms') {
                self.generalCategory.type = 'symptom-categories'
                self.generalCategory.symptom_id = response.id
                self.generalCategory.herb_id = response.id
              } else if (self.general.type === 'cautions') {
                self.generalCategory.type = 'caution-categories'
                self.generalCategory.caution_id = response.id
              }
              // const btn = self.$refs.dialogClose
              // self.$store.dispatch('setModalType', 0)
              // self.result = 'success'
              // btn.click()
              self.$store.dispatch('createGeneralCategory', self.generalCategory)
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
        let self = this
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Updating...')
        let category = {id: this.category_item, name: ''}
        this.general.categories = []
        this.general.categories.push(category)
        this.$store.dispatch('updateGeneral', this.general)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (response.id) {
              const btn = self.$refs.dialogClose
              self.$store.dispatch('setModalType', 0)
              self.result = 'success'
              btn.click()
            }
          }).catch((error) => {
            console.log(error)
          })
      },
      deleteGeneral: function () {
        let self = this
        let tabName = this.tabName.toLowerCase()
        tabName = tabName.substring(0, tabName.length - 1)
        this.$swal({
          title: 'Are you sure?',
          text: 'You will not be able to recover this ' + tabName + '!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it!'
        }).then(function () {
          this.$store.dispatch('setLoadingBar', 'block')
          this.$store.dispatch('setLoadingBarText', 'Deleting...')
          this.$store.dispatch('deleteGeneral', {id: this.general.id, type: this.general.type})
            .then((response) => {
              this.$store.dispatch('setLoadingBar', 'none')
              this.$swal(
                'Deleted!',
                response.message,
                'success'
              ).then(function () {
                const btn = self.$refs.dialogClose
                self.$store.dispatch('setModalType', 0)
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
      setColor: function (row, col) {
        this.general.color = this.colorList[row * 9 + col - 1]
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
