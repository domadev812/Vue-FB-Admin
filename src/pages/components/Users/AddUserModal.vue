<template>
  <FBModal ref="modal" modalId="createUser">
    <ClipLoader :loading="$store.getters.getLoadingStatus"></ClipLoader>
    <h4 class="modal-title" slot="modalHeader">New User</h4>
    <div slot="modalBody">
      <form role="form">
        <h4>Personal Information</h4>
        <FBInput type="text" name="firstname"
                 :inputProp="createUser.firstname"
                 validateRules="alpha_spaces" @inputChanged="createUser.firstname = $event"
                 inputId="firstname"
                 :isRequired="true" placeholder="First Name" :defaultClass="''">
          <label slot="before" for="firstname">First Name</label>
        </FBInput>
        <FBInput type="text"
                 :iconAfter="false" name="lastname"
                 :inputProp="createUser.lastname"
                 validateRules="alpha_spaces" @inputChanged="createUser.lastname = $event"
                 inputId="lastname"
                 :isRequired="true" placeholder="Last Name" :defaultClass="''">
          <label slot="before" for="lastname">Last Name</label>
        </FBInput>
        <FBInput type="text"
                 :iconAfter="false" name="email"
                 :inputProp="createUser.email"
                 validateRules="email" @inputChanged="createUser.email = $event" inputId="email"
                 :isRequired="true" placeholder="Email" :defaultClass="''">
          <label slot="before" for="email">Email</label>
        </FBInput>
        <FBInput type="text"
                 :iconAfter="false" name="phone"
                 :isMaskInput="true"
                 :inputMaskParams="'+1(###) ####-####'"
                 :defaultClass="''"
                 :inputProp="createUser.phone"
                 @inputChanged="createUser.phone = $event" inputId="phone"
                 :isRequired="false" placeholder="Phone">
          <label slot="before" for="email">Phone</label>
        </FBInput>
        <FBInput type="password" name="password"
                 validateRules="min:8|max:32" @inputChanged="createUser.password = $event"
                 :defaultClass="''"
                 inputId="password"
                 :isRequired="true" placeholder="Enter password">
          <label slot="before" for="password">Password</label>
        </FBInput>
        <FBInput type="password" name="retype" @inputChanged="createUser.retype = $event"
                 inputId="retype"
                 :defaultClass="''"
                 :isRequired="true" placeholder="Retype password">
          <label slot="before" for="retype">Retype</label>
        </FBInput>
        <FBSelect
          :selectId="'countrySelect'"
          :defaultClass="''"
          @select2="createUser.country_id = $event"
          :options="$store.getters.getCountries">
          <option disabled value="0">Select one</option>
          <label for="countrySelect" slot="before">Country</label>
        </FBSelect>
        <FBSelect
          @select2="createUser.language_id = $event"
          :selectId="'languageSelect'"
          :defaultClass="''"
          :options="$store.getters.getLanguages">
          <label for="languageSelect" slot="before">Language</label>
        </FBSelect>
        <h4>Permissions</h4>
        <div class="form-group">
          <label for="inputExperience">Roles</label>
          <div class="form-group">
            <div class="checkbox" v-for="(item, key) in $store.getters.getRoles" :key="item.name">
              <label :for="item.name">
                <input type="checkbox" :id="item.name" :value="item.name" v-model="createUser.permission"/>
                {{item.description}}
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div slot="modalFooter">
      <div class="form-group">
        <FBButton :disabled="errors.any()" :onClick="saveUser"
                  buttonClass="btn btn-lg btn-success" buttonText="Create User">
        </FBButton>
      </div>
    </div>
  </FBModal>
</template>
<script>
  import validateInit from '../../../mixins/validateInitial'

  const FBModal = () => import(/* webpackChunkName: "UI Elements" */ '../../../components/FBModal.vue')
  const FBInput = () => import(/* webpackChunkName: "UI Elements" */ '../../../components/FBInput.vue')
  const FBSelect = () => import(/* webpackChunkName: "UI Elements" */ '../../../components/FBSelect.vue')
  const FBButton = () => import(/* webpackChunkName: "UI Elements" */ '../../../components/FBButton.vue')
  const FBICheck = () => import(/* webpackChunkName: "UI Elements" */ '../../../components/FBICheck.vue')
  const FBIcon = () => import(/* webpackChunkName: "UI Elements" */ '../../../components/FBIcon.vue')
  export default {
    name: 'AddUserModal',
    mixins: [validateInit],
    inject: ['$validator'],
    components: {
      FBInput,
      FBSelect,
      FBButton,
      FBICheck,
      FBModal,
      FBIcon
    },
    methods: {
      saveUser () {
        this.$store.dispatch('createUserProfile', this.createUser)
          .then((response) => {
            this.$refs.modal.showModal = false
            this.$swal(
              'User created!',
              'User ' + response.firstname + ' ' + response.lastname + ' has been created !',
              'success'
            )
          })
      }
    },
    data () {
      return {
        createUser: {},
        permission: [],
        status: [
          {
            id: 0,
            name: 'In-active'
          },
          {
            id: 1,
            name: 'Active'
          }
        ]
      }
    }
  }
</script>
