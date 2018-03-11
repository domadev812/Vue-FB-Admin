<template>
  <div class="tab-pane" id="prep">
    <div class="box-body">
      <h3>Preparation Instruction
        <span data-toggle="tooltip" title="" class="badge bg-green">{{ selectedPreps.length }}</span>
      </h3>
    </div>
    <div class="row no-margin">
      <div class="col-md-12">
        <div class="box box-default box-solid">
          <div class="box-header with-border">
            <h3 class="box-title">Preparation Instruction</h3>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-toggle="modal" data-target="#modalFormulaPreps" @click="addPrep()"><i class="fa fa-plus-circle"></i> Prep instruction</button>
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
            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalFormulaPreps" @click="addPrep()"><i class="fa fa-plus"></i> Add</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'FormulaTabInfo',
    data () {
      return {
        selectedPreps: []
      }
    },
    computed: {
      ...mapGetters({
        formulaPreps: 'getFormulaPreps'
      })
    },
    watch: {
      formulaPreps: {
        handler () {
          this.selectedPreps = Object.assign([], this.formulaPreps)
        }
      }
    },
    methods: {
      addPrep: function () {
        this.switchTabs('Prep')
        this.$store.dispatch('setModalType', 5)
      },
      removePrep: function (index) {
        this.selectedPreps.splice(index, 1)
        this.$store.dispatch('setFormulaPreps', this.selectedPreps)
      },
      switchTabs (tabName) {
        this.$store.dispatch('setTabName', tabName)
      }
    }
  }
</script>
