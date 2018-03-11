<template>
  <div class="modal fade" id="modalFormulaHerbs" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <h4 class="modal-title" id="myModalLabel">Formulas Herbs</h4>
        </div>
        <div class="modal-header no-padding">
          <form action="#" method="get" class="sidebar-form" @submit="search">
            <div class="input-group">
              <input type="text" name="q" class="form-control" placeholder="Search..." v-model="query">
              <span class="input-group-btn">
                <button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i>
                </button>
              </span>
            </div>
          </form>
        </div>
        <div class="modal-body no-padding" style="overflow: auto; position:relative; height:460px;">
          <table class="table table-hover">
            <tbody v-if="herbs.items && herbs.items.length > 0">
            <tr v-for="(item, key) in herbs.items" :key="key">
              <td style="padding-top:12px;">
                <span>{{item.name}}</span></br>                 
                <span>{{ item.traditional_chinese }}({{ item.simplified_chinese }})</span></br>    
                <span>{{ item.latin_name }} / {{ item.english_name }}</span>               
              <td>
              <td style="width:95px">
                <div class="btn-group pull-right">                  
                  <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalHerbCreate" @click="editHerb(item)"><i class="fa fa-pencil"></i></button>
                  <button type="button" :class="selectedHerbIds.indexOf(item.id) > -1 ? 'btn btn-success' : 'btn btn-default'" @click="toggleHerb(item.id)"><i :class="selectedHerbIds.indexOf(item.id) > -1 ? 'fa fa-check' : 'fa fa-plus'"></i></button>
                </div>
              </td>
            </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="2">
                  No herbs
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default pull-left" data-toggle="modal" data-target="#modalHerbCreate" @click="addHerb()"><i class="fa fa-plus-circle"></i> Create new</button>          
          <button type="button" class="btn btn-default" data-dismiss="modal" ref="dialogClose" @click="close">Close</button>
          <button type="button" class="btn btn-primary" @click="save">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'FormulaHerbs',
    computed: {
      ...mapGetters({
        currentHerbIds: 'getFormulaHerbIds',
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        loading: 'getLoadingBar'
      })
    },
    data () {
      return {
        query: '',
        selectedHerbIds: [],
        selectedHerbs: [],
        herbs: [],
        result: '',
        flag: false,
        herb: {
          id: '',
          pinyin: '',
          name: '',
          english_name: '',
          latin_name: '',
          traditional_chinese: '',
          simplified_chinese: '',
          pinyin_ton: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        }
      }
    },
    created () {
      this.fetchFormulasHerbs()
    },
    watch: {
      currentHerbIds: {
        handler () {
          this.selectedHerbIds = Object.assign([], this.currentHerbIds)
        }
      },
      flag: {
        handler () {
          if (this.flag === true) this.$store.dispatch('setLoadingBar', 'none')
        }
      },
      modalType: {
        handler () {
          this.result = ''
          if (this.modalType === 0 && this.tabName === 'Herbs') {
            this.flag = false
            this.result = 'success'
            this.$store.dispatch('setLoadingBar', 'block')
            this.$store.dispatch('setLoadingBarText', 'Loading...')
            this.fetchFormulasHerbs()
          } else if (this.modalType === 5 && this.tabName === 'Herbs') {
            if (this.flag === false) {
              this.$store.dispatch('setLoadingBar', 'block')
              this.$store.dispatch('setLoadingBarText', 'Loading...')
            }
            this.selectedHerbIds = Object.assign([], this.currentHerbIds)
          }
        }
      }
    },
    methods: {
      fetchFormulasHerbs: function () {
        this.$store.dispatch('fetchHerbTotal', {query: 'query=' + this.query})
          .then((response) => {
            this.flag = true
            this.herbs = response
          })
      },
      toggleHerb (id) {
        let index = this.selectedHerbIds.indexOf(id)
        if (index > -1) {
          this.selectedHerbIds.splice(index, 1)
        } else {
          this.selectedHerbIds.push(id)
        }
      },
      save: function () {
        this.selectedHerbs = []
        this.herbs.items.map((item, ind) => {
          let index = this.selectedHerbIds.indexOf(item.id)
          if (index > -1) {
            this.selectedHerbs.push(item)
          }
        })
        this.$store.dispatch('setFormulaHerbs', this.selectedHerbs)
        this.result = 'success'
        const btn = this.$refs.dialogClose
        btn.click()
      },
      search: function (evt) {
        evt.preventDefault()
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Searching...')
        this.$store.dispatch('fetchHerbTotal', {query: 'query=' + this.query})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.herbs = response
          }).catch((error) => {
            console.log(error)
          })
      },
      addHerb: function () {
        this.herb.pinyin = ''
        this.herb.english_name = ''
        this.herb.latin_name = ''
        this.herb.traditional_chinese = ''
        this.herb.simplified_chinese = ''
        this.herb.pinyin_ton = ''
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setHerbValue', this.herb)
      },
      editHerb: function (item) {
        this.herb.id = item.id
        this.herb.pinyin = item.pinyin
        this.herb.english_name = item.english_name
        this.herb.latin_name = item.latin_name
        this.herb.traditional_chinese = item.traditional_chinese
        this.herb.simplified_chinese = item.simplified_chinese
        this.herb.pinyin_ton = item.pinyin_ton
        this.herb.modified_time = item.modified_time
        this.herb.created_time = item.created_time
        if (item.modifiedBy === null || item.modifiedBy === undefined) this.herb.modified_by_name = ''
        else this.herb.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        if (item.createdBy === null || item.createdBy === undefined) this.herb.created_by_name = ''
        else this.herb.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setHerbValue', this.herb)
      },
      close: function () {
        if (this.result === 'success') {
          this.$store.dispatch('setModalType', 4)
        } else {
          this.$store.dispatch('setModalType', 6)
        }
      }
    }
  }
</script>
