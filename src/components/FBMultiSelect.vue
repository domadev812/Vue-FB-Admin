<template>
  <div class="form-group">
    <slot name="before"></slot>
    <div :class="defaultClass">
      <select :id="selectId" class="form-control" multiple>
        <slot></slot>
      </select>
    </div>
  </div>
</template>
<script>
  import '../../node_modules/select2/dist/js/select2.full.min'
  import '../../node_modules/select2/dist/css/select2.min.css'

  export default {
    name: 'FBMultiSelect',
    data () {
      return {
        items: [],
        value: ''
      }
    },
    props: {
      defaultClass: {
        type: [String, undefined],
        default: 'col-sm-4'
      },
      selectVal: {},
      options: {
        required: true
      },
      valueKey: {
        type: String,
        default: 'name'
      },
      idKey: {
        type: String,
        default: 'id'
      },
      selectId: {
        type: String,
        default: ''
      }
    },
    mounted () {
      var vm = this
      this.$lodash.forEach(this.options, (value) => {
        this.items.push({
          id: value[vm.idKey],
          text: value[vm.valueKey]
        })
      })
      this.$jQuery('#' + this.selectId)
        .select2({
          data: this.items
        })
        .on('change', (e) => {
          vm.value = e.target.value
          vm.$emit('select2', e.target.value)
        })
    },
    beforeUpdate () {
      this.$jQuery('#' + this.selectId)
        .select2({
          data: this.items
        })
        .val(this.selectVal)
        .trigger('change')
    },
    watch: {
      value: function (value) {
        this.$jQuery('#' + this.selectId).val(value).trigger('change')
      },
      options: function (options) {
        this.$lodash.forEach(this.options, (value) => {
          this.items.push({
            id: value.id,
            text: value.name
          })
        })
        this.$jQuery('#' + this.selectId).empty().val(this.selectVal).select2({data: this.items})
      }
    }
  }
</script>
<style src="../assets/less/select2.less" lang="less"></style>
