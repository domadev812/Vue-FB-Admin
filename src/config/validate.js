const config = {
  errorBagName: 'errors', // change if property conflicts.
  fieldsBagName: 'fields',
  delay: 0,
  locale: 'en',
  dictionary: null,
  strict: true,
  classes: false,
  classNames: {
    touched: '', // the control has been blurred
    untouched: '', // the control hasn't been blurred
    valid: '', // model is valid
    invalid: '', // model is invalid
    pristine: '', // control has not been interacted with
    dirty: '' // control has been interacted with
  },
  events: 'input|focus|blur',
  inject: false,
  validity: true,
  aria: true
}
export default config
