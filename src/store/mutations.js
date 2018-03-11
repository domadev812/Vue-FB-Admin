export default {
  LOADING_CHANGE (state, payload) {
    state.loading = payload
  },
  ALERT_HIDE (state) {
    state.alert.showAlert = false
  },
  FETCH_COUNTRY (state, payload) {
    state.countries = payload
  },
  FETCH_LANGUAGE (state, payload) {
    state.languages = payload
  },
  FETCH_ROLES (state, payload) {
    state.roles = payload
  },
  ALERT_CHANGE (state, payload) {
    if (payload.hasOwnProperty('alertIconClass')) {
      state.alert.alertIconClass = payload.alertIconClass
    }
    if (payload.hasOwnProperty('alertClass')) {
      state.alert.alertClass = payload.alertClass
    }
    if (payload.hasOwnProperty('showAlert')) {
      state.alert.showAlert = payload.showAlert
    }
    if (payload.hasOwnProperty('content')) {
      state.alert.content = payload.content
    }
    if (payload.hasOwnProperty('headerText')) {
      state.alert.headerText = payload.headerText
    }
  },
  SET_CATEGORY_VALUE (state, category) {
    if (category.hasOwnProperty('id')) {
      state.tcmCategory.id = category.id
    }
    if (category.hasOwnProperty('name')) {
      state.tcmCategory.name = category.name
    }
    if (category.hasOwnProperty('type')) {
      state.tcmCategory.type = category.type
    }
    if (category.hasOwnProperty('color')) {
      state.tcmCategory.color = category.color
    }
    if (category.hasOwnProperty('modified_time')) {
      state.tcmCategory.modified_time = category.modified_time
    }
    if (category.hasOwnProperty('modified_by_name')) {
      state.tcmCategory.modified_by_name = category.modified_by_name
    }
    if (category.hasOwnProperty('created_by_name')) {
      state.tcmCategory.created_by_name = category.created_by_name
    }
    if (category.hasOwnProperty('created_time')) {
      state.tcmCategory.created_time = category.created_time
    }
  },
  SWITCH_TAB (state, tab) {
    state.activeTab = tab
  },
  SET_TAB_NAME (state, tabName) {
    state.activeTabName = tabName
  },
  SET_TCM_TAB_TYPE (state, tcmTabType) {
    state.tcmTabType = tcmTabType
  },
  CHOOSE_TCM_FILTER (state, listItem) {
    state.tcmListItem = listItem
  },
  SET_MODAL_TYPE (state, type) {
    state.modalType = type
  },
  SET_LOADING_BAR (state, flag) {
    state.loadingBar = flag
  },
  SET_LOADING_BAR_TEXT (state, text) {
    state.loadingBarText = text
  },
  SET_FILTER_FLAG (state, flag) {
    state.filterFlag = flag
  },
  SET_FORMULA_FILTER_QUERY (state, query) {
    state.formulaFilterQuery = query
  },
  SET_HERB_FILTER_QUERY (state, query) {
    state.herbFilterQuery = query
  }
}
