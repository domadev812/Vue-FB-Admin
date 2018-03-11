<template>
  <div class="active tab-pane" id="settings">
    <div class="box-body">
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-2 control-label"></label>
          <div class="col-sm-10">
            <h4>Personal information</h4>
          </div>
        </div>
        <FBInput type="text" name="firstname"
                 validateRules="alpha_spaces" @inputChanged="updateProfile.firstname = $event"
                 :inputProp="userProfile.firstname" inputId="firstname"
                 :isRequired="true" placeholder="First Name">
          <label slot="before" for="firstname" class="col-sm-2 control-label">First Name</label>
        </FBInput>
        <FBInput type="text"
                 :iconAfter="false" name="lastname"
                 validateRules="alpha_spaces" @inputChanged="updateProfile.lastname = $event"
                 :inputProp="userProfile.lastname"
                 inputId="lastname"
                 :isRequired="true" placeholder="Last Name">
          <label slot="before" for="lastname" class="col-sm-2 control-label">Last Name</label>
        </FBInput>
        <FBInput type="text"
                 :iconAfter="false" name="email"
                 validateRules="email" @inputChanged="updateProfile.email = $event"
                 :inputProp="userProfile.email" inputId="email"
                 :isRequired="true" placeholder="Email">
          <label slot="before" for="email" class="col-sm-2 control-label">Email</label>
        </FBInput>
        <FBInput type="text"
                 :iconAfter="false" name="phone"
                 :isMaskInput="true"
                 :inputMaskDivClass="'col-sm-10'"
                 :inputMaskParams="'+1(###) ####-####'"
                 @inputChanged="updateProfile.phone = $event" inputId="phone"
                 :isRequired="false" placeholder="Phone">
          <label slot="before" for="email" class="col-sm-2 control-label">Phone</label>
        </FBInput>
        <FBSelect
          :selectVal="userProfile.country_id"
          :selectId="'countrySelect'"
          @select2="updateProfile.country_id = $event"
          :options="countries">
          <option disabled value="0">Select one</option>
          <label for="countrySelect" class="col-sm-2 control-label" slot="before">Country</label>
        </FBSelect>
        <FBSelect
          @select2="updateProfile.language_id = $event"
          :selectVal="userProfile.language_id"
          :selectId="'languageSelect'"
          :options="language">
          <label for="languageSelect" class="col-sm-2 control-label" slot="before">Language</label>
        </FBSelect>
        <div class="form-group">
          <label class="col-sm-2 control-label"></label>

          <div class="col-sm-10">
            <h4>Permission</h4>
          </div>
        </div>
        <div class="form-group">
          <label for="inputExperience" class="col-sm-2 control-label">Roles</label>
          <div class="col-sm-4" style = "margin-left: 15px">
            <div class="form-group">
              <div class="checkbox" v-for="(item, key) in roles" :key="item.name">
                <label :for="item.name">
                  <input type="checkbox" :id="item.name" :value="item.name" v-model="permission"/>
                  {{item.description}}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="col-sm-2 control-label"></label>

          <div class="col-sm-10">
            <h4>Status</h4>
          </div>
        </div>
        <FBSelect
          :selectVal="userProfile.status"
          :selectId="'inputExperience'"
          @select2="updateProfile.status = $event"
          :options="status">
          <label for="inputExperience" class="col-sm-2 control-label" slot="before">Status</label>
        </FBSelect>

        <div class="form-group">
          <div class="col-sm-offset-2 col-sm-10">
            <FBButton :disabled="errors.any()" :onClick="saveProfile"
                      buttonClass="btn btn-primary" buttonText="Save">
            </FBButton>
          </div>
        </div>

      </form>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import validateInit from '../../../mixins/validateInitial'

  const FBInput = () => import(/* webpackChunkName: "UI Elements" */ '../../../components/FBInput.vue')
  const FBSelect = () => import(/* webpackChunkName: "UI Elements" */ '../../../components/FBSelect.vue')
  const FBButton = () => import(/* webpackChunkName: "UI Elements" */ '../../../components/FBButton.vue')
  const FBICheck = () => import(/* webpackChunkName: "UI Elements" */ '../../../components/FBICheck.vue')
  const FBIcon = () => import(/* webpackChunkName: "UI Elements" */ '../../../components/FBIcon.vue')
  export default {
    name: 'SettingTab',
    inject: ['$validator'],
    mixins: [validateInit],
    data () {
      return {
        updateProfile: {},
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
    },
    beforeCreate () {
      if (!this.$store.getters.getCountries || this.$store.getters.getCountries.length === 0) {
        this.$store.dispatch('fetchCountries')
      }
      if (!this.$store.getters.getLanguages || this.$store.getters.getLanguages.length === 0) {
        this.$store.dispatch('fetchLanguages')
      }
    },
    components: {
      FBInput,
      FBIcon,
      FBButton,
      FBICheck,
      FBSelect
    },
    methods: {
      saveProfile () {
        this.$store.dispatch('fetchRoles')
        this.$store.dispatch('updateUserProfile', {id: this.userProfile.id, data: this.updateProfile})
          .then((response) => {
            if (this.$route.params.hasOwnProperty('id')) {
              this.$store.dispatch('fetchUserProfile', this.$route.params.id)
                .then((response) => {
                  this.updateProfile = this.$lodash.clone(response)
                })
            } else {
              this.$store.dispatch('fetchUserProfile', this.$store.getters.getUserID)
                .then((response) => {
                  this.updateProfile = this.$lodash.clone(response)
                })
            }
          })
      }
    },
    computed: {
      ...mapGetters({
        countries: 'getCountries',
        language: 'getLanguages',
        userProfile: 'getUserProfile',
        loading: 'getLoadingBar',
        roles: 'getRoles'
      })
    }
  }
</script>
