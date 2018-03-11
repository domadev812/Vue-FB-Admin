export default {
  props: {
    defaultClass: {
      type: String,
      default: 'col-sm-10'
    },
    emailProp: {
      type: String,
      default: ''
    },
    inputId: {
      type: String,
      default: ''
    },
    inputProp: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      default: ''
    },
    validateRules: {
      type: String,
      default: ''
    },
    showHelp: {
      type: Boolean,
      default: true
    },
    showError: {
      type: Boolean,
      default: true
    },
    isInputGroup: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    name: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    iconAfter: {
      type: Boolean,
      default: true
    },
    iconAfterClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    rules () {
      if (this.validateRules.length > 0) {
        if (this.isRequired === true) {
          return 'required|' + this.validateRules
        } else {
          return this.validateRules
        }
      } else {
        return ''
      }
    }
  },
  methods: {
    changePassword (event) {
      this.pass = event.target.value
      this.$emit('passwordChanged', this.pass)
    },
    changeEmail (event) {
      this.email = event.target.value
      this.$on('validate', this.onValidate)
      this.$emit('emailChanged', this.email)
    },
    changeInput (event) {
      this.inputValue = event.target.value
      this.$emit('inputChanged', this.inputValue)
    }
  }
}
