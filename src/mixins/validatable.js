import { find, propEq } from 'ramda'

export default {
  inject: ['$validator'],
  mounted () {
    this.$bus.$on('validate', this.onValidate)
    this.$watch(() => this.errors.errors, (newValue, oldValue) => {
      const newErrors = newValue.filter(error =>
        find(propEq('field', error.field))(oldValue) === undefined
      )
      const oldErrors = oldValue.filter(error =>
        find(propEq('field', error.field))(newValue) === undefined
      )
      this.$bus.$emit('errors-changed', newErrors, oldErrors)
    })
  },
  methods: {
    onValidate () {
      this.$validator.validateAll()
      if (this.errors.any()) {
        this.$bus.$emit('errors-changed', this.errors.errors)
      }
    }
  },
  beforeDestroy () {
    this.$bus.$emit('errors-changed', [], this.errors.errors)
    this.$bus.$off('validate', this.onValidate)
  }
}
