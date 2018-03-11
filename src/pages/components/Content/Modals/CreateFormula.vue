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
              <input type="text" class="form-control" placeholder="Enter Formula name" v-model="formula.pinyin">
            </div>
            <div class="form-group">
              <label>English name</label>
              <input type="text" class="form-control" placeholder="Enter English name" v-model="formula.english_name">
            </div>
            <div class="form-group">
              <label>Latin name</label>
              <input type="text" class="form-control" placeholder="Enter Latin name" v-model="formula.latin_name">
            </div>
            <div class="form-group">
              <label>Traditional Chinese name</label>
              <input type="text" class="form-control" placeholder="Enter Traditional Chinese name" v-model="formula.traditional_chinese">
            </div>
            <div class="form-group">
              <label>Simplified Chinese name</label>
              <input type="text" class="form-control" placeholder="Enter Simplified Chinese name" v-model="formula.simplified_chinese">
            </div>
            <div class="form-group">
              <label>Tones</label>
              <input type="text" class="form-control" placeholder="Enter pinyin ton" v-model="formula.pinyin_ton">
            </div>
          </form>
        </div>
        <div class="modal-body" v-if = "this.modalType === 2">	  		
          <div class="description"><b>Modified by</b> <a class="pull-right"><span class="badge bg-blue">{{formula.modified_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{formula.modified_time}}</p></div>
          <div class="description"><b>Created by</b> <a class="pull-right"><span class="badge bg-blue">{{formula.created_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="123">{{formula.created_time}}</p></div>	  		
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-lg btn-default" data-dismiss="modal" ref="dialogClose" @click="close()">Cancel</button>
          <button type="button" class="btn btn-lg btn-success" @click="save()" v-if = "this.modalType === 1">Create</button>
          <button type="button" class="btn btn-lg btn-success" @click="update()" v-if = "this.modalType === 2">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'CreateFormula',
    data () {
      return {
        formula: {
          id: '',
          pinyin: '',
          name: '',
          english_name: '',
          latin_name: '',
          traditional_chinese: '',
          simplified_chinese: '',
          pinyin_ton: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        result: ''
      }
    },
    computed: {
      ...mapGetters({
        modalType: 'getModalType',
        selectedFormula: 'getSelectedFormula'
      })
    },
    watch: {
      modalType: {
        handler () {
          this.formula.id = this.selectedFormula.id
          this.formula.pinyin = this.selectedFormula.pinyin
          this.formula.english_name = this.selectedFormula.english_name
          this.formula.latin_name = this.selectedFormula.latin_name
          this.formula.traditional_chinese = this.selectedFormula.traditional_chinese
          this.formula.simplified_chinese = this.selectedFormula.simplified_chinese
          this.formula.pinyin_ton = this.selectedFormula.pinyin_ton
          this.formula.modified_time = this.selectedFormula.modified_time
          this.formula.created_time = this.selectedFormula.created_time
          this.result = ''
        }
      }
    },
    methods: {
      save: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Creating formula...')
        this.$store.dispatch('createFormula', this.formula)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (response.id) {
              this.formula = {}
              const btn = this.$refs.dialogClose
              this.$router.push({name: 'Formula', params: { id: response.id }})
              btn.click()
            }
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            console.log(error)
          })
      },
      update: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Updating formula...')
        this.$store.dispatch('updateFormula', {id: this.formula.id, model: this.formula, refresh: false})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (response.id) {
              const btn = this.$refs.dialogClose
              this.$store.dispatch('setModalType', 0)
              this.result = 'success'
              btn.click()
            }
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            console.log(error)
          })
      },
      close: function () {
        if (this.result === 'success') {
          this.$store.dispatch('setModalType', 0)
        } else {
          this.$store.dispatch('setModalType', 3)
        }
        this.result = ''
      }
    }
  }
</script>
