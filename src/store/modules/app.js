import jQuery from 'jquery'

const state = {
  isMenuCollapsed: false,
  appName: 'Formula Builder',
  appNameHeader: '<b>Formula</b>Builder',
  appSmallName: '<b>F</b>B',
  inputValue: ''
}

const getters = {
  getMenuCollapsed: state => state.isMenuCollapsed,
  getAppName: state => state.appName,
  getAppNameHeader: state => state.appNameHeader,
  getAppSmallName: state => state.appSmallName,
  getInputValue: state => state.inputValue
}

const actions = {
  isMenuCollapsed ({commit}) {
    commit('MENU_COLLAPSED')
  },
  inputOnChange ({commit}, payload) {
    commit('INPUT_CHANGED', payload)
  },
  inputOnFocus ({commit}, payload) {

  },
  inputOnBlur ({commit}, payload) {

  }
}

const mutations = {
  MENU_COLLAPSED (state) {
    if (jQuery('body').hasClass('sidebar-collapse') === true) {
      jQuery('body').removeClass('sidebar-collapse').trigger('expanded.pushMenu')
      state.isMenuCollapsed = false
    } else {
      jQuery('body').removeClass('sidebar-collapse').addClass('sidebar-collapse').trigger('collapsed.pushMenu')
      state.isMenuCollapsed = true
    }
  },
  INPUT_CHANGED (state, payload) {
    state.inputValue = payload
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
