<template>
  <div class="modal fade" id="modalHerbUpdate" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel">Edit Herb</h4>
        </div>
        <div class="modal-body">
          <form role="form">
            <div class="form-group">
              <label>Herb name</label>
              <input type="text" class="form-control" placeholder="Enter Herb name" v-model="model.name">
            </div>
            <div class="form-group">
                <label>Pinyin name</label>
                <input type="text" class="form-control" placeholder="Enter pinyin" v-model="model.pinyin">
            </div>
            <div class="form-group">
              <label>English name</label>
              <input type="text" class="form-control" placeholder="Enter English name" v-model="model.english_name">
            </div>
            <div class="form-group">
              <label>Latin name</label>
              <input type="text" class="form-control" placeholder="Enter English name" v-model="model.latin_name">
            </div>
            <div class="form-group">
              <label>Traditional Chinese name</label>
              <input type="text" class="form-control" placeholder="Enter Traditional Chinese name" v-model="model.traditional_chinese">
            </div>
            <div class="form-group">
              <label>Simplified Chinese name</label>
              <input type="text" class="form-control" placeholder="Enter Simplified Chinese name" v-model="model.simplified_chinese">
            </div>
            <div class="form-group">
                <label>Pinyin code</label>
                <input type="text" class="form-control" placeholder="Enter pinyin code" v-model="model.pinyin_code">
            </div>
          </form>
        </div>
        <div class="modal-body">
          <div class="description" v-if="herb.modifiedBy">
            <b>Modified by</b>
            <a class="pull-right"><span class="badge bg-blue">{{herb.modifiedBy.firstname}} {{herb.modifiedBy.lastname}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title=""> {{herb.modified_time}}</p>
          </div>
          <div class="description" v-if="herb.createdBy">
            <b>Created by</b>
            <a class="pull-right"><span class="badge bg-blue">{{herb.createdBy.firstname}} {{herb.createdBy.lastname}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title=""> {{herb.created_time}}</p>
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
    name: 'UpdateHerb',
    computed: {
      ...mapGetters({
        herb: 'getHerb'
      })
    },
    created () {
    },
    data () {
      return {
        model: {
          id: 0,
          name: '',
          english_name: '',
          traditional_chinese: '',
          latin_name: '',
          simplified_chinese: '',
          pinyin: '',
          pinyin_ton: '',
          pinyin_code: ''
        }
      }
    },
    watch: {
      herb: {
        handler () {
          this.model.name = this.herb.name
          this.model.english_name = this.herb.english_name
          this.model.traditional_chinese = this.herb.traditional_chinese
          this.model.latin_name = this.herb.latin_name
          this.model.simplified_chinese = this.herb.simplified_chinese
          this.model.pinyin = this.herb.pinyin
        }
      }
    },
    methods: {
      save: function () {
        this.$store.dispatch('updateHerb', {id: this.herb.id, model: this.model})
          .then((response) => {
            if (response.id) {
              const btn = this.$refs.dialogClose
              btn.click()
              this.$store.dispatch('fetchHerb', {id: this.herb.id})
            }
          }).catch((error) => {
            console.log(error)
          })
      }
    }
  }
</script>
