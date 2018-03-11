<template>
  <transition name="fade">
  <div class="col-md-4">
    <div class="box">
      <div class="box-body">
        <div class="input-group input-group" style = "padding: 0px 12px;">
          <input type="text" name="table_search" class="form-control pull-left" placeholder="Search" v-model="searchQuery">
          <div class="input-group-btn">
            <FBButton type="submit" :onClick="filterHerb" buttonClass="btn btn-default">
              <i slot="icon" class="fa fa-search"></i>
            </FBButton>
          </div>
        </div>
      </div>   
      <div class="box-body">
        <div class="form-group col-sm-12">
            <label>Species</label>                    
            <select class="form-control select2" multiple="multiple" data-placeholder="Select Species" style="width: 100%;" v-model = "selected_specy_list">
              <option v-for="specy in specy_list" :value='specy.id'>{{specy.name}}</option>
            </select>
        </div>
        <div class="form-group col-sm-12">
            <label>Flavour</label>
            <select class="form-control select2" multiple="multiple" data-placeholder="Select Flavours" style="width: 100%;" v-model = "selected_flavour_list">
              <option v-for="flavour in flavour_list" :value='flavour.id'>{{flavour.name}}</option>
            </select>
        </div>
        <div class="form-group col-sm-12">
            <label>Nature</label>
            <select class="form-control select2" multiple="multiple" data-placeholder="Select Natures" style="width: 100%;" v-model = "selected_nature_list">
              <option v-for="nature in nature_list" :value='nature.id'>{{nature.name}}</option>
            </select>
        </div>
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
          <label>Categories</label>
          <select class="form-control select2" multiple="multiple" data-placeholder="Select Categories" style="width: 100%;" v-model = "selected_category_list">
						<option v-for="category in category_list" :value='category.id'>{{category.name}}</option>
					</select>          
        </div>
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
    name: 'HerbFilter',
    created () {
      this.$store.dispatch('setHerbFilterQuery', '')
      this.$store.dispatch('setLoadingBar', 'block')
      this.$store.dispatch('setLoadingBarText', 'Loading...')
      this.$store.dispatch('setFilterFlag', false)
      this.$store.dispatch('fetchAllFlavours', {query: ''})
      this.$store.dispatch('fetchAllNatures', {query: ''})
      this.$store.dispatch('fetchAllSpecies', {query: ''})
      this.$store.dispatch('fetchAllSources', {query: ''})
      this.$store.dispatch('fetchHerbsCategories', {query: ''})
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
        flavour_list: [],
        specy_list: [],
        nature_list: [],
        source_list: [],
        category_list: [],
        selected_category_list: [],
        selected_flavour_list: [],
        selected_specy_list: [],
        selected_nature_list: [],
        source_item: 0,
        flavour_flag: false,
        specy_flag: false,
        nature_flag: false,
        source_flag: false,
        category_flag: false
      }
    },
    components: {
      FBSelect,
      FBButton
    },
    methods: {
      setFlag: function () {
        if (this.flavour_flag && this.specy_flag && this.nature_flag && this.source_flag && this.category_flag) {
          this.$store.dispatch('setLoadingBar', 'none')
        }
      },
      filterHerb: function () {
        let query = ''
        if (this.searchQuery !== '') query += 'query=' + this.searchQuery + '&'
        if (this.source_item !== '0' && this.source_item !== 0 && this.source_item !== '') query += 'source[]=' + this.source_item + '&'
        if (this.selected_category_list.length > 0) {
          this.selected_category_list.map((id, index) => {
            query += 'category[]=' + id + '&'
          })
        }
        if (this.selected_flavour_list.length > 0) {
          this.selected_flavour_list.map((id, index) => {
            query += 'flavour[]=' + id + '&'
          })
        }
        if (this.selected_specy_list.length > 0) {
          this.selected_specy_list.map((id, index) => {
            query += 'specie[]=' + id + '&'
          })
        }
        if (this.selected_nature_list.length > 0) {
          this.selected_nature_list.map((id, index) => {
            query += 'nature[]=' + id + '&'
          })
        }
        query = query.substr(0, query.length - 1)
        this.$store.dispatch('setHerbFilterQuery', query)
      }
    },
    computed: {
      ...mapGetters({
        flavours: 'getAllFlavours',
        categories: 'getHerbsCategories',
        natures: 'getAllNatures',
        species: 'getAllSpecies',
        sources: 'getAllSources'
      })
    },
    watch: {
      flavours: {
        handler () {
          this.flavour_list = this.flavours
          this.flavour_flag = true
          this.setFlag()
        }
      },
      natures: {
        handler () {
          this.nature_list = this.natures
          this.nature_flag = true
          this.setFlag()
        }
      },
      species: {
        handler () {
          this.specy_list = this.species
          this.specy_flag = true
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
      categories: {
        handler () {
          this.category_list = this.categories
          this.category_flag = true
          this.setFlag()
        }
      }
    }
  }
</script>
