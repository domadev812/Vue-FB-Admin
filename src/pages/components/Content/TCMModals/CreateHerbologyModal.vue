<template>
  <div class="modal fade" id="modalHerbologyGeneranCreate" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 1">Add {{tabName}}</h4>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 2">Edit {{tabName}}</h4>
        </div>
        <div class="modal-body">
          <form role="form">
            <div class="form-group">
              <label>Name</label>
              <input type="text" class="form-control" :placeholder="placeHolderText" v-model="herbology.name">
            </div>            
            <div class="modal-body" v-if = "this.modalType === 2">	  		
              <div class="description"><b>Modified by</b> <a class="pull-right"><span class="badge bg-blue">{{herbology.modified_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{herbology.modified_time}}</p></div>
              <div class="description"><b>Created by</b> <a class="pull-right"><span class="badge bg-blue">{{herbology.created_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="123">{{herbology.created_time}}</p></div>	  		
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-lg btn-danger pull-left" data-dismiss="modal" @click="deleteHerbology()" v-if = "this.modalType === 2"><i class="fa fa-trash"></i> Delete</button>
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
  .pull-left{
    margin-top: 0px !important;
  }
</style>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'CreateHerbology',
    data () {
      return {
        herbology: {
          id: 0,
          name: '',
          type: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        result: '',
        placeHolderText: ''
      }
    },
    computed: {
      ...mapGetters({
        modalType: 'getModalType',
        selectedHerbology: 'getHerbology',
        tabName: 'getActiveTabName'
      })
    },
    watch: {
      modalType: {
        handler () {
          this.herbology.id = this.selectedHerbology.id
          this.herbology.name = this.selectedHerbology.name
          this.herbology.type = this.selectedHerbology.type
          this.herbology.modified_by_name = this.selectedHerbology.modified_by_name
          this.herbology.modified_time = this.selectedHerbology.modified_time
          this.herbology.created_by_name = this.selectedHerbology.created_by_name
          this.herbology.created_time = this.selectedHerbology.created_time
          this.result = ''
          this.placeHolderText = 'Enter ' + this.tabName + ' Name'
        }
      }
    },
    methods: {
      save: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Creating ' + this.tabName + '...')
        this.$store.dispatch('createHerbology', this.herbology)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (response.id) {
              const btn = this.$refs.dialogClose
              this.$store.dispatch('setModalType', 0)
              this.result = 'success'
              btn.click()
            }
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            console.log(error)
          })
      },
      update: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Updating' + this.tabName + '...')
        this.$store.dispatch('updateHerbology', this.herbology)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (response.id) {
              const btn = this.$refs.dialogClose
              this.$store.dispatch('setModalType', 0)
              this.result = 'success'
              btn.click()
            }
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            console.log(error)
          })
      },
      deleteHerbology: function () {
        let self = this
        this.$swal({
          title: 'Are you sure?',
          text: 'You will not be able to recover this ' + this.tabName + '!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it!'
        }).then(function () {
          this.$store.dispatch('setLoadingBar', 'block')
          this.$store.dispatch('setLoadingBarText', 'Deleting...')
          this.$store.dispatch('deleteHerbology', {id: this.herbology.id, type: this.herbology.type})
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
