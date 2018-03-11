<template>
  <div class="tab-pane" id="text">
    <div class="box-body">
      <h3>Source Texts
        <span data-toggle="tooltip" title="" class="badge bg-green">{{ selectedTexts.length }}</span>
      </h3>
    </div>
    <div class="row no-margin">
      <div class="col-md-12">
        <div class="box box-default box-solid">
          <div class="box-header with-border">
            <h3 class="box-title">Source Texts</h3>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-toggle="modal" data-target="#modalHerbTexts" @click="addPrep()"><i class="fa fa-plus-circle"></i> Prep instruction</button>
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
                  <th>English</th>       
                  <th>Chinese</th>       
                  <th>Year</th>       
                  <th>Author</th>       
                  <th></th>
                </tr>
              </thead>
              <tbody v-if="selectedTexts.length > 0">
              <tr v-for="(item, key) in selectedTexts">
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
                <td>
                  <div class="pull-right">
                    <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="Remove"  @click="removeText(key)"><i class="fa fa-times"></i></button>
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
          <!-- /.box-body -->
          <div class="box-footer clearfix" style="display: block;">
            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalHerbTexts" @click="addText()"><i class="fa fa-plus"></i> Add</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'HerbTabText',
    data () {
      return {
        selectedTexts: []
      }
    },
    computed: {
      ...mapGetters({
        herbTexts: 'getHerbTexts'
      })
    },
    watch: {
      herbTexts: {
        handler () {
          this.selectedTexts = Object.assign([], this.herbTexts)
        }
      }
    },
    methods: {
      addText: function () {
        this.$store.dispatch('setModalType', 5)
      },
      removeText: function (index) {
        this.selectedTexts.splice(index, 1)
        this.$store.dispatch('setHerbTexts', this.selectedTexts)
      }
    }
  }
</script>
