<template>
  <aside class="main-sidebar">
    <section class="sidebar">
      <ul class="sidebar-menu" v-if="menuItems.length">
        <router-link activeClass="active" tag="li" :to="'dashboard'" :replace="true">
          <a>
            <i class='fa fa-dashboard'></i>
            <span>Dashboard</span>
          </a>
        </router-link>
        <router-link :key="key" tag="li" activeClass="active" :to="item.path" :replace="true"
                     v-if="item.path && item.meta.showInMenu"
                     :class="{'treeview': (typeof item.children !== 'undefined') && item.children.length}"
                     v-for="(item, key) in menuItems[0].children">
          <a>
            <FBIcon :iconClass="item.meta.menu.iconClass"></FBIcon>
            <span>{{item.name}}</span>
            <span class="pull-right-container" v-if="(typeof item.children !== 'undefined') && item.children.length">
              <i class="fa fa-angle-left pull-right" v-if="($lodash.filter(item.children, function(o){
        return o.meta.showInMenu
      }).length > 0)"></i>
            </span>
          </a>
          <ul class="treeview-menu" v-if="(typeof item.children !== 'undefined')
          && (item.children.length > 0)">
            <router-link v-if="child.meta.showInMenu" :key="key" v-for="(child, key) in item.children"
                         activeClass="active" tag="li" :to="child.path">
              <a>
                <i :class="child.meta.menu.iconClass"></i>
                <span>{{child.name}}</span>
              </a>
            </router-link>
          </ul>
        </router-link>
      </ul>
    </section>
  </aside>
</template>
<script>
  const FBIcon = () => import(/* webpackChunkName: "UI Elements" */ '../components/FBIcon.vue')
  export default {
    name: 'LeftSidebar',
    components: {
      FBIcon
    },
    data () {
      return {
        menuItems: []
      }
    },
    created () {
      this.$router.options.routes.forEach((route) => {
        if (route.meta.showInMenu === true) {
          if (route.children.length < 0) {
            this.menuItems.push({
              name: route.name,
              path: route.path,
              children: [],
              meta: route.meta
            })
          } else {
            this.menuItems.push({
              name: route.name,
              path: route.path,
              meta: route.meta,
              children: route.children
            })
          }
        }
      })
    }
  }
</script>
