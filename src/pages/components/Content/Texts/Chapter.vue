<template>
  <div>
    <section class="content-header">
      <h1>Chapter / Line</h1>
    </section>
    <section class="view-content-wrapper">
      <div class="row">
        <div class="col-md-3">
          <div class="box box-widget widget-user-2">
            <div class="box-header no-padding">
              <ul class="nav nav-stacked">
                <li><a href="#" @click="back()"><i class="fa fa-arrow-left"></i> {{book.english_name}} {{book.chinese_name}}</a></li>
              </ul>
            </div>
            <div class="widget-user-header bg-grey">
              <h3 class="text-light-blue">{{chapter.english_name}} </h3>
              <h4>{{chapter.chinese_name}}</h4>
            </div>
            <div class="box-footer no-padding">
              <ul class="nav nav-stacked">
	            <li><a href="#" data-toggle="modal" data-target="#modalChapterCreate" @click="editChapter()"><i class="fa fa-pencil"></i> Edit Chapter / Line</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-9">
          <div class="box">           
            <div class="box-body">
                <form role="form">
                    <div class="form-group">
                        <label>English</label>
                        <textarea class="form-control" rows="3" placeholder="Enter" v-model="update_chapter.english"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Chinese</label>
                        <textarea class="form-control" rows="3" placeholder="Enter" v-model="update_chapter.chinese"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Pinyin</label>
                        <textarea class="form-control" rows="3" placeholder="Enter" v-model="update_chapter.pinyin"></textarea>
                    </div>
                </form>
            </div>
            <div class="box-body">
                <button type="button" class="btn btn-danger pull-right" data-dismiss="modal" @click="deleteChapter()"><i class="fa fa-trash"></i> Delete</button>
                <button type="button" class="btn btn-primary pull-left" @click="updateChapter()">Save</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <CreateChapterModal></CreateChapterModal>
    <LoadingModal></LoadingModal>
  </div>
</template>
<style scoped>
  .view-content-wrapper {
    padding: 20px;
  }
</style>
<script>
  import { mapGetters } from 'vuex'
  const LoadingModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/LoadingModal.vue')
  const CreateChapterModal = () => import(/* webpackChunkName: "Modals" */ './../TextsModal/CreateChapterModal.vue')
  const FBButton = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBButton.vue')

  export default {
    name: 'Book',
    created () {
      this.fetchBook()
      this.fetchChapter()
    },
    data () {
      return {
        update_chapter: {
          english: '',
          chinese: '',
          pinyin: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        book: 'getBook',
        chapter: 'getChapter',
        modalType: 'getModalType'
      })
    },
    watch: {
      modalType: {
        handler () {
          if (this.modalType === 4) {
            this.fetchChapter()
          }
        }
      }
    },
    methods: {
      fetchBook: function () {
        this.$store.dispatch('fetchBook', { id: this.$route.params.book_id })
      },
      fetchChapter: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading chapter...')
        this.$store.dispatch('fetchChapter', { id: this.$route.params.id, book_id: this.$route.params.book_id })
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.update_chapter = response
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            console.log(error)
          })
      },
      updateChapter: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Updating chapter...')
        this.update_chapter.book_id = this.$route.params.book_id
        this.update_chapter.id = this.chapter.id
        this.$store.dispatch('updateChapter', this.update_chapter)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            console.log(error)
          })
      },
      deleteChapter: function () {
        this.$swal({
          title: 'Are you sure?',
          text: 'You will not be able to recover this chapter!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it!'
        }).then(function () {
          this.$store.dispatch('setLoadingBar', 'block')
          this.$store.dispatch('setLoadingBarText', 'Deleting chapter...')
          this.$store.dispatch('deleteChapter', this.$route.params.id)
            .then((response) => {
              this.$store.dispatch('setLoadingBar', 'none')
              this.$swal(
                'Deleted!',
                response.message,
                'success'
              )
              this.$router.go(-1)
            })
            .catch((error) => {
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
      editChapter: function () {
        this.$store.dispatch('setModalType', 2)
      },
      back: function () {
        this.$router.go(-1)
      }
    },
    components: {
      LoadingModal,
      CreateChapterModal,
      FBButton
    }
  }
</script>
