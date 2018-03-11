<template>
  <div
    class="form-group"
    :class="{
        'has-feedback': iconAfter,
        'has-warning': errors.has(name),
        'has-success': !errors.has(name)
    }"
  >
    <div v-if="($slots.before||$slots.after) || isMaskInput" :class="{'input-group': isInputGroup}">
      <slot name="before"></slot>
      <div :class="[defaultClass]" v-if="!isMaskInput">
        <input v-if="type === 'text'" class="form-control"
               :name="name"
               @input="changeInput"
               v-validate="rules"
               :placeholder="placeholder"
               :readonly="readonly"
               :required="isRequired"
               type="text"
               :id="inputId"
               :disabled="disabled"
               :value="inputProp"
        >
        <input v-if="type === 'password'" class="form-control"
               :name="name"
               @input="changeInput"
               v-validate="rules"
               :placeholder="placeholder"
               :readonly="readonly"
               :required="isRequired"
               v-model="pass"
               type="password"
               :id="inputId"
               :disabled="disabled"
        >
        <span class="help-block" v-show="errors.has(name)" aria-hidden="true">
          <i v-show="errors.has(name)" class="fa fa-warning"></i>
          {{ errors.first(name) }}
        </span>
      </div>
      <div :class="[inputMaskDivClass]" v-else>
        <input v-if="type === 'text'" class="form-control maskinput"
               :name="name"
               @input="changeInput"
               v-validate="rules"
               :placeholder="placeholder"
               :readonly="readonly"
               :required="isRequired"
               v-mask="inputMaskParams"
               type="text"
               :id="inputId"
               :disabled="disabled"
               :value="inputProp"
        >
        <span class="help-block" v-show="errors.has(name)" aria-hidden="true">
          <i v-show="errors.has(name)" class="fa fa-warning"></i>
          {{ errors.first(name) }}
        </span>
      </div>
      <slot name="after"></slot>
    </div>
    <template v-else>
      <input v-if="type === 'text'" class="form-control"
             :name="name"
             @input="changeInput"
             v-validate="rules"
             :placeholder="placeholder"
             :readonly="readonly"
             :required="isRequired"
             type="text"
             :disabled="disabled"
             :value="inputProp"
      />
      <input v-if="type === 'email'" class="form-control"
             :name="name"
             @input="changeEmail"
             v-validate="rules"
             :placeholder="placeholder"
             :readonly="readonly"
             :required="isRequired"
             type="email"
             :disabled="disabled"
             v-model="email"
      />
      <input v-if="type === 'password'" class="form-control"
             @input="changePassword"
             :name="name"
             v-validate="rules"
             :value="password"
             :placeholder="placeholder"
             :readonly="readonly"
             :required="isRequired"
             type="password"
             :disabled="disabled"
      />
      <span v-if="iconAfter" class="form-control-feedback glyphicon" :class="[iconAfterClass]"></span>
      <span class="help-block" v-show="errors.has(name)" aria-hidden="true">
        <i v-show="errors.has(name)" class="fa fa-warning"></i>
        {{ errors.first(name) }}
      </span>
    </template>
  </div>
</template>

<script>
  import inputable from '../mixins/inputable'
  import validatable from '../mixins/validatable'
  import maskedable from '../mixins/maskedable'
  import { mask } from 'vue-the-mask'

  export default {
    name: 'FBInput',
    mixins: [inputable, validatable, maskedable],
    directives: {mask},
    data () {
      return {
        val: '',
        pass: '',
        email: '',
        inputValue: this.inputProp
      }
    }
  }
</script>
<style scoped>
  i.fa {
    margin-right: 10px;
  }
</style>
