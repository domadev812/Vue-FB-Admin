<template>
  <div class="modal fade" id="modalFormulaCreate" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100">
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
        <div class="modal-footer">
          <button type="button" class="btn btn-lg btn-default" data-dismiss="modal" ref="dialogClose">Cancel</button>
          <button type="button" class="btn btn-lg btn-success" @click="save()">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CreateFormula',
    data () {
      return {
        formula: {
          name: '',
          english_name: '',
          traditional_chinese: '',
          simplified_chinese: '',
          pinyin: '',
          pinyin_ton: '',
          pinyin_code: ''
        }
      }
    },
    methods: {
      save: function () {
        this.$store.dispatch('createFormula', this.formula)
          .then((response) => {
            if (response.id) {
              this.formula = {}
              const btn = this.$refs.dialogClose
              this.$router.push({name: 'Formula', params: { id: response.id }})
              btn.click()
            }
          }).catch((error) => {
            console.log(error)
          })
      }
    }
  }
</script>
