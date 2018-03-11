<template>
  <div>
    <section class="content-header">
      <h1>{{$route.name}}</h1>
    </section>
    <section class="content">    
      <div class="row" v-if="$route.name=='Acupuncture'">      
      </div>
      <div class="row" v-if="$route.name=='Materia Medica'">
        <FormulaFilter v-if="activeTab == 'formulas'"></FormulaFilter>
        <HerbFilter v-if="activeTab == 'herbs'"></HerbFilter>
        <TabController></TabController>
      </div>
      <div class="row" v-if="$route.name=='TCM Foundation'">
        <TcmFilterList></TcmFilterList>
        <TcmTabController></TcmTabController>
      </div>
      <div class="row" v-if="$route.name=='Texts'">        
        <BooksView></BooksView>
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
  const TcmTabController = () => import(/* webpackChunkName: "Content" */ './components/Content/TCMFoundation/TabController.vue')
  const TcmFilterList = () => import(/* webpackChunkName: "Content" */ './components/Content/TCMFoundation/FilterList.vue')
  const BooksView = () => import(/* webpackChunkName: "Content" */ './components/Content/Texts/BooksView.vue')
  const LoadingModal = () => import(/* webpackChunkName: "Modals" */ './components/Content/TCMModals/LoadingModal.vue')
  export default {
    name: 'Content',
    computed: {
      ...mapGetters({
        activeTab: 'getActiveTab',
        loading: 'getLoadingBar'
      })
    },
    components: {
      TabController,
      FormulaFilter,
      HerbFilter,
      TcmTabController,
      TcmFilterList,
      BooksView,
      LoadingModal
    }
  }
</script>
