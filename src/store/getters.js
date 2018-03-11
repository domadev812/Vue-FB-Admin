import { orderBy } from 'lodash'

let getLoadingStatus = state => {
  return state.loading
}
let getAlertShowing = (state) => state.alert.showAlert
let getAlertClasses = state => state.alert.alertClass
let getAlertIconClasses = state => state.alert.alertIconClass
let getAlertHeaderText = state => state.alert.headerText
let getAlertContent = state => state.alert.content
let getCountries = (state) => {
  return orderBy(state.countries.items, ['name'], ['asc'])
}
let getLanguages = (state) => {
  return orderBy(state.languages.items, ['name'], ['asc'])
}

let getRoles = state => state.roles

let getActiveTab = state => state.activeTab
let getActiveTabName = state => state.activeTabName
let getTcmTabType = state => state.tcmTabType
let getTcmListItem = state => state.tcmListItem
let getActiveFilter = state => state.activeFilter
let getModalType = state => state.modalType
let getCategoryValue = state => state.tcmCategory
let getCategoryName = state => state.tcmCategory.name
let getLoadingBar = state => state.loadingBar
let getLoadingBarText = state => state.loadingBarText
let getFilterFlag = state => state.filterFlag
let getFormulaFilterQuery = state => state.formulaFilterQuery
let getHerbFilterQuery = state => state.herbFilterQuery
let getRefreshTable = state => state.refreshTable

export { getLoadingStatus }
export { getAlertShowing }
export { getAlertClasses }
export { getAlertIconClasses }
export { getAlertHeaderText }
export { getAlertContent }
export { getCountries }
export { getLanguages }
export { getRoles }
export { getActiveTab }
export { getActiveTabName }
export { getTcmTabType }
export { getTcmListItem }
export { getActiveFilter }
export { getModalType }
export { getCategoryValue }
export { getCategoryName }
export { getLoadingBar }
export { getLoadingBarText }
export { getFilterFlag }
export { getFormulaFilterQuery }
export { getHerbFilterQuery }
export { getRefreshTable }
