export default {
  mounted () {
    this.$on('veeValidate', () => {
      this.$bus.$emit('validate')
    })
    this.$bus.$on('errors-changed', (newErrors, oldErrors) => {
      newErrors.forEach(error => {
        if (!this.errors.has(error.field)) {
          this.errors.add(error.field, error.msg)
        }
      })
      if (oldErrors) {
        oldErrors.forEach(error => {
          this.errors.remove(error.field)
        })
      }
    })
  }
}
