<template>
  <div class="modal fade" id="modalHerbFlavours" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <h4 class="modal-title" id="myModalLabel">Flavours</h4>
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
                <th></th>
              </tr>
            </thead>
            <tbody v-if="flavours.items && flavours.items.length > 0">
            <tr v-for="(item, key) in flavours.items" :key="key">
              <td style="padding-top:12px;">
                <span>{{item.name}}</span>             
              </td>
              <td>
                <div class="btn-group pull-right">                  
                  <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalHerbologyGeneranCreate" @click="editFlavour(item)"><i class="fa fa-pencil"></i></button>
                  <button type="button" :class="selectedFlavourIds.indexOf(item.id) > -1 ? 'btn btn-success' : 'btn btn-default'" @click="toggleFlavour(item.id)"><i :class="selectedFlavourIds.indexOf(item.id) > -1 ? 'fa fa-check' : 'fa fa-plus'"></i></button>
                </div>
              </td>
            </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5" style="text-align:center;">
                  No Flavours
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default pull-left" data-toggle="modal" data-target="#modalHerbologyGeneranCreate" @click="addFlavour()"><i class="fa fa-plus-circle"></i> Create new</button>          
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
    name: 'HerbFlavours',
    computed: {
      ...mapGetters({
        currentFlavourIds: 'getHerbFlavourIds',
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        activeTab: 'getActiveTab',
        loading: 'getLoadingBar'
      })
    },
    data () {
      return {
        query: '',
        selectedFlavourIds: [],
        selectedFlavours: [],
        flavours: [],
        result: '',
        flag: false,
        flavour: {
          id: 0,
          name: '',
          type: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        }
      }
    },
    created () {
      this.fetchHerbFlavours()
    },
    watch: {
      currentFlavourIds: {
        handler () {
          this.selectedFlavourIds = Object.assign([], this.currentFlavourIds)
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
          if (this.modalType === 0 && this.tabName === 'Flavour') {
            this.flag = false
            this.result = 'success'
            this.$store.dispatch('setLoadingBar', 'block')
            this.$store.dispatch('setLoadingBarText', 'Loading...')
            this.fetchHerbFlavours()
          } else if (this.modalType === 5 && this.tabName === 'Flavour') {
            if (this.flag === false) {
              this.$store.dispatch('setLoadingBar', 'block')
              this.$store.dispatch('setLoadingBarText', 'Loading...')
            }
            this.selectedFlavourIds = Object.assign([], this.currentFlavourIds)
          }
        }
      }
    },
    methods: {
      fetchHerbFlavours: function () {
        this.$store.dispatch('fetchAllFlavours', {query: this.query})
          .then((response) => {
            this.flag = true
            this.flavours = response
          })
      },
      toggleFlavour (id) {
        let index = this.selectedFlavourIds.indexOf(id)
        if (index > -1) {
          this.selectedFlavourIds.splice(index, 1)
        } else {
          this.selectedFlavourIds.push(id)
        }
      },
      save: function () {
        this.selectedFlavours = []
        this.flavours.items.map((item, ind) => {
          let index = this.selectedFlavourIds.indexOf(item.id)
          if (index > -1) {
            this.selectedFlavours.push(item)
          }
        })
        this.$store.dispatch('setHerbFlavours', this.selectedFlavours)
        this.result = 'success'
        const btn = this.$refs.dialogClose
        btn.click()
      },
      search: function (evt) {
        evt.preventDefault()
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Searching...')
        this.$store.dispatch('fetchAllFlavours', {query: this.query})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.flavours = response
          }).catch((error) => {
            console.log(error)
          })
      },
      addFlavour: function () {
        this.flavour.name = ''
        this.flavour.type = this.activeTab
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setHerbologyValue', this.flavour)
      },
      editFlavour: function (item) {
        this.flavour.name = item.name
        this.flavour.type = this.activeTab
        this.flavour.modified_time = item.modified_time
        if (item.modifiedBy === null || item.modifiedBy === undefined) this.flavour.modified_by_name = ''
        else this.flavour.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        this.flavour.created_time = item.created_time
        if (item.createdBy === null || item.createdBy === undefined) this.flavour.created_by_name = ''
        else this.flavour.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.flavour.id = item.id
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setHerbologyValue', this.flavour)
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
