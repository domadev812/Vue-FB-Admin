<template>
  <div class="modal fade" id="modalChapterCreate" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 1">Add Chapter</h4>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 2">Edit Chapter</h4>
        </div>
        <div class="modal-body">
          <form role="form">
            <div class="form-group">
              <label>Chapter English Name</label>
              <input type="text" class="form-control" placeholder="Enter Chapter English name" v-model="chapter.english_name">
            </div>
            <div class="form-group">
              <label>Chapter Chinese Name</label>
              <input type="text" class="form-control" placeholder="Enter Chapter Chinese name" v-model="chapter.chinese_name">
            </div>            
            <div class="modal-body" v-if = "this.modalType === 2">	  		
              <div class="description"><b>Modified by</b> <a class="pull-right"><span class="badge bg-blue">{{chapter.created_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{chapter.modified_time}}</p></div>
              <div class="description"><b>Created by</b> <a class="pull-right"><span class="badge bg-blue">{{chapter.modified_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="123">{{chapter.created_time}}</p></div>	  		
            </div>
            <div class="modal-footer">
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
    name: 'CreateChapter',
    data () {
      return {
        chapter: {
          id: 0,
          book_id: 0,
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
        selectedChapter: 'getChapter'
      })
    },
    watch: {
      modalType: {
        handler () {
          this.chapter.id = this.selectedChapter.id
          this.chapter.english_name = this.selectedChapter.english_name
          this.chapter.chinese_name = this.selectedChapter.chinese_name
          this.chapter.book_id = this.selectedChapter.book_id
          this.chapter.modified_by_name = this.selectedChapter.modified_by_name
          this.chapter.modified_time = this.selectedChapter.modified_time
          this.chapter.created_by_name = this.selectedChapter.created_by_name
          this.chapter.created_time = this.selectedChapter.created_time
          this.result = ''
        }
      }
    },
    methods: {
      save: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Creating chapter...')
        this.$store.dispatch('createChapter', this.chapter)
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
        this.$store.dispatch('setLoadingBarText', 'Updating chapter...')
        this.$store.dispatch('updateChapter', this.chapter)
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
      close: function () {
        if (this.result === 'success') {
          this.$store.dispatch('setModalType', 4)
        } else {
          this.$store.dispatch('setModalType', 6)
        }
        this.result = ''
      }
    }
  }
</script>
