<template>
  <div class="modal fade" id="modalFormulaTexts" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <h4 class="modal-title" id="myModalLabel">Formulas Texts</h4>
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
            <thead>
              <tr>
                <th>English</th>       
                <th style = "width:100px;">Chinese</th>       
                <th>Year</th>       
                <th>Author</th>       
                <th></th>
              </tr>
            </thead>
            <tbody v-if="texts.items && texts.items.length > 0">
            <tr v-for="(item, key) in texts.items" :key="key">
              <td style="padding-top:12px;">
                <span>{{item.english_name}}</span>             
              </td>
              <td style="padding-top:12px;">
                 <span>{{item.chinese_name}}</span>              
              </td>
              <td style="padding-top:12px;">
                <span>{{item.year}}</span>   
              </td>
              <td style="padding-top:12px;">
                <span>{{item.author}}</span>           
              </td>
              <td style="width:95px">
                <div class="btn-group pull-right">                  
                  <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalBookCreate" @click="editText(item)"><i class="fa fa-pencil"></i></button>
                  <button type="button" :class="selectedTextIds.indexOf(item.id) > -1 ? 'btn btn-success' : 'btn btn-default'" @click="toggleText(item.id)"><i :class="selectedTextIds.indexOf(item.id) > -1 ? 'fa fa-check' : 'fa fa-plus'"></i></button>
                </div>
              </td>
            </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5" style="text-align:center;">
                  No Texts
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default pull-left" data-toggle="modal" data-target="#modalBookCreate" @click="addText()"><i class="fa fa-plus-circle"></i> Create new</button>          
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
    name: 'FormulaTexts',
    computed: {
      ...mapGetters({
        currentTextIds: 'getFormulaTextIds',
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        loading: 'getLoadingBar'
      })
    },
    data () {
      return {
        query: '',
        selectedTextIds: [],
        selectedTexts: [],
        texts: [],
        result: '',
        flag: false,
        text: {
          id: 0,
          english_name: '',
          chinese_name: '',
          year: 2013,
          author: '',
          chinese_author: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        }
      }
    },
    created () {
      this.fetchFormulasTexts()
    },
    watch: {
      currentTextIds: {
        handler () {
          this.selectedTextIds = Object.assign([], this.currentTextIds)
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
          if (this.modalType === 0 && this.tabName === 'Text') {
            this.flag = false
            this.result = 'success'
            this.$store.dispatch('setLoadingBar', 'block')
            this.$store.dispatch('setLoadingBarText', 'Loading...')
            this.fetchFormulasTexts()
          } else if (this.modalType === 5 && this.tabName === 'Text') {
            if (this.flag === false) {
              this.$store.dispatch('setLoadingBar', 'block')
              this.$store.dispatch('setLoadingBarText', 'Loading...')
            }
            this.selectedTextIds = Object.assign([], this.currentTextIds)
          }
        }
      }
    },
    methods: {
      fetchFormulasTexts: function () {
        this.$store.dispatch('fetchBookTotal', {query: 'query=' + this.query})
          .then((response) => {
            this.flag = true
            this.texts = response
          })
      },
      toggleText (id) {
        let index = this.selectedTextIds.indexOf(id)
        if (index > -1) {
          this.selectedTextIds.splice(index, 1)
        } else {
          this.selectedTextIds.push(id)
        }
      },
      save: function () {
        this.selectedTexts = []
        this.texts.items.map((item, ind) => {
          let index = this.selectedTextIds.indexOf(item.id)
          if (index > -1) {
            this.selectedTexts.push(item)
          }
        })
        this.$store.dispatch('setFormulaTexts', this.selectedTexts)
        this.result = 'success'
        const btn = this.$refs.dialogClose
        btn.click()
      },
      search: function (evt) {
        evt.preventDefault()
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Searching...')
        this.$store.dispatch('fetchBookTotal', {query: 'query=' + this.query})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.texts = response
          }).catch((error) => {
            console.log(error)
          })
      },
      addText: function () {
        this.text.english_name = ''
        this.text.chinese_name = ''
        this.text.year = 2013
        this.text.author = ''
        this.text.chinese_author = ''
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setBookValue', this.text)
      },
      editText: function (item) {
        this.text.english_name = item.english_name
        this.text.chinese_name = item.chinese_name
        this.text.year = item.year
        this.text.author = item.author
        this.text.chinese_author = item.chinese_author
        this.text.modified_time = item.modified_time
        this.text.created_time = item.created_time
        if (item.modifiedBy === null || item.modifiedBy === undefined) this.text.modified_by_name = ''
        else this.text.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        if (item.createdBy === null || item.createdBy === undefined) this.text.created_by_name = ''
        else this.text.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.text.id = item.id
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setBookValue', this.text)
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
