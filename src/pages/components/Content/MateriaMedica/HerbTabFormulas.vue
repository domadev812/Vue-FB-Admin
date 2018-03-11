<template>
  <div class="tab-pane" id="formulas">
    <div class="box-body">
      <h3>Containing Formulas
        <span data-toggle="tooltip" title="" class="badge bg-green">{{ selectedFormulas.length }}</span>
      </h3>
    </div>
    <div class="row no-margin">
      <div class="col-md-12">
        <div class="box box-default box-solid">
          <div class="box-header with-border">
            <h3 class="box-title">Formulas</h3>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-toggle="modal" data-target="#modalHerbFormulas" @click="addFormula()"><i class="fa fa-plus-circle"></i> Formula</button>
              <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
              </button>
            </div>
            <!-- /.box-tools -->
          </div>
          <!-- /.box-header -->
          <div class="box-body no-padding" style="display: block;">
            <table class="table table-hover">
              <tbody v-if="selectedFormulas.length > 0">
              <tr v-for="(item, key) in selectedFormulas">
                <td style="padding-top:12px;">                  
                  <router-link :to="{ name: 'Herb', params: { id: item.id }}">{{item.name}}</router-link></br>                 
                  <span>{{ item.traditional_chinese }}({{ item.simplified_chinese }})</span>          
                </td>
                <td>
                  <div class="pull-right">
                    <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="Remove"  @click="removeFormula(key)"><i class="fa fa-times"></i></button>
                  </div>
                </td>
              </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="2" style="text-align:center;">
                    No Formulas
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.box-body -->
          <div class="box-footer clearfix" style="display: block;">
            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalHerbFormulas" @click="addFormula()"><i class="fa fa-plus"></i> Add</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'HerbTabFormulas',
    data () {
      return {
        selectedFormulas: []
      }
    },
    computed: {
      ...mapGetters({
        herbFormulas: 'getHerbFormulas'
      })
    },
    watch: {
      herbFormulas: {
        handler () {
          this.selectedFormulas = Object.assign([], this.herbFormulas)
        }
      }
    },
    methods: {
      addFormula: function () {
        this.$store.dispatch('setModalType', 5)
      },
      removeFormula: function (index) {
        this.selectedFormulas.splice(index, 1)
        this.$store.dispatch('setHerbFormulas', this.selectedFormulas)
      }
    }
  }
</script>
