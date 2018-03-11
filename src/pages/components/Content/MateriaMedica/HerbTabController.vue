<template>
    <div class="nav-tabs-custom">
      <ul class="nav nav-tabs">
        <li class="active" @click="switchTabs('Info')">
          <a href="#info" data-toggle="tab">Info</a>
        </li>
        <li @click="switchTabs('Formulas')"><a href="#formulas" data-toggle="tab">Formulas</a></li>
        <li @click="switchTabs('Text')"><a href="#text" data-toggle="tab">Text</a></li>
        <li @click="switchTabs('More')"><a href="#more" data-toggle="tab">More</a></li>
        <li @click="switchTabs('Activity')"><a href="#activity" data-toggle="tab">Activity</a></li>
        <!-- <li><a href="#formulas" data-toggle="tab">Prep</a></li>
        <li><a href="#formulas" data-toggle="tab">Text</a></li>
         -->
        <li class="pull-right">
          <div class="btn-group">
            <button type="button" class="btn btn-primary">Save</button>
            <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <span class="caret"></span>
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <ul class="dropdown-menu" role="menu">
              <li><a href="#" data-toggle="modal" data-target="#modalHerbUpdate">Edit</a></li>
              <li><a href="#">Save Draft</a></li>
              <li><a href="#">Publish</a></li>
              <li class="divider"></li>
              <li><a href="#" @click="deleteHerb()">Delete</a></li>
            </ul>
          </div>
        </li>
      </ul>
      <div class="tab-content no-padding">
        <HerbTabInfo></HerbTabInfo>
        <HerbTabFormulas></HerbTabFormulas>
        <HerbTabText></HerbTabText>
        <HerbTabMore></HerbTabMore>
        <HerbTabActivity></HerbTabActivity>
      </div>
      <!-- /.tab-content -->
    </div>
    <!-- /.nav-tabs-custom -->
</template>
<script>
  const HerbTabInfo = () => import(/* webpackChunkName: "Content" */ './HerbTabInfo.vue')
  const HerbTabFormulas = () => import(/* webpackChunkName: "Content" */ './HerbTabFormulas.vue')
  const HerbTabText = () => import(/* webpackChunkName: "Content" */ './HerbTabText.vue')
  const HerbTabMore = () => import(/* webpackChunkName: "Content" */ './HerbTabMore.vue')
  const HerbTabActivity = () => import(/* webpackChunkName: "Content" */ './HerbTabActivity.vue')
  import { mapGetters } from 'vuex'
  export default {
    name: 'HerbTabController',
    components: {
      HerbTabInfo,
      HerbTabFormulas,
      HerbTabText,
      HerbTabMore,
      HerbTabActivity
    },
    computed: {
      ...mapGetters({
        herb: 'getHerb'
      })
    },
    methods: {
      switchTabs (tabName) {
        this.$store.dispatch('setTabName', tabName)
      }
    }
  }
</script>
