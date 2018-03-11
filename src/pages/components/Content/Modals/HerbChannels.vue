<template>
  <div class="modal fade" id="modalHerbChannels" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <h4 class="modal-title" id="myModalLabel">Channels</h4>
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
            <tbody v-if="channels.items && channels.items.length > 0">
            <tr v-for="(item, key) in channels.items" :key="key">
              <td style="padding-top:12px;">
                <span>{{item.english_name}}<br> <span class="text-muted">{{item.chinese_name}}</span></span>             
              </td>
              <td>
                <div class="btn-group pull-right">                  
                  <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalHerbologyGeneranCreate" @click="editChannel(item)"><i class="fa fa-pencil"></i></button>
                  <button type="button" :class="selectedChannelIds.indexOf(item.id) > -1 ? 'btn btn-success' : 'btn btn-default'" @click="toggleChannel(item.id)"><i :class="selectedChannelIds.indexOf(item.id) > -1 ? 'fa fa-check' : 'fa fa-plus'"></i></button>
                </div>
              </td>
            </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5" style="text-align:center;">
                  No Channels
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default pull-left" data-toggle="modal" data-target="#modalHerbologyGeneranCreate" @click="addChannel()"><i class="fa fa-plus-circle"></i> Create new</button>          
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
    name: 'HerbChannels',
    computed: {
      ...mapGetters({
        currentChannelIds: 'getHerbChannelIds',
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        activeTab: 'getActiveTab',
        loading: 'getLoadingBar'
      })
    },
    data () {
      return {
        query: '',
        selectedChannelIds: [],
        selectedChannels: [],
        channels: [],
        result: '',
        flag: false,
        channel: {
          id: '',
          english_name: '',
          chinese_name: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        }
      }
    },
    created () {
      this.fetchHerbChannels()
    },
    watch: {
      currentChannelIds: {
        handler () {
          this.selectedChannelIds = Object.assign([], this.currentChannelIds)
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
          if (this.modalType === 0 && this.tabName === 'Channel') {
            this.flag = false
            this.result = 'success'
            this.$store.dispatch('setLoadingBar', 'block')
            this.$store.dispatch('setLoadingBarText', 'Loading...')
            this.fetchHerbChannels()
          } else if (this.modalType === 5 && this.tabName === 'Channel') {
            if (this.flag === false) {
              this.$store.dispatch('setLoadingBar', 'block')
              this.$store.dispatch('setLoadingBarText', 'Loading...')
            }
            this.selectedChannelIds = Object.assign([], this.currentChannelIds)
          }
        }
      }
    },
    methods: {
      fetchHerbChannels: function () {
        this.$store.dispatch('fetchAllChannels', {query: this.query})
          .then((response) => {
            this.flag = true
            this.channels = response
          })
      },
      toggleChannel (id) {
        let index = this.selectedChannelIds.indexOf(id)
        if (index > -1) {
          this.selectedChannelIds.splice(index, 1)
        } else {
          this.selectedChannelIds.push(id)
        }
      },
      save: function () {
        this.selectedChannels = []
        this.channels.items.map((item, ind) => {
          let index = this.selectedChannelIds.indexOf(item.id)
          if (index > -1) {
            this.selectedChannels.push(item)
          }
        })
        this.$store.dispatch('setHerbChannels', this.selectedChannels)
        this.result = 'success'
        const btn = this.$refs.dialogClose
        btn.click()
      },
      search: function (evt) {
        evt.preventDefault()
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Searching...')
        this.$store.dispatch('fetchAllChannels', {query: this.query})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.channels = response
          }).catch((error) => {
            console.log(error)
          })
      },
      addChannel: function () {
        this.channel.english_name = ''
        this.channel.chinese_name = ''
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setChannelValue', this.channel)
      },
      editChannel: function (item) {
        this.channel.english_name = item.english_name
        this.channel.chinese_name = item.chinese_name
        this.channel.modified_time = item.modified_time
        if (item.modifiedBy === null || item.modifiedBy === undefined) this.channel.modified_by_name = ''
        else this.channel.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        this.channel.created_time = item.created_time
        if (item.createdBy === null || item.createdBy === undefined) this.channel.created_by_name = ''
        else this.channel.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.channel.id = item.id
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setChannelValue', this.channel)
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
