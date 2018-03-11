import Vue from 'vue'
import Vuex from 'vuex'
import jQuery from 'jquery'
import createMutationsSharer from 'vuex-shared-mutations'
import * as actions from './actions'
import * as getters from './getters'
import auth from './modules/auth'
import app from './modules/app'
import dashboard from './modules/dashboard'
import mutations from './mutations'
import user from './modules/user'
import formula from './modules/formula'
import herb from './modules/herb'
import materia from './modules/materia'
import createLogger from 'vuex/dist/logger'
import herbologies from './modules/herbologies'
import prepmethods from './modules/prepmethods'
import channels from './modules/channels'
import tcmgeneral from './modules/tcmgeneral'
import categories from './modules/categories'
import source from './modules/source'
import flavour from './modules/flavour'
import nature from './modules/nature'
import specy from './modules/specy'
import book from './modules/book'

Vue.use(Vuex)
Vue.prototype.$jQuery = jQuery
const debug = process.env.NODE_ENV !== 'production'

const state = {
  loading: false,
  alert: {
    showAlert: false,
    alertClass: 'success',
    alertIconClass: 'icon fa fa-check',
    headerText: 'Alert!',
    content: 'Test content'
  },
  countries: {},
  languages: {},
  roles: {},
  activeTab: null,
  activeTabName: null,
  tcmListItem: 'herbology',
  tcmCategory: {
    id: 0,
    name: '',
    type: '',
    color: '#FFF',
    modified_by_name: '',
    modified_time: '',
    created_by_name: '',
    created_time: ''
  },
  /* 0: Herbology - Flavour, Nature, Plant, Cultivations, General - Channels  1: Herbology - English, Latin, General - Cautions  2: General - Actions, Symptoms */
  /* 0: Diagnosis - Element, Stage 1: Diagnosis - Medidian  2: Diagnosis - Wesern */
  tcmTabType: 0,
  modalType: 0, /* 0: Add Modal Dialog,  1: Update Modal Dialog */
  loadingBar: 'none',
  loadingBarText: 'Loading...',
  formulaFilterQuery: '',
  herbFilterQuery: '',
  filterFlag: true,
  activeFilter: false,
  refreshTable: false
}

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  modules: {
    auth,
    app,
    user,
    formula,
    dashboard,
    herb,
    materia,
    categories,
    herbologies,
    prepmethods,
    channels,
    tcmgeneral,
    source,
    flavour,
    nature,
    specy,
    book
  },
  strict: debug,
  plugins: debug ? [createLogger(), createMutationsSharer({predicate: ['MENU_COLLAPSED']})] : [createMutationsSharer({predicate: ['MENU_COLLAPSED']})]
})
