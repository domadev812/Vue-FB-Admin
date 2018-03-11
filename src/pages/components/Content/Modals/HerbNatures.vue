<template>
  <div class="modal fade" id="modalHerbNatures" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <h4 class="modal-title" id="myModalLabel">Natures</h4>
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
            <tbody v-if="natures.items && natures.items.length > 0">
            <tr v-for="(item, key) in natures.items" :key="key">
              <td style="padding-top:12px;">
                <span>{{item.name}}</span>             
              </td>
              <td>
                <div class="btn-group pull-right">                  
                  <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalHerbologyGeneranCreate" @click="editNature(item)"><i class="fa fa-pencil"></i></button>
                  <button type="button" :class="selectedNatureIds.indexOf(item.id) > -1 ? 'btn btn-success' : 'btn btn-default'" @click="toggleNature(item.id)"><i :class="selectedNatureIds.indexOf(item.id) > -1 ? 'fa fa-check' : 'fa fa-plus'"></i></button>
                </div>
              </td>
            </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5" style="text-align:center;">
                  No Natures
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default pull-left" data-toggle="modal" data-target="#modalHerbologyGeneranCreate" @click="addNature()"><i class="fa fa-plus-circle"></i> Create new</button>          
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
    name: 'HerbNatures',
    computed: {
      ...mapGetters({
        currentNatureIds: 'getHerbNatureIds',
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        activeTab: 'getActiveTab',
        loading: 'getLoadingBar'
      })
    },
    data () {
      return {
        query: '',
        selectedNatureIds: [],
        selectedNatures: [],
        natures: [],
        result: '',
        flag: false,
        nature: {
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
      this.fetchHerbNatures()
    },
    watch: {
      currentNatureIds: {
        handler () {
          this.selectedNatureIds = Object.assign([], this.currentNatureIds)
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
          if (this.modalType === 0 && this.tabName === 'Nature') {
            this.flag = false
            this.result = 'success'
            this.$store.dispatch('setLoadingBar', 'block')
            this.$store.dispatch('setLoadingBarText', 'Loading...')
            this.fetchHerbNatures()
          } else if (this.modalType === 5 && this.tabName === 'Nature') {
            if (this.flag === false) {
              this.$store.dispatch('setLoadingBar', 'block')
              this.$store.dispatch('setLoadingBarText', 'Loading...')
            }
            this.selectedNatureIds = Object.assign([], this.currentNatureIds)
          }
        }
      }
    },
    methods: {
      fetchHerbNatures: function () {
        this.$store.dispatch('fetchAllNatures', {query: this.query})
          .then((response) => {
            this.flag = true
            this.natures = response
          })
      },
      toggleNature (id) {
        let index = this.selectedNatureIds.indexOf(id)
        if (index > -1) {
          this.selectedNatureIds.splice(index, 1)
        } else {
          this.selectedNatureIds.push(id)
        }
      },
      save: function () {
        this.selectedNatures = []
        this.natures.items.map((item, ind) => {
          let index = this.selectedNatureIds.indexOf(item.id)
          if (index > -1) {
            this.selectedNatures.push(item)
          }
        })
        this.$store.dispatch('setHerbNatures', this.selectedNatures)
        this.result = 'success'
        const btn = this.$refs.dialogClose
        btn.click()
      },
      search: function (evt) {
        evt.preventDefault()
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Searching...')
        this.$store.dispatch('fetchAllNatures', {query: this.query})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.natures = response
          }).catch((error) => {
            console.log(error)
          })
      },
      addNature: function () {
        this.nature.name = ''
        this.nature.type = this.activeTab
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setHerbologyValue', this.nature)
      },
      editNature: function (item) {
        this.nature.name = item.name
        this.nature.type = this.activeTab
        this.nature.modified_time = item.modified_time
        this.nature.created_time = item.created_time
        if (item.modifiedBy === null || item.modifiedBy === undefined) this.nature.modified_by_name = ''
        else this.nature.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        if (item.createdBy === null || item.createdBy === undefined) this.nature.created_by_name = ''
        else this.nature.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.nature.id = item.id
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setHerbologyValue', this.nature)
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
