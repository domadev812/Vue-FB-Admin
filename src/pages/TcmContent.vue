<template>
  <div>
    <section class="content-header">
      <h1>Materia Medica</h1>
    </section>
    <section class="content">
      <div class="row">
      </div>
    </section>
     <LoadingModal></LoadingModal>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  const TabController = () => import(/* webpackChunkName: "Content" */ './components/Content/MateriaMedica/TabController.vue')
  const FormulaFilter = () => import(/* webpackChunkName: "Content" */ './components/Content/MateriaMedica/FormulaFilter.vue')
  const HerbFilter = () => import(/* webpackChunkName: "Content" */ './components/Content/MateriaMedica/HerbFilter.vue')
  const LoadingModal = () => import(/* webpackChunkName: "Modals" */ './components/Content/TCMModals/LoadingModal.vue')
  export default {
    name: 'Content',
    computed: {
      ...mapGetters({
        activeTab: 'getActiveTab'
      })
    },
    components: {
      TabController,
      FormulaFilter,
      HerbFilter,
      LoadingModal
    }
  }
</script>
