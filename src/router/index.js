import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)
const Home = () => import(/* webpackChunkName: "Pages" */ '@/pages/Home')
const SignIn = () => import(/* webpackChunkName: "Pages" */ '@/pages/SignIn')
const Users = () => import(/* webpackChunkName: "Pages" */ '@/pages/Users')
const Profile = () => import(/* webpackChunkName: "Pages" */ '@/pages/Profile')
const Content = () => import(/* webpackChunkName: "Pages" */ '@/pages/Content')
const MateriaActivity = () => import(/* webpackChunkName: "Pages" */ '@/pages/components/Content/MateriaMedica/ActivityTab')
const Formula = () => import(/* webpackChunkName: "Formula" */ '@/pages/components/Content/MateriaMedica/FormulaView')
const Herb = () => import(/* webpackChunkName: "Herb" */ '@/pages/components/Content/MateriaMedica/HerbView')
const Book = () => import(/* webpackChunkName: "Book" */ '@/pages/components/Content/Texts/Book')
const Chapter = () => import(/* webpackChunkName: "Book" */ '@/pages/components/Content/Texts/Chapter')
const LayoutHeader = () => import(/* webpackChunkName: "Layout" */ '@/layouts/LayoutHeader.vue')
const LayoutLeftSidebar = () => import(/* webpackChunkName: "Layout" */ '@/layouts/LayoutLeftSidebar.vue')
const LayoutFooter = () => import(/* webpackChunkName: "Layout" */ '@/layouts/LayoutFooter.vue')
// const FBAlert = () => import(/* webpackChunkName: "UI Elements" */ '@/components/FBAlert.vue')
export default new Router({
  routes: [
    {
      path: '/',
      alias: ['/dashboard', '/home'],
      name: 'Dashboard',
      components: {
        default: Home,
        sidebar: LayoutLeftSidebar,
        footer: LayoutFooter,
        header: LayoutHeader
      },
      meta: {
        breadcrumb: 'Home',
        breadcrumbIcon: 'fa fa-dashboard',
        title: route => 'Home',
        showInMenu: true,
        menu: {
          iconClass: 'fa fa-dashboard'
        },
        requiresAuth: true
      },
      children: [
        {
          path: '/users',
          name: 'Users',
          components: {
            default: Users
          },
          meta: {
            title: route => 'Users',
            showInMenu: true,
            requiresAuth: true,
            menu: {
              iconClass: 'fa fa-users'
            }
          },
          children: [
            {
              path: '/users/profile/:id',
              name: 'Profile',
              components: {
                default: Profile
              },
              meta: {
                breadcrumb: 'Profile',
                breadcrumbIcon: 'fa fa-dashboard',
                title: (route) => {
                  return (store.getters.getUserFullName) + '\xa0 - \xa0' + 'Profile'
                },
                showInMenu: false,
                requiresAuth: true,
                menu: {
                  iconClass: 'fa fa-dashboard'
                }
              }
            },
            {
              path: 'profile',
              alias: '/profile',
              name: 'Profile',
              components: {
                default: Profile
              },
              meta: {
                breadcrumb: 'Profile',
                breadcrumbIcon: 'fa fa-dashboard',
                title: (route) => {
                  return (store.getters.getUserFullName) + '\xa0 - \xa0' + 'Profile'
                },
                showInMenu: false,
                requiresAuth: true,
                menu: {
                  iconClass: 'fa fa-dashboard'
                }
              }
            }
          ]
        },
        {
          path: '#',
          name: 'Content',
          components: {
            default: Content
          },
          data: {

          },
          meta: {
            breadcrumb: 'Content',
            breadcrumbIcon: 'fa fa-book',
            title: (route) => {
              return (store.getters.getUserFullName) + '\xa0 - \xa0' + 'Profile'
            },
            showInMenu: true,
            requiresAuth: true,
            menu: {
              iconClass: 'fa fa-book'
            }
          },
          children: [
            {
              name: 'Acupuncture',
              path: '/acupuncture',
              components: {
                default: Home
              },
              title: () => {
                return 'Acupuncture'
              },
              meta: {
                title: () => {
                  return 'Formulas'
                },
                showInMenu: true,
                menu: {
                  iconClass: 'fa fa-angle-double-right'
                }
              }
            },
            {
              name: 'Materia Medica',
              path: '/materiamedica',
              title: () => {
                return 'Formulas'
              },
              meta: {
                title: () => {
                  return 'Formulas'
                },
                showInMenu: true,
                menu: {
                  iconClass: 'fa fa-angle-double-right'
                }
              }
            },
            {
              name: 'TCM Foundation',
              path: '/tcmfoundation',
              title: () => {
                return 'TCM Foundation'
              },
              meta: {
                title: () => {
                  return 'TCM Foundation'
                },
                showInMenu: true,
                menu: {
                  iconClass: 'fa fa-angle-double-right'
                }
              }
            },
            {
              name: 'Texts',
              path: '/texts',
              title: () => {
                return 'Books'
              },
              meta: {
                title: () => {
                  return 'Books'
                },
                showInMenu: true,
                menu: {
                  iconClass: 'fa fa-angle-double-right'
                }
              }
            },
            {
              name: 'References',
              path: '/reference',
              title: () => {
                return 'Formulas'
              },
              meta: {
                title: () => {
                  return 'Formulas'
                },
                showInMenu: true,
                menu: {
                  iconClass: 'fa fa-angle-double-right'
                }
              }
            }
          ]
        },
        {
          path: '/materiamedica/formula/:id',
          name: 'Formula',
          component: Formula,
          meta: {
            title: route => 'Formula',
            showInMenu: false,
            menu: {
              iconClass: 'fa fa-angle-double-right'
            }
          }
        },
        {
          path: '/materiamedica/herb/:id',
          name: 'Herb',
          component: Herb,
          meta: {
            title: route => 'Herb',
            showInMenu: false,
            menu: {
              iconClass: 'fa fa-angle-double-right'
            }
          }
        },
        {
          path: '/materiamedica/activity',
          name: 'MateriaActivity',
          component: MateriaActivity,
          meta: {
            title: route => 'Herb',
            showInMenu: false
          }
        },
        {
          path: '/texts/book/:id',
          name: 'Book',
          component: Book,
          meta: {
            title: route => 'Book',
            showInMenu: false,
            menu: {
              iconClass: 'fa fa-angle-double-right'
            }
          }
        },
        {
          path: '/texts/book/:book_id/chapter/:id',
          name: 'Chapter',
          component: Chapter,
          meta: {
            title: route => 'Chapter',
            showInMenu: false,
            menu: {
              iconClass: 'fa fa-angle-double-right'
            }
          }
        }
      ]
    },
    {
      path: '/signin',
      name: 'Sign In',
      component:
      SignIn,
      beforeEnter: (to, from, next) => {
        if (store.getters.getIsLoggedIn === true) {
          next({
            path: '/dashboard',
            query: {redirect: to.fullPath}
          })
        } else {
          next()
        }
      },
      meta: {
        title: route => 'Log In',
        showInMenu: false
      }
    }
  ]
})

