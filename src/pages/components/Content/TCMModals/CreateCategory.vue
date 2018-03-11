<template>
  <div class="modal fade" id="modalCategoryCreate" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 1">Add {{tabName}} Category</h4>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 2">Edit {{tabName}} Category</h4>
        </div>
        <div class="modal-body">
          <form role="form">
            <div class = "row">
              <div class="col-sm-6">
                <div class="form-group">
                  <label>Category Title</label>
                  <input type="text" class="form-control category-name" placeholder="Enter Category Name" v-model="category.name" v-bind:style="{background:category.color}">
                </div>
              </div>
              <div class="col-sm-6">
                <div>
                  <label>Color</label>                  
                </div>
                <div class = "row" v-for = "index_row in rowLength">
                <!--
                  <div class = "col-sm-4" v-for = "index_col in 3">
                    <div class = "row">
                      <div class = "col-sm-4" v-bind:style="{background:colorList[(index_row -1) * 9 + (index_col - 1) * 3]}">{{index_row}}</div>
                      <div class = "col-sm-4" v-bind:style="{background:colorList[(index_row -1) * 9 + (index_col - 1) * 3 + 1]}">{{index_row}}</div>
                      <div class = "col-sm-4" v-bind:style="{background:colorList[(index_row -1) * 9 + (index_col - 1) * 3 + 2]}">{{index_row}}</div>                      
                    </div>
                  </div> -->
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
          <div class="description"><b>Modified by</b> <a class="pull-right"><span class="badge bg-blue">{{category.modified_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{category.modified_time}}</p></div>
          <div class="description"><b>Created by</b> <a class="pull-right"><span class="badge bg-blue">{{category.created_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="123">{{category.created_time}}</p></div>	  		
        </div>
        <div class="modal-footer">
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
  .category-name {
    color: #FFF;
    font-size:12pt;    
  }
</style>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'CreateCategory',
    created () {
      this.rowLength = Math.floor(this.colorList.length / 9)
      this.remainder = this.colorList.length % 9
    },
    data () {
      return {
        category: {
          id: 0,
          name: '',
          type: 'formula',
          color: '#498a40',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        // colorList: [{color: '#F00'}, {color: '#0F0'}, {color: '#00F'}],
        colorList: ['#498a40', '#6baa4d', '#45a168', '#6ec496', '#88cca8', '#1a4f63', '#265a97', '#508bc8', '#9bc0e4',
          '#efe36e', '#ffd144', '#eeb41e', '#d77b00', '#d45c00', '#E12A0B', '#545ba8', '#939BF4', '#B3B9FF', '#575757',
          '#99999a', '#75a460', '#8fbd65', '#74b683', '#93d2a9', '#a6d7b9', '#507587', '#587db1', '#79a3d8', '#b3cdec',
          '#f2ea7a', '#fedd38', '#f0c638', '#dd9a38', '#da8138', '#e45d38', '#bd5338', '#825a51', '#523b6e', '#7a7dc0',
          '#abaffc', '#c4c8ff', '#fdcff8', '#fb91ed', '#996493', '#7c7c7c', '#afafb0'],
        rowLength: 0,
        remainder: 0,
        result: ''
      }
    },
    computed: {
      ...mapGetters({
        activeTab: 'getActiveTab',
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        selectedCategory: 'getCategoryValue',
        categoryName: 'getCategoryName'
      })
    },
    watch: {
      modalType: {
        handler () {
          this.category.id = this.selectedCategory.id
          this.category.name = this.selectedCategory.name
          this.category.color = this.selectedCategory.color
          this.category.type = this.selectedCategory.type
          this.category.modified_by_name = this.selectedCategory.modified_by_name
          this.category.modified_time = this.selectedCategory.modified_time
          this.category.created_by_name = this.selectedCategory.created_by_name
          this.category.created_time = this.selectedCategory.created_time
          this.result = ''
        }
      }
    },
    methods: {
      save: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Creating category...')
        this.$store.dispatch('createCategory', this.category)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (response.id) {
              const btn = this.$refs.dialogClose
              this.$store.dispatch('setModalType', 0)
              this.result = 'success'
              btn.click()
            }
          }).catch((error) => {
            console.log(error)
          })
      },
      update: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Updating category...')
        this.$store.dispatch('updateCategory', this.category)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (response.id) {
              const btn = this.$refs.dialogClose
              this.$store.dispatch('setModalType', 0)
              this.result = 'success'
              btn.click()
            }
          }).catch((error) => {
            console.log(error)
          })
      },
      setColor: function (row, col) {
        this.category.color = this.colorList[row * 9 + col - 1]
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
