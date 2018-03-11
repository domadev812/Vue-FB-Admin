<template>
  <div class="modal fade" id="modalFormulaPreps" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <h4 class="modal-title" id="myModalLabel">Formulas Preps</h4>
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
                <th>Name</th>       
                <th>Category</th>       
                <th>Method</th>       
                <th>Associated</th>       
                <th></th>
              </tr>
            </thead>
            <tbody v-if="preps.items && preps.items.length > 0">
            <tr v-for="(item, key) in preps.items" :key="key">
              <td style="padding-top:12px;">
                <span>{{item.name}}</span>             
              </td>
              <td style="padding-top:12px;">
                <span v-if="item.categories.length > 0">{{item.categories[0].name}}</span>
                <span v-else></span>            
              </td>
              <td style="padding-top:12px;">
                <span>{{item.method}}</span>             
              </td>
              <td style="padding-top:12px;">
                <span></span>             
              </td>
              <td style="width:95px">
                <div class="btn-group pull-right">                  
                  <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalPrepMethodCreate" @click="editPrep(item)"><i class="fa fa-pencil"></i></button>
                  <button type="button" :class="selectedPrepIds.indexOf(item.id) > -1 ? 'btn btn-success' : 'btn btn-default'" @click="togglePrep(item.id)"><i :class="selectedPrepIds.indexOf(item.id) > -1 ? 'fa fa-check' : 'fa fa-plus'"></i></button>
                </div>
              </td>
            </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5" style="text-align:center;">
                  No Preps
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default pull-left" data-toggle="modal" data-target="#modalPrepMethodCreate" @click="addPrep()"><i class="fa fa-plus-circle"></i> Create new</button>          
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
    name: 'FormulaPreps',
    computed: {
      ...mapGetters({
        currentPrepIds: 'getFormulaPrepIds',
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        loading: 'getLoadingBar'
      })
    },
    data () {
      return {
        query: '',
        selectedPrepIds: [],
        selectedPreps: [],
        preps: [],
        result: '',
        flag: false,
        prep: {
          id: '',
          name: '',
          method: '',
          category: 0,
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        }
      }
    },
    created () {
      this.fetchFormulasPreps()
    },
    watch: {
      currentPrepIds: {
        handler () {
          this.selectedPrepIds = Object.assign([], this.currentPrepIds)
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
          if (this.modalType === 0 && this.tabName === 'Prep') {
            this.flag = false
            this.result = 'success'
            this.$store.dispatch('setLoadingBar', 'block')
            this.$store.dispatch('setLoadingBarText', 'Loading...')
            this.fetchFormulasPreps()
          } else if (this.modalType === 5 && this.tabName === 'Prep') {
            if (this.flag === false) {
              this.$store.dispatch('setLoadingBar', 'block')
              this.$store.dispatch('setLoadingBarText', 'Loading...')
            }
            this.selectedPrepIds = Object.assign([], this.currentPrepIds)
          }
        }
      }
    },
    methods: {
      fetchFormulasPreps: function () {
        this.$store.dispatch('fetchPrepTotal', {query: 'query=' + this.query})
          .then((response) => {
            this.flag = true
            this.preps = response
          })
      },
      togglePrep (id) {
        let index = this.selectedPrepIds.indexOf(id)
        if (index > -1) {
          this.selectedPrepIds.splice(index, 1)
        } else {
          this.selectedPrepIds.push(id)
        }
      },
      save: function () {
        this.selectedPreps = []
        this.preps.items.map((item, ind) => {
          let index = this.selectedPrepIds.indexOf(item.id)
          if (index > -1) {
            this.selectedPreps.push(item)
          }
        })
        this.$store.dispatch('setFormulaPreps', this.selectedPreps)
        this.result = 'success'
        const btn = this.$refs.dialogClose
        btn.click()
      },
      search: function (evt) {
        evt.preventDefault()
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Searching...')
        this.$store.dispatch('fetchPrepTotal', {query: 'query=' + this.query})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.preps = response
          }).catch((error) => {
            console.log(error)
          })
      },
      addPrep: function () {
        this.prep.name = ''
        this.prep.method = ''
        this.prep.category = 0
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setPrepMethodValue', this.prep)
      },
      editPrep: function (item) {
        this.prep.name = item.name
        this.prep.method = item.method
        if (item.categories.length > 0) this.prep.category = item.categories[0].id
        else this.prep.category = 0
        this.prep.modified_time = item.modified_time
        this.prep.created_time = item.created_time
        if (item.modifiedBy === null || item.modifiedBy === undefined) this.prep.modified_by_name = ''
        else this.prep.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        if (item.createdBy === null || item.createdBy === undefined) this.prep.created_by_name = ''
        else this.prep.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.prep.id = item.id
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setPrepMethodValue', this.prep)
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
