<template>
  <div class="tab-pane active" id="info">
    <div class="box-body">
      <h3>Basic Information</h3>
    </div>
    <!-- Categories -->
    <div class="row no-margin">
      <div class="col-md-12">
        <div class="box box-default box-solid">
          <div class="box-header with-border">
            <h3 class="box-title">Categories</h3>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-toggle="modal" data-target="#modalHerbCategories" @click="addRelation('category', 'Category')"><i class="fa fa-plus-circle"></i> Category</button>
              <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
              </button>
            </div>
            <!-- /.box-tools -->
          </div>
          <!-- /.box-header -->
          <div class="box-body no-padding" style="display: block;">
            <table class="table table-hover">              
              <tbody v-if="selectedCategories.length > 0">
              <tr v-for="(item, key) in selectedCategories">
                <td style="padding-top:12px;">                  
                  <span class = "badge" style="font-size: 12pt; font-weight:400" v-bind:style="{background: item.color}">{{item.name}}</span>              
                </td>
                <td>
                  <div class="pull-right">
                    <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="Remove" @click="removeCategory(key)"><i class="fa fa-times"></i></button>
                  </div>
                </td>
              </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="2" style="text-align:center;">
                    No Categories
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.box-body -->
          <div class="box-footer clearfix" style="display: block;">
            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalHerbCategories" @click="addRelation('category', 'Category')"><i class="fa fa-plus"></i> Add</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Flavours -->
    <div class="row no-margin">
      <div class="col-md-12">
        <div class="box box-default box-solid">
          <div class="box-header with-border">
            <h3 class="box-title">Flavour</h3>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-toggle="modal" data-target="#modalHerbFlavours" @click="addRelation('flavours', 'Flavour')"><i class="fa fa-plus-circle"></i> Flavour</button>
              <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
              </button>
            </div>
            <!-- /.box-tools -->
          </div>
          <!-- /.box-header -->
          <div class="box-body no-padding" style="display: block;">
            <table class="table table-hover">
            <tbody v-if="selectedFlavours.length > 0">
              <tr v-for="(item, key) in selectedFlavours">
                <td style="padding-top:12px;">                  
                  <span style="font-size: 12pt; font-weight:400">{{item.name}}</span>              
                </td>
                <td>
                  <div class="pull-right">
                    <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="Remove" @click="removeFlavour(key)"><i class="fa fa-times"></i></button>
                  </div>
                </td>
              </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="2" style="text-align:center;">
                    No Flavours
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.box-body -->
          <div class="box-footer clearfix" style="display: block;">
            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalHerbFlavours" @click="addRelation('flavours', 'Flavour')"><i class="fa fa-plus"></i> Add</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Nature -->
    <div class="row no-margin">
      <div class="col-md-12">
        <div class="box box-default box-solid">
          <div class="box-header with-border">
            <h3 class="box-title">Nature</h3>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-toggle="modal" data-target="#modalHerbNatures" @click="addRelation('natures', 'Nature')"><i class="fa fa-plus-circle"></i> Nature</button>
              <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
              </button>
            </div>
            <!-- /.box-tools -->
          </div>
          <!-- /.box-header -->
          <div class="box-body no-padding" style="display: block;">
            <table class="table table-hover">
              <tbody v-if="selectedNatures.length > 0">
                <tr v-for="(item, key) in selectedNatures">
                  <td style="padding-top:12px;">                  
                    <span style="font-size: 12pt; font-weight:400">{{item.name}}</span>              
                  </td>
                  <td>
                    <div class="pull-right">
                      <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="Remove" @click="removeNature(key)"><i class="fa fa-times"></i></button>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="2" style="text-align:center;">
                    No Natures
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.box-body -->
          <div class="box-footer clearfix" style="display: block;">
            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalHerbNatures" @click="addRelation('natures', 'Nature')"><i class="fa fa-plus"></i> Add</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Channels -->
    <div class="row no-margin">
      <div class="col-md-12">
        <div class="box box-default box-solid">
          <div class="box-header with-border">
            <h3 class="box-title">Channels</h3>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-toggle="modal" data-target="#modalHerbChannels" @click="addRelation('channels', 'Channel')"><i class="fa fa-plus-circle"></i> Channel</button>
              <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
              </button>
            </div>
            <!-- /.box-tools -->
          </div>
          <!-- /.box-header -->
          <div class="box-body no-padding" style="display: block;">
            <table class="table table-hover">
              <tbody v-if="selectedChannels.length > 0">
                <tr v-for="(item, key) in selectedChannels">
                  <td style="padding-top:12px;">                  
                    <span>{{item.english_name}}<br> <span class="text-muted">{{item.chinese_name}}</span></span>                
                  </td>
                  <td>
                    <div class="pull-right">
                      <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="Remove" @click="removeChannel(key)"><i class="fa fa-times"></i></button>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="2" style="text-align:center;">
                    No Channels
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.box-body -->
          <div class="box-footer clearfix" style="display: block;">
            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalHerbChannels" @click="addRelation('channels', 'Channel')"><i class="fa fa-plus"></i> Add</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'HerbTabInfo',
    data () {
      return {
        selectedCategories: [],
        selectedFlavours: [],
        selectedNatures: [],
        selectedChannels: []
      }
    },
    computed: {
      ...mapGetters({
        herbCategories: 'getHerbCategories',
        herbFlavours: 'getHerbFlavours',
        herbNatures: 'getHerbNatures',
        herbChannels: 'getHerbChannels'
      })
    },
    watch: {
      herbCategories: {
        handler () {
          this.selectedCategories = Object.assign([], this.herbCategories)
        }
      },
      herbFlavours: {
        handler () {
          this.selectedFlavours = Object.assign([], this.herbFlavours)
        }
      },
      herbNatures: {
        handler () {
          this.selectedNatures = Object.assign([], this.herbNatures)
        }
      },
      herbChannels: {
        handler () {
          this.selectedChannels = Object.assign([], this.herbChannels)
        }
      }
    },
    methods: {
      addRelation: function (activeTab, tabName) {
        this.$store.dispatch('setModalType', 5)
        this.$store.dispatch('switchTab', activeTab)
        this.$store.dispatch('setTabName', tabName)
      },
      removeCategory: function (index) {
        this.selectedCategories.splice(index, 1)
        this.$store.dispatch('setHerbCategories', this.selectedCategories)
      },
      removeFlavour: function (index) {
        this.selectedFlavours.splice(index, 1)
        this.$store.dispatch('setHerbFlavours', this.selectedFlavours)
      },
      removeChannel: function (index) {
        this.selectedChannels.splice(index, 1)
        this.$store.dispatch('setHerbChannels', this.selectedChannels)
      },
      removeNature: function (index) {
        this.selectedNatures.splice(index, 1)
        this.$store.dispatch('setHerbNatures', this.selectedNatures)
      }
    }
  }
</script>
