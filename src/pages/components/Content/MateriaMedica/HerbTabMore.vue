<template>
  <div class="tab-pane" id="more">
    <div class="box-body">
      <h3>More Information</h3>
    </div>
    <!-- Preparation Methods -->
    <div class="row no-margin">
      <div class="col-md-12">
        <div class="box box-default box-solid">
          <div class="box-header with-border">
            <h3 class="box-title">Preparation Methods</h3>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-toggle="modal" data-target="#modalHerbPreps" @click="addRelation('prep', 'Prep')"><i class="fa fa-plus-circle"></i> Method</button>
              <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
              </button>
            </div>
            <!-- /.box-tools -->
          </div>
          <!-- /.box-header -->
          <div class="box-body no-padding" style="display: block;">
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
              <tbody v-if="selectedPreps.length > 0">
              <tr v-for="(item, key) in selectedPreps">
                <td style="padding-top:12px;">
                  <span>{{item.name}}</span>             
                </td>
                <td style="padding-top:12px;">
                  <span v-if="item.categories !== null && item.categories !== undefined">{{item.categories[0].name}}</span>
                  <span v-else></span>            
                </td>
                <td style="padding-top:12px;">
                  <span>{{item.method}}</span>             
                </td>
                <td style="padding-top:12px;">
                  <span></span>             
                </td>
                <td>
                  <div class="pull-right">
                    <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="Remove"  @click="removePrep(key)"><i class="fa fa-times"></i></button>
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
          <!-- /.box-body -->
          <div class="box-footer clearfix" style="display: block;">
            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalHerbPreps" @click="addRelation('prep', 'Prep')"><i class="fa fa-plus"></i> Add</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Plant Species -->
    <div class="row no-margin">
      <div class="col-md-12">
        <div class="box box-default box-solid">
          <div class="box-header with-border">
            <h3 class="box-title">Plant Species</h3>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-toggle="modal" data-target="#modalHerbSpecies" @click="addRelation('species', 'Species')"><i class="fa fa-plus-circle"></i> Plant Species</button>
              <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
              </button>
            </div>
            <!-- /.box-tools -->
          </div>
          <!-- /.box-header -->
          <div class="box-body no-padding" style="display: block;">
            <table class="table table-hover">
            <tbody v-if="selectedSpecies.length > 0">
              <tr v-for="(item, key) in selectedSpecies">
                <td style="padding-top:12px;">                  
                  <span style="font-size: 12pt; font-weight:400">{{item.name}}</span>              
                </td>
                <td>
                  <div class="pull-right">
                    <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="Remove" @click="removeSpecy(key)"><i class="fa fa-times"></i></button>
                  </div>
                </td>
              </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="2" style="text-align:center;">
                    No Species
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.box-body -->
          <div class="box-footer clearfix" style="display: block;">
            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalHerbSpecies" @click="addRelation('species', 'Species')"><i class="fa fa-plus"></i> Add</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Cultivations -->
    <div class="row no-margin">
      <div class="col-md-12">
        <div class="box box-default box-solid">
          <div class="box-header with-border">
            <h3 class="box-title">Cultivations</h3>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-toggle="modal" data-target="#modalHerbCultivations" @click="addRelation('cultivations', 'Cultivations')"><i class="fa fa-plus-circle"></i> Cultivations</button>
              <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
              </button>
            </div>
            <!-- /.box-tools -->
          </div>
          <!-- /.box-header -->
          <div class="box-body no-padding" style="display: block;">
            <table class="table table-hover">
              <tbody v-if="selectedCultivations.length > 0">
                <tr v-for="(item, key) in selectedCultivations">
                  <td style="padding-top:12px;">                  
                    <span style="font-size: 12pt; font-weight:400">{{item.name}}</span>              
                  </td>
                  <td>
                    <div class="pull-right">
                      <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="Remove" @click="removeCultivation(key)"><i class="fa fa-times"></i></button>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="2" style="text-align:center;">
                    No Cultivations
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.box-body -->
          <div class="box-footer clearfix" style="display: block;">
            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalHerbCultivations" @click="addRelation('cultivations', 'Cultivations')"><i class="fa fa-plus"></i> Add</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Cautions -->   
    <div class="row no-margin">
      <div class="col-md-12">
        <div class="box box-default box-solid">
          <div class="box-header with-border">
            <h3 class="box-title">Cautions</h3>

            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-toggle="modal" data-target="#modalHerbCautions" @click="addRelation('cautions', 'Cautions')"><i class="fa fa-plus-circle"></i> Cautions</button>
              <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
              </button>
            </div>
            <!-- /.box-tools -->
          </div>
          <!-- /.box-header -->
          <div class="box-body no-padding" style="display: block;">
            <table class="table table-hover">
              <tbody v-if="selectedCautions.length > 0">
                <tr v-for="(item, key) in selectedCautions">
                  <td style="padding-top:12px;">                  
                    <span style="font-size: 12pt; font-weight:400">{{item.name}}</span>              
                  </td>
                  <td>
                    <div class="pull-right">
                      <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="Remove" @click="removeCaution(key)"><i class="fa fa-times"></i></button>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="2" style="text-align:center;">
                    No Cautions
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.box-body -->
          <div class="box-footer clearfix" style="display: block;">
            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalHerbCautions" @click="addRelation('Cautions', 'Cautions')"><i class="fa fa-plus"></i> Add</button>
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
        selectedPreps: [],
        selectedSpecies: [],
        selectedCultivations: [],
        selectedCautions: []
      }
    },
    computed: {
      ...mapGetters({
        herbPreps: 'getHerbPreps',
        herbSpecies: 'getHerbSpecies',
        herbCultivations: 'getHerbCultivations',
        herbCautions: 'getHerbCautions'
      })
    },
    watch: {
      herbPreps: {
        handler () {
          this.selectedPreps = Object.assign([], this.herbPreps)
        }
      },
      herbSpecies: {
        handler () {
          this.selectedSpecies = Object.assign([], this.herbSpecies)
        }
      },
      herbCultivations: {
        handler () {
          this.selectedCultivations = Object.assign([], this.herbCultivations)
        }
      },
      herbCautions: {
        handler () {
          this.selectedCautions = Object.assign([], this.selectedCautions)
        }
      }
    },
    methods: {
      addRelation: function (activeTab, tabName) {
        this.$store.dispatch('setModalType', 5)
        this.$store.dispatch('switchTab', activeTab)
        this.$store.dispatch('setTabName', tabName)
      },
      removePrep: function (index) {
        this.selectedPreps.splice(index, 1)
        this.$store.dispatch('setHerbPreps', this.selectedPreps)
      },
      removeCultivation: function (index) {
        this.selectedCultivations.splice(index, 1)
        this.$store.dispatch('setHerbCultivations', this.selectedCultivations)
      },
      removeSpecy: function (index) {
        this.selectedSpecies.splice(index, 1)
        this.$store.dispatch('setHerbSpecies', this.selectedSpecies)
      },
      removeCaution: function (index) {
        this.selectedCautions.splice(index, 1)
        this.$store.dispatch('setHerbCautions', this.selectedCautions)
      }
    }
  }
</script>
