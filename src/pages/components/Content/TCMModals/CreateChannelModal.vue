<template>
  <div class="modal fade" id="modalChannelCreate" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 1">Add Channel</h4>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 2">Edit Channel</h4>
        </div>
        <div class="modal-body">
          <form role="form">
            <div class="form-group">
              <label>Name</label>
              <input type="text" class="form-control" placeholder="Enter English Name" v-model="channel.english_name">
            </div>
            <div class="form-group">
              <label>Chinese Name</label>
              <input type="text" class="form-control" placeholder="Enter Chinese Name" v-model="channel.chinese_name">
            </div>            
            <div class="modal-body" v-if = "this.modalType === 2">	  		
              <div class="description"><b>Modified by</b> <a class="pull-right"><span class="badge bg-blue">{{channel.modified_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{channel.modified_time}}</p></div>
              <div class="description"><b>Created by</b> <a class="pull-right"><span class="badge bg-blue">{{channel.created_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="123">{{channel.created_time}}</p></div>	  		
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-lg btn-danger pull-left" data-dismiss="modal" @click="deleteChannel()" v-if = "this.modalType === 2"><i class="fa fa-trash"></i> Delete</button>
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

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'CreateChannel',
    data () {
      return {
        channel: {
          id: 0,
          english_name: '',
          chinese_name: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        result: ''
      }
    },
    computed: {
      ...mapGetters({
        modalType: 'getModalType',
        selectedChannel: 'getChannel',
        tabName: 'getActiveTabName'
      })
    },
    watch: {
      modalType: {
        handler () {
          this.channel.id = this.selectedChannel.id
          this.channel.english_name = this.selectedChannel.english_name
          this.channel.chinese_name = this.selectedChannel.chinese_name
          this.channel.modified_by_name = this.selectedChannel.modified_by_name
          this.channel.modified_time = this.selectedChannel.modified_time
          this.channel.created_by_name = this.selectedChannel.created_by_name
          this.channel.created_time = this.selectedChannel.created_time
          this.result = ''
        }
      }
    },
    methods: {
      save: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Creating channel...')
        this.$store.dispatch('createChannel', this.channel)
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
        this.$store.dispatch('setLoadingBarText', 'Updating channel...')
        this.$store.dispatch('updateChannel', this.channel)
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
      deleteChannel: function () {
        let self = this
        this.$swal({
          title: 'Are you sure?',
          text: 'You will not be able to recover this channel!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it!'
        }).then(function () {
          this.$store.dispatch('setLoadingBar', 'block')
          this.$store.dispatch('setLoadingBarText', 'Deleting...')
          this.$store.dispatch('deleteChannel', {id: this.channel.id, type: this.channel.type})
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
