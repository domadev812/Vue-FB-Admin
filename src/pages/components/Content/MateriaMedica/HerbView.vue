<template>
  <div>
    <section class="content-header">
      <h1>Herbs</h1>
    </section>
    <section class="view-content-wrapper">
      <div class="row">
        <div class="col-sm-3">
          <div class="box box-widget widget-user-2">
            <div class="widget-user-header bg-green">
              <h3>{{ herb.pinyin }} ({{ herb.pinyin_ton }})</h3>
              <h4>{{ herb.latin_name }} / {{ herb.english_name }}</h4>
              <h5>{{ herb.traditional_chinese }}</h5>
              <h6>({{ herb.simplified_chinese }})</h6>              
            </div>
            <div class="box-body">
              <div class="description" v-if="herb.createdBy"><b>Created by</b> <a class="pull-right"><span class="badge bg-aqua">{{ herb.createdBy.firstname }} {{ herb.createdBy.lastname }}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{herb.created_time}}</p></div>
              <hr>
              <div class="description" v-if="herb.modifiedBy"><b>Modified by</b> <a class="pull-right"><span class="badge bg-blue">{{ herb.modifiedBy.firstname }} {{ herb.modifiedBy.lastname }}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{herb.modified_time}}</p></div>
            </div>
            <!--div class="box-footer"><a href="#" class="text-muted"><i class="fa fa-edit"></i> Edit</a></div!-->
          </div>
        </div>
        <div class="col-md-9">
          <HerbTabController></HerbTabController>
          <HerbUpdateModal></HerbUpdateModal>
          <HerbCategories></HerbCategories>
          <CreateCategoryModal></CreateCategoryModal>
          <HerbFlavours></HerbFlavours>
          <HerbNatures></HerbNatures>
          <HerbChannels></HerbChannels>
          <HerbFormulas></HerbFormulas>
          <HerbTexts></HerbTexts>
          <HerbPreps></HerbPreps>
          <CreateHerbologyModal></CreateHerbologyModal>
          <CreateFormulaModal></CreateFormulaModal>
          <CreateSourceModal></CreateSourceModal>
          <CreatePrepModal></CreatePrepModal>
          <LoadingModal></LoadingModal>
        </div>
      </div>
    </section>
  </div>
</template>
<style scoped>
  .view-content-wrapper {
    padding: 20px;
  }
</style>
<script>
  import { mapGetters } from 'vuex'
  const HerbTabController = () => import(/* webpackChunkName: "Content" */ './HerbTabController.vue')
  const HerbUpdateModal = () => import(/* webpackChunkName: "Modals" */ './../Modals/UpdateHerb.vue')
  const HerbCategories = () => import(/* webpackChunkName: "Modals" */ './../Modals/HerbCategories.vue')
  const CreateCategoryModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/CreateCategory.vue')
  const HerbFlavours = () => import(/* webpackChunkName: "Modals" */ './../Modals/HerbFlavours.vue')
  const HerbNatures = () => import(/* webpackChunkName: "Modals" */ './../Modals/HerbNatures.vue')
  const HerbChannels = () => import(/* webpackChunkName: "Modals" */ './../Modals/HerbChannels.vue')
  const HerbFormulas = () => import(/* webpackChunkName: "Modals" */ './../Modals/HerbFormulas.vue')
  const HerbTexts = () => import(/* webpackChunkName: "Modals" */ './../Modals/HerbTexts.vue')
  const HerbPreps = () => import(/* webpackChunkName: "Modals" */ './../Modals/HerbPreps.vue')
  const CreateHerbologyModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/CreateHerbologyModal.vue')
  const CreateFormulaModal = () => import(/* webpackChunkName: "Modals" */ './../Modals/CreateFormula.vue')
  const CreateSourceModal = () => import(/* webpackChunkName: "Modals" */ './../TextsModal/CreateBookModal.vue')
  const CreatePrepModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/CreatePrepMethodModal.vue')
  const LoadingModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/LoadingModal.vue')

  export default {
    name: 'HerbView',
    created () {
      this.fetchHerb()
    },
    computed: {
      ...mapGetters({
        herb: 'getHerb',
        modalType: 'getModalType'
      })
    },
    components: {
      HerbTabController,
      HerbCategories,
      CreateCategoryModal,
      HerbFlavours,
      HerbNatures,
      HerbChannels,
      HerbFormulas,
      HerbTexts,
      HerbPreps,
      CreateHerbologyModal,
      CreateFormulaModal,
      CreateSourceModal,
      CreatePrepModal,
      LoadingModal,
      HerbUpdateModal
    },
    watch: {
      modalType: {
        handler () {
          if (this.modalType === 4) {
            // this.fetchHerb()
          }
        }
      }
    },
    methods: {
      fetchHerb: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.$store.dispatch('fetchHerb', { id: this.$route.params.id })
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.$swal(
              'Error!',
              error.message,
              'error'
            ).then((result) => {
              this.$router.go(-1)
            })
          }
        )
      }
    }
  }
</script>
