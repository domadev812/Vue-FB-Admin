<template>
  <transition name="fade">
    <div class="col-md-4">
      <div class="box">
        <div class="box-body">
          <div class="input-group input-group" style = "padding: 0px 12px;">
            <input type="text" name="table_search" class="form-control pull-left" placeholder="Search" v-model="searchQuery">
            <div class="input-group-btn">
              <FBButton type="submit" :onClick="filterFormula" buttonClass="btn btn-default">
                <i slot="icon" class="fa fa-search"></i>
              </FBButton>
            </div>
          </div>
        </div>
        <div class="box-body">
          <div class="form-group">
            <FBSelect
              @select2="source_item = $event"
              :selectVal="source_item"
              :selectId="'sourceSelect'"
              :defaultClass = "'col-sm-12'"
              :options="source_list">
              <label for="sourceSelect" class="col-sm-12 control-label" slot="before">Source Text</label>
            </FBSelect>
          </div>
          <div class="form-group col-sm-12">
            <label>Author</label>
            <select class="form-control select2" multiple="multiple" data-placeholder="Select Authors" style="width: 100%;" v-model = "selected_author_list">
              <option v-for="author in author_list" :value='author.id'>{{author.firstname}} {{author.lastname}}</option>
            </select>
          </div>
          <div class="form-group col-sm-12">
            <label>Category</label>
            <select class="form-control select2" multiple="multiple" data-placeholder="Select Categories" style="width: 100%;" v-model = "selected_category_list">
              <option v-for="category in category_list" :value='category.id'>{{category.name}}</option>
            </select>
          </div>
          <div class="form-group">
            <FBSelect
              @select2="creator_item = $event"
              :selectVal="creator_item"
              :selectId="'creatorSelect'"
              :defaultClass = "'col-sm-12'"
              :options="user_list">
              <label for="creatorSelect" class="col-sm-12 control-label" slot="before">Created</label>
            </FBSelect>
          </div>
          <div class="form-group">
            <FBSelect
              @select2="modified_item = $event"
              :selectVal="modified_item"
              :selectId="'modifiedSelect'"
              :defaultClass = "'col-sm-12'"
              :options="user_list">
              <label for="modifiedSelect" class="col-sm-12 control-label" slot="before">Modified</label>
            </FBSelect>
          </div>
          <div class="form-group">
            <div class="input-group pull-left" style="width: 100%;">
              <button type="button" class="btn btn-default" id="daterange-btn" style="width: 100%;">
                <span>
                  <i class="fa fa-calendar"></i> Date range picker
                </span>
                <i class="fa fa-caret-down"></i>
              </button>
            </div>
          </div>
          <!-- THIS SHOULD BE SHOWN IF HERBS SELECTED IN THE SEARCH BAR ABOVE !-->
          <!-- /.search form -->
          <!-- /input-group -->
        </div>
        <!-- /.box-body -->
      </div>
    </div>
  </transition>
</template>
<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: .5s ease;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0
  }  
</style>

<script>
  const FBSelect = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBSelect.vue')
  const FBButton = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBButton.vue')
  import { mapGetters } from 'vuex'
  export default {
    name: 'FilterFilter',
    computed: {
      ...mapGetters({
        categories: 'getFormulasCategories',
        sources: 'getAllSources',
        users: 'getUsers',
        userProfile: 'getUserProfile'
      })
    },
    watch: {
      categories: {
        handler () {
          this.category_list = this.categories
          this.category_flag = true
          this.setFlag()
        }
      },
      sources: {
        handler () {
          this.sources.map((source, index) => {
            source.name = source.english_name
            this.source_list.push(source)
          })
          let item = {id: 0, name: 'Any'}
          this.source_list.splice(0, 0, item)
          this.source_flag = true
          this.setFlag()
        }
      },
      users: {
        handler () {
          this.users.items.map((user, index) => {
            user.name = user.firstname + ' ' + user.lastname
            this.user_list.push(user)
            this.author_list.push(user)
          })
          let item = {id: 0, name: 'Any'}
          this.user_list.splice(0, 0, item)
          this.user_flag = true
          this.setFlag()
        }
      }
    },
    created () {
      this.$store.dispatch('setFormulaFilterQuery', '')
      this.$store.dispatch('setLoadingBar', 'block')
      this.$store.dispatch('setLoadingBarText', 'Loading...')
      this.$store.dispatch('setFilterFlag', false)
      this.$store.dispatch('fetchFormulasCategories', {query: ''})
      this.$store.dispatch('fetchAllSources', {query: ''})
      this.$store.dispatch('fetchAllUsers', {token: this.$store.getters.getUserAccessToken})
    },
    data () {
      return {
        form: {
          author: ''
        },
        defaultClass: {
          type: [String, undefined],
          default: 'col-sm-12'
        },
        searchQuery: '',
        updateProfile: {},
        category_list: [],
        selected_category_list: [],
        category_item: 0,
        source_list: [],
        source_item: 0,
        user_list: [],
        author_list: [],
        selected_author_list: [],
        author_item: 0,
        selected_creator: 0,
        creator_item: 0,
        selected_modified: 0,
        modified_item: 0,
        user_flag: false,
        category_flag: false
      }
    },
    methods: {
      setFlag: function () {
        if (this.user_flag && this.source_flag && this.category_flag) {
          this.$store.dispatch('setLoadingBar', 'none')
        }
      },
      filterFormula: function () {
        let query = ''
        if (this.searchQuery !== '') query += 'query=' + this.searchQuery + '&'
        if (this.source_item !== '0' && this.source_item !== '') query += 'source[]=' + this.source_item + '&'
        if (this.selected_category_list.length > 0) {
          this.selected_category_list.map((id, index) => {
            query += 'category[]=' + id + '&'
          })
        }
        if (this.selected_author_list.length > 0) {
          this.selected_author_list.map((id, index) => {
            query += 'author[]=' + id + '&'
          })
        }
        if (this.creator_item !== '0' && this.creator_item !== '') query += 'created=' + this.creator_item + '&'
        if (this.modified_item !== '0' && this.modified_item !== '') query += 'modified=' + this.modified_item + '&'
        query = query.substr(0, query.length - 1)
        this.$store.dispatch('setFormulaFilterQuery', query)
      }
    },
    components: {
      FBSelect,
      FBButton
    }
  }
</script>
