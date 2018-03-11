<template>
  <div class="modal fade" id="modalHerbCreate" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel">New Herb</h4>
        </div>
        <div class="modal-body">
          <form role="form">
            <div class="form-group">
                <label>Pinyin name</label>
                <input type="text" class="form-control" placeholder="Enter pinyin" v-model="herb.pinyin">
            </div>
            <div class="form-group">
              <label>English name</label>
              <input type="text" class="form-control" placeholder="Enter English name" v-model="herb.english_name">
            </div>
            <div class="form-group">
              <label>Latin name</label>
              <input type="text" class="form-control" placeholder="Enter English name" v-model="herb.latin_name">
            </div>
            <div class="form-group">
              <label>Traditional Chinese name</label>
              <input type="text" class="form-control" placeholder="Enter Traditional Chinese name" v-model="herb.traditional_chinese">
            </div>
            <div class="form-group">
              <label>Simplified Chinese name</label>
              <input type="text" class="form-control" placeholder="Enter Simplified Chinese name" v-model="herb.simplified_chinese">
            </div>
            <div class="form-group">
                <label>Pinyin ton</label>
                <input type="text" class="form-control" placeholder="Enter pinyin ton" v-model="herb.pinyin_ton">
            </div>
          </form>
        </div>
        <div class="modal-body" v-if = "this.modalType === 2">	  		
          <div class="description"><b>Modified by</b> <a class="pull-right"><span class="badge bg-blue">{{herb.modified_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{herb.modified_time}}</p></div>
          <div class="description"><b>Created by</b> <a class="pull-right"><span class="badge bg-blue">{{herb.created_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="123">{{herb.created_time}}</p></div>	  		
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
    name: 'CreateHerb',
    data () {
      return {
        herb: {
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
        selectedHerb: 'getSelectedHerb'
      })
    },
    watch: {
      modalType: {
        handler () {
          this.herb.id = this.selectedHerb.id
          this.herb.pinyin = this.selectedHerb.pinyin
          this.herb.english_name = this.selectedHerb.english_name
          this.herb.latin_name = this.selectedHerb.latin_name
          this.herb.traditional_chinese = this.selectedHerb.traditional_chinese
          this.herb.simplified_chinese = this.selectedHerb.simplified_chinese
          this.herb.pinyin_ton = this.selectedHerb.pinyin_ton
          this.herb.modified_by_name = this.selectedHerb.modified_by_name
          this.herb.modified_time = this.selectedHerb.modified_time
          this.herb.created_by_name = this.selectedHerb.created_by_name
          this.herb.created_time = this.selectedHerb.created_time
          this.result = ''
        }
      }
    },
    methods: {
      save: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Creating herb...')
        this.$store.dispatch('createHerb', this.herb)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (response.id) {
              this.herb = {}
              const btn = this.$refs.dialogClose
              this.$router.push({name: 'Herb', params: { id: response.id }})
              btn.click()
            }
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            console.log(error)
          })
      },
      update: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Updating herb...')
        this.$store.dispatch('updateHerb', {id: this.herb.id, model: this.herb})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (response.id) {
              const btn = this.$refs.dialogClose
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
