<template>
    <div class="nav-tabs-custom">
      <ul class="nav nav-tabs">
        <li class="active" @click="switchTabs('Info')"><a href="#info" data-toggle="tab">Info</a></li>        
        <li @click="switchTabs('Herbs')"><a href="#herbs" data-toggle="tab">Herbs</a></li>
        <li @click="switchTabs('Prep')"><a href="#prep" data-toggle="tab">Prep</a></li>
        <li @click="switchTabs('Text')"><a href="#text" data-toggle="tab">Text</a></li>        
        <li @click="switchTabs('Activity')"><a href="#activity" data-toggle="tab">Activity</a></li>
        <!-- <li><a href="#prep" data-toggle="tab">Prep</a></li>
        <li><a href="#text" data-toggle="tab">Text</a></li>
        -->
        <li class="pull-right">
          <div class="btn-group">
            <button type="button" class="btn btn-primary" @click="saveFormula()">Save</button>
            <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <span class="caret"></span>
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <ul class="dropdown-menu" role="menu">
              <li><a href="#" data-toggle="modal" data-target="#modalFormulaCreate" @click="editFormula()">Edit</a></li>
              <li><a href="#">Save Draft</a></li>
              <li><a href="#">Publish</a></li>
              <li class="divider"></li>
              <li><a @click="deleteFormula()">Delete</a></li>
            </ul>
          </div>
        </li>
      </ul>
      <div class="tab-content no-padding">
        <FormulaTabInfo></FormulaTabInfo>
        <FormulaTabHerbs></FormulaTabHerbs>
        <FormulaTabPrep></FormulaTabPrep>
        <FormulaTabText></FormulaTabText>
        <FormulaTabActivity></FormulaTabActivity>
      </div>
      <!-- /.tab-content -->
      <FormulaModal></FormulaModal>
      <FormulaCategories></FormulaCategories>
      <CreateHerbModal></CreateHerbModal>
      <CreatePrepModal></CreatePrepModal>
      <CreateSourceModal></CreateSourceModal>
      <FormulaHerbs></FormulaHerbs>
      <FormulaPreps></FormulaPreps>
      <FormulaTexts></FormulaTexts>
      <LoadingModal></LoadingModal>
    </div>
    <!-- /.nav-tabs-custom -->
</template>
<script>
  import { mapGetters } from 'vuex'
  const FormulaTabInfo = () => import(/* webpackChunkName: "Content" */ './FormulaTabInfo.vue')
  const FormulaTabHerbs = () => import(/* webpackChunkName: "Content" */ './FormulaTabHerbs.vue')
  const FormulaTabPrep = () => import(/* webpackChunkName: "Content" */ './FormulaTabPrep.vue')
  const FormulaTabText = () => import(/* webpackChunkName: "Content" */ './FormulaTabText.vue')
  const FormulaTabActivity = () => import(/* webpackChunkName: "Content" */ './FormulaTabActivity.vue')
  
  const FormulaModal = () => import(/* webpackChunkName: "Modals" */ './../Modals/CreateFormula.vue')
  const FormulaCategories = () => import(/* webpackChunkName: "Modals" */ './../Modals/FormulaCategories.vue')
  const FormulaHerbs = () => import(/* webpackChunkName: "Modals" */ './../Modals/FormulaHerbs.vue')
  const FormulaPreps = () => import(/* webpackChunkName: "Modals" */ './../Modals/FormulaPreps.vue')
  const FormulaTexts = () => import(/* webpackChunkName: "Modals" */ './../Modals/FormulaTexts.vue')
  const CreatePrepModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/CreatePrepMethodModal.vue')
  const CreateHerbModal = () => import(/* webpackChunkName: "Modals" */ './../Modals/CreateHerb.vue')
  const CreateSourceModal = () => import(/* webpackChunkName: "Modals" */ './../TextsModal/CreateBookModal.vue')
  const LoadingModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/LoadingModal.vue')
  export default {
    name: 'FormulaTabController',
    data () {
      return {
        selectedFormula: {
          id: '',
          pinyin: '',
          english_name: '',
          latin_name: '',
          traditional_chinese: '',
          simplified_chinese: '',
          pinyin_ton: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        }
      }
    },
    components: {
      FormulaTabInfo,
      FormulaTabHerbs,
      FormulaTabPrep,
      FormulaTabText,
      FormulaTabActivity,
      FormulaModal,
      FormulaCategories,
      FormulaHerbs,
      FormulaPreps,
      FormulaTexts,
      CreateHerbModal,
      CreatePrepModal,
      CreateSourceModal,
      LoadingModal
    },
    computed: {
      ...mapGetters({
        formula: 'getFormula',
        currentCategoriesIds: 'getFormulaCategoryIds',
        currentHerbIds: 'getFormulaHerbIds',
        currentPrepIds: 'getFormulaPrepIds',
        currentTextIds: 'getFormulaTextIds'
      })
    },
    mounted () {
      this.$store.dispatch('setTabName', 'Info')
    },
    methods: {
      deleteFormula: function () {
        this.$store.dispatch('deleteFormula', {id: this.formula.id})
          .then((response) => {
            this.$router.push({name: 'Content'})
          }).catch((error) => {
            console.log(error)
          })
      },
      switchTabs (tabName) {
        this.$store.dispatch('setTabName', tabName)
      },
      editFormula: function () {
        this.selectedFormula.id = this.formula.id
        this.selectedFormula.pinyin = this.formula.pinyin
        this.selectedFormula.english_name = this.formula.english_name
        this.selectedFormula.latin_name = this.formula.latin_name
        this.selectedFormula.traditional_chinese = this.formula.traditional_chinese
        this.selectedFormula.simplified_chinese = this.formula.simplified_chinese
        this.selectedFormula.pinyin_ton = this.formula.pinyin_ton
        if (this.formula.modifiedBy === null || this.formula.modifiedBy === undefined) this.selectedFormula.modified_by_name = ''
        else this.selectedFormula.modified_by_name = this.formula.modifiedBy.firstname + ' ' + this.formula.modifiedBy.lastname
        this.selectedFormula.modified_time = this.formula.modified_time
        if (this.formula.createdBy === null || this.formula.createdBy === undefined) this.selectedFormula.created_by_name = ''
        else this.selectedFormula.created_by_name = this.formula.createdBy.firstname + ' ' + this.formula.createdBy.lastname
        this.selectedFormula.created_time = this.formula.created_time
        this.switchTabs('UpdateFormula')
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setFormulaValue', this.selectedFormula)
      },
      saveFormula () {
        let payload = {}
        payload.id = this.formula.id
        // Categories
        let categories = []
        this.currentCategoriesIds.map((item, ind) => {
          let category = {}
          category.id = item
          category.name = ''
          categories.push(category)
        })
        payload.categories = categories
        // PrepMethods
        let preps = []
        this.currentPrepIds.map((item, ind) => {
          let prep = {}
          prep.id = item
          prep.name = ''
          preps.push(prep)
        })
        payload.preparations = preps
        // Herbs
        let herbs = []
        this.currentHerbIds.map((item, ind) => {
          let herb = {}
          herb.id = item
          herb.name = ''
          herbs.push(herb)
        })
        payload.herbs = herbs
        // PrepMethods
        let texts = []
        this.currentTextIds.map((item, ind) => {
          let text = {}
          text.id = item
          text.name = ''
          texts.push(text)
        })
        payload.sources = texts
        payload.actions = []
        payload.symptoms = []
        payload.pinyin = this.formula.pinyin
        payload.english_name = this.formula.english_name
        payload.latin_name = this.formula.latin_name
        payload.traditional_chinese = this.formula.traditional_chinese
        payload.simplified_chinese = this.formula.simplified_chinese
        payload.pinyin_ton = this.formula.pinyin_ton
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Updating...')
        this.$store.dispatch('updateFormulaRelations', payload)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            console.log(error)
          })
      }
    }
  }
</script>
