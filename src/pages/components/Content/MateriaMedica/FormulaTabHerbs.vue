<template>
  <div class="tab-pane" id="herbs">
    <div class="box-body">
      <h3>Containing Herbs
        <span data-toggle="tooltip" title="" class="badge bg-green">{{ selectedHerbs.length }}</span>
      </h3>
    </div>
    <div class="row no-margin">
      <div class="col-md-12">
        <div class="box box-default box-solid">
          <div class="box-header with-border">
            <h3 class="box-title">Herbs</h3>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-toggle="modal" data-target="#modalFormulaHerbs" @click="addHerb()"><i class="fa fa-plus-circle"></i> Herb</button>
              <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
              </button>
            </div>
            <!-- /.box-tools -->
          </div>
          <!-- /.box-header -->
          <div class="box-body no-padding" style="display: block;">
            <table class="table table-hover">
              <tbody v-if="selectedHerbs.length > 0">
              <tr v-for="(item, key) in selectedHerbs">
                <td style="padding-top:12px;">                  
                  <router-link :to="{ name: 'Herb', params: { id: item.id }}">{{item.name}}</router-link></br>                 
                  <span>{{ item.traditional_chinese }}({{ item.simplified_chinese }})</span></br>    
                  <span>{{ item.latin_name }} / {{ item.english_name }}</span>            
                </td>
                <td>
                  <div class="pull-right">
                    <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="Remove"  @click="removeHerb(key)"><i class="fa fa-times"></i></button>
                  </div>
                </td>
              </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="2" style="text-align:center;">
                    No Herbs
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.box-body -->
          <div class="box-footer clearfix" style="display: block;">
            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalFormulaHerbs" @click="addHerb()"><i class="fa fa-plus"></i> Add</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'FormulaTabHerbs',
    data () {
      return {
        selectedHerbs: []
      }
    },
    computed: {
      ...mapGetters({
        formulaHerbs: 'getFormulaHerbs'
      })
    },
    watch: {
      formulaHerbs: {
        handler () {
          this.selectedHerbs = Object.assign([], this.formulaHerbs)
        }
      }
    },
    methods: {
      addHerb: function () {
        this.switchTabs('Herbs')
        this.$store.dispatch('setModalType', 5)
      },
      removeHerb: function (index) {
        this.selectedHerbs.splice(index, 1)
        this.$store.dispatch('setFormulaHerbs', this.selectedHerbs)
      },
      switchTabs (tabName) {
        this.$store.dispatch('setTabName', tabName)
      }
    }
  }
</script>
