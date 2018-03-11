<template>
  <div class="form-group" v-if="((selectList.length > 0) && (isMultiple === false))">
    <label :for="'check['+key+']'" v-for="(item, key) in selectList">
      <input type="checkbox" :id="'check['+key+']'" :name="'check['+key+']'"
             class="minimal">
      {{item.text}}
    </label>
  </div>
  <div v-else-if="((items.length > 0) && (isMultiple === true))" class="form-group">
    <div class="checkbox" v-for="(item, key) in items">
      <label :for="item.value + '_' + key">
        <input type="checkbox" :id="item.value + '_' + key" :name="item.name" :value="item.value"
               class="multipleCheckbox minimal">
        {{item.name}}
      </label>
    </div>
  </div>
</template>
<script>
  import 'icheck'
  import '../../node_modules/icheck/skins/square/blue.css'

  export default {
    name: 'FBICheck',
    data () {
      return {
        items: []
      }
    },
    created () {
      console.log(this.isMultiple)
      if (this.isMultiple) {
        this.$lodash.forEach(this.selectList, (value) => {
          this.items.push({
            name: value[this.nameKey],
            value: value[this.valueKey]
          })
        })
      }
    },
    mounted () {
      this.$jQuery('.multipleCheckbox').iCheck({
        checkboxClass: this.checkboxClass,
        radioClass: this.radioClass,
        increaseArea: this.increaseArea
      })
        .trigger('change')
        .on('ifChanged', ($event) => {
          this.$emit('input', $event.target.checked)
        })
    },
    beforeDestroy () {
      this.$jQuery('input').iCheck('destroy')
    },
    props: {
      selectList: {
        type: [Array, Object],
        default:
          []
      },
      nameKey: {
        type: String,
        default: ''
      },
      valueKey: {
        type: String,
        default: ''
      },
      isMultiple: {
        type: Boolean,
        default: false
      },
      value: {
        type: Boolean,
        default: false
      },
      checkboxClass: {
        type: String,
        default: 'icheckbox_square-blue'
      },
      radioClass: {
        type: String,
        default: 'iradio_square-blue'
      },
      increaseArea: {
        type: String,
        default: '20%'
      }
    }
  }
</script>
<style scoped>
  .checkbox.icheck label {
    padding-left: 0;
  }
</style>
