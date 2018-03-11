<template>
  <div>
    <section class="content-header">
      <h1>{{$store.getters.getUserProfile | fullUserName}}</h1>
    </section>

    <section class="content">
      <div class="row">
        <UserInfo></UserInfo>
        <TabController></TabController>
      </div>
    </section>
  </div>
</template>

<script>
  const TabController = () => import(/* webpackChunkName: "Profile" */ './components/Profile/TabController.vue')
  const UserInfo = () => import(/* webpackChunkName: "Profile" */ './components/Profile/UserInfo.vue')
  export default {
    name: 'Profile',
    components: {
      TabController,
      UserInfo
    }
  }
</script>
