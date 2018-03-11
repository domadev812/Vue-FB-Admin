<template>
  <div class="modal fade" id="modalFormulaUpdate" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel">New Formula</h4>
        </div>
        <div class="modal-body">
          <form role="form">
            <div class="form-group">
              <label>Formula name</label>
              <input type="text" class="form-control" placeholder="Enter Formula name" v-model="formula.name">
            </div>
            <div class="form-group">
              <label>English name</label>
              <input type="text" class="form-control" placeholder="Enter English name" v-model="formula.english_name">
            </div>
            <div class="form-group">
              <label>Traditional Chinese name</label>
              <input type="text" class="form-control" placeholder="Enter Traditional Chinese name" v-model="formula.traditional_chinese">
            </div>
            <div class="form-group">
              <label>Simplified Chinese name</label>
              <input type="text" class="form-control" placeholder="Enter Simplified Chinese name" v-model="formula.simplified_chinese">
            </div>
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label>Pinyin</label>
                  <input type="text" class="form-control" placeholder="Enter pinyin" v-model="formula.pinyin">
                </div>
              </div>
              <div class="col-sm-4">
                <div class="form-group">
                  <label>Pinyin ton</label>
                  <input type="text" class="form-control" placeholder="Enter pinyin ton" v-model="formula.pinyin_ton">
                </div>
              </div>
              <div class="col-sm-4">
                <div class="form-group">
                  <label>Pinyin code</label>
                  <input type="text" class="form-control" placeholder="Enter pinyin code" v-model="formula.pinyin_code">
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-body">
          <div class="description" v-if="formula.modifiedBy">
            <b>Modified by</b>
            <a class="pull-right"><span class="badge bg-blue">{{formula.modifiedBy.firstname}} {{formula.modifiedBy.lastname}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title=""> {{formula.modified_time}}</p>
          </div>
          <div class="description" v-if="formula.createdBy">
            <b>Created by</b>
            <a class="pull-right"><span class="badge bg-blue">{{formula.createdBy.firstname}} {{formula.createdBy.lastname}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title=""> {{formula.created_time}}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-lg btn-default" data-dismiss="modal" ref="dialogClose">Cancel</button>
          <button type="button" class="btn btn-lg btn-info" @click="save()">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'UpdateFormula',
    computed: {
      ...mapGetters({
        formula: 'getFormula'
      })
    },
    methods: {
      save: function () {
        let model = {
          name: this.formula.name,
          english_name: this.formula.english_name,
          traditional_chinese: this.formula.traditional_chinese,
          simplified_chinese: this.formula.simplified_chinese,
          pinyin: this.formula.pinyin,
          pinyin_ton: this.formula.pinyin_ton,
          pinyin_code: this.formula.pinyin_code
        }
        this.$store.dispatch('updateFormula', {id: this.formula.id, model: model})
          .then((response) => {
            if (response.id) {
              this.formula = response
              const btn = this.$refs.dialogClose
              btn.click()
            }
          }).catch((error) => {
            console.log(error)
          })
      }
    }
  }
</script>
