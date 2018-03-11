<template>
  <div class="col-md-9">
    <div class="nav-tabs-custom">
      <ul class="nav nav-tabs">
        <li class="active">
          <a href="#settings" data-toggle="tab">Account</a>
        </li>
        <li><a href="#subscription" data-toggle="tab">Subscriptions</a></li>
        <li><a href="#security" data-toggle="tab">Security</a></li>
        <li><a href="#activity" data-toggle="tab">Activity</a></li>
        <li><a href="#devices" data-toggle="tab">Devices</a></li>
        <li><a href="#loginhistory" data-toggle="tab">Login History</a></li>
      </ul>
      <div class="tab-content no-padding">
        <ActivityTab></ActivityTab>
        <SettingTab></SettingTab>
        <SecurityTab></SecurityTab>
        <SubscriptionTab></SubscriptionTab>
        <DeviceTab></DeviceTab>
        <LoginHistoryTab></LoginHistoryTab>
      </div>
      <!-- /.tab-content -->
      <LoadingModal></LoadingModal>
    </div>
    <!-- /.nav-tabs-custom -->
  </div>
</template>
<script>
  import validateInit from '../../../mixins/validateInitial'
  const SettingTab = () => import(/* webpackChunkName: "Profile" */ './SettingTab.vue')
  const LoginHistoryTab = () => import(/* webpackChunkName: "Profile" */ './LoginHistoryTab.vue')
  const SecurityTab = () => import(/* webpackChunkName: "Profile" */ './SecurityTab.vue')
  const ActivityTab = () => import(/* webpackChunkName: "Profile" */ './ActivityTab.vue')
  const SubscriptionTab = () => import(/* webpackChunkName: "Profile" */ './SubscriptionTab.vue')
  const DeviceTab = () => import(/* webpackChunkName: "Profile" */ './DeviceTab.vue')
  const LoadingModal = () => import(/* webpackChunkName: "Modals" */ '../../components/Content/TCMModals/LoadingModal.vue')
  export default {
    name: 'TabController',
    inject: ['$validator'],
    mixins: [validateInit],
    components: {
      SettingTab,
      LoginHistoryTab,
      SecurityTab,
      SubscriptionTab,
      ActivityTab,
      DeviceTab,
      LoadingModal
    }
  }
</script>
