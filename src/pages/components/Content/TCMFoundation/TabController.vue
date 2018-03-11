<template>
  <div class="col-md-8">
    <!-- /. Herbology Category -->
    <div class="nav-tabs-custom" v-if="listItem == 'herbology'">
      <ul class="nav nav-tabs">
        <li class="active">
          <a href="#herobology" data-toggle="tab" @click="switchTabs('flavours', 'Flavour', 0)">Flavour</a>
        </li>
        <li><a href="#herobology" data-toggle="tab" @click="switchTabs('natures', 'Nature', 0)">Nature</a></li>
        <li><a href="#herobology" data-toggle="tab" @click="switchTabs('species', 'Plant Species', 0)">Plant Species</a></li>
        <li><a href="#herobology" data-toggle="tab" @click="switchTabs('cultivations', 'Cultivations', 0)">Cultivations</a></li>
        <li><a href="#herobology_prep" data-toggle="tab" @click="switchTabs('prep', 'Prep Methods', 2)">Prep Methods</a></li>
        <li><a href="#herobology" data-toggle="tab" @click="switchTabs('english-commons', 'English', 1)">English</a></li>
        <li><a href="#herobology" data-toggle="tab" @click="switchTabs('latin-names', 'Latin', 1)">Latin</a></li>
      </ul>
      <div class="tab-content no-padding">
        <div class="tab-pane active" id="herobology">
          <HerbologyTab></HerbologyTab>
        </div>
        <div class="tab-pane " id="herobology_prep">
         <PrepMethodTab></PrepMethodTab>
        </div>
      </div>
      <!-- /.tab-content -->
    </div>
    <!-- ************ -->
    <!-- /. General Tcm Category -->
    <div class="nav-tabs-custom" v-if="listItem == 'general'">
      <ul class="nav nav-tabs">
        <li class="active">
          <a href="#general_channel" data-toggle="tab" @click="switchTabs('channels', 'Channels', 0)">Channels</a>
        </li>
        <li><a href="#general" data-toggle="tab" @click="switchTabs('cautions', 'Cautions', 1)">Cautions</a></li>
        <li><a href="#general" data-toggle="tab" @click="switchTabs('actions', 'Actions', 2)">Actions</a></li>
        <li><a href="#general" data-toggle="tab" @click="switchTabs('symptoms', 'Symptoms', 2)">Symptoms</a></li>        
      </ul>
      <div class="tab-content no-padding">
        <div class="tab-pane active" id="general_channel">
          <GeneralChannelTab></GeneralChannelTab>
        </div>
        <div class="tab-pane" id="general">
          <GeneralTab></GeneralTab>
        </div>
        <!--
        <div class="tab-pane" id="cautions">
          <GeneralTab></GeneralTab>
        </div>
        <div class="tab-pane" id="actions">
          <GeneralTab></GeneralTab>
        </div>
        <div class="tab-pane" id="symptoms">
          <GeneralTab></GeneralTab>
        </div>  -->
      </div>
      <!-- /.tab-content -->
    </div>
    <!-- ************ -->
    <!-- /. Diagnosis Category -->
    <div class="nav-tabs-custom" v-if="listItem == 'diagnosis'">
      <ul class="nav nav-tabs">
        <li class="active">
          <a href="#diagnosis" data-toggle="tab" @click="switchTabs('element', '5 Element 五行', 0)">5 Element 五行</a>
        </li>
        <li><a href="#diagnosis" data-toggle="tab" @click="switchTabs('stage', '6 Stage 六脈', 0)">6 Stage 六脈</a></li>
        <li><a href="#diagnosis" data-toggle="tab" @click="switchTabs('meridian', 'Meridian', 1)">Meridian</a></li>
        <li><a href="#diagnosis" data-toggle="tab" @click="switchTabs('western', 'Western Diagnosis', 2)">Western Diagnosis</a></li>        
      </ul>
      <div class="tab-content no-padding">
        <div class="tab-pane active" id="diagnosis">
          <DiagnosisTab></DiagnosisTab>
        </div>
        <!--
        <div class="tab-pane" id="stage">
          <DiagnosisTab></DiagnosisTab>
        </div>
        <div class="tab-pane" id="meridian">
          <DiagnosisTab></DiagnosisTab>
        </div>
        <div class="tab-pane" id="western">
          <DiagnosisTab></DiagnosisTab>
        </div>  -->      
      </div>
      <!-- /.tab-content -->
    </div>
    <!-- ************ -->
    <!-- /. Category Category -->
    <div class="nav-tabs-custom" v-if="listItem == 'categories'">      
      <ul class="nav nav-tabs">
        <li class="active">
          <a href="#category" data-toggle="tab" @click="switchTabs('formula', 'Formulas', 0)">Formulas</a>
        </li>
        <li><a href="#category" data-toggle="tab" @click="switchTabs('herb', 'Herbs', 0)">Herbs</a></li>
        <li><a href="#category" data-toggle="tab" @click="switchTabs('prep', 'Prep', 0)">Prep</a></li>
        <li><a href="#category" data-toggle="tab" @click="switchTabs('action', 'Actions', 0)">Actions</a></li>
        <li><a href="#category" data-toggle="tab" @click="switchTabs('symptom', 'Symptoms', 0)">Symptoms</a></li>
        <li><a href="#category" data-toggle="tab" @click="switchTabs('caution', 'Cautions', 0)">Cautions</a></li>        
      </ul>
      <div class="tab-content no-padding">
        <div class="tab-pane active" id="category">
          <CategoriesTab ></CategoriesTab>        
        </div>
        <!-- <div class="tab-pane" id="category_herbs">
          <CategoriesTab ></CategoriesTab>        
        </div>
        <div class="tab-pane" id="category_prep">
          <CategoriesTab ></CategoriesTab>        
        </div>
        <div class="tab-pane" id="category_actions">
          <CategoriesTab ></CategoriesTab>        
        </div>
        <div class="tab-pane" id="category_symptoms">
          <CategoriesTab ></CategoriesTab>        
        </div>
        <div class="tab-pane" id="category_cautions">
          <CategoriesTab ></CategoriesTab>        
        </div> -->  
      </div>     
      <!-- /.tab-content -->
    </div>
    <!-- /.nav-tabs-custom -->   
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  const HerbologyTab = () => import(/* webpackChunkName: "Content" */ './HerbologyGeneralTab.vue')
  const GeneralTab = () => import(/* webpackChunkName: "Content" */ './GeneralTab.vue')
  const GeneralChannelTab = () => import(/* webpackChunkName: "Content" */ './GeneralChannelTab.vue')
  const PrepMethodTab = () => import(/* webpackChunkName: "Content" */ './PrepMethodTab.vue')
  const DiagnosisTab = () => import(/* webpackChunkName: "Content" */ './DiagnosisTab.vue')
  const CategoriesTab = () => import(/* webpackChunkName: "Content" */ './CategoriesTab.vue')
  export default {
    name: 'TabController',
    created () {
    },
    computed: {
      ...mapGetters({
        listItem: 'getTcmListItem'
      })
    },
    mounted () {
      this.$store.dispatch('switchTab', 'flavours')
      this.$store.dispatch('setTabName', 'Flavour')
    },
    components: {
      HerbologyTab,
      PrepMethodTab,
      GeneralTab,
      GeneralChannelTab,
      DiagnosisTab,
      CategoriesTab
    },
    methods: {
      switchTabs (tab, tabName, type) {
        this.$store.dispatch('switchTab', tab)
        this.$store.dispatch('setTabName', tabName)
        this.$store.dispatch('setTcmTabType', type)
      }
    }
  }
</script>
