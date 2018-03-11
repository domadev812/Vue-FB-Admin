<template>
  <div class="modal fade" id="modalHerbFormulas" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <h4 class="modal-title" id="myModalLabel">Herb Formulas</h4>
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
            <tbody v-if="formulas.items && formulas.items.length > 0">
            <tr v-for="(item, key) in formulas.items" :key="key">
              <td style="padding-top:12px;">
                <span>{{item.name}}</span></br>                 
                <span>{{ item.traditional_chinese }}({{ item.simplified_chinese }})</span>              
              <td>
                <div class="btn-group pull-right">                  
                  <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalFormulaCreate" @click="editFormula(item)"><i class="fa fa-pencil"></i></button>
                  <button type="button" :class="selectedFormulaIds.indexOf(item.id) > -1 ? 'btn btn-success' : 'btn btn-default'" @click="toggleFormula(item.id)"><i :class="selectedFormulaIds.indexOf(item.id) > -1 ? 'fa fa-check' : 'fa fa-plus'"></i></button>
                </div>
              </td>
            </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="2">
                  No Formulas
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default pull-left" data-toggle="modal" data-target="#modalFormulaCreate" @click="addFormula()"><i class="fa fa-plus-circle"></i> Create new</button>          
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
    name: 'HerbFormulas',
    computed: {
      ...mapGetters({
        currentFormulaIds: 'getHerbFormulaIds',
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        loading: 'getLoadingBar'
      })
    },
    data () {
      return {
        query: '',
        selectedFormulaIds: [],
        selectedFormulas: [],
        formulas: [],
        result: '',
        flag: false,
        formula: {
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
      this.fetchHerbFormulas()
    },
    watch: {
      currentFormulaIds: {
        handler () {
          this.selectedFormulaIds = Object.assign([], this.currentFormulaIds)
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
          if (this.modalType === 0 && this.tabName === 'Formulas') {
            this.flag = false
            this.result = 'success'
            this.$store.dispatch('setLoadingBar', 'block')
            this.$store.dispatch('setLoadingBarText', 'Loading...')
            this.fetchHerbFormulas()
          } else if (this.modalType === 5 && this.tabName === 'Formulas') {
            if (this.flag === false) {
              this.$store.dispatch('setLoadingBar', 'block')
              this.$store.dispatch('setLoadingBarText', 'Loading...')
            }
            this.selectedFormulaIds = Object.assign([], this.currentFormulaIds)
          }
        }
      }
    },
    methods: {
      fetchHerbFormulas: function () {
        this.$store.dispatch('fetchFormulaTotal', {query: 'query=' + this.query})
          .then((response) => {
            this.flag = true
            this.formulas = response
          })
      },
      toggleFormula (id) {
        let index = this.selectedFormulaIds.indexOf(id)
        if (index > -1) {
          this.selectedFormulaIds.splice(index, 1)
        } else {
          this.selectedFormulaIds.push(id)
        }
      },
      save: function () {
        this.selectedFormulas = []
        this.formulas.items.map((item, ind) => {
          let index = this.selectedFormulaIds.indexOf(item.id)
          if (index > -1) {
            this.selectedFormulas.push(item)
          }
        })
        this.$store.dispatch('setHerbFormulas', this.selectedFormulas)
        this.result = 'success'
        const btn = this.$refs.dialogClose
        btn.click()
      },
      search: function (evt) {
        evt.preventDefault()
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Searching...')
        this.$store.dispatch('fetchFormulaTotal', {query: 'query=' + this.query})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.formulas = response
          }).catch((error) => {
            console.log(error)
          })
      },
      addFormula: function () {
        this.formula.pinyin = ''
        this.formula.english_name = ''
        this.formula.latin_name = ''
        this.formula.traditional_chinese = ''
        this.formula.simplified_chinese = ''
        this.formula.pinyin_ton = ''
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setFormulaValue', this.formula)
      },
      editFormula: function (item) {
        this.formula.id = item.id
        this.formula.pinyin = item.pinyin
        this.formula.english_name = item.english_name
        this.formula.latin_name = item.latin_name
        this.formula.traditional_chinese = item.traditional_chinese
        this.formula.simplified_chinese = item.simplified_chinese
        this.formula.pinyin_ton = item.pinyin_ton
        if (item.modifiedBy === null || item.modifiedBy === undefined) this.formula.modified_by_name = ''
        else this.formula.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        this.formula.modified_time = item.modified_time
        if (item.createdBy === null || item.createdBy === undefined) this.formula.created_by_name = ''
        else this.formula.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.formula.created_time = item.created_time
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setFormulaValue', this.formula)
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
