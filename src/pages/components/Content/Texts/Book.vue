<template>
  <div>
    <section class="content-header">
      <h1>Books</h1>
    </section>
    <section class="view-content-wrapper">
      <div class="row">
        <div class="col-md-3">
          <div class="box box-widget widget-user-2">
            <div class="widget-user-header bg-gray">
              <h3>{{ book.english_name }}</h3>
              <h4>{{ book.chinese_name }}</h4>
              <h5>{{ book.year }}</h5>              
              <h5>{{ book.author }}/{{book.chinese_author}}</h5>
            </div>
            <div class="box-footer no-padding">
              <ul class="nav nav-stacked">
                <li><a href="#" data-toggle="modal" data-target="#modalChapterCreate" @click="addChapter()"><i class="fa fa-plus-circle"></i> Add Chapter / Line</a></li>
                <li><a href="#" data-toggle="modal" data-target="#modalBookCreate" @click="editBook()"><i class="fa fa-pencil"></i> Edit</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-9">
          <div class="box">
            <div class="box-body">
              <div class="btn-group pull-left">
                <div class="input-group input-group pull-right">
                  <input type="text" name="table_search" class="form-control pull-left" placeholder="Search" v-model="search_string">
                  <div class="input-group-btn">
                    <FBButton type="submit" :onClick="filterChapter" buttonClass="btn btn-default">
                      <i slot="icon" class="fa fa-search"></i>
                    </FBButton>
                  </div>
                </div>
              </div>
            </div>
            <table class="table table-hover">
			        <thead>
                <tr>
                  <th>Chapters / Lines<i class="fa fa-caret-down"></i></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in filteredChapters" :key="item.id">                
                  <td><router-link :to="{ name: 'Chapter', params: { id: item.id, book_id: book.id }}">{{item.english_name}} <br><span class="text-muted">{{item.chinese_name}}</span></router-link></td>                  
                </tr>					                					                
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
    <CreateBookModal></CreateBookModal>
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
  const CreateBookModal = () => import(/* webpackChunkName: "Modals" */ './../TextsModal/CreateBookModal.vue')
  const CreateChapterModal = () => import(/* webpackChunkName: "Modals" */ './../TextsModal/CreateChapterModal.vue')
  const FBButton = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBButton.vue')

  export default {
    name: 'Book',
    created () {
      this.fetchBook()
      this.fetchChapters()
    },
    data () {
      return {
        chapters: {
        },
        filteredChapters: {
        },
        search_string: '',
        chapter: {
          id: 0,
          book_id: 0,
          english_name: '',
          chinese_name: '',
          modified_by_name: 'Modified By',
          modified_time: '',
          created_by_name: 'Created By',
          created_time: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        book: 'getBook',
        modalType: 'getModalType'
      })
    },
    watch: {
      modalType: {
        handler () {
          if (this.modalType === 0) {
            this.fetchBook()
          }
          if (this.modalType === 4) {
            this.fetchChapters()
          }
        }
      }
    },
    methods: {
      fetchBook: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.$store.dispatch('fetchBook', { id: this.$route.params.id })
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
          })
      },
      fetchChapters: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.$store.dispatch('fetchChapters', { id: this.$route.params.id })
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.chapters = response
            this.filteredChapters = response
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.$swal(
              'Error!',
              error.message,
              'error'
            ).then((result) => {
              this.$router.go(-1)
            })
          }
        )
      },
      filterChapter: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.filteredChapters = []
        this.chapters.map((item, ind) => {
          if (item.english_name.includes(this.search_string)) this.filteredChapters.push(item)
        })
        this.$store.dispatch('setLoadingBar', 'none')
      },
      addChapter: function () {
        this.chapter.book_id = this.$route.params.id
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setChapterValue', this.chapter)
      },
      editBook: function () {
        this.$store.dispatch('setModalType', 2)
      }
    },
    components: {
      LoadingModal,
      CreateBookModal,
      CreateChapterModal,
      FBButton
    }
  }
</script>
