<template>
  <div class="col-md-8">
    <div class="nav-tabs-custom">
      <ul class="nav nav-tabs">
        <li><a href="#activity" data-toggle="tab" @click="switchTabs('activity')">Activity</a></li>
        <li class="active"><a href="#formulas" data-toggle="tab" @click="switchTabs('formulas')">Formulas</a></li>
        <li><a href="#herbs" data-toggle="tab" @click="switchTabs('herbs')">Herbs</a></li>
      </ul>
      <div class="tab-content no-padding">
        <FormulaTab></FormulaTab>
        <HerbTab></HerbTab>
        <ActivityTab></ActivityTab>
      </div>
      <!-- /.tab-content -->
    </div>
    <!-- /.nav-tabs-custom -->
  </div>
</template>
<script>
  const ActivityTab = () => import(/* webpackChunkName: "Content" */ './ActivityTab.vue')
  const FormulaTab = () => import(/* webpackChunkName: "Content" */ './FormulaTab.vue')
  const HerbTab = () => import(/* webpackChunkName: "Content" */ './HerbTab.vue')
  export default {
    name: 'TabController',
    components: {
      ActivityTab,
      FormulaTab,
      HerbTab
    },
    created () {
      this.switchTabs('formulas')
    },
    methods: {
      switchTabs (tab) {
        this.$store.dispatch('switchTab', tab)
      }
    }
  }
</script>
